import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-accesibility/etools-accesibility';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/countries-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/organizations-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/buttons/support-button';
import {resetOldUserData} from '../../endpoints/endpoint-mixin';
import {sharedStyles} from '../styles/shared-styles';
import {GenericObject} from '../../typings/globals.types';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import apdEndpoints from '../../endpoints/endpoints';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends MatomoMixin(LitElement) {
  @property({type: Object})
  user!: GenericObject;

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
      ${sharedStyles}
      <style>
        etools-accesibility {
          display: none;
        }
      </style>

      <app-toolbar 
        sticky 
        responsive-width="951px"
        class="layout-horizontal align-items-center"  
        @menu-button-clicked="${this.openDrawer}"
        .profile=${this.user}>
          <div slot="dropdowns">
            <countries-dropdown
              id="countries"
              .profile="${this.user}"
              .changeCountryEndpoint="${apdEndpoints.changeCountry}"
              @country-changed="${this.countryOrOrganizationChanged}"
            >
            </countries-dropdown>
            <organizations-dropdown
              .profile="${this.user}"
              .changeOrganizationEndpoint="${apdEndpoints.changeOrganization}"
              @organization-changed="${this.countryOrOrganizationChanged}"
            ></organizations-dropdown>
          </div>
          <div slot="icons">
            <support-btn></support-btn>

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

  public countryOrOrganizationChanged() {
    DexieRefresh.refreshInProgress = true;
    DexieRefresh.clearDexieDbs();
    DexieRefresh.refreshInProgress = false;
    document.location.assign(window.location.origin + Environment.basePath);
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
