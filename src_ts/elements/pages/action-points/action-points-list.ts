import {LitElement, html, customElement, property} from 'lit-element';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer//app-route/app-location';
import '@polymer/iron-location/iron-query-params.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {EtoolsDataTableColumn} from '@unicef-polymer/etools-data-table/etools-data-table-column.js';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/search-and-filter';
import '../../common-elements/filters-element';
import '../../data-elements/action-points-data';
import {getData} from '../../mixins/static-data-mixin';
import {LocalizationMixin} from '../../mixins/localization-mixin-lit';
import {DateMixin} from '../../mixins/date-mixin-lit';
import {InputAttrsMixin} from '../../mixins/input-attrs-mixin-lit';
import {updateQueries, clearQueries} from '../../mixins/query-params-helper';
import '../../common-elements/text-content';
import {moduleStyles} from '../../styles/module-styles-lit';
import {sharedStyles} from '../../styles/shared-styles-lit';
import {dataTableStylesLit} from '@unicef-polymer/etools-data-table/data-table-styles-lit';
import {noActionsAllowed} from '../../mixins/permission-controller';
import {GenericObject} from '../../../typings/globals.types';
import {SearchAndFilter} from '../../common-elements/search-and-filter';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-media-query/iron-media-query.js';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';

@customElement('action-points-list')
export class ActionPointsList extends PaginationMixin(InputAttrsMixin(LocalizationMixin(DateMixin(LitElement)))) {
  @property({type: Array}) // , notify: true
  actionPoints: any[];

  @property({type: Object}) // , notify: true
  labels: any;

  @property({type: Array}) // , notify: true
  createLink = '/new';

  @property({type: Array}) // , notify: true
  statuses: any[];

  @property({type: Array})
  modules: [];

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

  @property({type: Object}) // , notify: true
  queryParams: GenericObject;

  @property({type: Object})
  oldQueryParams: GenericObject;

  @property({type: Array})
  totalResults: number;

  @property({type: Object}) // , notify: true
  route: any;

  @property({type: String})
  basePermissionPath = 'action_points';

  @property({type: Object}) // , notify: true
  exportParams: any;

  @property({type: Array}) // , notify: true
  exportLinks: any[];

  @property({type: Boolean})
  staticDataLoaded: boolean;

  @property({type: String})
  path: string;

  @property({type: Object})
  _debounceLoadData: Debouncer;

  @property({type: Object})
  searchParams: any;

  @property({type: String})
  rootPath: string;

  static get styles() {
    // language=CSS
    return [gridLayoutStylesLit];
  }

