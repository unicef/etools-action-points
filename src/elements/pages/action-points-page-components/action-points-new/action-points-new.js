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
                value: () => [{labe: 'test 1', value: 1}, {labe: 'test 2', value: 2}, {labe: 'test 3', value: 3}]
            }
        };
    }

    ready() {
        super.ready();
        // this.partners = this.getData('partnerOrganisations');
    }
}

window.customElements.define(ActionPointsNew.is, ActionPointsNew);
