'use strict';

(function() {
    let mixins = [
        APDMixins.InputAttrs,
        APDMixins.StaticDataMixin,
        APDMixins.AppConfig,
        EtoolsAjaxRequestMixin
    ];

    class ActionPointsNew extends generateBaseClass(mixins) {
        static get is() { return 'action-points-new'; }

        static get observers() {
            return [
                '_requestPartner(editedItem.partner)',
                '_updateCpOutputs(editedItem.intervention)'
            ];
        }

        static get properties() {
            return {
                route: {
                    type: Object,
                    notify: true
                },
                partners: {
                    type: Array,
                    value: () => []
                },
                basePermissionPath: {
                    type: String,
                    value: 'action_points'
                },
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

        ready() {
            super.ready();
            this.partners = this.getData('partnerOrganisations');

            this._updateLocations();
            document.addEventListener('locations-loaded', () => this._updateLocations());
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
            this.set('editedItem.intervention', null);

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
    }

    customElements.define(ActionPointsNew.is, ActionPointsNew);
})();
