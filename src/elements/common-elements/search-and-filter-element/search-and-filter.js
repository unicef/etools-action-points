class SearchAndFilter extends EtoolsMixinFactory.combineMixins([
    APDMixins.DateMixin,
    APDMixins.QueryParamsMixin], Polymer.Element) {
    static get is() {
        return 'search-and-filter';
    }

    static get properties() {
        return {
            filters: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            searchLabel: {
                type: String
            },
            searchString: {
                type: String
            },
            usedFilters: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            availableFilters: {
                type: Array,
                value: []
            },
            queryParams: {
                type: Object,
                notify: true
            },
            dates: {
                type: Object,
                value: () => ({})
            }
        };
    }

    static get observers() {
        return [
            '_restoreFilters(queryParams.*)'
        ];
    }

    searchKeyDown() {
        if (!this.searchString) {return;}
        this._debounceSearch = Polymer.Debouncer.debounce(
            this._debounceSearch, Polymer.Async.timeOut.after(300), () => {
            if (this.searchString.length !== 1) {
                this.updateQueries({search: this.searchString || undefined, page: '1'});
            }
        });
    }

    addFilter(e) {
        let query = (typeof e === 'string') ? e : e.model.item.query;
        let alreadySelected = this.usedFilters.findIndex((filter) => {
            return filter.query === query;
        });

        if (alreadySelected === -1) {
            let newFilter = this.filters.find((filter) => {
                return filter.query === query;
            });

            this._setFilterValue(newFilter);
            this.push('usedFilters', newFilter);

            if (this.queryParams[query] === undefined) {
                let queryObject = {};
                queryObject[query] = true;
                this.updateQueries(queryObject);
            }
        }
    }

    removeFilter(e) {
        let query = (typeof e === 'string') ? e : e.model.item.query;
        let indexToRemove = this.usedFilters.findIndex((filter) => {
            return filter.query === query;
        });
        if (indexToRemove === -1) {return;}

        let queryObject = {};
        queryObject[query] = undefined;

        if (this.queryParams[query]) {
            queryObject.page = '1';
        }

        if (indexToRemove !== -1) {
            this.splice('usedFilters', indexToRemove, 1);
        }
        this.updateQueries(queryObject);
    }

    _reloadFilters() {
        this.set('usedFilters', []);
        this._restoreFilters();
    }

    _restoreFilters() {
        this.restoreInProcess = true;
        this._debounceFilters = Polymer.Debouncer.debounce(this._debounceFilters,
            Polymer.Async.timeOut.after(50),
            () => {
                let queryParams = this.queryParams;

                if (!queryParams) {
                    return;
                }

                let availableFilters = [];

                this.filters.forEach((filter) => {
                    let usedFilter = this.usedFilters.find(used => used.query === filter.query);

                    if (!usedFilter && queryParams[filter.query] !== undefined) {
                        this.addFilter(filter.query);
                    } else if (queryParams[filter.query] === undefined) {
                        this.removeFilter(filter.query);
                        availableFilters.push(filter);
                    }
                });
                this.set('availableFilters', availableFilters);

                if (queryParams.search) {
                    this.set('searchString', queryParams.search);
                } else {
                    this.set('searchString', '');
                }
                setTimeout(() => {
                    this._updateValues();
                    this.restoreInProcess = false;
                });
            });
    }

    _updateValues() {
        let ids = Object.keys(this.queryParams || {});
        _.each(ids, (id) => {
            let element = this.shadowRoot.querySelector(`#${id}`);
            if (!element) {return;}

            let isDatepicker = element.dataset.hasOwnProperty('isDatepicker');
            if (isDatepicker) {
                element.parentElement.value = this.queryParams[id];
            } else {
                element.selected = this.queryParams[id];
            }
        });
    }

    _setFilterValue(filter) {
        if (!filter) {
            return;
        }

        filter.value = this.get(`queryParams.${filter.query}`);
    }

    _getFilter(query) {
        let filterIndex = this.filters.findIndex((filter) => {
            return filter.query === query;
        });

        if (filterIndex !== -1) {
            return this.get(`filters.${filterIndex}`);
        } else {
            return {};
        }
    }

    _changeFilterValue(e) {
        if (!e || !e.currentTarget) {
            return;
        }

        let query = e.currentTarget.id,
            date = _.get(e, 'detail.prettyDate'),
            queryObject;

        if (e.type === 'date-has-changed' && query && (this.dates[query] || date)) {
            e.currentTarget.parentElement.value = date;
            this.dates[query] = date;
            queryObject = {
                page: '1',
                [query]: date || true
            };

        } else if (e.detail.item && query) {
            queryObject = {page: '1'};
            // e.detail.item.item doesn't from etools-dropdown
            queryObject[query] = e.detail.item.getAttribute('internal-id');
        }

        if (queryObject) {
            this.updateQueries(queryObject);
        }
    }
}

customElements.define(SearchAndFilter.is, SearchAndFilter);
