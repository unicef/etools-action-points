import {PolymerElement, html} from '@polymer/polymer';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import {updateQueries} from '../app-mixins/query-params-mixin';
import {DateMixin} from '../app-mixins/date-mixin';
import {sharedStyles} from '../styles-elements/shared-styles';
import {moduleStyles} from '../styles-elements/module-styles';
import {tabInputsStyles} from '../styles-elements/tab-inputs-styles';
import {customElement, property, observe} from '@polymer/decorators';
import {GenericObject} from '../../typings/globals.types';
declare const dayjs: any;

@customElement('search-and-filter')
export class SearchAndFilter extends DateMixin(PolymerElement) {
  public static get template() {
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

        .inputs-container {
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
        <template is="dom-repeat" items="[[selectedFilters]]">

          <template is="dom-if" if="[[item.isDatePicker]]">
            <div class="layout horizontal">
              <datepicker-lite id="[[item.query]]"
                               label="[[item.name]]"
                               slot="prefix"
                               selected-date-display-format="YYYY-MM-DD"
                               fire-date-has-changed="[[!restoreInProcess]]"
                               on-date-has-changed="_changeFilterValue"
                               clear-btn-inside-dr>
              </datepicker-lite>
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
              <template is="dom-repeat" items="[[filters]]">
                <paper-icon-item on-tap="selectFilter">
                  <iron-icon icon="check" slot="item-icon" hidden$="[[!item.selected]]"></iron-icon>
                  <paper-item><span class="add-filter--item-name">[[item.name]]</span></paper-item>
                </paper-icon-item>
              </template>
            </paper-listbox>
          </paper-menu-button>
        </div>
      </template>
    `;
  }

  @property({type: Array, notify: true})
  filters: GenericObject[];

  @property({type: String})
  searchLabel: string;

  @property({type: String})
  searchString: string;

  @property({type: Array})
  selectedFilters: GenericObject[];

  @property({type: Object, notify: true})
  queryParams: GenericObject;

  @property({type: Object})
  dates: GenericObject = {};

  @property({type: Object})
  _debounceSearch: Debouncer;

  @property({type: Object})
  _debounceFilters: Debouncer;

  @observe('searchString')
  searchKeyDown() {
    this.set('_debounceSearch', Debouncer.debounce(
        this._debounceSearch, timeOut.after(300), () => {
          let query = this.searchString ? encodeURIComponent(this.searchString) : undefined;
          updateQueries({
            search: query,
            page: '1'
          });
        }));
  }

  addFilter(e: CustomEvent | any) {
    let query = (typeof e === 'string') ? e : e.model.item.query;
    let alreadySelected = this.selectedFilters.findIndex((filter) => {
      return filter.query === query;
    });

    if (alreadySelected === -1) {
      let newFilter = this.filters.find((filter) => {
        return filter.query === query;
      });
      this._setFilterValue(newFilter);
      this.push('selectedFilters', newFilter);
      let filterIndex = this.filters.findIndex(filter => filter.query === query);
      this.set(`filters.${filterIndex}.selected`, true);

      if (this.queryParams[query] === undefined) {
        let queryObject = {};
        queryObject[query] = true;
        updateQueries(queryObject);
      }
    }
  }

  removeFilter(e: CustomEvent | any) {
    let query = (typeof e === 'string') ? e : e.model.item.query;
    let indexToRemove = this.selectedFilters.findIndex((filter) => {
      return filter.query === query;
    });
    if (indexToRemove === -1) {return;}

    let queryObject = {query: undefined, page: undefined};

    if (this.queryParams[query]) {
      queryObject.page = '1';
    }

    if (indexToRemove !== -1) {
      let filterIndex = this.filters.findIndex(filter => filter.query === query);
      this.set(`filters.${filterIndex}.selected`, false);
      this.splice('selectedFilters', indexToRemove, 1);
    }
    updateQueries(queryObject);
  }

  _reloadFilters() {
    this.set('selectedFilters', []);
    this._restoreFilters();
  }

  @observe('queryParams.*')
  _restoreFilters() {
    this.set('restoreInProcess', true);
    this.set('_debounceFilters', Debouncer.debounce(this._debounceFilters,
        timeOut.after(50),
        () => {
          let queryParams = this.queryParams;

          if (!queryParams) {
            return;
          }

          let availableFilters = [];

          this.filters.forEach((filter) => {
            let usedFilter = this.selectedFilters.find(used => used.query === filter.query);

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
            this.set('restoreInProcess', false);
          });
        }));
  }

  _updateValues() {
    let ids = Object.keys(this.queryParams || {});
    ids.forEach((id) => {
      let element: any = this.shadowRoot.querySelector(`#${id}`);
      if (!element) {
        return;
      }
      let value = this.queryParams[id];
      let isDatepicker = element.dataset.hasOwnProperty('isDatepicker');
      if (isDatepicker) {
        element.set('value', value);
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

  // select a filter from ADD FILTER menu
  selectFilter({model: {item: selectedOption, index: selectedIdx}}) {
    if (!this._isAlreadySelected(selectedOption)) {
      this._setFilterValue(selectedOption);
      this.push('selectedFilters', selectedOption);
      this.set(`filters.${selectedIdx}.selected`, true);
      if (this.queryParams[selectedOption.query] === undefined) {
        let queryObject: any = {};
        queryObject[selectedOption.query] = true;
        updateQueries(queryObject);
      }
    } else {
      let paredFilters = this.selectedFilters.filter(fil => fil.query != selectedOption.query);
      this.set('selectedFilters', paredFilters);
      this.set(`filters.${selectedIdx}.selected`, false);
      let newQueryObj = this.queryParams;
      newQueryObj[selectedOption.query] = undefined;
      updateQueries(newQueryObj);
      delete newQueryObj[selectedOption.query];
      this.set('queryParams', newQueryObj);
    }
  }

  _isAlreadySelected(filter) {
    return Boolean(
        this.selectedFilters.find(sF => sF.query === filter.query)
    );
  }

  _changeFilterValue(e: any) {
    if (!e || !e.currentTarget) {
      return;
    }

    let query = e.currentTarget.id,
      date = dayjs(e.detail.date).format('YYYY-MM-DD'),
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
      updateQueries(queryObject);
    }
  }
}
