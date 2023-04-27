import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/paper-card/paper-card.js';
import '@polymer//app-route/app-location';
import '@polymer/iron-location/iron-query-params.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {EtoolsDataTableColumn} from '@unicef-polymer/etools-data-table/etools-data-table-column.js';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../data-elements/action-points-data';
import {getData} from '../../mixins/static-data-mixin';
import {LocalizationMixin} from '../../mixins/localization-mixin';
import {DateMixin} from '../../mixins/date-mixin';
import {InputAttrsMixin} from '../../mixins/input-attrs-mixin';
import {updateQueries, clearQueries} from '../../mixins/query-params-helper';
import '../../common-elements/text-content';
import {moduleStyles} from '../../styles/module-styles';
import {sharedStyles} from '@unicef-polymer/etools-modules-common/dist/styles/shared-styles-lit';
import {dataTableStylesLit} from '@unicef-polymer/etools-data-table/data-table-styles-lit';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {noActionsAllowed} from '../../mixins/permission-controller';
import {GenericObject} from '../../../typings/globals.types';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-media-query/iron-media-query.js';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {EtoolsFilter} from '@unicef-polymer/etools-filters/src/etools-filters';
import {
  updateFilterSelectionOptions,
  updateFiltersSelectedValues,
  setselectedValueTypeByFilterKey,
  clearSelectedValuesInFilters
} from '@unicef-polymer/etools-filters/src/filters';
import {APFilterKeys, getAPFilters, selectedValueTypeByFilterKey} from './action-point-filters';

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
  allFilters!: EtoolsFilter[];

  @property({type: Array})
  filters: any[];

  @property({type: Object}) // , notify: true
  queryParams: GenericObject;

  @property({type: Object}) // , notify: true
  initialQueryParams: GenericObject;

  @property({type: Object})
  prevQueryParams: GenericObject;

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
      ${moduleStyles}
      <style>
        ${sharedStyles} ${elevationStyles} ${dataTableStylesLit} :host {
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
        *[slot='row-data'] {
          max-width: calc(100% - 56px);
        }
        section.page-content.filters {
          padding: 8px 24px;
          margin: 24px;
        }
        @media (max-width: 576px) {
          section.page-content.filters {
            margin: 5px 0;
          }
          .page-content {
            margin: 5px;
          }
        }
        datepicker-lite {
          width: 176px;
          margin-left: 12px;
          margin-right: 12px;
          --iron-icon-fill-color: var(--gray-mid-dark);
        }

        .filter-dropdown {
          width: 200px;

          --esmm-list-wrapper: {
            margin-top: 0;
            padding-top: 12px;
            -ms-overflow-style: auto;
          }
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
          this.paginator = {...this.paginator, count: detail.value};
        }}
      >
      </action-points-data>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.allFilters}" @filter-change="${this.filtersChange}"></etools-filters>
      </section>

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
              <div slot="row-data">
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
              <div slot="row-data-details">
                <div class="row-details-content flex-c">
                  <div class="rdc-title">${this.getLabel('description', this.basePermissionPath)}</div>
                  <text-content rows="3" text="${this.getStringValue(entry.description)}"></text-content>
                  <paper-tooltip fit-to-visible-bounds offset="0" ?hidden="${!this._showTooltip(entry.description)}">
                    ${this.getStringValue(entry.description)}
                  </paper-tooltip>
                </div>
                <div class="row-details-content flex-c">
                  <div class="rdc-title">${this.getLabel('intervention', this.basePermissionPath)}</div>
                  <div>
                    <div class="truncate">${this.getStringValue(entry.intervention?.number)}</div>
                    <paper-tooltip ?hidden="${!this._showTooltip(entry.intervention?.number)}" offset="0"
                      >${this.getStringValue(entry.intervention?.number)}</paper-tooltip
                    >
                  </div>
                </div>
                <div class="row-details-content flex-c">
                  <div class="rdc-title">${this.getLabel('location', this.basePermissionPath)}</div>
                  <div>
                    <div class="truncate">${this.getStringValue(entry.location?.name)}</div>
                    <paper-tooltip ?hidden="${!this._showTooltip(entry.location?.name)}" offset="0"
                      >${this.getStringValue(entry.location?.name)}</paper-tooltip
                    >
                  </div>
                </div>
                <div class="row-details-content flex-c">
                  <div class="rdc-title">${this.getLabel('related_module', this.basePermissionPath)}</div>
                  <div>
                    <div class="truncate">
                      ${this.getStringValue(entry.related_module, this.modules, 'display_name')}
                    </div>
                    <paper-tooltip
                      offset="0"
                      ?hidden="${!this._showTooltip(entry.related_module, this.modules, 'display_name')}"
                    >
                      ${this.getStringValue(entry.related_module, this.modules, 'display_name')}
                    </paper-tooltip>
                  </div>
                </div>
                <div class="row-details-content flex-c">
                  <div class="rdc-title">${this.getLabel('assigned_by', this.basePermissionPath)}</div>
                  <div>
                    <div class="truncate">${this.getStringValue(entry.assigned_by?.name)}</div>
                    <paper-tooltip ?hidden="${!this._showTooltip(entry.assigned_by?.name)}" offset="0"
                      >${this.getStringValue(entry.assigned_by?.name)}</paper-tooltip
                    >
                  </div>
                </div>
                <div class="row-details-content flex-c">
                  <div ?hidden="${!entry.date_of_completion?.length}">
                    <div class="rdc-title">${this.getLabel('date_of_completion', this.basePermissionPath)}</div>
                    <div>
                      <div class="truncate">${this.prettyDate(entry.date_of_completion)}</div>
                      <paper-tooltip ?hidden="${!this._showTooltip(entry.date_of_completion)}" offset="0"
                        >${this.prettyDate(entry.date_of_completion)}</paper-tooltip
                      >
                    </div>
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
    this.addEventListener('sort-changed', (e: CustomEvent) => this._sort(e));
  }

  updated(changedProperties) {
    if (changedProperties.has('staticDataLoaded')) {
      if (!this.allFilters) {
        this.initFiltersForDisplay();
        setTimeout(() => {
          this._setInitialTableSorting();
        }, 200);
      }
    }

    if (changedProperties.has('exportParams')) {
      this._setExportLinks();
    }
  }

  pathChanged({detail}: CustomEvent) {
    this._setPath(detail.value);
  }

  queryParamsChanged({detail}: CustomEvent) {
    if (this.path?.includes('/list')) {
      if (!detail.value || !Object.keys(detail.value).length) {
        if (this.prevQueryParams) {
          this.queryParams = this.prevQueryParams;
          this._updateQueries(this.queryParams);
        }
        return;
      }
      if (!this.prevQueryParams || JSON.stringify(this.queryParams) !== JSON.stringify(detail.value)) {
        this.queryParams = detail.value;
        this._updateQueries(detail.value);
      }
    }
  }

  noActionsAllowed(path: string) {
    return noActionsAllowed(path);
  }

  _setInitialTableSorting() {
    const sortParams = this.queryParams && this.queryParams.ordering;
    if (!sortParams) return;
    const field = sortParams.replace(/^-/, '');
    const direction = sortParams.charAt(0) === '-' ? 'desc' : 'asc';
    const column: EtoolsDataTableColumn = this.shadowRoot.querySelector(`etools-data-table-column[field="${field}"]`);
    if (!column) return;
    column.setAttribute('selected', 'true');
    column.setAttribute('direction', direction);
  }

  _setPath(path: string) {
    this.path = path;
    if (path.includes('/list')) {
      this.queryParams = Object.assign({}, this.queryParams, {
        page: this.queryParams && this.queryParams.page ? this.queryParams.page : this.paginator.page,
        page_size:
          this.queryParams && this.queryParams.page_size ? this.queryParams.page_size : this.paginator.page_size
      });
      if (!this.initialQueryParams) {
        this.initialQueryParams = Object.assign({}, this.queryParams);
      }
    } else {
      this.queryParams = {};
      clearQueries();
      this.requestUpdate();
    }
  }

  _updateQueries(queryParams: GenericObject) {
    if (!this.path?.indexOf('action-points/list') || !queryParams || !Object.keys(queryParams).length) {
      return;
    }

    queryParams = Object.keys(queryParams).reduce((acc, key) => {
      if (queryParams[key]) {
        acc[key] = String(queryParams[key]);
      }
      return acc;
    }, {});

    const exportParams = JSON.parse(JSON.stringify(queryParams));
    delete exportParams['page_size'];
    delete exportParams['page'];
    this.exportParams = exportParams;

    if (queryParams.reload) {
      clearQueries();
      clearSelectedValuesInFilters(this.allFilters);
      this.allFilters = [...this.allFilters];
      this.prevQueryParams = {};
      this.resetPageNumber();
      this.queryParams = Object.assign({}, {page: this.paginator.page, page_size: this.paginator.page_size});
      return;
    } else if (queryParams.page) {
      this.paginator.page = Number(queryParams.page);
    }

    if (!this.prevQueryParams || JSON.stringify(queryParams) !== JSON.stringify(this.prevQueryParams)) {
      this.prevQueryParams = Object.assign({}, queryParams);
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

  filtersChange(e: CustomEvent) {
    this._updateQueries({...e.detail, page: 1, page_size: this.paginator.page_size});
  }

  paginatorChanged() {
    if (
      String(this.prevQueryParams.page) !== String(this.paginator.page) ||
      String(this.prevQueryParams.page_size) !== String(this.paginator.page_size)
    ) {
      const queryParams = {
        ...this.prevQueryParams,
        page: this.paginator.page,
        page_size: this.paginator.page_size
      };
      this._updateQueries(queryParams);
    }
  }

  _sort({detail}: any) {
    let ordering = detail.field;
    const prevQueryParams = this.prevQueryParams ? this.prevQueryParams : {};
    if (prevQueryParams.ordering && prevQueryParams.ordering === ordering) {
      ordering = this.prevQueryParams.ordering.charAt(0) !== '-' ? `-${ordering}` : ordering.slice(1);
    }
    const queryParams = {...prevQueryParams, ordering: ordering};
    this._updateQueries(queryParams);
  }

  _getLink(actionPointId: number) {
    return `action-points/detail/${actionPointId}`;
  }

  initFiltersForDisplay() {
    setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);
    const availableFilters = JSON.parse(JSON.stringify(getAPFilters()));
    this.populateDropdownFilterOptionsFromCommonData(availableFilters);
    const currentParams = Object.assign({}, this.queryParams || {});
    ['page', 'page_size', 'sort'].forEach((key) => {
      if (currentParams[key]) {
        delete currentParams[key];
      }
    });
    this.allFilters = availableFilters;
    this.allFilters = updateFiltersSelectedValues(currentParams, this.allFilters);
  }

  populateDropdownFilterOptionsFromCommonData(allFilters: EtoolsFilter[]) {
    this.modules = getData('modules') || [];
    this.statuses = getData('statuses') || [];
    const usersList = getData('unicefUsers').map((user: any) => {
      return {
        id: user.id,
        name: user.name
      };
    });
    updateFilterSelectionOptions(allFilters, APFilterKeys.assigned_to, usersList);
    updateFilterSelectionOptions(allFilters, APFilterKeys.assigned_by, usersList);
    updateFilterSelectionOptions(allFilters, APFilterKeys.partner, getData('partnerOrganisations'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.office, getData('offices'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.location, getData('locations'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.cp_output, getData('cpOutputsList'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.intervention, getData('interventionsList'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.status, getData('statuses'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.section, getData('sectionsCovered'));
    updateFilterSelectionOptions(allFilters, APFilterKeys.related_module, getData('modules'));
  }

  _requestData() {
    const actionPointData = this.shadowRoot.querySelector('action-points-data');
    actionPointData.dispatchEvent(new CustomEvent('request-action-points'));
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

  _showTooltip(value: string, list?: [], field?: string) {
    return this.getStringValue(value, list, field) !== '-';
  }
}
