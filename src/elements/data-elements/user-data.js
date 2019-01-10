import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import 'etools-ajax/etools-ajax';
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory';
import '../common-elements/lodash';
import '../app-mixins/permission-controller';
import '../app-mixins/user-controller';

class UserData extends EtoolsMixinFactory.combineMixins([
  APDMixins.AppConfig,
  APDMixins.PermissionController,
  APDMixins.UserController
], PolymerElement) {

  static get template() {
    return html`
      <etools-ajax
        endpoint="[[endpoint]]"
        caching-storage="custom"
        dexie-db-collection="profile"
        on-success="_handleResponse"
        on-forbidden="_forbidden"
        on-fail="_handleError">
      </etools-ajax>
    `;
  }

  static get properties() {return {};}

  ready() {
    super.ready();
    this.endpoint = this.getEndpoint('userProfile');
  }

  _handleResponse(data) {
    let user = data.detail;
    let lastUserId = JSON.parse(localStorage.getItem('userId'));
    let countriesAvailable = _.get(user, 'profile.countries_available') || [];

    countriesAvailable = _.sortBy(countriesAvailable, ['name']);
    _.set(user, 'countries_available', countriesAvailable);

    if (!lastUserId || lastUserId !== user.id) {
      this.resetOldUserData();
    }

    localStorage.setItem('userId', user.id);

    this._setUserData(user);
    this.dispatchEvent(new CustomEvent('user-profile-loaded', {bubbles: true}));
  }

  _handleError(rsp, err) {
    console.error('Can\'t load user data');
  }

  _forbidden() {
    window.location.href = window.location.origin + '/';
  }
}

window.customElements.define('user-data', UserData);
