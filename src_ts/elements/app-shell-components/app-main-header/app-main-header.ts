import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@unicef-polymer/etools-app-selector/dist/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown.js';
import {resetOldUserData} from '../../../endpoints/endpoint-mixin';
import {sharedStyles} from '../../styles/shared-styles';
import './countries-dropdown';
import '../../common-elements/support-btn';
import {customElement, property, observe} from '@polymer/decorators';
import {GenericObject} from '../../../typings/globals.types';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {appLanguages} from '../../../config/app-constants';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import {use} from 'lit-translate';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-ajax/ajax-error-parser';
import apdEndpoints from '../../../endpoints/endpoints';
import {UserControllerMixin} from '../../mixins/user-controller';

/**
 * @polymer
 * @customElement
 */
@customElement('app-main-header')
export class AppMainHeader extends MatomoMixin(UserControllerMixin(PolymerElement)) {
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
        .dropdowns {
          display: flex;
          margin-inline-end: 5px;
        }

        .header {
          flex-wrap: wrap;
          height: 100%;
          justify-content: space-between;
        }

        .header__item {
          display: flex;
          align-items: center;
        }

        .header__right-group {
          justify-content: space-evenly;
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
        etools-dropdown {
          --paper-listbox: {
            max-height: 600px;
          }

          --esmm-icons: {
            color: var(--light-secondary-text-color);
            cursor: pointer;
          }

          --paper-input-container-underline: {
            display: none;
          }

          --paper-input-container-underline-focus: {
            display: none;
          }

          --paper-input-container-shared-input-style: {
            color: var(--light-secondary-text-color);
            cursor: pointer;
            font-size: 16px;
            text-align: right;
            width: 100px;
          }
        }
      </style>

      <app-toolbar sticky class="content-align header">
        <div class="header__item">
          <etools-app-selector user="[[user]]"></etools-app-selector>

          <img src$="[[rootPath]]../../../../../../apd/images/etools-logo-color-white.svg" />
          <template is="dom-if" if="[[environment]]">
            <div class="envWarning">- [[environment]] TESTING ENVIRONMENT</div>
          </template>
        </div>

        <div class="header__item header__right-group">
          <div class="dropdowns">
            <etools-dropdown
              id="languageSelector"
              selected="[[user.preferences.language]]"
              options="[[appLanguages()]]"
              option-label="display_name"
              option-value="value"
              on-etools-selected-item-changed="languageChanged"
              trigger-value-change-event
              hide-search
              allow-outside-scroll
              no-label-float
              auto-width
              placeholder="Language"
            ></etools-dropdown>
            <countries-dropdown countries="[[user.countries_available]]" country-id="[[user.country.id]]">
            </countries-dropdown>
          </div>

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

  languageChanged(e: CustomEvent): void {
    if (!e.detail.selectedItem) {
      return;
    }

    const newLanguage = e.detail.selectedItem.value;
    if (newLanguage) {
      window.dayjs.locale(newLanguage);
      // Event caught by self translating npm packages
      this.dispatchEvent(
        new CustomEvent('language-changed', {
          detail: {language: newLanguage}
        })
      );
    }
    if (newLanguage !== this.user.preferences.language) {
      localStorage.setItem('defaultLanguage', newLanguage);
      use(newLanguage).then(() => {
        if (this.user?.preferences?.language != newLanguage) {
          this.updateUserPreference(newLanguage);
        }
      });
    }
  }

  appLanguages() {
    return appLanguages;
  }

  private updateUserPreference(language: string) {
    sendRequest({endpoint: apdEndpoints.userProfile, method: 'PATCH', body: {preferences: {language: language}}})
      .then((response) => {
        this._setUserData(response);
      })
      .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this));
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
