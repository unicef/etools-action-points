'use strict';

class ListPagination extends APDMixins.QueryParamsMixin(Polymer.Element) {
    static get is() { return 'list-pagination'; }

    static get properties() {
        return {
            sizesAllowed: {
                type: Array,
                value: ['10', '25', '50', '100']
            },
            pageSize: {
                type: String,
                notify: true,
                observer: '_sizeChanged'
            },
            pageNumber: {
                type: String,
                notify: true,
                observer: '_pageChanged'
            },
            currentPage: {
                type: Number,
                value: 1
            },
            lastPage: {
                type: Number,
                computed: '_calcLastPage(datalength, pageSize)'
            },
            withoutQueries: {
                type: Boolean,
                value: false
            }
        };
    }

    _sizeChanged(newSize) {
        if (this.sizesAllowed.indexOf(newSize) < 0) { this.set('pageSize', '10'); }
    }

    goToFirst() { this.set('pageNumber', '1'); }

    goToLeft() {
        this.set('pageNumber', `${(+this.currentPage || 1) - 1}`);
    }

    goToRight() {
        if (this.currentPage !== this.lastPage) { this.set('pageNumber', `${(+this.currentPage || 1) + 1}`); }
    }

    goToLast() { this.set('pageNumber', this.lastPage); }

    _disableButton(currentPage, datalength, pageSize) {
        if ((+this.currentPage === 1 && !pageSize) || (+this.currentPage === +this.lastPage && pageSize) || this.pageSize >= datalength) { return true; }
    }

    _calcLastPage(dataLength, size) {
        return dataLength % size ? Math.ceil(dataLength / size) : dataLength / size;
    }

    _pageChanged(pageNumber) {
        this.currentPage = pageNumber || 1;
    }
}

customElements.define(ListPagination.is, ListPagination);
