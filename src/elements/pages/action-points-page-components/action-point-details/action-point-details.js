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
            '_updateCpOutputs(editedItem.intervention)',
            '_updateEditedItem(actionPoint)',
            '_updateInterventions(originalActionPoint.intervention, originalActionPoint.partner.id, partner)'
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

    _updateLocations(filter) {
        let locations = this.getData('locations') || [];
        this.locations = locations.filter((location) => {
            return !filter || !!~filter.indexOf(+location.id);
        });
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

        let originalPartner = _.get(this, 'originalActionPoint.partner.id');
        let originalIntervention = _.get(this, 'originalActionPoint.intervention.id');
        if (partnerId !== originalPartner || this.editedItem.intervention !== originalIntervention) {
            this.set('editedItem.intervention', null);
        }

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

    async _updateCpOutputs(interventionId) {
        if (interventionId === undefined) {return;}
        this._checkAndResetData(interventionId);
        if (interventionId === null) {
            this.cpOutputs = this.getData('cpOutputsList');
            this._updateLocations();
            return;
        }
        try {
            this.interventionRequestInProcess = true;
            this.cpOutputs = undefined;
            let interventionEndpoint = this.getEndpoint('interventionDetails', {id: interventionId});
            let intervention = await this.sendRequest({method: 'GET', endpoint: interventionEndpoint});

            let locations = intervention && intervention.flat_locations || [];
            this._updateLocations(locations);

            let resultLinks = intervention && intervention.result_links;
            if (!_.isArray(resultLinks)) {
                this._finishCpoRequest();
                return;
            }

            let cpIds = [];
            resultLinks.forEach((link) => {
                if (link && (link.cp_output || link.cp_output === 0)) {
                    cpIds.push(link.cp_output);
                }
            });

            if (!cpIds.length) {
                this._finishCpoRequest();
                return;
            }

            let endpoint = this.getEndpoint('cpOutputsV2', {ids: cpIds.join(',')});
            this.cpOutputs = await this.sendRequest({method: 'GET', endpoint}) || [];
            this.interventionRequestInProcess = false;
        } catch (error) {
            console.error('Can not load cpOutputs data');
            this._finishCpoRequest();
        }
    }
    /* jshint ignore:end */

    _checkAndResetData(intervention) {
        let originalIntervention = _.get(this, 'originalActionPoint.intervention.id', null);
        let originalOutput = _.get(this, 'originalActionPoint.cp_output.id', null);
        let originalLocation = _.get(this, 'originalActionPoint.location.id', null);
        let currentOutput = _.get(this, 'editedItem.cp_output');
        let currentLocation = _.get(this, 'editedItem.location');

        let interventionChanged = originalIntervention !== intervention;
        if (interventionChanged || originalOutput !== currentOutput) {
            this.set('editedItem.cp_output', null);
        }
        if (interventionChanged || originalLocation !== currentLocation) {
            this.set('editedItem.location', null);
        }
    }

    _finishCpoRequest() {
        this.cpOutputs = [];
        this.interventionRequestInProcess = false;
    }

    _updateInterventions(intervention, originalId, partner) {
        let interventions = partner && partner.interventions || [];
        let id = partner && partner.id;
        let exists = intervention && _.find(interventions, (item) => {return item.id === intervention.id;});

        if (intervention && id === originalId && !exists) {
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
