import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {UserControllerMixin} from '../mixins/user-controller';
import {getEndpoint, resetOldUserData} from '../../endpoints/endpoint-mixin';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('user-data')
export class UserData extends UserControllerMixin(LitElement) {
  constructor() {
    super();
    const endpoint = getEndpoint('userProfile');
    sendRequest({
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
    if (!user.is_unicef_user) {
      window.location.href = window.location.origin + '/menu/';
    }

    const lastUserId = JSON.parse(JSON.stringify(localStorage.getItem('userId')));
    const countriesAvailable = user.countries_available || [];
    user.countries_available = countriesAvailable;

    if (!lastUserId || lastUserId != user.user) {
      resetOldUserData();
    }

    localStorage.setItem('userId', user.user);

    this._setUserData(user);
    fireEvent(this, 'user-profile-loaded');
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
