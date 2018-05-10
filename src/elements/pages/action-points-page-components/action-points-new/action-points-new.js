'use strict';

class ActionPointsNew extends APDMixins.InputAttrs(APDMixins.StaticDataMixin(Polymer.Element)) {
    static get is() { return 'action-points-new'; }

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
            }
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

        // if (!this.editDialogOpened) {
        //     this.set('intervention', null);
        //     this.set('optionsModel.intervention', null);
        //     this.set('partner.interventions', []);
        //
        //     this.set('optionsModel.cp_output', null);
        //     this.set('cpOutputs', []);
        // }

        if (!partnerId && partnerId !== 0) {
            return;
        }

        this.partnerRequestInProcess = true;
        let endpoint = this.getEndpoint('partnerOrganisationDetails');

        return true;
    }
}

window.customElements.define(ActionPointsNew.is, ActionPointsNew);
