Polymer({
    is: 'multi-notification-list',

    properties: {
        notifications: {
            type: Array,
            value: function() {
                return [];
            },
            notify: true,
        },
        notificationsQueue: {
            type: Array,
            value: function() {
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
    },

    listeners: {
        'notification-push': '_onNotificationPush',
        'notification-shift': '_onNotificationShift',
        'reset-notifications': '_resetNotifications',
    },

    _onNotificationShift: function(e, id) {
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
    },

    _onNotificationPush: function(e, notification = {}) {
        notification.id = `toast___${this.count++}`;

        if (this.limit > this.notifications.length) {
            this.push('notifications', notification);
        } else {
            this.push('notificationsQueue', notification);
        }
    },

    _resetNotifications: function() {
        this.set('notifications', []);
        this.set('notificationsQueue', []);
    },

    /**
     * Fired when notification added in queue
     *
     * @event notification-push
     */

    /**
     * Fired when notification removed from queue after showing
     *
     * @event notification-shift
     */
});
