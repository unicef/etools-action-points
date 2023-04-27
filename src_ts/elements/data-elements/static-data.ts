import {LitElement, html, customElement, property} from 'lit-element';
import {_setData} from '../mixins/static-data-mixin';
import {ErrorHandlerMixin} from '../mixins/error-handler-mixin';
import {_addToCollection, getChoices, isValidCollection} from '../mixins/permission-controller';
import {UserControllerMixin} from '../mixins/user-controller';
import {getEndpoint} from '../../endpoints/endpoint-mixin';
import './user-data';
import {GenericObject} from '../../typings/globals.types';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

/**
 * @polymer
 * @customElement
 */
@customElement('static-data')
export class StaticData extends ErrorHandlerMixin(UserControllerMixin(LitElement)) {
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

  render() {
    return html`<user-data
      @user-profile-loaded=${() => {
        this.changeLanguageIfNeeded().then(() => {
          this.loadStaticData();
        });
      }}
    ></user-data>`;
  }

  changeLanguageIfNeeded() {
    // @ts-ignore
    const user = this.getUserData();
    if (user.preferences?.language !== 'en') {
      localStorage.setItem('defaultLanguage', 'en');
      const endpoint = getEndpoint('userProfile');
      return sendRequest({
        method: 'PATCH',
        endpoint: {
          url: endpoint.url
        },
        body: {preferences: {language: 'en'}}
      }).then(() =>
        fireEvent(this, 'toast', {
          text: 'Language set to English',
          duration: 5000
        })
      );
    }
    return Promise.resolve();
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
      fireEvent(this, 'static-data-loaded');
    }
  }

  _loadAPOptions() {
    const endpoint = getEndpoint('actionPointsList');
    sendRequest({method: 'OPTIONS', endpoint})
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
    sendRequest({method: 'GET', endpoint})
      .then((data: any) => {
        _setData('partnerOrganisations', data);
        this.dataLoaded.organizations = true;
        this._allDataLoaded();
      })
      .catch(() => this._responseError('Partners', 'request error'));
  }

  _loadLocations() {
    const endpoint = getEndpoint('locations');
    sendRequest({method: 'GET', endpoint})
      .then((data: any) => {
        _setData('locations', data);
        const locationsLoaded = new CustomEvent('locations-loaded');
        document.dispatchEvent(locationsLoaded);
      })
      .catch(() => this._responseError('Locations', 'request error'));
  }

  _loadData(dataName: string) {
    const endpoint = getEndpoint(dataName);
    sendRequest({method: 'GET', endpoint})
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
