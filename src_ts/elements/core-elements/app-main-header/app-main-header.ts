import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@unicef-polymer/etools-app-selector/etools-app-selector.js';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown.js';
import EtoolsPageRefreshMixin from '@unicef-polymer/etools-behaviors/etools-page-refresh-mixin.js';
import {resetOldUserData} from '../../app-mixins/endpoint-mixin';
import {sharedStyles} from '../../styles-elements/shared-styles';
import './countries-dropdown';
import '../../common-elements/support-btn';
import {customElement, property, observe} from '@polymer/decorators';
import {GenericObject} from '../../../typings/globals.types';

/**
 * @polymer
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends EtoolsPageRefreshMixin(PolymerElement) {
  public static get template() {
    return html`
      ${sharedStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color);
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

          <img src$="[[rootPath]]../../../../../../apd/images/etools-logo-color-white.svg">
          <template is="dom-if" if="[[environment]]">
            <div class="envWarning">- [[environment]] TESTING ENVIRONMENT</div>
          </template>
        </div>

        <div class="content-align">
          <countries-dropdown
                  countries="[[user.countries_available]]"
                  country-id="[[user.country.id]]">
          </countries-dropdown>

          <support-btn></support-btn>

          <etools-profile-dropdown profile="{{user}}"
                                   users="[[allUsers]]"
                                   offices="[[offices]]"
                                   sections="[[sections]]">
          </etools-profile-dropdown>

          <paper-icon-button id="pageRefresh"
                             icon="refresh"
                             on-tap="refresh"
                             disabled="[[refreshInProgress]]">
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
    window.location.href = `${window.location.origin}/logout/`;
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
