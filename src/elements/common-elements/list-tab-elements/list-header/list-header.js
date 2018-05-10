'use strict';

class ListHeader extends APDMixins.LocalizationMixin(Polymer.Element) {
    static get is() { return 'list-header'; }

    static get properties() {
        return {
            basePermissionPath: {
                type: String,
                value: ''
            },
            orderBy: {
                type: String,
                notify: true
            },
            noOrdered: Boolean,
            noAdditional: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_setRightPadding(data.*)'
        ];
    }

    _setRightPadding() {
        if (!this.data) { return; }
        let rightPadding = 0;
        let padding;

        this.data.forEach((heading) => {
            if (typeof heading.size === 'string') {
                padding = parseInt(heading.size, 10) || 0;
                rightPadding += padding;
            }
        });

        this.paddingRight = `${rightPadding}px`;
    }

    _changeOrder(event) {
        if (this.noOrdered) { return; }
        let item = event && event.model && event.model.item;

        if (!item || item.noOrder) { return; }
        let newOrderName = item.name;
        let currentOrderName = this.orderBy || '';
        let direction = '-';

        if (currentOrderName.startsWith('-')) {
            direction = '';
            currentOrderName = currentOrderName.slice(1);
        }

        if (newOrderName !== currentOrderName) {
            direction = '';
        }

        this.orderBy = `${direction}${newOrderName}`;
    }
}

customElements.define(ListHeader.is, ListHeader);
