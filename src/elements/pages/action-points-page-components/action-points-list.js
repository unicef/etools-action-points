import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-location/iron-location.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory.js';
import '../../common-elements/pages-header-element.js';
import '../../common-elements/search-and-filter.js';
import '../../common-elements/filters-element.js';
import 'etools-data-table/etools-data-table.js';
import '../../data-elements/action-points-data.js';
import '../../app-mixins/static-data-mixin.js';
import '../../app-mixins/localization-mixin.js';
import '../../app-mixins/date-mixin.js';
import '../../app-mixins/input-attrs-mixin.js';
import '../../common-elements/text-content.js';
import {moduleStyles} from '../../styles-elements/module-styles.js';
import {sharedStyles} from '../../styles-elements/shared-styles.js';
import {dataTableStyles} from '../../styles-elements/data-table-styles.js';

class ActionPointsList extends EtoolsMixinFactory.combineMixins([
  APDMixins.AppConfig,
  APDMixins.StaticDataMixin,
  APDMixins.InputAttrs,
  APDMixins.QueryParamsMixin,
  APDMixins.LocalizationMixin,
  APDMixins.DateMixin
], PolymerElement) {

  static get template() {
    return html`
      ${moduleStyles}
      ${sharedStyles}
      ${dataTableStyles}
      <style include="iron-flex-factors iron-flex">
        :host {
          position: relative;
          display: block;
        }

        .col-data a {
          color: var(--module-primary);
          font-weight: 500;
          cursor: pointer;
        }
      
        .row-details-content {
          position: relative;
          min-width: 0;
          paper-tooltip {
            max-width: 100%;
          }
        }
      
        .row-details-content .truncate {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      
        paper-card {
          display: block;
          margin-top: 25px;
          background-color: white;
          margin: 24px 24px 0 24px;
          width: calc(100% - 48px);
        }
      
        .no-content {
          padding: 16px 24px;
        }
      
        .show-completed-toggle {
          @apply --layout-horizontal;
          @apply --layout-center;
          border-left: 2px solid var(--gray-lighter);
          margin-left: 16px;
          margin-right: 16px;
          align-self: center;
          padding: 18px 0 18px 10px;
        }
        .show-completed-toggle span {
          padding: 0 12px;
          font-size: 16px;
        }
      
        .ellipse {
          max-height: 4.4em;
          overflow: hidden;
        }
      
        .tooltip-container {
          display: inline-block;
          max-width: 100%;
        }
        
        pages-header-element { 
          box-shadow: 1px -3px 9px 0 #000000; 
        }

        etools-data-table-row {
          --icon-wrapper: {
            padding: 0 24px;
          }
          --list-icon-color: {
            rgba(0, 0, 0, 0.54);
          }
        }
        etools-data-table-header {
          --header-title: {
            padding-left: 47px;
            font-weight: 500;
          }
          --header-columns: {
            margin-left: 47px;
          }
        }    
      </style>
  
      <iron-location path="{{path}}" query="{{query}}"></iron-location>
      <iron-query-params params-string="{{query}}" params-object="{{queryParams}}">
      </iron-query-params>
      <app-route-converter path="{{path}}" query-params="{{queryParams}}" route="{{route}}">
      </app-route-converter>
      <pages-header-element hide-print-button link="action-points/new" 
        show-add-button="[[!noActionsAllowed(basePermissionPath)]]"
        export-links="[[_setExportLinks()]]" btn-text="Add Action Point" page-title="Action Points">
      </pages-header-element>
      <action-points-data action-points="{{actionPoints}}" request-queries="{{queryParams}}" 
        list-length="{{totalResults}}">
      </action-points-data>
      <filters-element>
        <search-and-filter id="filters" filters="[[filters]]" query-params="{{queryParams}}" 
          search-params="[[searchParams]]">
        </search-and-filter>
        <div class="show-completed-toggle">
          <span>Show Completed</span>
          <paper-toggle-button checked="{{isShowCompleted}}"></paper-toggle-button>
        </div>
      </filters-element>
      <paper-card>
        <etools-data-table-header id="listHeader" no-collapse="[[!actionPoints.length]]" 
          label="[[visibleRange.0]] - [[visibleRange.1]] of [[totalResults]] results to show">
          <etools-data-table-column class="flex-1" field="reference_number" sortable>
          <!--[[getLabel('reference_number', basePermissionPath)]]-->
          Reference Number
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="cp_output__name" sortable>
          <!--[[getLabel('cp_output', basePermissionPath)]]-->
          CP Output
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="partner__name" sortable>
          <!--[[getLabel('partner', basePermissionPath)]]-->
          Partner
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="office__name" sortable>
          <!--[[getLabel('office', basePermissionPath)]]-->
          Office
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="section__name" sortable>
          <!--[[getLabel('section', basePermissionPath)]]-->
          Section
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="assigned_to__first_name,assigned_to__last_name" sortable>
          <!--[[getLabel('assigned_to', basePermissionPath)]]-->
          Assigned To
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="due_date" sortable>
          <!--[[getLabel('due_date', basePermissionPath)]]-->
          Due Date
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="status" sortable>
          <!--[[getLabel('status', basePermissionPath)]]-->
          Status
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="high_priority" sortable>
            Priority
          </etools-data-table-column>
        </etools-data-table-header>
  
        <template is="dom-if" if="[[!actionPoints.length]]">
          <etools-data-table-row no-collapse>
            <div slot="row-data" class="layout horizontal">
              <div class="col-data flex-1 truncate">-</div>
              <div class="col-data flex-2 truncate">-</div>
              <div class="col-data flex-2 truncate">-</div>
              <div class="col-data flex-2 truncate">-</div>
              <div class="col-data flex-2 truncate">-</div>
              <div class="col-data flex-2 truncate">-</div>
              <div class="col-data flex-1 truncate">-</div>
              <div class="col-data flex-1 truncate">-</div>
              <div class="col-data flex-1 truncate"></div>
            </div>
          </etools-data-table-row>
        </template>
  
        <template id="rows" is="dom-repeat" items="[[actionPoints]]" as="entry">
          <etools-data-table-row>
            <div slot="row-data" class="layout horizontal">
              <div class="col-data flex-1 truncate">
                <div class="tooltip-container">
                  <a href$="[[_getLink(entry.id)]]">[[getStringValue(entry.reference_number)]]</a>
                  <paper-tooltip offset="0">[[getStringValue(entry.reference_number)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate">
                <div class="tooltip-container">
                  [[getStringValue(entry.cp_output.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.cp_output.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate">
                <div class="tooltip-container">
                  [[getStringValue(entry.partner.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.partner.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate">
                <div class="tooltip-container">
                  [[getStringValue(entry.office.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.office.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate">
                <div class="tooltip-container">
                  [[getStringValue(entry.section.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.section.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate">
                <div class="tooltip-container">
                  <span>[[getStringValue(entry.assigned_to.name)]]</span>
                  <paper-tooltip offset="0">[[getStringValue(entry.assigned_to.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-1 truncate">
                <div class="tooltip-container">
                  [[prettyDate(entry.due_date, null, '-')]]
                  <paper-tooltip offset="0">[[prettyDate(entry.due_date, null, '-')]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-1 truncate">
                <div class="tooltip-container">
                  [[getStringValue(entry.status, statuses, 'display_name')]]
                  <paper-tooltip offset="0">[[getStringValue(entry.status, statuses, 'display_name')]]
                  </paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-1 truncate">
                <div class="tooltip-container">
                  [[_getPriorityValue(entry.high_priority)]]
                  <paper-tooltip offset="0">[[_getPriorityValue(entry.high_priority)]]
                  </paper-tooltip>
                </div>
              </div>
            </div>
            <div slot="row-data-details" class="layout horizontal">
              <div class="row-details-content layout vertical flex">
                <div class="rdc-title">[[getLabel('description', basePermissionPath)]]</div>
                <text-content rows="3" text="[[getStringValue(entry.description)]]"></text-content>
                <paper-tooltip offset="0">[[getStringValue(entry.description)]]</paper-tooltip>
              </div>
              <div class="row-details-content layout vertical flex">
                <div class="rdc-title">[[getLabel('intervention', basePermissionPath)]]</div>
                <div class="truncate">[[getStringValue(entry.intervention.number)]]</div>
                <paper-tooltip offset="0">[[getStringValue(entry.intervention.number)]]</paper-tooltip>
              </div>
              <div class="row-details-content layout vertical flex">
                <div class="rdc-title">[[getLabel('location', basePermissionPath)]]</div>
                <div class="truncate">[[getStringValue(entry.location.name)]]</div>
                <paper-tooltip offset="0">[[getStringValue(entry.location.name)]]</paper-tooltip>
              </div>
              <div class="row-details-content layout vertical flex">
                <div class="rdc-title">[[getLabel('related_module', basePermissionPath)]]</div>
                <div class="truncate">[[getStringValue(entry.related_module, modules, 'display_name')]]</div>
                <paper-tooltip offset="0">[[getStringValue(entry.related_module, modules, 'display_name')]]
                </paper-tooltip>
              </div>
              <div class="row-details-content layout vertical flex">
                <div class="rdc-title">[[getLabel('assigned_by', basePermissionPath)]]</div>
                <div class="truncate">[[getStringValue(entry.assigned_by.name)]]</div>
                <paper-tooltip offset="0">[[getStringValue(entry.assigned_by.name)]]</paper-tooltip>
              </div>
              <div class="row-details-content layout vertical flex">
                <template is="dom-if" if="[[entry.date_of_completion.length]]">
                  <div class="rdc-title">[[getLabel('date_of_completion', basePermissionPath)]]</div>
                  <div class="truncate">[[prettyDate(entry.date_of_completion)]]</div>
                  <paper-tooltip offset="0">[[prettyDate(entry.date_of_completion)]]</paper-tooltip>
                </template>
              </div>
            </div>
          </etools-data-table-row>
        </template>
  
        <etools-data-table-footer page-size="{{pageSize}}" page-number="{{pageNumber}}" 
          total-results="[[totalResults]]"
          visible-range="{{visibleRange}}" on-page-size-changed="_pageSizeSelected" 
          on-page-number-changed="_pageNumberChanged">
        </etools-data-table-footer>
      </paper-card>
    `;
  }

  static get properties() {
    return {
      actionPoints: {
        type: Array
      },
      createLink: {
        type: String,
        value: '/new'
      },
      filters: {
        type: Array,
        value: () => _.sortBy([{
            name: 'Assignee',
            query: 'assigned_to',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Assigned By',
            query: 'assigned_by',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Partner',
            query: 'partner',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Office',
            query: 'office',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Location',
            query: 'location',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Section',
            query: 'section',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Related App',
            query: 'related_module',
            optionValue: 'value',
            optionLabel: 'display_name',
            selection: []
          },
          {
            name: 'Status',
            query: 'status',
            optionValue: 'value',
            optionLabel: 'display_name',
            selection: []
          },
          {
            name: 'High Priority',
            query: 'high_priority',
            optionValue: 'value',
            optionLabel: 'display_name',
            selection: [{
              display_name: 'Yes',
              value: 'true'
            }, {
              display_name: 'No',
              value: 'false'
            }]
          },
          {
            name: 'PD/SSFA',
            query: 'intervention',
            optionValue: 'id',
            optionLabel: 'title',
            selection: []
          },
          {
            name: 'CP Output',
            query: 'cp_output',
            optionValue: 'id',
            optionLabel: 'name',
            selection: []
          },
          {
            name: 'Due On',
            query: 'due_date',
            isDatePicker: true
          },
          {
            name: 'Due Before',
            query: 'due_date__lte',
            isDatePicker: true
          },
          {
            name: 'Due After',
            query: 'due_date__gte',
            isDatePicker: true
          }
        ], (filter) => {
          return filter.name.toLowerCase();
        })
      },
      isShowCompleted: {
        type: Boolean,
        value: true,
        observer: '_setShowCompleted'
      },
      pageNumber: {
        type: Number,
        value: 1
      },
      pageSize: {
        type: Number,
        value: 10
      },
      queryParams: {
        type: Object,
        observer: '_updateQueries',
        notify: true
      },
      totalResults: Number,
      route: {
        type: Object,
        notify: true
      },
      basePermissionPath: {
        type: String,
        value: 'action_points'
      }
    };
  }

  static get observers() {
    return [
      // '_updateQueries(queryParams.*)',
      '_setPath(path)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.modules = this.getData('modules') || [];
    this.statuses = this.getData('statuses') || [];
    this._initFilters();
    this._initSort();
    this.isShowCompleted = this.queryParams.status !== 'open';
    this.addEventListener('sort-changed', e => this._sort(e));
  }

  _initSort() {
    let sortParams = this.queryParams && this.queryParams.ordering;
    if (!sortParams) return;
    let field = sortParams.replace(/^-/, '');
    let direction = sortParams.charAt(0) === '-' ? 'desc' : 'asc';
    let column = this.shadowRoot.querySelector(`etools-data-table-column[field="${field}"]`);
    if (!column) return;
    column.dispatchEvent(new CustomEvent('sort-changed', {
      detail: {
        field: field,
        direction: direction
      },
      bubbles: true,
      composed: true
    }));
    column.set('selected', true);
    column.set('direction', direction);
  }

  _setPath(path) {
    if (~path.indexOf('/list')) {
      this.set('queryParams.page_size', this.pageSize);
      this.set('queryParams.page', this.pageNumber);
    }
  }

  _updateQueries(queryParams, oldQueryParams) {
    if (!~this.path.indexOf('action-points/list')) return;
    if (this.queryParams.reload) {
      this.clearQueries();
      this.set('queryParams.page_size', this.pageSize);
      this.set('queryParams.page', this.pageNumber);
    }
    this.updateQueries(this.queryParams, null, true);
    let hasNewEmptyFilter = oldQueryParams && _.some(_.map(queryParams, (value, key) => {
      return !oldQueryParams.hasOwnProperty(key) && value.length === 0;
    }), value => value);
    let hasOldEmptyFilter = oldQueryParams && _.some(_.map(oldQueryParams, (value, key) => {
      return !queryParams.hasOwnProperty(key) && value.length === 0;
    }), value => value);
    if (!hasNewEmptyFilter && !hasOldEmptyFilter) {
      let listElements = this.shadowRoot.querySelectorAll(`etools-data-table-row`);
      _.each(listElements, (element) => {
        element.detailsOpened = false;
      });
      this._requestData();
    }
  }

  _sort({
    detail
  }) {
    let ordering = detail.field;
    if (this.queryParams.ordering && this.queryParams.ordering === ordering) {
      ordering = this.queryParams.ordering.charAt(0) !== '-' ? `-${ordering}` : ordering.slice(1);
    }
    this.set('queryParams.ordering', ordering);
  }

  _getLink(actionPointId) {
    return `action-points/detail/${actionPointId}`;
  }

  _initFilters() {
    let filtersElement = this.$.filters;
    // this.setFiltersSelections();
    if (filtersElement) {
      filtersElement._reloadFilters();
    }
  }

  setFiltersSelections() {
    let usersList = this.getData('unicefUsers').map((user) => {
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      };
    });
    let queryDataPairs = [{
        query: 'assigned_to',
        data: usersList
      },
      {
        query: 'assigned_by',
        data: usersList
      },
      {
        query: 'partner',
        dataKey: 'partnerOrganisations'
      },
      {
        query: 'office',
        dataKey: 'offices'
      },
      {
        query: 'location',
        dataKey: 'locations'
      },
      {
        query: 'cp_output',
        dataKey: 'cpOutputsList'
      },
      {
        query: 'intervention',
        dataKey: 'interventionsList'
      },
      {
        query: 'status',
        dataKey: 'statuses'
      },
      {
        query: 'section',
        dataKey: 'sectionsCovered'
      },
      {
        query: 'related_module',
        dataKey: 'modules'
      }
    ];

    queryDataPairs.forEach((pair) => {
      let filterIndex = this._getFilterIndex(pair.query);
      let data = !pair.data ? this.getData(pair.dataKey) : pair.data || [];
      this.setFilterSelection(filterIndex, data);
    });
  }

  _getFilterIndex(query) {
    if (!this.filters) {
      return -1;
    }

    return this.filters.findIndex((filter) => {
      return filter.query === query;
    });
  }

  setFilterSelection(filterIndex, data) {
    if (filterIndex !== undefined && filterIndex !== -1) {
      this.set(`filters.${filterIndex}.selection`, data);
      return true;
    }
  }

  _requestData() {
    let actionPointData = this.shadowRoot.querySelector('action-points-data');
    actionPointData.dispatchEvent(new CustomEvent('request-action-points'));
  }

  _pageNumberChanged({
    detail
  }) {
    this.set('queryParams.page', detail.value);
  }

  _pageSizeSelected({
    detail
  }) {
    this.set('queryParams.page_size', detail.value);
  }
  _setShowCompleted(isShowCompleted) {
    if (!isShowCompleted) {
      this.set('queryParams.status', 'open');
    } else {
      this.queryParams = _.omit(this.queryParams, ['status']);
    }
  }
  _setExportLinks() {
    return [{
      name: 'Export CSV',
      url: this.getEndpoint('actionPointsListExport').url
    }];
  }

  _getPriorityValue(priority) {
    return priority === true ? 'high' : '';
  }
}

customElements.define('action-points-list', ActionPointsList);
