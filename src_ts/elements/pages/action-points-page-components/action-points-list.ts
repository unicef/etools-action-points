import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-location/iron-location.js';
import '@polymer/iron-location/iron-query-params.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {EtoolsDataTableColumn} from '@unicef-polymer/etools-data-table/etools-data-table-column.js';
import {getEndpoint} from '../../app-mixins/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/search-and-filter';
import '../../common-elements/filters-element';
import '../../data-elements/action-points-data';
import {getData} from '../../app-mixins/static-data-mixin';
import {LocalizationMixin} from '../../app-mixins/localization-mixin';
import {DateMixin} from '../../app-mixins/date-mixin';
import {InputAttrsMixin} from '../../app-mixins/input-attrs-mixin';
import {updateQueries, clearQueries} from '../../app-mixins/query-params-mixin';
import '../../common-elements/text-content';
import {moduleStyles} from '../../styles-elements/module-styles';
import {sharedStyles} from '../../styles-elements/shared-styles';
import {dataTableStyles} from '../../styles-elements/data-table-styles';
import {customElement, property, observe} from '@polymer/decorators';
import {noActionsAllowed} from '../../app-mixins/permission-controller';
import {GenericObject} from '../../../typings/globals.types';
import {SearchAndFilter} from '../../common-elements/search-and-filter';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-media-query/iron-media-query.js';

