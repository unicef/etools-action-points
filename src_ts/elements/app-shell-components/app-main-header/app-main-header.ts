import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-accesibility/etools-accesibility';
import {resetOldUserData} from '../../../endpoints/endpoint-mixin';
import {sharedStyles} from '../../styles/shared-styles';
import './countries-dropdown';
import './organizations-dropdown';
import '../../common-elements/support-btn';
import {GenericObject} from '../../../typings/globals.types';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {basePath} from '../../../config/config';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {headerDropdownStyles} from './header-dropdown-styles';

/**
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends MatomoMixin(LitElement) {
  @property({type: Object})
  user!: GenericObject;

  @property({type: String, reflect: true, attribute: 'environment'})
  environment = '';

  @property({type: Array})
  allUsers: any[] = [];

  @property({type: Array})
  offices: any[] = [];

  @property({type: Array})
  sections: any[] = [];

  @property({type: Boolean})
  refreshInProgress = false;

  static get styles() {
    return [layoutStyles];
  }

  public render() {
    return html`
      ${sharedStyles} ${headerDropdownStyles}
      <style>
        app-toolbar {
          background-color: var(--header-bg-color);
          padding: 0 8px 0 0;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        :host([environment]) app-toolbar {
          background-color: var(--nonprod-header-color);
        }

        #pageRefresh {
          color: var(--light-secondary-text-color);
          margin-inline-end: 10px;
        }
        support-btn {
          color: var(--light-secondary-text-color);
          margin-inline-start: 16px;
        }
        .titlebar {
          flex: 1;
          font-size: var(--etools-font-size-28, 28px);
          font-weight: 300;
        }
        .envWarning {
          color: #000;
          background-color: #ffffff;
          font-weight: 700;
          padding: 5px 10px;
          font-size: var(--etools-font-size-14, 14px);
          line-height: 1;
          border-radius: 10px;
        }
        #app-logo {
          height: 32px;
          width: auto;
          margin: 0px 10px 0px 20px;
        }
        etools-accesibility {
          margin-inline-end: 10px;
          display: none;
        }
        .pd-6 {
          padding-block-start: 6px;
        }
        .right {
          margin-inline-start: auto;
        }
        @media (max-width: 768px) {
          #app-logo {
            width: 60px;
          }
          .envWarning {
            var(--etools-font-size-12, 12px)
          }
          etools-app-selector {
            width: 42px;
          }
          etools-profile-dropdown {
            margin-inline-start: 0px;
            width: 40px;
          }
        }
        @media (max-width: 576px) {
          etools-app-selector {
            --app-selector-button-padding: 18px 8px;
          }
          #app-logo {
            display: none;
          }
          .envWarning {
            font-size: var(--etools-font-size-10, 10px);
            margin-inline-start: 2px;
          }
        }
      </style>

      <app-toolbar sticky class="layout-horizontal align-items-center">
        <div class="titlebar layout-horizontal align-items-center">
          <etools-icon-button
            id="menuButton"
            name="menu"
            class="nav-menu-button"
            @click="${() => this.openDrawer()}"
          ></etools-icon-button>
          <etools-app-selector .user="${this.user}"></etools-app-selector>

          <img id="app-logo" src="${basePath}assets/images/etools-logo-color-white.svg" alt="ETools" />
          <div class="envWarning" .hidden="${!this.environment}" title="${this.environment} TESTING ENVIRONMENT">
            ${this.environment}
          </div>
        </div>

        <div class="layout-horizontal align-items-center">
          <div class="layout-horizontal align-items-center pd-6">
            <countries-dropdown .countries="${this.user?.countries_available}" .countryId="${this.user?.country.id}">
            </countries-dropdown>

            <organizations-dropdown .user="${this.user}"></organizations-dropdown>
          </div>
          <div class="layout-horizontal align-items-center right">
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
              label="refresh"
              tracker="Refresh"
              @click="${this.onRefreshClick}"
              ?disabled="${this.refreshInProgress}"
            >
            </etools-icon-button>

            <etools-accesibility></etools-accesibility>
          </div>
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
