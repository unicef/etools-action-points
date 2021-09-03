import {html, PolymerElement} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {_setData} from '../app-mixins/static-data-mixin';
import {ErrorHandlerMixin} from '../app-mixins/error-handler-mixin';
import {_addToCollection, getChoices, isValidCollection} from '../app-mixins/permission-controller';
import {UserControllerMixin} from '../app-mixins/user-controller';
import {getEndpoint} from '../app-mixins/endpoint-mixin';
import './user-data';
import {customElement, property} from '@polymer/decorators';
import {GenericObject} from '../../typings/globals.types';

/**
 * @polymer
 * @customElement
 */
@customElement('static-data')
export class StaticData extends EtoolsAjaxRequestMixin(ErrorHandlerMixin(UserControllerMixin(PolymerElement))) {
  public static get template() {
    return html` <user-data></user-data> `;
  }

  @property({type: Object})
  dataLoaded: GenericObject = {
    organizations: false,
    apOptions: false,
    sectionsCovered: false,
    offices: false,
    unicefUsers: false,
    cpOutputsList: false,
    interventionsList: false
  };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector('user-data').addEventListener('user-profile-loaded', () => {
      this.loadStaticData();
    });
  }

  loadStaticData() {
    this._loadAPOptions();
    this._loadPartners();
    this._loadLocations();
    this._loadData('sectionsCovered');
    this._loadData('offices');
    this._loadData('unicefUsers');
    this._loadData('interventionsList');
    this._loadData('cpOutputsList');
    this._loadData('categoriesList');
  }

  _allDataLoaded() {
    if (
      this.dataLoaded.organizations &&
      this.dataLoaded.apOptions &&
      this.dataLoaded.sectionsCovered &&
      this.dataLoaded.offices &&
      this.dataLoaded.unicefUsers &&
      this.dataLoaded.cpOutputsList &&
      this.dataLoaded.interventionsList
    ) {
      this.dispatchEvent(new CustomEvent('static-data-loaded', {bubbles: true, composed: true}));
    }
  }

  _loadAPOptions() {
    const endpoint = getEndpoint('actionPointsList');
    this.sendRequest({method: 'OPTIONS', endpoint})
      .then((data: any) => {
        const actions = data && data.actions;
        if (!isValidCollection(actions)) {
          this._responseError('partners options');
          return;
        }

        _addToCollection('action_points', actions);

        const statusesData = getChoices('action_points.status');
        if (!statusesData) {
          console.error('Can not load action points statuses data');
        }
        _setData('statuses', statusesData);

        const modulesData = getChoices('action_points.related_module');
        if (!modulesData) {
          console.error('Can not load action points modules data');
        }
        _setData('modules', modulesData);

        this.dataLoaded.apOptions = true;
        this._allDataLoaded();
      })
      .catch(() => this._responseError('Partners', 'request error'));
  }

  _loadPartners() {
    const endpoint = getEndpoint('partnerOrganisations');
    this.sendRequest({method: 'GET', endpoint})
      .then((data: any) => {
        _setData('partnerOrganisations', data);
        this.dataLoaded.organizations = true;
        this._allDataLoaded();
      })
      .catch(() => this._responseError('Partners', 'request error'));
  }

  _loadLocations() {
    const endpoint = getEndpoint('locations');
    this.sendRequest({method: 'GET', endpoint})
      .then((data: any) => {
        _setData('locations', data);
        const locationsLoaded = new CustomEvent('locations-loaded');
        document.dispatchEvent(locationsLoaded);
      })
      .catch(() => this._responseError('Locations', 'request error'));
  }

  _loadData(dataName: string) {
    const endpoint = getEndpoint(dataName);
    this.sendRequest({method: 'GET', endpoint})
      .then((data: any) => {
        _setData(dataName, data);
        this.dataLoaded[dataName] = true;
        this._allDataLoaded();
      })
      .catch(() => this._responseError(dataName, 'request error'));
  }

  _triggerGlobalEvent(eventName: string, data: any) {
    const detail = {detail: data};
    const event = new CustomEvent(eventName, detail);
    document.dispatchEvent(event);
  }
}
