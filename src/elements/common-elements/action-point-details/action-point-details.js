'use strict';

(function() {
    let mixins = [
        APDMixins.InputAttrs,
        APDMixins.StaticDataMixin,
        APDMixins.AppConfig,
        EtoolsAjaxRequestMixin,
        APDMixins.DateMixin
    ];

    class ActionPointDetails extends generateBaseClass(mixins) {
        static get is() { return 'action-point-details'; }

        static get observers() {
            return [
                '_updateStyles(basePermissionPath)',
                '_requestPartner(editedItem.partner)',
                '_updateCpOutputs(editedItem.intervention)',
                '_updateEditedItem(actionPoint)'
            ];
        }

        static get properties() {
            return {
                partners: {
                    type: Array,
                    value: () => []
                },
                basePermissionPath: String,
                locations: {
                    type: Array,
                    value: () => []
                },
                editedItem: {
                    type: Object,
                    value: () => ({})
                },
                cpOutputs: Array
            };
        }

        _updateStyles() {
            this.updateStyles();
        }

        ready() {
            super.ready();
            this.partners = this.getData('partnerOrganisations');
            this.offices = this.getData('offices');
            this.sectionsCovered = this.getData('sectionsCovered');
            this.unicefUsers = (this.getData('unicefUsers') || []).map((user) => {
                return {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`
                };
            });

            this._updateLocations();
            document.addEventListener('locations-loaded', () => this._updateLocations());
        }

        _updateEditedItem(actionPoint) {
            this.editedItem = actionPoint || {};
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
            this.cpOutputs = undefined;

            let endpoint = this.getEndpoint('partnerOrganisationDetails', {id: partnerId});
            this.sendRequest({method: 'GET', endpoint})
                .then(data => {
                    this.partner = data || null;
                }, () => {
                    console.error('Can not load partner data');
                })
                .finally(() => this.partnerRequestInProcess = false);
        }

        /* jshint ignore:start */
        async _updateCpOutputs(interventionId) {
            if (!interventionId) { return; }
            try {
                this.interventionRequestInProcess = true;
                this.cpOutputs = undefined;
                let interventionEndpoint = this.getEndpoint('interventionDetails', {id: interventionId});
                let intervention = await this.sendRequest({method: 'GET', endpoint: interventionEndpoint});

                let resultLinks = intervention && intervention.result_links;
                if (!_.isArray(resultLinks)) {
                    this._finishCpoRequest();
                    return;
                }

                let cpIds = [];
                resultLinks.forEach(link => {
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

        _finishCpoRequest() {
            this.cpOutputs = [];
            this.interventionRequestInProcess = false;
        }

        isFieldReadonly(path, base, special) {
            return this.isReadOnly(path, base) || !special;
        }

        validate() {
            let elements = this.shadowRoot.querySelectorAll('.validate-input');
            let valid = true;
            _.each(elements, element => {
                if (element.required && !element.disabled && !element.validate()) {
                    let label = element.label || 'Field';
                    element.errorMessage = `${label} is required`;
                    element.invalid = true;
                    valid = false;
                }
            });

            return valid;
        }
    }

    customElements.define(ActionPointDetails.is, ActionPointDetails);
})();