@customElement('action-points-list')
export class ActionPointsList extends InputAttrsMixin(LocalizationMixin(DateMixin(PolymerElement))) {
  public static get template() {
    return html`
      ${moduleStyles} ${sharedStyles} ${dataTableStyles}
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
        }

        .row-details-content .truncate {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        etools-data-table-row[low-resolution-layout] *[slot="row-data-details"] {
          margin-left: 32px;
        }

        etools-data-table-row *[slot="row-data-details"] {
          margin-left: 14px;
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
          display: flex;
          flex-direction: row;
          align-items: center;
          border-left: 2px solid var(--gray-lighter);
          margin: 8px 16px 8px 16px;
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
          overflow: hidden;
        }

        pages-header-element {
          box-shadow: 1px -3px 9px 0 #000000;
        }

        etools-data-table-row::part(edt-icon-wrapper) {
          padding: 0 24px;
        }
        etools-data-table-row {
          --list-icon-color: {
            rgba(0, 0, 0, 0.54);
          }
        }
        etools-data-table-header::part(edt-header-title){
          padding-left: 47px;
          font-weight: 500;
        }
        etools-data-table-header::part(edt-header-columns){
          margin-left: 47px;
        }
      </style>
      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>
      <iron-location path="{{path}}" query="{{query}}" url-space-regex="^[[rootPath]]"></iron-location>
      <iron-query-params params-string="{{query}}" params-any="{{queryParams}}"> </iron-query-params>
      <app-route-converter path="{{path}}" query-params="{{queryParams}}" route="{{route}}"> </app-route-converter>
      <pages-header-element
        hide-print-button
        link="action-points/new"
        show-add-button="[[!noActionsAllowed(basePermissionPath)]]"
        show-export-button
        export-links="[[exportLinks]]"
        btn-text="Add Action Point"
        page-title="Action Points"
      >
      </pages-header-element>
      <action-points-data
        action-points="{{actionPoints}}"
        request-queries="{{queryParams}}"
        list-length="{{totalResults}}"
      >
      </action-points-data>
      <filters-element>
        <search-and-filter
          id="filters"
          filters="[[filters]]"
          query-params="{{queryParams}}"
          search-params="[[searchParams]]"
        >
        </search-and-filter>
        <div class="show-completed-toggle">
          <span>Show Completed</span>
          <paper-toggle-button checked="{{isShowCompleted}}"></paper-toggle-button>
        </div>
      </filters-element>
      <paper-card>
        <etools-data-table-header
          id="listHeader"
          no-collapse="[[!actionPoints.length]]"
          low-resolution-layout="[[lowResolutionLayout]]"
          label="[[visibleRange.0]] - [[visibleRange.1]] of [[totalResults]] results to show"
        >
          <etools-data-table-column class="flex-1" field="reference_number" sortable>
            [[getLabel('reference_number', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="cp_output__name" sortable>
            [[getLabel('cp_output', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="partner__name" sortable>
            [[getLabel('partner', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="office__name" sortable>
            [[getLabel('office', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="section__name" sortable>
            [[getLabel('section', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="assigned_to__first_name,assigned_to__last_name" sortable>
            [[getLabel('assigned_to', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="due_date" sortable>
            [[getLabel('due_date', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="status" sortable>
            [[getLabel('status', basePermissionPath)]]
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="high_priority" sortable> Priority </etools-data-table-column>
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
          <etools-data-table-row low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data" class="layout horizontal">
              <div
                class="col-data flex-1 truncate"
                data-col-header-label$="[[getLabel('reference_number', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  <a href$="[[_getLink(entry.id)]]">[[getStringValue(entry.reference_number)]]</a>
                  <paper-tooltip offset="0">[[getStringValue(entry.reference_number)]]</paper-tooltip>
                </div>
              </div>
              <div
                class="col-data flex-2 truncate"
                data-col-header-label$="[[getLabel('cp_output', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  [[getStringValue(entry.cp_output.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.cp_output.name)]]</paper-tooltip>
                </div>
              </div>
              <div
                class="col-data flex-2 truncate"
                data-col-header-label$="[[getLabel('partner', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  [[getStringValue(entry.partner.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.partner.name)]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-2 truncate" data-col-header-label$="[[getLabel('office', basePermissionPath)]]">
                <div class="tooltip-container">
                  [[getStringValue(entry.office.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.office.name)]]</paper-tooltip>
                </div>
              </div>
              <div
                class="col-data flex-2 truncate"
                data-col-header-label$="[[getLabel('section', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  [[getStringValue(entry.section.name)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.section.name)]]</paper-tooltip>
                </div>
              </div>
              <div
                class="col-data flex-2 truncate"
                data-col-header-label$="[[getLabel('assigned_to', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  <span>[[getStringValue(entry.assigned_to.name)]]</span>
                  <paper-tooltip offset="0">[[getStringValue(entry.assigned_to.name)]]</paper-tooltip>
                </div>
              </div>
              <div
                class="col-data flex-1 truncate"
                data-col-header-label$="[[getLabel('due_date', basePermissionPath)]]"
              >
                <div class="tooltip-container">
                  [[prettyDate(entry.due_date, null, '-')]]
                  <paper-tooltip offset="0">[[prettyDate(entry.due_date, null, '-')]]</paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-1 truncate" data-col-header-label$="[[getLabel('status', basePermissionPath)]]">
                <div class="tooltip-container">
                  [[getStringValue(entry.status)]]
                  <paper-tooltip offset="0">[[getStringValue(entry.status)]] </paper-tooltip>
                </div>
              </div>
              <div class="col-data flex-1 truncate" data-col-header-label="Priority">
                <div class="tooltip-container">
                  [[_getPriorityValue(entry.high_priority)]]
                  <paper-tooltip offset="0">[[_getPriorityValue(entry.high_priority)]] </paper-tooltip>
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
                <paper-tooltip offset="0"
                  >[[getStringValue(entry.related_module, modules, 'display_name')]]
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

        <etools-data-table-footer
          page-size="{{pageSize}}"
          page-number="{{pageNumber}}"
          low-resolution-layout="[[lowResolutionLayout]]"
          total-results="[[totalResults]]"
          visible-range="{{visibleRange}}"
          on-page-size-changed="_pageSizeSelected"
          on-page-number-changed="_pageNumberChanged"
        >
        </etools-data-table-footer>
      </paper-card>
    `;
  }

  @property({type: Array, notify: true})
  actionPoints: any[];

