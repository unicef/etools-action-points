import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import { sendRequest } from '@unicef-polymer/etools-ajax';
import { EtoolsDropdownEl } from '@unicef-polymer/etools-dropdown/etools-dropdown';
import { fireEvent } from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('countries-dropdown')
export class CountriesDropdown extends LitElement {
  private _countries: [] = [];

  @property({type: Array})
  get countries() {
    return this._countries;
  }

  set countries(val: []) {
    this._countries = val;
    this._countrySelectorUpdate(this._countries);
  }

  @property({type: Number})
  countryId: number;

  @property({type: Boolean})
  countrySelectorVisible = false;

  render() {
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
            font-size: 16px;
            text-align: right;
            width: 100px;
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
        ?hidden="${!this.countrySelectorVisible}"
        .selected="${this.countryId}"
        placeholder="Country"
        allow-outside-scroll
        no-label-float
        .options="${this.countries}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this._countrySelected}"
        .shownOptionsLimit="${250}"
        hide-search
        auto-width
      ></etools-dropdown>
    `;
  }

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

  public connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
      (this.shadowRoot?.querySelector('#countrySelector') as EtoolsDropdownEl).fitInto = fitInto;
    }, 0);
  }

  _changeCountry(countryId: any) {
    fireEvent(this, 'global-loading', {
      loadingSource: 'change-country',
      active: true,
      message: 'Please wait while country is changing...'
    });
    const endpoint = getEndpoint('changeCountry');
    sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: {
        country: countryId
      }
    })
      .then(() => this._handleResponse())
      .catch(() => this._handleError());
  }

  _handleError() {
    fireEvent(this, 'global-loading', {
      loadingSource: 'change-country'
    });
    fireEvent(this, 'toast', {
      text: 'Can not change country. Please, try again later'
    });
  }

  _handleResponse() {
    DexieRefresh.refreshInProgress = true;
    DexieRefresh.clearDexieDbs();
  }

  _refreshPage() {
    DexieRefresh.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}
