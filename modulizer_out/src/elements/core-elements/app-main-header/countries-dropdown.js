import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-dropdown-menu';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/etools-ajax';
import '@polymer/etools-page-refresh/etools-refresh-behavior';
import 'etools-app-config';
/**
 * @polymer
 * @customElement
 */
class CountriesDropdown extends Polymer.mixinBehaviors(
  [etoolsBehaviors.EtoolsRefreshBehavior],
  APDMixins.AppConfig(PolymerElement)
) {

  static get template() {
    return html`
      <style>
        :host {
          .arrow-up {
            display: none;
          }

          paper-menu-button {
            padding: 0;
            font-size: 16px;
          }

          paper-button {
            height: 60px;
            margin: 0;
            padding: 12px 12px 12px 12px;
            min-width: 50px;
            text-transform: none;
            font-weight: normal !important;

            .dropdown-text {
              margin-left: 5px;
              color: var(--light-secondary-text-color);
            }

            .arrow-down,
            .arrow-up {
              color: var(--light-ink-color);
            }
          }

          iron-icon {
            color: var(--light-ink-color);

            &.mr-8 {
              margin-right: 8px;
            }

            &.b-3 {
              bottom: 3px;
            }
          }

          paper-listbox {
            max-height: 296px;

            iron-icon {
              margin-right: 13px;
              color: var(--dark-icon-color);
            }

            paper-item {
              height: 48px;
              min-height: initial;
              font-weight: 500 !important;
              color: var(--dark-primary-text-color);
              cursor: pointer;
              padding: 0 16px;
              white-space: nowrap;
              min-width: 140px;
            }
          }
        }

        :host([opened]) {
          .arrow-up {
            display: block;
          }

          .arrow-down {
            display: none;
          }

          iron-icon {
            color: var(--dark-icon-color);
          }

          paper-menu-button {
            color: var(--dark-icon-color);
            background-color: var(--primary-background-color);
          }

          paper-button {
            .dropdown-text {
              color: var(--dark-primary-text-color);
            }

            .arrow-down,
            .arrow-up {
              color: var(--dark-icon-color);
            }
          }
        }

        paper-listbox.no-focus {
          --paper-menu-focused-item-after: #{'{
          background: var(--primary-background-color);
          opacity: 0;
        }


        paper-item {
          --paper-item-focused-before: #{'{
              background: var(--primary-background-color);
              opacity: 0;
            }
          }

          paper-item:hover {
            background: #EEEEEE;
          }
        }
      </style>

      <etools-ajax method="POST" url="{{url}}" body="{{countryData}}"
                   on-success="_handleResponse" on-forbidden="_handleError" on-fail="_handleError">
      </etools-ajax>

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
    return [
      '_setCountryIndex(countries, countryId)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('paper-dropdown-close', this._toggleOpened);
    this.addEventListener('paper-dropdown-open', this._toggleOpened);
  }
  _setCountryIndex(countries, countryId) {
    if (!(countries instanceof Array)) {
      return;
    }

    this.countryIndex = countries.findIndex((country) => {
      return country.id === countryId;
    });
  }

  _toggleOpened() {
    this.set('opened', this.$.dropdown.opened);
  }

  _countrySelected(e) {
    this.set('country', this.$.repeat.itemForElement(e.detail.item));
  }

  _changeCountry(event) {
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
    this.countryData = {
      country: id
    };
    this.url = this.getEndpoint('changeCountry').url;
  }

  _handleError() {
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

  _handleResponse() {
    this.refreshInProgress = true;
    this.clearDexieDbs();
  }

  _refreshPage() {
    this.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}

window.customElements.define(CountriesDropdown.is, CountriesDropdown);