  @property({type: Object, notify: true})
  labels: any;

  @property({type: Array, notify: true})
  createLink = '/new';

  @property({type: Array, notify: true})
  statuses: any[];

  @property({type: Boolean})
  lowResolutionLayout = false;

  @property({type: Array})
  filters: any[] = [
    {
      name: 'Assignee',
      query: 'assigned_to',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Assigned By',
      query: 'assigned_by',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Partner',
      query: 'partner',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Office',
      query: 'office',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Location',
      query: 'location',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Section',
      query: 'section',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Related App',
      query: 'related_module',
      optionValue: 'value',
      optionLabel: 'display_name',
      selection: [],
      selected: false
    },
    {
      name: 'Status',
      query: 'status',
      optionValue: 'value',
      optionLabel: 'display_name',
      selection: [],
      selected: false
    },
    {
      name: 'High Priority',
      query: 'high_priority',
      optionValue: 'value',
      optionLabel: 'display_name',
      selection: [
        {
          display_name: 'Yes',
          value: 'true'
        },
        {
          display_name: 'No',
          value: 'false'
        }
      ],
      selected: false
    },
    {
      name: 'PD/SSFA',
      query: 'intervention',
      optionValue: 'id',
      optionLabel: 'title',
      selection: [],
      selected: false
    },
    {
      name: 'CP Output',
      query: 'cp_output',
      optionValue: 'id',
      optionLabel: 'name',
      selection: [],
      selected: false
    },
    {
      name: 'Due On',
      query: 'due_date',
      isDatePicker: true,
      selected: false
    },
    {
      name: 'Due Before',
      query: 'due_date__lte',
      isDatePicker: true,
      selected: false
    },
    {
      name: 'Due After',
      query: 'due_date__gte',
      isDatePicker: true,
      selected: false
    }
  ];

  @property({type: Boolean})
  isShowCompleted = true;

  @property({type: Number})
  pageNumber = 1;

  @property({type: Number})
  pageSize = 10;

  @property({type: Object, notify: true})
  queryParams: GenericObject;

  @property({type: Object})
  oldQueryParams: GenericObject;

  @property({type: Array})
  totalResults: number;

  @property({type: Object, notify: true})
  route: any;

  @property({type: String})
  basePermissionPath = 'action_points';

  @property({type: Array, notify: true})
  exportParams: any;

  @property({type: Array, notify: true})
  exportLinks: string[];

  @property({type: Boolean})
  staticDataLoaded: boolean;

  @property({type: String})
  path: string;

  @property({type: Object})
  _debounceLoadData: Debouncer;

  ready() {
    super.ready();
    this._initSort();
    this.set('isShowCompleted', this.queryParams.status !== 'open');
    this.addEventListener('sort-changed', (e: CustomEvent) => this._sort(e));
  }

  @observe('staticDataLoaded')
  setData() {
    this.set('modules', getData('modules') || []);
    this.set('statuses', getData('statuses') || []);
    this._initFilters();
  }

  noActionsAllowed(path: string) {
    return noActionsAllowed(path);
  }

  _initSort() {
    const sortParams = this.queryParams && this.queryParams.ordering;
    if (!sortParams) return;
    const field = sortParams.replace(/^-/, '');
    const direction = sortParams.charAt(0) === '-' ? 'desc' : 'asc';
    const column: EtoolsDataTableColumn = this.shadowRoot.querySelector(`etools-data-table-column[field="${field}"]`);
    if (!column) return;
    column.dispatchEvent(
      new CustomEvent('sort-changed', {
        detail: {
          field: field,
          direction: direction
        },
        bubbles: true,
        composed: true
      })
    );
    column.set('selected', true);
    column.set('direction', direction);
  }

  @observe('path')
  _setPath(path: string) {
    if (~path.indexOf('/list')) {
      this.set('queryParams', Object.assign({}, this.queryParams, {page_size: this.pageSize, page: this.pageNumber}));
    }
  }

