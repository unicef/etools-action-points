class CountriesDropdown extends window.APDMixins.AppConfig(Polymer.Element) {
    static get is() { return 'countries-dropdown'; }

    static get properties() {
        return {
            opened: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            countries: {
                type: Array,
                value: []
            },
            countryId: {
                type: Number
            },
            countryIndex: {
                type: Number
            }
        };
    }

    static get observers() {
        return [
            '_setCountryIndex(countries, countryId)'
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('paper-dropdown-close', this._toggleOpened);
        this.addEventListener('paper-dropdown-open', this._toggleOpened);
    }
    _setCountryIndex(countries, countryId) {
        if (!(countries instanceof Array)) { return; }

        this.countryIndex = countries.findIndex((country) => {
            return country.id === countryId;
        });
    }
    _toggleOpened() {
        this.set('opened', this.$.dropdown.opened);
    }
    _countrySelected(e) {
        this.set('country', this.$.repeat.itemForElement(e.detail.item));
    }
    _changeCountry(event) {
        let country = event && event.model && event.model.item,
            id = country && country.id;

        if (Number(parseFloat(id)) !== id) { throw 'Can not find country id!'; }

        this.fire('global-loading', {type: 'change-country', active: true, message: 'Please wait while country is changing...'});
        this.countryData = {country: id};
        this.url = this.getEndpoint('changeCountry').url;
    }
    _handleError() {
        this.countryData = null;
        this.url = null;
        this.fire('global-loading', {type: 'change-country'});
        this.fire('toast', {text: 'Can not change country. Please, try again later'});
    }
    _handleResponse() {
        this.fire('main_refresh');
    }
}

window.customElements.define(CountriesDropdown.is, CountriesDropdown);
