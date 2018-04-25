Polymer({

    is: 'countries-dropdown',

    behaviors: [
        etoolsAppConfig.globals
    ],

    properties: {
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
    },

    listeners: {
        'paper-dropdown-close': '_toggleOpened',
        'paper-dropdown-open': '_toggleOpened'
    },

    observers: [
        '_setCountryIndex(countries, countryId)'
    ],

    _setCountryIndex: function(countries, countryId) {
        if (!(countries instanceof Array)) { return; }

        this.countryIndex = countries.findIndex((country) => {
            return country.id === countryId;
        });
    },

    _toggleOpened: function() {
        this.set('opened', this.$.dropdown.opened);
    },

    _countrySelected: function(e) {
        this.set('country', this.$.repeat.itemForElement(e.detail.item));
    },

    _changeCountry: function(event) {
        let country = event && event.model && event.model.item,
            id = country && country.id;

        if (Number(parseFloat(id)) !== id) { throw 'Can not find country id!'; }

        this.fire('global-loading', {type: 'change-country', active: true, message: 'Please wait while country is changing...'});
        this.countryData = {country: id};
        this.url = this.getEndpoint('changeCountry').url;
    },

    _handleError: function() {
        this.countryData = null;
        this.url = null;
        this.fire('global-loading', {type: 'change-country'});
        this.fire('toast', {text: 'Can not change country. Please, try again later'});
    },

    _handleResponse: function() {
        this.fire('main_refresh');
    }
});
