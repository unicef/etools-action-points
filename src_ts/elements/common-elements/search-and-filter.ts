import {PolymerElement, html} from '@polymer/polymer';
import {timeOut} from '@polymer/polymer/lib/utils/async';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-card/paper-card';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
// import 'etools-dropdown/';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-toggle-button/paper-toggle-button';
// import 'etools-datepicker/etools-datepicker-button';
import QueryParams from '../app-mixins/query-params-mixin';
import DateMixin from '../app-mixins/date-mixin';
import {sharedStyles} from '../styles-elements/shared-styles';
import {moduleStyles} from '../styles-elements/module-styles';
import {tabInputsStyles} from '../styles-elements/tab-inputs-styles';

class SearchAndFilter extends
  DateMixin(
    QueryParams(
      PolymerElement)) {

  static get template() {
    return html`
      ${sharedStyles}
      ${moduleStyles}
      ${tabInputsStyles}
      <style include="iron-flex">
        :host {
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-flex;
        }
      
        :host.inputs-container {
          flex-wrap: wrap;
        }
      
        paper-input {
          --paper-input-container: {
            width: 240px;
            margin-left: 26px;
          };
          --paper-input-container-color: var(--gray-light);
      
          iron-icon { color: var(--gray-mid); }
        }
        
        
        .toggle-hidden-div {
          margin-right: 26px;
        }
        
        span.toggle-hidden-div {
          color: var(--gray-dark);
          font-size: 16px;
          margin-right: 8px;
        }
        
        #add-filter-container {
          border-left: 2px solid var(--gray-lighter);
          margin-left: 16px;
          margin-right: 16px;
          padding-left: 10px;
        }
      
        #add-filter-container.add-filter-text {
          margin-top: 4px;
        }
      
        #add-filter-container paper-button {
          color: var(--module-primary);
          font-weight: bold;
        }
      
        #add-filter-container paper-menu-button {
          padding: 0;
          margin: 8px;
        }
      
        #add-filter-container paper-menu-button paper-button {
          margin: 0;
        }
        
          paper-listbox {
            background-color: #ffffff;
    
            --paper-menu-background-color: #ffffff;
            --paper-menu-focused-item-after: {
              background: var(--primary-background-color);
              opacity: 0;
          };
    
          paper-listbox paper-item {
            font-weight: normal;
            height: 48px;
            min-height: initial;
            cursor: pointer;

            --paper-item-focused-before: {
              background: var(--primary-background-color);
              opacity: 0;
            };
          }
    
          paper-listbox span.add-filter--item-name {
            white-space: nowrap;
            text-transform: capitalize;
          }
        
        .filter-dropdown {
          margin-left: 20px;
          width: 200px;
      
          --esmm-list-wrapper: {
            margin-top: 0;
            padding-top: 12px;
            -ms-overflow-style: auto;
          }
        }
        .filter-reset-button {
          margin: auto 12px;
          transform: translate(0, 8px);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          line-height: 16px;
          background-color: var(--module-error);
          color: white;
          font-weight: 500;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
        }
      </style>

      <div class="layout horizontal flex inputs-container">
        <div class="layout horizontal">
          <paper-input type="search"
                       value="{{searchString}}"
                       label="[[searchLabel]]"
                       placeholder="Search"
                       always-float-label inline>

            <iron-icon icon="search" slot="prefix"></iron-icon>
          </paper-input>
        </div>

        <!-- FILTERS -->
        <template is="dom-repeat" items="[[usedFilters]]">

          <template is="dom-if" if="[[item.isDatePicker]]">
            <div class="layout horizontal">
              <paper-input placeholder="Select [[item.name]]" data-selector$="[[item.query]]" on-tap="openDatePicker">
                <etools-datepicker-button id="[[item.query]]" slot="prefix" format="YYYY-MM-DD"
                  fire-date-has-changed="[[!restoreInProcess]]"
                  on-date-has-changed="_changeFilterValue"
                  show-clear-btn data-is-datepicker no-init>
                </etools-datepicker-button>
              </paper-input>

              <div class="filter-reset-button" on-click="removeFilter">×</div>
            </div>
          </template>

          <template is="dom-if" if="[[!item.isDatePicker]]">
            <div class="layout horizontal">
              <etools-dropdown id="[[item.query]]" class="filter-dropdown"
                selected="[[item.value]]" label="[[item.label]]"
                placeholder$="Select [[item.name]]" options="[[item.selection]]"
                option-label="[[item.optionLabel]]"
                option-value="[[item.optionValue]]" on-iron-select="_changeFilterValue"
                hide-search="[[item.hideSearch]]"
                allow-outside-scroll shown-items-limit="5">
              </etools-dropdown>

              <div class="filter-reset-button" on-click="removeFilter">×</div>
            </div>
          </template>

        </template>
      </div>

      <!-- ADD FILTERS -->
      <template is="dom-if" if="[[filters.length]]">
        <div id="add-filter-container">
          <paper-menu-button horizontal-align="right" vertical-align="top" no-overlap>
            <paper-button slot="dropdown-trigger">
              <iron-icon icon="filter-list" class="filter-list-icon"></iron-icon>

              <span class="add-filter-text">ADD FILTER</span>
            </paper-button>

            <paper-listbox slot="dropdown-content">
              <template is="dom-repeat" items="[[availableFilters]]">
                <paper-item on-click="addFilter"><span class="add-filter--item-name">[[item.name]]</span></paper-item>
              </template>
            </paper-listbox>
          </paper-menu-button>
        </div>
      </template>
    `;
  }

  static get properties() {
    return {
      filters: {
        type: Array,
        value: () => {
          return [];
        }
      },
      searchLabel: {
        type: String
      },
      searchString: {
        type: String,
        observer: 'searchKeyDown'
      },
      usedFilters: {
        type: Array,
        value: () => {
          return [];
        }
      },
      availableFilters: {
        type: Array,
        value: []
      },
      queryParams: {
        type: Object,
        notify: true
      },
      dates: {
        type: Object,
        value: () => ({})
      }
    };
  }

  static get observers() {
    return [
      '_restoreFilters(queryParams.*)'
    ];
  }

  searchKeyDown() {
    this._debounceSearch = Debouncer.debounce(
      this._debounceSearch, timeOut.after(300), () => {
        let query = this.searchString ? encodeURIComponent(this.searchString) : undefined;
        this.updateQueries({
          search: query,
          page: '1'
        });
      });
  }

  addFilter(e: any) {
    let query = (typeof e === 'string') ? e : e.model.item.query;
    let alreadySelected = this.usedFilters.findIndex((filter: any) => {
      return filter.query === query;
    });

    if (alreadySelected === -1) {
      let newFilter = this.filters.find((filter: any) => {
        return filter.query === query;
      });

      this._setFilterValue(newFilter);
      this.push('usedFilters', newFilter);

      if (this.queryParams[query] === undefined) {
        let queryObject: any = {};
        queryObject[query] = true;
        this.updateQueries(queryObject);
      }
    }
  }

  removeFilter(e: any) {
    let query = (typeof e === 'string') ? e : e.model.item.query;
    let indexToRemove = this.usedFilters.indexOf(query);
    if (indexToRemove === -1) {
      return;
    }

    let queryObject: any = {};
    queryObject[query] = undefined;

    if (this.queryParams[query]) {
      queryObject.page = '1';
    }

    if (indexToRemove !== -1) {
      this.splice('usedFilters', indexToRemove, 1);
    }
    this.updateQueries(queryObject);
  }

  _reloadFilters() {
    this.set('usedFilters', []);
    this._restoreFilters();
  }

  _restoreFilters() {
    this.restoreInProcess = true;
    this._debounceFilters = Debouncer.debounce(this._debounceFilters,
      timeOut.after(50),
      () => {
        let queryParams = this.queryParams;

        if (!queryParams) {
          return;
        }

        let availableFilters: any[] = [];

        this.filters.forEach((filter: any) => {
          let usedFilter = this.usedFilters.find((used: any) => used.query === filter.query);

          if (!usedFilter && queryParams[filter.query] !== undefined) {
            this.addFilter(filter.query);
          } else if (queryParams[filter.query] === undefined) {
            this.removeFilter(filter.query);
            availableFilters.push(filter);
          }
        });
        this.set('availableFilters', availableFilters);

        if (queryParams.search) {
          this.set('searchString', queryParams.search);
        } else {
          this.set('searchString', '');
        }
        setTimeout(() => {
          this._updateValues();
          this.restoreInProcess = false;
        });
      });
  }

  _updateValues() {
    let ids = Object.keys(this.queryParams || {});
    ids.forEach(id => {
      let element = this.shadowRoot.querySelector(`#${id}`);
      if (!element) {
        return;
      }

      let value = this.queryParams[id];
      let isDatepicker = element.dataset.hasOwnProperty('isDatepicker');
      if (isDatepicker) {
        element.set('prettyDate', value);
        this.dates[element.id] = value;
        element.parentElement.value = this.prettyDate(value);
      } else {
        element.selected = value;
      }
    });
  }

  _setFilterValue(filter: any) {
    if (!filter) {
      return;
    }

    filter.value = this.get(`queryParams.${filter.query}`);
  }

  _getFilter(query: string) {
    let filterIndex = this.filters.findIndex((filter: any) => {
      return filter.query === query;
    });

    if (filterIndex !== -1) {
      return this.get(`filters.${filterIndex}`);
    } else {
      return {};
    }
  }

  _changeFilterValue(e: any) {
    if (!e || !e.currentTarget) {
      return;
    }

    let query = e.currentTarget.id,
      date = e.detail.prettyDate,
      queryObject: any;

    if (e.type === 'date-has-changed' && query && (this.dates[query] || date)) {
      e.currentTarget.parentElement.value = this.prettyDate(date);
      this.dates[query] = date;
      queryObject = {
        page: '1',
        [query]: date || true
      };

    } else if (e.detail.item && query) {
      queryObject = {page: '1'};
      // e.detail.item.item doesn't from etools-dropdown
      queryObject[query] = e.detail.item.getAttribute('internal-id');
    }

    if (queryObject) {
      this.updateQueries(queryObject);
    }
  }
}

customElements.define('search-and-filter', SearchAndFilter);