  render() {
    return html`
      ${moduleStyles} ${sharedStyles}
      <style>
        ${dataTableStylesLit} :host {
          position: relative;
          display: block;
        }

        paper-card {
          display: block;
          margin-top: 25px;
          background-color: white;
          margin: 24px 24px 0 24px;
          width: calc(100% - 48px);
        }

        etools-data-table-row {
          --row-width_-_width: 100%;
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
      </style>
      <iron-media-query
        query="(max-width: 767px)"
        .queryMatches="${this.lowResolutionLayout}"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></iron-media-query>
      <app-location
        .path="${this.path}"
        .queryParams="${this.queryParams}"
        url-space-regex="^${this.rootPath}"
        @path-changed=${this.pathChanged}
        @query-params-changed=${this.queryParamsChanged}
      >
      </app-location>

      <pages-header-element
        hide-print-button
        link="action-points/new"
        .showAddButton="${!this.noActionsAllowed(this.basePermissionPath)}"
        show-export-button
        .exportLinks="${this.exportLinks}"
        btn-text="Add Action Point"
        page-title="Action Points"
      >
      </pages-header-element>
      <action-points-data
        .actionPoints="${this.actionPoints}"
        .requestQueries="${this.queryParams}"
        .listLength="${this.paginator.count}"
        @action-points-changed=${({detail}: CustomEvent) => {
          this.actionPoints = detail.value;
        }}
        @list-length-changed=${({detail}: CustomEvent) => {
          this.paginator.count = detail.value;
        }}
      >
      </action-points-data>
      <filters-element>
        <search-and-filter
          id="filters"
          .filters="${this.filters}"
          .queryParams="${this.queryParams}"
          .searchParams="${this.searchParams}"
          @query-params-changed=${this.queryParamsChanged}
        >
        </search-and-filter>
        <div class="show-completed-toggle">
          <span>Show Completed</span>
          <paper-toggle-button
            ?checked="${this.isShowCompleted}"
            @iron-change="${(event: CustomEvent) =>
              (this.isShowCompleted = (event.currentTarget as HTMLInputElement).checked)}"
          >
          </paper-toggle-button>
        </div>
      </filters-element>
      <paper-card>
        <etools-data-table-header
          id="listHeader"
          ?no-collapse="${!this.actionPoints?.length}"
          .lowResolutionLayout="${this.lowResolutionLayout}"
          label="${this.paginator.visible_range[0]} - ${this.paginator.visible_range[1]} of ${this.paginator
            .count} results to show"
        >
          <etools-data-table-column class="col-1" field="reference_number" sortable>
            ${this.getLabel('reference_number', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-2" field="cp_output__name" sortable>
            ${this.getLabel('cp_output', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-2" field="partner__name" sortable>
            ${this.getLabel('partner', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-2" field="office__name" sortable>
            ${this.getLabel('office', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-1" field="section__name" sortable>
            ${this.getLabel('section', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-1" field="assigned_to__first_name,assigned_to__last_name" sortable>
            ${this.getLabel('assigned_to', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-1" field="due_date" sortable>
            ${this.getLabel('due_date', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-1" field="status" sortable>
            ${this.getLabel('status', this.basePermissionPath)}
          </etools-data-table-column>
          <etools-data-table-column class="col-1" field="high_priority" sortable> Priority </etools-data-table-column>
        </etools-data-table-header>

        <etools-data-table-row no-collapse ?hidden="${this.actionPoints?.length}">
          <div slot="row-data" class="layout-horizontal">
            <div class="col-data col-1">-</div>
            <div class="col-data col-2">-</div>
            <div class="col-data col-2">-</div>
            <div class="col-data col-2">-</div>
            <div class="col-data col-1">-</div>
            <div class="col-data col-1">-</div>
            <div class="col-data col-1">-</div>
            <div class="col-data col-1">-</div>
            <div class="col-data col-1"></div>
          </div>
        </etools-data-table-row>

        ${this.actionPoints?.map(
          (entry) => html`
            <etools-data-table-row .lowResolutionLayout="${this.lowResolutionLayout}">
              <div slot="row-data" class="layout-horizontal">
                <div
                  class="col-data col-1"
                  data-col-header-label="${this.getLabel('reference_number', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.reference_number)}"
                >
                  <a href="${this._getLink(entry.id)}" class="truncate"
                    >${this.getStringValue(entry.reference_number)}</a
                  >
                </div>
                <div
                  class="col-data col-2"
                  data-col-header-label="${this.getLabel('cp_output', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.cp_output?.name)}"
                >
                  <span class="truncate">${this.getStringValue(entry.cp_output?.name)}</span>
                </div>
                <div
                  class="col-data col-2"
                  data-col-header-label="${this.getLabel('partner', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.partner?.name)}"
                >
                  <span class="truncate">${this.getStringValue(entry.partner?.name)}</span>
                </div>
                <div
                  class="col-data col-2"
                  data-col-header-label="${this.getLabel('office', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.office?.name)}"
                >
                  <span class="truncate">${this.getStringValue(entry.office?.name)}</span>
                </div>
                <div
                  class="col-data col-1"
                  data-col-header-label="${this.getLabel('section', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.section?.name)}"
                >
                  <span class="truncate">${this.getStringValue(entry.section?.name)}</span>
                </div>
                <div
                  class="col-data col-1"
                  data-col-header-label="${this.getLabel('assigned_to', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.assigned_to?.name)}"
                >
                  <span class="truncate">${this.getStringValue(entry.assigned_to?.name)}</span>
                </div>
                <div
                  class="col-data col-1"
                  data-col-header-label="${this.getLabel('due_date', this.basePermissionPath)}"
                  title="${this.prettyDate(entry.due_date, null, '-')}"
                >
                  <span class="truncate">${this.prettyDate(entry.due_date, null, '-')}</span>
                </div>
                <div
                  class="col-data col-1"
                  data-col-header-label="${this.getLabel('status', this.basePermissionPath)}"
                  title="${this.getStringValue(entry.status)}"
                >
                  <span class="truncate">${this.getStringValue(entry.status)}</span>
                </div>
                <div
                  class="col-data col-1"
                  data-col-header-label="Priority"
                  title=${this._getPriorityValue(entry.high_priority)}
                >
                  <span class="truncate">${this._getPriorityValue(entry.high_priority)}</span>
                </div>
              </div>
              <div slot="row-data-details" class="layout-horizontal">
                <div class="row-details-content layout-vertical flex-c">
                  <div class="rdc-title">${this.getLabel('description', this.basePermissionPath)}</div>
                  <text-content rows="3" text="${this.getStringValue(entry.description)}"></text-content>
                  <paper-tooltip offset="0">${this.getStringValue(entry.description)}</paper-tooltip>
                </div>
                <div class="row-details-content layout-vertical flex-c">
                  <div class="rdc-title">${this.getLabel('intervention', this.basePermissionPath)}</div>
                  <div class="truncate">${this.getStringValue(entry.intervention?.number)}</div>
                  <paper-tooltip offset="0">${this.getStringValue(entry.intervention?.number)}</paper-tooltip>
                </div>
                <div class="row-details-content layout-vertical flex-c">
                  <div class="rdc-title">${this.getLabel('location', this.basePermissionPath)}</div>
                  <div class="truncate">${this.getStringValue(entry.location?.name)}</div>
                  <paper-tooltip offset="0">${this.getStringValue(entry.location?.name)}</paper-tooltip>
                </div>
                <div class="row-details-content layout-vertical flex-c">
                  <div class="rdc-title">${this.getLabel('related_module', this.basePermissionPath)}</div>
                  <div class="truncate">${this.getStringValue(entry.related_module, this.modules, 'display_name')}</div>
                  <paper-tooltip offset="0"
                    >${this.getStringValue(entry.related_module, this.modules, 'display_name')}
                  </paper-tooltip>
                </div>
                <div class="row-details-content layout-vertical flex-c">
                  <div class="rdc-title">${this.getLabel('assigned_by', this.basePermissionPath)}</div>
                  <div class="truncate">${this.getStringValue(entry.assigned_by?.name)}</div>
                  <paper-tooltip offset="0">${this.getStringValue(entry.assigned_by?.name)}</paper-tooltip>
                </div>
                <div class="row-details-content layout-vertical flex-c">
                  <div ?hidden="${!entry.date_of_completion?.length}">
                    <div class="rdc-title">${this.getLabel('date_of_completion', this.basePermissionPath)}</div>
                    <div class="truncate">${this.prettyDate(entry.date_of_completion)}</div>
                    <paper-tooltip offset="0">${this.prettyDate(entry.date_of_completion)}</paper-tooltip>
                  </div>
                </div>
              </div>
            </etools-data-table-row>
          `
        )}

        <etools-data-table-footer
          .lowResolutionLayout="${this.lowResolutionLayout}"
          .pageSize="${this.paginator.page_size}"
          .pageNumber="${this.paginator.page}"
          .totalResults="${this.paginator.count}"
          .visibleRange="${this.paginator.visible_range}"
          @visible-range-changed="${this.visibleRangeChanged}"
          @page-size-changed="${this.pageSizeChanged}"
          @page-number-changed="${this.pageNumberChanged}"
        >
        </etools-data-table-footer>
      </paper-card>
    `;
  }

