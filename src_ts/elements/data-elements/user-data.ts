import {PolymerElement} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {PermissionController} from '../app-mixins/permission-controller';
import {UserController} from '../app-mixins/user-controller';
import {EndpointMixin} from '../app-mixins/endpoint-mixin';
import {customElement} from '@polymer/decorators';

@customElement('user-data')
export class UserData extends EndpointMixin(
    EtoolsAjaxRequestMixin(
        PermissionController(
            UserController(
                PolymerElement)))) {

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
        () => this._handleError());
  }

  _handleResponse(this: any, data: any) {
    let user = data;
    let lastUserId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));
    let countriesAvailable = user.countries_available || [];
    this.set('user.countries_available', countriesAvailable);

    if (!lastUserId || lastUserId !== user.user) {
      this.resetOldUserData();
    }

    localStorage.setItem('userId', user.user);

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
