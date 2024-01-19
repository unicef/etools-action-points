import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import {resetOldUserData} from '../../../endpoints/endpoint-mixin';
import {sharedStyles} from '../../styles/shared-styles';
import './countries-dropdown';
import './organizations-dropdown';
import '../../common-elements/support-btn';
import {GenericObject} from '../../../typings/globals.types';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {basePath} from '../../../config/config';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {headerDropdownStyles} from './header-dropdown-styles';

/**
 * @polymer
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends MatomoMixin(LitElement) {
  @property({type: Object})
  user: GenericObject;

  @property({type: String, reflect: true, attribute: 'environment'})
  environment: string;

  @property({type: Array})
  allUsers: any[];

  @property({type: Array})
  offices: any[];

  @property({type: Array})
  sections: any[];

  @property({type: Boolean})
  refreshInProgress: boolean;

  static get styles() {
    return [gridLayoutStylesLit];
  }

  public render() {
    return html`
      ${sharedStyles} ${headerDropdownStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color);
          padding: 0 8px 0 0;
        }

        :host([environment]) app-toolbar {
          background-color: var(--nonprod-header-color);
        }

        #pageRefresh {
          color: #bcc1c6;
          margin-left: 8px;
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

        .envWarning {
          color: var(--nonprod-text-warn-color);
          font-weight: 700;
          font-size: 18px;
        }
      </style>

      <app-toolbar sticky class="layout-horizontal align-items-center">
        <div class="titlebar layout-horizontal align-items-center">
          <etools-app-selector .user="${this.user}"></etools-app-selector>

          <img src="${basePath}/images/etools-logo-color-white.svg" />
          <div class="envWarning" .hidden="${!this.environment}">- ${this.environment} TESTING ENVIRONMENT</div>
        </div>

        <div class="layout-horizontal align-items-center">
          <countries-dropdown .countries="${this.user?.countries_available}" .countryId="${this.user?.country.id}">
          </countries-dropdown>

          <organizations-dropdown .user="${this.user}"></organizations-dropdown>

          <support-btn title="Support"></support-btn>

          <etools-profile-dropdown
            title="Profile and Sign out"
            .profile="${this.user}"
            .users="${this.allUsers}"
            .offices="${this.offices}"
            .sections="${this.sections}"
          >
          </etools-profile-dropdown>

          <etools-icon-button
            title="Refresh"
            id="pageRefresh"
            name="refresh"
            tracker="Refresh"
            @click="${this.onRefreshClick}"
            ?disabled="${this.refreshInProgress}"
          >
          </etools-icon-button>
        </div>
      </app-toolbar>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sign-out', this._logout);
  }

  openDrawer() {
    fireEvent(this, 'change-drawer-state');
  }

  _logout() {
    resetOldUserData();
    window.location.href = `${window.location.origin}/social/unicef-logout/`;
  }

  onRefreshClick(e: CustomEvent) {
    this.trackAnalytics(e);
    DexieRefresh.refresh();
  }
}
