class MultiNotificationList extends Polymer.Element {
    static get is() { return 'multi-notification-list'; }

    static get properties() {
        return {
            notifications: {
                type: Array,
                value() {
                    return [];
                },
                notify: true,
            },
            notificationsQueue: {
                type: Array,
                value() {
                    return [];
                }
            },
            limit: {
                type: Number,
                value: 3
            },
            count: {
                type: Number,
                value: 1
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('notification-push', this._onNotificationPush);
        this.addEventListener('notification-shift', this._onNotificationShift);
        this.addEventListener('reset-notifications', this._resetNotifications);
    }

    _onNotificationShift(e, id) {
        let index = this.notifications.findIndex((notification) => {
            return notification.id === id;
        });

        if (index !== undefined) {
            this.splice('notifications', index, 1);
        }

        Polymer.dom.flush();
        //Check and show notifications from queue
        if (this.notificationsQueue.length) {
            this.push('notifications', this.shift('notificationsQueue'));
        }
    }

    _onNotificationPush(e, notification = {}) {
        notification.id = `toast___${this.count++}`;

        if (this.limit > this.notifications.length) {
            this.push('notifications', notification);
        } else {
            this.push('notificationsQueue', notification);
        }
    }

    _resetNotifications() {
        this.set('notifications', []);
        this.set('notificationsQueue', []);
    }
}

window.customElements.define(MultiNotificationList.is, MultiNotificationList);
