Polymer({
    is: 'multi-notification-item',

    properties: {
        opened: {
            type: Boolean,
            observer: '_openedChanged'
        },
        text: {
            type: String,
            value: ''
        }
    },

    listeners: {
        'transitionend': '_onTransitionEnd',
    },

    _onTransitionEnd: function(e) {
        if (e && e.target === this && e.propertyName === 'opacity') {
            if (!this.opened) {
                this.fire('notification-shift', this.id);
            }
        }
    },

    _renderOpened: function() {
        requestAnimationFrame(() => {
            this.classList.add('notification-open');
        });
    },

    _renderClosed: function() {
        requestAnimationFrame(() => {
            this.classList.remove('notification-open');
        });
    },

    _openedChanged: function(opened) {
        if (opened) {
            this._renderOpened();
        } else {
            this._renderClosed();
        }
    },

    close: function() {
        this.opened = false;
    },

    /**
     * Fired when notification should be moved up
     *
     * @event move-up
     */
});
