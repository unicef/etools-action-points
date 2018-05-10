'use strict';

class ListTabMain extends APDMixins.QueryParamsMixin(Polymer.Element) {
    static get is() { return 'list-tab-main'; }

    static get properties() {
        return {
            basePermissionPath: {
                type: String,
                value: ''
            },
            queryParams: {
                type: Object,
                notify: true,
                observer: '_paramsChanged'
            },
            showingResults: {
                type: String,
                computed: '_computeResultsToShow(listLength, queryParams.page_size)'
            },
            orderBy: {
                type: String,
                value: ''
            },
            listLength: Number,
            data: {
                type: Array,
                notify: true
            },
            emptyObj: {
                type: Object,
                value: function() {
                    return {empty: true};
                }
            },
            noTableTitle: {
                type: Boolean,
                value: false
            },
            withoutPagination: {
                type: Boolean,
                value: false
            },
            hasCollapse: {
                type: Boolean,
                value: false
            },
            headings: {
                type: Array,
                value: []
            },
            details: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            noAdditional: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_orderChanged(orderBy, headings)'
        ];
    }

    _setHeaderNoAdditional(noAdditional, dataLength) {
        return noAdditional || !dataLength;
    }

    _setTitleNoAdditionalClass(noAdditional, dataLength) {
        return (noAdditional || !dataLength) ? 'no-additional' : '';
    }

    _orderChanged(newOrder) {
        if (!newOrder || !(this.headings instanceof Array)) { return false; }

        let direction = 'asc';
        let name = newOrder;

        if (name.startsWith('-')) {
            direction = 'desc';
            name = name.slice(1);
        }

        this.headings.forEach((heading, index) => {
            if (heading.name === name) {
                this.set(`headings.${index}.ordered`, direction);
            } else {
                this.set(`headings.${index}.ordered`, false);
            }
        });

        if (this.queryParams && this.queryParams.ordering !== this.orderBy) { this.set('queryParams.ordering', this.orderBy); }
    }

    _paramsChanged(newParams) {
        if (this.orderBy !== newParams.ordering) { this.orderBy = newParams.ordering; }
    }

    _computeResultsToShow(lengthAmount, size) {
        let page = (this.queryParams.page || 1) - 1;
        size = +size || 10;

        let last = size * page + size;
        if (last > lengthAmount) { last = lengthAmount; }
        let first = last ? (size * page + 1) : 0;

        return `${first} - ${last} of ${lengthAmount}`;
    }

    _listDataChanged() {
        let rows = Polymer.dom(this.root).querySelectorAll('.list-element');

        if (rows && rows.length) {
            this.noAnimation = true;

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].detailsOpened) {
                    rows[i]._toggleRowDetails();
                }
            }

            this.noAnimation = false;
        }
    }

    _isTableTitle(noTableTitle, withoutPagination) {
        if (noTableTitle) { return false; }
        return withoutPagination;
    }
}

customElements.define(ListTabMain.is, ListTabMain);
