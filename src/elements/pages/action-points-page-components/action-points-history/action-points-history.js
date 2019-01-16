class ActionPointsHistory extends EtoolsMixinFactory.combineMixins([
    APDMixins.InputAttrs,
    APDMixins.DateMixin
], Polymer.Element) {
    static get is() {return 'action-points-history';}

    static properties() {
        return {
            history: {
                type: Array,
                value() {return [];}
            },
            permissionPath: String
        };
    }
}
customElements.define(ActionPointsHistory.is, ActionPointsHistory);