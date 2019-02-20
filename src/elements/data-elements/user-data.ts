import {PolymerElement} from '@polymer/polymer/polymer-element';
// import 'etools-ajax/etools-ajax';
// @ts-ignore
import EtoolsAjaxRequestMixin from 'etools-ajax/etools-ajax-request-mixin';
// import * as _ from 'lodash';
import PermissionController from '../app-mixins/permission-controller';
import UserController from '../app-mixins/user-controller';
import EndpointMixin from '../app-mixins/endpoint-mixin';

class UserData extends
  EndpointMixin(
    PermissionController(
      UserController(
        EtoolsAjaxRequestMixin(
          PolymerElement)))) {

  // static get template() {
  //   return html`
  //     <etools-ajax
  //       endpoint="[[endpoint]]"
  //       caching-storage="custom"
  //       dexie-db-collection="profile"
  //       on-success="_handleResponse"
  //       on-forbidden="_forbidden"
  //       on-fail="_handleError">
  //     </etools-ajax>
  //   `;
  // }

  static get properties() {return {};}

  ready() {
    super.ready();
    let endpoint = this.getEndpoint('userProfile');
    this.sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url,
        cachingKey: 'profile'
      }
    }).then(
        (resp: any) => this._handleResponse(resp)
      ).catch(
        () => this._handleError())
  }

  _handleResponse(this: any, data: any) {
    let user = data;
    let lastUserId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));
    let countriesAvailable = user.profile.countries_available || [];
    this.set('user.countries_available', countriesAvailable);

    if (!lastUserId || lastUserId !== user.id) {
      this.resetOldUserData();
    }

    localStorage.setItem('userId', user.id);

    this._setUserData(user);
    this.dispatchEvent(new CustomEvent('user-profile-loaded', {bubbles: true}));
  }

  _handleError() {
    console.error('Can\'t load user data');
  }

  _forbidden() {
    window.location.href = window.location.origin + '/';
  }
}

window.customElements.define('user-data', UserData);
