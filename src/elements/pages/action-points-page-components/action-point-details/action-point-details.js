class ActionPointDetails extends EtoolsMixinFactory.combineMixins([
    APDMixins.AppConfig,
    APDMixins.InputAttrs,
    APDMixins.StaticDataMixin,
    APDMixins.PermissionController,
    APDMixins.LocalizationMixin,
    APDMixins.DateMixin,
    APDMixins.TextareaMaxRowsMixin,
    EtoolsAjaxRequestMixin], Polymer.Element) {

    static get is() {return 'action-point-details';}

    static get observers() {
        return [
            '_updateStyles(permissionPath)',
            '_setDrDOptions(editedItem)',
            '_requestPartner(editedItem.partner)',
            '_updateEditedItem(actionPoint)',
            '_updateInterventions(originalActionPoint.intervention, partner)'
        ];
    }

    static get properties() {
        return {
            partners: {
                type: Array,
                value: () => []
            },
            permissionPath: String,
            locations: {
                type: Array,
                value: () => []
            },
            editedItem: {
                type: Object,
                value: () => ({})
            },
            cpOutputs: Array,
            interventions: {
                type: Array,
                value: () => []
            },
            originalActionPoint: {
                type: Object,
                readonly: true
            }
        };
    }

    _updateStyles() {
        this.updateStyles();
    }

    _setDrDOptions(editedItem) {
        let module = editedItem && editedItem.related_module;
        let categories = [];

        if (module) {
            let categoriesList = this.getData('categoriesList');
            categories = _.filter(categoriesList, (category) => {return category.module === module;});
        }

        this.categories = categories;
    }

    ready() {
        super.ready();
        this.modules = this.getData('modules');
        this.partners = this.getData('partnerOrganisations');
        this.offices = this.getData('offices');
        this.sectionsCovered = this.getData('sectionsCovered');
        this.cpOutputs = this.getData('cpOutputsList');
        this.unicefUsers = (this.getData('unicefUsers') || []).map((user) => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            };
        });

        this._updateLocations();
        document.addEventListener('locations-loaded', () => this._updateLocations());
        this.addEventListener('reset-validation', ({detail}) => {
            let elements = this.shadowRoot.querySelectorAll('.validate-input');
            for (let element of elements) {
                element.invalid = false;
                if (detail && detail.resetValues) {
                    element.value = '';
                }
            }
        });
    }

    _updateEditedItem(actionPoint) {
        this.editedItem = actionPoint && _.cloneDeep(actionPoint) || {};
    }

    _updateLocations() {
        this.locations = this.getData('locations') || [];
    }

    _requestPartner(partnerId) {
        if (this.partnerRequestInProcess || this.lastPartnerId === partnerId) {
            return;
        }
        this.lastPartnerId = partnerId;

        if (!partnerId && partnerId !== 0) {
            return;
        }

        this.partnerRequestInProcess = true;
        this.partner = null;

        let endpoint = this.getEndpoint('partnerOrganisationDetails', {id: partnerId});
        this.sendRequest({method: 'GET', endpoint})
            .then((data) => {
                this.partner = data || null;
                this.partnerRequestInProcess = false;
            }, () => {
                console.error('Can not load partner data');
                this.partnerRequestInProcess = false;
            });
    }
    /* jshint ignore:end */

    _updateInterventions(intervention, partner) {
        let interventions = partner && partner.interventions || [];
        let exists = intervention && _.find(interventions, (item) => {return item.id === intervention.id;});

        if (intervention && !exists) {
            interventions.push(intervention);
        }

        this.interventions = interventions;
    }

    isFieldReadonly(path, base, special) {
        return this.isReadOnly(path, base) || !special;
    }

    validate() {
        let elements = this.shadowRoot.querySelectorAll('.validate-input');
        let valid = true;
        for (let element of elements) {
            if (element.required && !element.disabled && !element.validate()) {
                let label = element.label || 'Field';
                element.errorMessage = `${label} is required`;
                element.invalid = true;
                valid = false;
            }
        }

        return valid;
    }

    getRefNumber(number) {
        return number || '-';
    }

    showCategory(categories) {
        return !!(categories && categories.length);
    }
}

customElements.define(ActionPointDetails.is, ActionPointDetails);
