const StatusElementMixins = EtoolsMixinFactory.combineMixins([
    APDMixins.PermissionController,
    APDMixins.StaticDataMixin], Polymer.Element);

class StatusElement extends StatusElementMixins {
    static get is() {
        return 'status-element';
    }

    static get properties() {
        return {
            dateProperties: {
                type: Object,
                value: function() {
                    return {
                        open: 'created',
                        completed: 'date_of_completion'
                    };
                }
            },
            actions: {
                type: Array,
                value() {return [];}
            },
            permissionPath: String
        };
    }

    ready() {
        super.ready();
        this.statuses = this.getData('statuses') || [];
    }

    _isStatusFinish(actionPoint, status) {
        let currentStatus = actionPoint.status;
        if (!currentStatus) {return false;}
        let currentStatusIndex = _.findIndex(this.statuses, {value: currentStatus});
        let statusIndex = _.findIndex(this.statuses, {value: status});
        return (currentStatusIndex >= statusIndex);
    }

    _getStatusClass(actionPoint, status) {
        let currentStatus = actionPoint.status;

        if (!currentStatus && status === 'open') {
            return 'active';
        } else if (this._isStatusFinish(actionPoint, status)) {
            return 'completed';
        } else {
            return 'pending';
        }
    }

    setIndex(index) {
        return index + 1;
    }

    hideDivider(status, statuses) {
        let lastStatus = statuses[statuses.length - 1];
        return !!(lastStatus && lastStatus.value === status);
    }

}

customElements.define(StatusElement.is, StatusElement);
