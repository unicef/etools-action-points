import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
// import 'etools-ajax/etools-ajax.js';
// @ts-ignore
import EtoolsAjaxRequestMixin from 'etools-ajax/etools-ajax-request-mixin.js';
// @ts-ignore
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory.js';
import * as _ from 'lodash';
import StaticDataMixin from '../app-mixins/static-data-mixin.js';
import ErrorHandler from '../app-mixins/error-handler-mixin.js';
import PermissionController from '../app-mixins/permission-controller.js';
import UserController from '../app-mixins/user-controller.js';
import AppConfig from'../core-elements/etools-app-config.js';
// import { log } from 'util.js';
/**
 * @polymer
 * @customElement
 */
class StaticData extends EtoolsMixinFactory.combineMixins([
  AppConfig,
  EtoolsAjaxRequestMixin,
  StaticDataMixin,
  ErrorHandler,
  PermissionController,
  UserController], PolymerElement) {

  constructor() {
    super();
    this.dataLoaded = {};
  }

  static get template() {
    return html`
      <user-data></user-data>
    `;
  }

  ready() {
    super.ready();
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
    if (this.dataLoaded.organizations && this.dataLoaded.apOptions &&
      this.dataLoaded.sectionsCovered && this.dataLoaded.offices && this.dataLoaded.unicefUsers &&
      this.dataLoaded.cpOutputsList && this.dataLoaded.interventionsList) {
      this.dispatchEvent(new CustomEvent('static-data-loaded', {bubbles: true, composed: true}));
    }
  }

  _loadAPOptions() {
    let endpoint = this.getEndpoint('actionPointsList');
    this.sendRequest({method: 'OPTIONS', endpoint})
      .then(data => {
        let actions = data && data.actions;
        if (!this.isValidCollection(actions)) {
          this._responseError('partners options');
          return;
        }

        this._addToCollection('action_points', actions);

        let statusesData = this.getChoices('action_points.status');
        if (!statusesData) {console.error('Can not load action points statuses data');}
        this._setData('statuses', statusesData);

        let modulesData = this.getChoices('action_points.related_module');
        if (!modulesData) {console.error('Can not load action points modules data');}
        this._setData('modules', modulesData);

        this.dataLoaded.apOptions = true;
        this._allDataLoaded();
      }, error => this._responseError('Partners', 'request error'));
  }

  _loadPartners() {
    let endpoint = this.getEndpoint('partnerOrganisations');
    this.sendRequest({method: 'GET', endpoint})
      .then(data => {
        let partnerOrganisations = _.sortBy(data, ['name']);
        this._setData('partnerOrganisations', partnerOrganisations);
        this.dataLoaded.organizations = true;
        this._allDataLoaded();
      }, error => this._responseError('Partners', 'request error'));
  }

  _loadLocations() {
    let endpoint = this.getEndpoint('locations');
    this.sendRequest({method: 'GET', endpoint})
      .then(data => {
        let locations = _.sortBy(data, ['name']);
        this._setData('locations', locations);

        let locationsLoaded = new CustomEvent('locations-loaded');
        document.dispatchEvent(locationsLoaded);
      }, error => this._responseError('Locations', 'request error'));
  }

  _loadData(dataName) {
    let endpoint = this.getEndpoint(dataName);
    this.sendRequest({method: 'GET', endpoint})
      .then(data => {
        this._setData(dataName, data);
        this.dataLoaded[dataName] = true;
        this._allDataLoaded();
      }).catch(error => this._responseError(dataName, 'request error'));
  }

  _triggerGlobalEvent(eventName, data) {
    let detail = {detail: data};
    let event = new CustomEvent(eventName, detail);
    document.dispatchEvent(event);
  }
}

customElements.define('static-data', StaticData);
