class ActionPointsList extends APDMixins.StaticDataMixin(Polymer.Element) {
    static get is() { return 'action-points-list'; }

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
                value: [
                    {
                        name: 'Assigned To',
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
                        name: 'Locations',
                        query: 'locations',
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
                    }
                ]
            },
            pageSize: {
                type: Number,
                value: 10
            },
            pageNumber: {
                type: Number,
                value: 1
            },
            totalResults: Number,
            route: {
                type: Object,
                notify: true
            },
            queryParams: {
                type: Object,
                notify: true
            }
        };
    }

    static get observers() {
        return [
            '_updateQuery(pageSize, pageNumber)'
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._initFilters();
        this.addEventListener('sort-changed', (e) => this._sort(e));
    }

    _sort({detail}) {
        this.set('queryParams.ordering', detail.field);
    }

    _getLink(actionPointId) {
        return `action-points/${actionPointId}`;
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
                name: `${user.first_name} ${user.last_name}`};
        });
        let queryDataPairs = [
            {query: 'assigned_to', data: usersList},
            {query: 'assigned_by', data: usersList},
            {query: 'partner', dataKey: 'partnerOrganisations'},
            {query: 'office', dataKey: 'offices'},
            {query: 'location', dataKey: 'locations'},
            {query: 'section', dataKey: 'sectionsCovered'},
        ];

        queryDataPairs.forEach((pair) => {
            let filterIndex = this._getFilterIndex(pair.query);
            let data = !pair.data ? this.getData(pair.dataKey) : pair.data || [];
            this.setFilterSelection(filterIndex, data);
        });
    }

    _getFilterIndex(query) {
        if (!this.filters) { return -1; }

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

    _showAddButton() {
        return true;
    }

    _updateQuery(pageSize, pageNumber) {
        this.set('queryParams.page_size', pageSize || 10);
        this.set('queryParams.page', pageNumber || 1);
    }
}

window.customElements.define(ActionPointsList.is, ActionPointsList);
