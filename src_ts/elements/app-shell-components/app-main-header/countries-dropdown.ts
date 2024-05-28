import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {toolbarDropdownStyles} from '@unicef-polymer/etools-unicef/src/styles/toolbar-dropdown-styles';

@customElement('countries-dropdown')
export class CountriesDropdown extends LitElement {
  private _countries: [] = [];

  @property({type: Array})
  get countries() {
    return this._countries;
  }

  set countries(val: []) {
    this._countries = val;
  }

  @property({type: Number})
  countryId?: number;

  render() {
    return html`
      ${toolbarDropdownStyles}
      <etools-dropdown
        transparent
        id="countrySelector"
        class="w100"
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
        min-width="160px"
        placement="bottom-end"
        .syncWidth="${false}"
        hide-search
        auto-width
      ></etools-dropdown>
    `;
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
    DexieRefresh.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}
