class ActionPointsList extends EtoolsMixinFactory.combineMixins([
    APDMixins.AppConfig,
    APDMixins.StaticDataMixin,
    APDMixins.InputAttrs,
    APDMixins.QueryParamsMixin,
    APDMixins.LocalizationMixin,
    APDMixins.DateMixin], Polymer.Element) {

    static get is() {
        return 'action-points-list';
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
                value: () => _.sortBy([
                    {
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
                        selection: [{display_name: 'Yes', value: 'true'}, {display_name: 'No', value: 'false'}]
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
                ], (filter) => {return filter.name.toLowerCase();})
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
            detail: {field: field, direction: direction},
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

    _sort({detail}) {
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
        this.setFiltersSelections();
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
        let queryDataPairs = [
            {query: 'assigned_to', data: usersList},
            {query: 'assigned_by', data: usersList},
            {query: 'partner', dataKey: 'partnerOrganisations'},
            {query: 'office', dataKey: 'offices'},
            {query: 'location', dataKey: 'locations'},
            {query: 'cp_output', dataKey: 'cpOutputsList'},
            {query: 'intervention', dataKey: 'interventionsList'},
            {query: 'status', dataKey: 'statuses'},
            {query: 'section', dataKey: 'sectionsCovered'},
            {query: 'related_module', dataKey: 'modules'}
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

    _pageNumberChanged({detail}) {
        this.set('queryParams.page', detail.value);
    }

    _pageSizeSelected({detail}) {
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
}


customElements.define(ActionPointsList.is, ActionPointsList);
