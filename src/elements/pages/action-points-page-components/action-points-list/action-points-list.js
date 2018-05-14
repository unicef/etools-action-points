class ActionPointsList extends Polymer.Element {
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
                        name: 'auditor',
                        query: 'agreement__auditor_firm',
                        optionValue: 'id',
                        optionLabel: 'name',
                        selection: []
                    }
                ]
            },
            pageSize: Number,
            pageNumber: Number,
            totalResults: Number,
            visibleRange: Number,
            route: {
                type: Object,
                notify: true
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('static-data-loaded', this._actionPointsFiltersUpdated.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('static-data-loaded', this._actionPointsFiltersUpdated);
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
            {query: 'partner', dataKey: 'filterPartners'},
            {query: 'agreement__auditor_firm', dataKey: 'filterAuditors'},
            {query: 'status', dataKey: 'statuses'},
            {query: 'engagement_type', dataKey: 'engagementTypes'},
            {query: 'staff_members__user', dataKey: 'staffMembersUsers'}
        ];

        queryAndKeyPairs.forEach((pair) => {
            let filterIndex = this._getFilterIndex(pair.query);
            let data = this.getData(pair.dataKey) || [];
            this.setFilterSelection(filterIndex, data);
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

    _toNew() {
        this.set('route.path', '/new');
    }
    _showAddButton() {
        return true;
    }
}

window.customElements.define(ActionPointsList.is, ActionPointsList);
