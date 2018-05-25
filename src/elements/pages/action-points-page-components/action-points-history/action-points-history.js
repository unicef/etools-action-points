const ActionPointsHistoryMixins = EtoolsMixinFactory.combineMixins([
    APDMixins.InputAttrs,
    APDMixins.DateMixin
], Polymer.Element);

class ActionPointsHistory extends ActionPointsHistoryMixins {
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

    _getChanges(item) {
        if (!item) {return '';}
        if (item.action === 'create') {return 'Created';}
        if (item.action === 'update') {
            let changes = [];
            _.forIn(item.change, (value, key) => {
                let propertyDescription = this.getLabel(key, this.permissionPath);
                if (propertyDescription && propertyDescription.length > 0) {
                    changes.push(propertyDescription);
                }
            });
            return `Changed ${_.join(changes, ', ')}`;
        }
    }
}
customElements.define(ActionPointsHistory.is, ActionPointsHistory);
