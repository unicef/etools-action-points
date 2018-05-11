'use strict';

(function() {
    let mixins = [
        APDMixins.PermissionController,
        APDMixins.StaticDataMixin
    ];

    class StatusElement extends generateBaseClass(mixins) {
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
                permissionBase: String
            };
        }

        ready() {
            super.ready();
            this.statuses = this.getData('statuses') || [];
        }

        _getStatusClass(actionPoint, status) {
            let currentStatus = actionPoint.status,
                statusDateField = this.dateProperties[status];

            if (!currentStatus && status === 'open') {
                return 'active';
            } else if (actionPoint[statusDateField]) {
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
})();