  firstUpdated() {
    this._initSort();
    this.isShowCompleted = this.queryParams?.status !== 'open';
    this.addEventListener('sort-changed', (e: CustomEvent) => this._sort(e));
  }

  updated(changedProperties) {
    if (changedProperties.has('staticDataLoaded')) {
      this.setData();
    }

    if (changedProperties.has('isShowCompleted')) {
      this._setShowCompleted();
    }

    if (changedProperties.has('exportParams')) {
      this._setExportLinks();
    }
  }

  pathChanged({detail}: CustomEvent) {
    this._setPath(detail.value);
  }

  queryParamsChanged({detail}: CustomEvent) {
    if (!this.oldQueryParams || JSON.stringify(this.queryParams) !== JSON.stringify(detail.value)) {
      this.queryParams = detail.value;
      this._updateQueries(detail.value);
    }
  }

  setData() {
    this.modules = getData('modules') || [];
    this.statuses = getData('statuses') || [];
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

  _setPath(path: string) {
    if (path.indexOf('/list')) {
      this.path = path;
      this.queryParams = Object.assign({}, this.queryParams, {page_size: this.pageSize, page: this.pageNumber});
    }
  }

  _updateQueries(queryParams: GenericObject) {
    if (!this.path?.indexOf('action-points/list') || !queryParams || !Object.keys(queryParams).length) {
      return;
    }
    const exportParams = JSON.parse(JSON.stringify(queryParams));
    delete exportParams['page_size'];
    delete exportParams['page'];
    this.exportParams = exportParams;

    if (queryParams.reload) {
      clearQueries();
      this.oldQueryParams = {};
      this.queryParams = Object.assign({}, {page_size: this.pageSize, page: this.pageNumber});
      return;
    } else if (queryParams.page) {
      this.pageNumber = Number(queryParams.page);
    }

    if (!this.oldQueryParams || JSON.stringify(queryParams) !== JSON.stringify(this.oldQueryParams)) {
      this.oldQueryParams = Object.assign({}, queryParams);
    } else {
      return;
    }

    updateQueries(this, queryParams, null, true);

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
    this.queryParams.ordering = ordering;
    this.queryParams = {...this.queryParams};
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
      this.filters[filterIndex].selection = data;
      return true;
    }
    return false;
  }

  _requestData() {
    const actionPointData = this.shadowRoot.querySelector('action-points-data');
    actionPointData.dispatchEvent(new CustomEvent('request-action-points'));
  }

  paginatorChanged() {
    if (this.queryParams.page !== this.paginator.page || this.queryParams.page_size !== this.paginator.page_size) {
      this.queryParams = {
        ...this.queryParams,
        page: this.paginator.page,
        page_size: this.paginator.page_size
      };
    }
  }

  _setShowCompleted() {
    if (!this.isShowCompleted) {
      this.queryParams.status = 'open';
    } else if (this.queryParams) {
      this.queryParams.status = undefined;
    }
    this.queryParams = {...this.queryParams};
  }

  _setExportLinks() {
    let qs = '';
    if (this.exportParams) {
      const keys = Object.keys(this.exportParams);
      const queryArray = keys.map((k) => k + '=' + this.exportParams[k]);
      qs = '?' + queryArray.join('&');
    }
    this.exportLinks = [
      {
        name: 'Export CSV',
        url: getEndpoint('actionPointsListExport').url + qs
      }
    ];
  }

  _getPriorityValue(priority: boolean) {
    return priority === true ? 'high' : '';
  }
}
