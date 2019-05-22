import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icon/iron-icon';
import EtoolsPageRefreshMixin from 'etools-behaviors/etools-page-refresh-mixin';
import EtoolsAjaxRequestMixin from 'etools-ajax/etools-ajax-request-mixin';
import EndpointMixin from '../../app-mixins/endpoint-mixin';
import {EtoolsMixinFactory} from 'etools-behaviors/etools-mixin-factory';

const CountriesDropdownMixin = EtoolsMixinFactory.combineMixins([
  EtoolsPageRefreshMixin, EtoolsAjaxRequestMixin, EndpointMixin
], PolymerElement);

/**
 * @polymer
 * @customElement
 * @applies EtoolsPageRefreshMixin
 * @applies EndpointMixin
 * @applies EtoolsAjaxRequestMixin
 * @extends {PolymerElement}
 */
class CountriesDropdown extends CountriesDropdownMixin {

  static get template() {
    return html`
      <style>
        .arrow-up {
          display: none;
        }

        paper-menu-button {
          font-size: 16px;
          padding: 0;
        }

        paper-button {
          height: 60px;
          margin: 0;
          padding: 12px 12px 12px 12px;
          min-width: 50px;
          text-transform: none;
          font-weight: normal !important;
        }

        .dropdown-text {
          margin-left: 5px;
          color: var(--light-secondary-text-color);
        }

        .arrow-down,
        .arrow-up) {
          color: var(--light-ink-color);
        }

        iron-icon {
          color: var(--light-ink-color);
        }

        iron-icon > .mr-8 {
          margin-right: 8px;
        }

        iron-icon > .b-3 {
          bottom: 3px;
        }

        paper-listbox {
          max-height: 296px;
        }

        paper-listbox iron-icon {
          margin-right: 13px;
          color: var(--dark-icon-color);
        }

        paper-listbox paper-item {
          height: 48px;
          min-height: initial;
          font-weight: 500 !important;
          color: var(--dark-primary-text-color);
          cursor: pointer;
          padding: 0 16px;
          white-space: nowrap;
          min-width: 140px;
        }
        
        :host([opened]) .arrow-up {
          display: block;
        }

        :host([opened]) .arrow-down {
          display: none;
        }

        :host([opened]) iron-icon {
          color: var(--dark-icon-color);
        }

        :host([opened]) paper-menu-button {
          color: var(--dark-icon-color);
          background-color: var(--primary-background-color);
        }

        :host([opened]) paper-button.dropdown-text {
          color: var(--dark-primary-text-color);
        }

        :host([opened]) paper-button.arrow-down,
        :host([opened]) paper-button.arrow-up {
          color: var(--dark-icon-color);
        }

        :host([opened]) paper-listbox.no-focus {
          --paper-menu-focused-item-after: {
            background: var(--primary-background-color);
            opacity: 0;
          }
        }

      paper-item {
        --paper-item-focused-before: {
            background: var(--primary-background-color);
            opacity: 0;
          }
        }

        paper-item:hover {
          background: #EEEEEE;
        }

      </style>

      <paper-menu-button id="dropdown" vertical-align="top" vertical-offset="56" horizontal-align="right">
        <paper-button slot="dropdown-trigger">
          <span class="dropdown-text">[[country.name]]</span>

          <iron-icon class="arrow-down" icon="icons:arrow-drop-down"></iron-icon>
          <iron-icon class="arrow-up" icon="icons:arrow-drop-up"></iron-icon>
        </paper-button>

        <paper-listbox slot="dropdown-content" selected="[[countryIndex]]" on-iron-select="_countrySelected">
          <template id="repeat" is="dom-repeat" items="[[countries]]">
            <paper-item on-tap="_changeCountry">
              [[item.name]]
            </paper-item>
          </template>
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      countries: {
        type: Array,
        value: []
      },
      countryId: {
        type: Number
      },
      countryIndex: {
        type: Number
      }
    };
  }

  static get observers() {
    return ['_setCountryIndex(countries, countryId)'];
  }

  connectedCallback(this: any) {
    super.connectedCallback();
    this.addEventListener('paper-dropdown-close', this._toggleOpened);
    this.addEventListener('paper-dropdown-open', this._toggleOpened);
  }

  _setCountryIndex(this: any, countries: object[], countryId: number) {
    if (!(countries instanceof Array)) {
      return;
    }

    let countryObj: any = countries.find((country: any) => {
      return country.id === countryId;
    });
    this.countryIndex = countries.indexOf(countryObj);
  }

  _toggleOpened(this: any) {
    this.set('opened', this.$.dropdown.opened);
  }

  _countrySelected(this: any, e: CustomEvent) {
    this.set('country', this.$.repeat.itemForElement(e.detail.item));
  }

  _changeCountry(this: any, event: any) {
    let country = event && event.model && event.model.item;
    let id = country && country.id;

    if (Number(parseFloat(id)) !== id) {
      throw new Error('Can not find country id!');
    }

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'change-country',
        active: true,
        message: 'Please wait while country is changing...'
      },
      bubbles: true,
      composed: true
    }));
    let url = this.getEndpoint('changeCountry').url;
    let countryData = {
      country: id
    };
    this.sendRequest({
      method: 'POST',
      endpoint: {
        url: url
      },
      body: {
        countryData
      }
    }).then(() => this._handleResponse).catch(() => this._handleError);
  }

  _handleError(this: any) {
    this.countryData = null;
    this.url = null;
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

  _handleResponse(this: any) {
    this.refreshInProgress = true;
    this.clearDexieDbs();
  }

  _refreshPage(this: any) {
    this.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}

window.customElements.define('countries-dropdown', CountriesDropdown);
