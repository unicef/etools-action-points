'use strict';

class MultiNotificationItem extends Polymer.Element {
    static get is() { return 'multi-notification-item'; }

    static get properties() {
        return {
            opened: {
                type: Boolean,
                observer: '_openedChanged'
            },
            text: {
                type: String,
                value: ''
            }
        };
    }

    connectCallback() {
        super.connectCallback();
        this.addEventListener('transitionend', this._onTransitionEnd);
    }

    _onTransitionEnd(e) {
        if (e && e.target === this && e.propertyName === 'opacity') {
            if (!this.opened) {
                this.fire('notification-shift', this.id);
            }
        }
    }

    _renderOpened() {
        requestAnimationFrame(() => {
            this.classList.add('notification-open');
        });
    }

    _renderClosed() {
        requestAnimationFrame(() => {
            this.classList.remove('notification-open');
        });
    }

    _openedChanged(opened) {
        if (opened) {
            this._renderOpened();
        } else {
            this._renderClosed();
        }
    }

    close() {
        this.opened = false;
    }
}

window.customElements.define(MultiNotificationItem.is, MultiNotificationItem);

