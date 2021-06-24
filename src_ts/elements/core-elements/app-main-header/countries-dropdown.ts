import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import EtoolsPageRefreshMixin from '@unicef-polymer/etools-behaviors/etools-page-refresh-mixin.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {getEndpoint} from '../../app-mixins/endpoint-mixin';
import {customElement, property} from '@polymer/decorators';
import {GenericObject} from '../../../typings/globals.types';

/**
 * @polymer
 * @customElement
 * @applies EtoolsPageRefreshMixin
 * @applies EtoolsAjaxRequestMixin
 * @extends {PolymerElement}
 */
@customElement('countries-dropdown')
export class CountriesDropdown extends EtoolsPageRefreshMixin(EtoolsAjaxRequestMixin(PolymerElement)) {
  public static get template() {
    return html`
      <style>
      *[hidden] {
        display: none !important;
      }
      :host {
        display: block;
      }
      :host(:hover) {
        cursor: pointer;
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

        --paper-input-container-underline-disabled: {
          display: none;
        }

        --paper-input-container-shared-input-style: {
          color: var(--light-secondary-text-color);
          cursor: pointer;
          min-height: 24px;
          text-align: right;
          line-height: 21px; /* for IE */
        }

        --paper-menu-button-dropdown: {
          max-height: 380px;
        }
      }

      @media (max-width: 768px) {
        etools-dropdown {
          width: 130px;
        }
      }
      </style>

      <etools-dropdown
        id="countrySelector"
        hidden$="[[!countrySelectorVisible]]"
        selected="[[countryId]]"
        allow-outside-scroll
        no-label-float
        options="[[countries]]"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        on-etools-selected-item-changed="_countrySelected"
        shown-options-limit="250"
        hide-search
        min-width="160px"
        auto-width
      ></etools-dropdown>
    `;
  }

  @property({type: Array, observer: '_countrySelectorUpdate'})
  countries: GenericObject[];

  @property({type: Number})
  countryId: number;

  @property({type: Boolean})
  countrySelectorVisible = false;

  _countrySelectorUpdate(countries: any) {
    if (Array.isArray(countries) && countries.length > 1) {
      this.countrySelectorVisible = true;
    }
  }

  _countrySelected(e: CustomEvent) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedCountryId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedCountryId !== this.countryId) {
      // send post request to change_coutry endpoint
      this._changeCountry(selectedCountryId);
    }
  }

  _changeCountry(countryId: any) {
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'change-country',
        active: true,
        message: 'Please wait while country is changing...'
      },
      bubbles: true,
      composed: true
    }));
    let endpoint = getEndpoint('changeCountry');
    this.sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: {
        country: countryId
      }
    }).then(() => this._handleResponse()).catch(() => this._handleError());
  }

  _handleError() {
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'change-country'
      },
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('toast', {
      detail: {
        text: 'Can not change country. Please, try again later'
      },
      bubbles: true,
      composed: true
    }));
  }

  _handleResponse() {
    this.refreshInProgress = true;
    this.clearDexieDbs();
  }

  _refreshPage() {
    this.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}
