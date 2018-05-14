'use strict';

(function() {
    class ActionButtons extends Polymer.Element {
        static get is() {
            return 'action-buttons';
        }

        static get properties() {
            return {
                actions: {
                    type: Array,
                    value: function() {
                        return [];
                    }
                },
                icons: {
                    type: Object,
                    value: function() {
                        return {
                            'cancel': 'cancel',
                            'save': 'save',
                            'submit': 'assignment-turned-in',
                            'finalize': 'assignment-turned-in',
                            'activate': 'check',
                            'confirm': 'check',
                            'assign': 'check',
                            'approve': 'assignment-turned-in',
                            'reject_report': 'cancel',
                            'send_report': 'assignment-turned-in',
                            'accept': 'check',
                            'reject': 'cancel'
                        };
                    }
                }
            };
        }

        closeMenu() {
            this.statusBtnMenuOpened = false;
        }

        _setButtonText(item) {
            if (!item) {
                return '';
            }
            let text = item.display_name || item.replace('_', ' ');

            if (!text) {
                throw 'Can not get button text!';
            }

            return text.toUpperCase();
        }

        _btnClicked(event) {
            if (!event || !event.target) {
                return;
            }
            let target = event.target.classList.contains('other-options') ? event.target : event.target.parentElement || event.target,
                isMainAction = event.target.classList.contains('main-action');

            let action = isMainAction ?
                (this.actions[0].code || this.actions[0]) :
            target && target.getAttribute('action-code');

            if (action) {
                this.dispatchEvent(new CustomEvent('toast', {detail: {reset: true}}));
                this.dispatchEvent(new CustomEvent('action-activated', {
                    detail: {type: action},
                    bubbles: true,
                    composed: true
                }));
            }
        }

        _showOtherActions(length) {
            return length > 1;
        }

        withActionsMenu(length) {
            return length > 1 ? 'with-menu' : '';
        }

        _filterActionsn(action) {
            return !_.isEqual(action, this.actions[0]);
        }

        _setIcon(item, icons) {
            if (!icons || !item) {
                return '';
            }
            return icons[(item.code || item)] || '';
        }

        _setActionCode(item) {
            return item && (item.code || item);
        }
    }

    customElements.define(ActionButtons.is, ActionButtons);
})();