  @observe('queryParams')
  _updateQueries(queryParams: GenericObject) {
    if (!~this.path.indexOf('action-points/list') || !queryParams || !Object.keys(queryParams).length) {
      return;
    }
    const exportParams = JSON.parse(JSON.stringify(queryParams));
    delete exportParams['page_size'];
    delete exportParams['page'];
    this.set('exportParams', exportParams);

    if (queryParams.reload) {
      clearQueries();
      this.oldQueryParams = {};
      this.set('queryParams', Object.assign({}, {page_size: this.pageSize, page: this.pageNumber}));
      return;
    } else if (queryParams.page) {
      this.set('pageNumber', Number(queryParams.page));
    }

    if (!this.oldQueryParams || JSON.stringify(queryParams) !== JSON.stringify(this.oldQueryParams)) {
      this.oldQueryParams = Object.assign({}, queryParams);
    } else {
      return;
    }

    updateQueries(queryParams, null, true);

    const listElements = this.shadowRoot.querySelectorAll(`etools-data-table-row`);
    listElements.forEach((element: any) => (element.detailsOpened = false));

    this._debounceLoadData = Debouncer.debounce(this._debounceLoadData, timeOut.after(100), () => {
      this._requestData();
    });
  }

  _sort({detail}: any) {
    let ordering = detail.field;
    if (this.queryParams.ordering && this.queryParams.ordering === ordering) {
      ordering = this.queryParams.ordering.charAt(0) !== '-' ? `-${ordering}` : ordering.slice(1);
    }
    this.set('queryParams.ordering', ordering);
  }

  _getLink(actionPointId: number) {
    return `action-points/detail/${actionPointId}`;
  }

  _initFilters() {
    const filtersElement: SearchAndFilter = this.shadowRoot.querySelector('#filters');
    this.setFiltersSelections();
    if (filtersElement) {
      filtersElement._reloadFilters();
    }
  }

  setFiltersSelections() {
    const usersList = getData('unicefUsers').map((user: any) => {
      return {
        id: user.id,
        name: user.name
      };
    });
    const queryDataPairs = [
      {
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
      const filterIndex = this._getFilterIndex(pair.query);
      const data = !pair.data ? getData(pair.dataKey) : pair.data || [];
      this.setFilterSelection(filterIndex, data);
    });
  }

  _getFilterIndex(query: any) {
    if (!this.filters) {
      return -1;
    }

    return this.filters.findIndex((filter: any) => {
      return filter.query === query;
    });
  }

  setFilterSelection(filterIndex: number, data: any) {
    if (filterIndex !== undefined && filterIndex !== -1) {
      this.set(`filters.${filterIndex}.selection`, data);
      return true;
    }
    return false;
  }

  _requestData() {
    const actionPointData = this.shadowRoot.querySelector('action-points-data');
    actionPointData.dispatchEvent(new CustomEvent('request-action-points'));
  }

  _pageNumberChanged({detail}: any) {
    this.set('queryParams.page', detail.value);
  }

  _pageSizeSelected({detail}: any) {
    this.set('queryParams.page_size', detail.value);
  }

  @observe('isShowCompleted')
  _setShowCompleted(isShowCompleted: boolean) {
    if (!isShowCompleted) {
      this.set('queryParams.status', 'open');
    } else if (this.queryParams) {
      this.queryParams.status = undefined;
      updateQueries(this.queryParams);
    }
  }

  @observe('exportParams')
  _setExportLinks() {
    let qs = '';
    if (this.exportParams) {
      const keys = Object.keys(this.exportParams);
      const queryArray = keys.map((k) => k + '=' + this.exportParams[k]);
      qs = '?' + queryArray.join('&');
    }
    this.set('exportLinks', [
      {
        name: 'Export CSV',
        url: getEndpoint('actionPointsListExport').url + qs
      }
    ]);
  }

  _getPriorityValue(priority: boolean) {
    return priority === true ? 'high' : '';
  }
}
