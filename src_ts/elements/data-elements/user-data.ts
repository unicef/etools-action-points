import {PolymerElement} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {UserControllerMixin} from '../mixins/user-controller';
import {getEndpoint, resetOldUserData} from '../mixins/endpoint-mixin';
import {customElement} from '@polymer/decorators';

@customElement('user-data')
export class UserData extends EtoolsAjaxRequestMixin(UserControllerMixin(PolymerElement)) {
  ready() {
    super.ready();
    const endpoint = getEndpoint('userProfile');
    this.sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url,
        cachingKey: 'profile'
      }
    })
      .then((resp: any) => this._handleResponse(resp))
      .catch((err: any) => this._handleError(err));
  }

  _handleResponse(data: any) {
    const user = data;
    const lastUserId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));
    const countriesAvailable = user.countries_available || [];
    this.set('user.countries_available', countriesAvailable);

    if (!lastUserId || lastUserId != user.user) {
      resetOldUserData();
    }

    localStorage.setItem('userId', user.user);

    this._setUserData(user);
    this.dispatchEvent(new CustomEvent('user-profile-loaded', {bubbles: true}));
  }

  _handleError(error) {
    console.error("Can't load user data");
    if ([403, 401].includes(error.status)) {
      window.location.href = window.location.origin + '/login';
    }
  }

  _forbidden() {
    window.location.href = window.location.origin + '/';
  }
}
