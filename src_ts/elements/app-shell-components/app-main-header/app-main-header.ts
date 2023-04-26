import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@unicef-polymer/etools-app-selector/dist/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown.js';
import {resetOldUserData} from '../../../endpoints/endpoint-mixin';
import {sharedStyles} from '../../styles/shared-styles';
import './countries-dropdown';
import './organizations-dropdown';
import '../../common-elements/support-btn';
import {customElement, property, observe} from '@polymer/decorators';
import {GenericObject} from '../../../typings/globals.types';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';

/**
 * @polymer
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends MatomoMixin(PolymerElement) {
  public static get template() {
    return html`
      ${sharedStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color);
          padding: 0 8px 0 0;
        }

        #pageRefresh {
          color: #bcc1c6;
          margin-left: 8px;
        }

        .right-side {
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        support-btn {
          color: var(--light-secondary-text-color);
          margin: 0 16px;
        }

        .titlebar {
          flex: 1;
          font-size: 28px;
          font-weight: 300;
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
          <etools-app-selector user="[[user]]"></etools-app-selector>

          <img src$="[[rootPath]]../../../../../../apd/images/etools-logo-color-white.svg" />
          <template is="dom-if" if="[[environment]]">
            <div class="envWarning">- [[environment]] TESTING ENVIRONMENT</div>
          </template>
        </div>

        <div class="content-align">
          <countries-dropdown countries="[[user.countries_available]]" country-id="[[user.country.id]]">
          </countries-dropdown>

          <organizations-dropdown user="[[user]]"></organizations-dropdown>

          <support-btn title="Support"></support-btn>

          <etools-profile-dropdown
            title="Profile and Sign out"
            profile="{{user}}"
            users="[[allUsers]]"
            offices="[[offices]]"
            sections="[[sections]]"
          >
          </etools-profile-dropdown>

          <paper-icon-button
            title="Refresh"
            id="pageRefresh"
            icon="refresh"
            tracker="Refresh"
            on-tap="onRefreshClick"
            disabled="[[refreshInProgress]]"
          >
          </paper-icon-button>
        </div>
      </app-toolbar>
    `;
  }

  @property({type: Object})
  user: GenericObject;

  @property({type: String})
  environment: string;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sign-out', this._logout);
  }

  openDrawer() {
    this.dispatchEvent(new CustomEvent('drawer'));
  }

  _logout() {
    resetOldUserData();
    window.location.href = `${window.location.origin}/social/unicef-logout/`;
  }

  onRefreshClick(e: CustomEvent) {
    this.trackAnalytics(e);
    DexieRefresh.refresh();
  }

  @observe('environment')
  _setBgColor() {
    // If not production environment, changing header color to red
    if (this.environment) {
      this.updateStyles({
        '--header-bg-color': 'var(--nonprod-header-color)'
      });
    }
  }
}
