import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
import EtoolsPageRefreshMixin from 'etools-behaviors/etools-page-refresh-mixin';
import 'etools-profile-dropdown/etools-profile-dropdown';
import EndpointMixin from '../../app-mixins/endpoint-mixin';
import {EtoolsMixinFactory} from 'etools-behaviors/etools-mixin-factory'
import 'etools-app-selector/etools-app-selector';
import './countries-dropdown';
import {sharedStyles} from '../../styles-elements/shared-styles';

/**
 * @polymer
 * @customElement
 */

const AppMainHeaderMixins = EtoolsMixinFactory.combineMixins([
  EndpointMixin, EtoolsPageRefreshMixin], PolymerElement
) 

class AppMainHeader extends AppMainHeaderMixins {

  static get template() {
    return html`
      ${sharedStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color, #233944);
          padding: 0 8px 0 0;
        }

        #pageRefresh {
          color: #BCC1C6;
          margin-left: 8px;
        }

        .right-side {
          @apply --layout-horizontal;
          @apply --layout-center;
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
      </style>

      <app-toolbar sticky class="content-align">
        <div class="titlebar content-align">
          <etools-app-selector hidden$="[[!user.is_staff]]"></etools-app-selector>

          <img src$="[[rootPath]]../../../../../../apd/images/etools-logo-color-white.svg">
          <dom-if id="envWarningIf">
            <template>
              <div class="envWarning">- STAGING TESTING ENVIRONMENT</div>
            </template>
          </dom-if>
        </div>

        <div class="content-align">
          <countries-dropdown
                  countries="[[user.profile.countries_available]]"
                  country-id="[[user.profile.country]]">
          </countries-dropdown>

          <etools-profile-dropdown profile="{{user}}"></etools-profile-dropdown>

          <paper-icon-button id="pageRefresh" icon="refresh" on-tap="refresh" disabled="[[refreshInProgress]]"></paper-icon-button>
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
    // this.addEventListener('main_refresh', this._refreshPage);
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

  // _refreshPage(event: CustomEvent) {
  //   event.stopImmediatePropagation();
  //   this.$.refresh.refresh();
  // }

  _logout() {
    this.resetOldUserData();
    window.location.href = `${window.location.origin}/logout/`;
  }
}

customElements.define('app-main-header', AppMainHeader);
