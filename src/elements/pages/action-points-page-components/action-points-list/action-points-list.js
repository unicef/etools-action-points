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
            visibleRange: {
                type: Array,
                computed: '_computeVisibleRange(queryParams.*)'
            },
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

    connectedCallback() {
        super.connectedCallback();
        this._actionPointsFiltersUpdated();
    }

    _computeVisibleRange() {
        let startRange = (this.queryParams.page - 1) * this.queryParams.page_size;
        let endRange = this.queryParams.page * this.queryParams.page_size;
        return [startRange, endRange];
    }

    _actionPointsFiltersUpdated() {
        let filtersElement = this.$.filters;
        this.setFiltersSelections();
        if (filtersElement) {
            filtersElement._reloadFilters();
        }
    }

    setFiltersSelections() {
        let queryAndKeyPairs = [
            {query: 'assigned_to', dataKey: 'offices'},
        ];

        queryAndKeyPairs.forEach((pair) => {
            let filterIndex = this._getFilterIndex(pair.query);
            let data = this.getData(pair.dataKey) || [];
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

    _toActionPoint({model}) {
        this.set('route.path', `/${model.item.id}`);
    }

    _showAddButton() {
        return true;
    }
}

window.customElements.define(ActionPointsList.is, ActionPointsList);
