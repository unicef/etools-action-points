import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
// @ts-ignore
import EtoolsPageRefreshMixin from 'etools-behaviors/etools-page-refresh-mixin';
// import 'etools-profile-dropdown/etools-profile-dropdown';
import EndpointMixin from '../../app-mixins/endpoint-mixin';
import 'etools-app-selector/etools-app-selector';
import './countries-dropdown';
// import 'user-dropdown';
import {sharedStyles} from '../../styles-elements/shared-styles';

/**
 * @polymer
 * @customElement
 */
class AppMainHeader extends
  EndpointMixin(
    EtoolsPageRefreshMixin(
      PolymerElement)) {

  static get template() {
    return html`
      ${sharedStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color, #233944);
          padding: 0 8px 0 0;
        }

        div[main-title] {
          position: relative;
          bottom: 1px;
          margin-left: 24px;
          min-height: 30px;
          background: url('../../../images/etools_logo_icon.png') no-repeat center left;
          background-size: auto 48px;
          padding-left: 48px;
          font-size: 30px;
          color: var(--light-primary-text-color);
        }

        etools-page-refresh {
          color: #BCC1C6;
        }

        .right-side {
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        etools-page-refresh {
          margin-left: 8px;
        }

        .titlebar {
          flex: 1;
          font-size: 28px;
          font-weight: 300;
          color: var(--light-primary-text-color);
        }

        .titlebar img {
          height: auto;
          width: auto;
          max-width: 130px;
          max-height: 36px;
          margin: 0 8px 0 24px;
        }

        .content-align {
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        .envWarning {
          color: var(--nonprod-text-warn-color);
          font-weight: 700;
          font-size: 18px;
        }

        @media (min-width: 851px) {
          div[main-title] {
            margin-left: 32px;
          }
        }
      </style>

      <app-toolbar sticky class="content-align">
        <div class="titlebar content-align">
          <etools-app-selector hidden$="[[!user.is_staff]]"></etools-app-selector>

          <img src$="images/etools_logo.svg">
          <dom-if id="envWarningIf">
            <template>
              <div class="envWarning">- STAGING TESTING ENVIRONMENT</div>
            </template>
          </dom-if>
        </div>

        <div class="content-align">
          <countries-dropdown
                  countries="[[user.countries_available]]"
                  country-id="[[user.profile.country]]">
          </countries-dropdown>

          <etools-profile-dropdown profile="{{user}}"></etools-profile-dropdown>

          <paper-icon-button icon="refresh" on-tap="refresh" disabled="[[refreshInProgress]]"></paper-icon-button>
        </div>
      </app-toolbar>
    `;
  }

  static get properties() {
    return {
      user: {
        type: Object
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('main_refresh', this._refreshPage);
    this.addEventListener('sign-out', this._logout);
  }

  ready() {
    super.ready();
    this._isStaging();
  }

  _isStaging() {
    if (this.isStagingServer()) {
      this.$.envWarningIf.if = true;
    }
  }

  openDrawer() {
    this.dispatchEvent(new CustomEvent('drawer'));
  }

  _refreshPage(event: CustomEvent) {
    event.stopImmediatePropagation();
    this.$.refresh.refresh();
  }

  _logout() {
    this.resetOldUserData();
    window.location.href = `${window.location.origin}/saml2/logout/`;
  }
}

customElements.define('app-main-header', AppMainHeader);
