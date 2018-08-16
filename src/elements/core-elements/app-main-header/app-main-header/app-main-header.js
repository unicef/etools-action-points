'use strict';

class AppMainHeader extends APDMixins.AppConfig(Polymer.Element) {
    static get is() {return 'app-main-header';}

    static get properties() {
        return {
            user: {
                type: Object
            },
           
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('main_refresh', this._refreshPage);
    }

    ready() {
        super.ready();
        this._isStaging();
    }

    _isStaging() {
        if (this.isStagingServer()) {
            this.$.envWarningIf.if = true;
        }
    }

    openDrawer() {
        this.dispatchEvent(new CustomEvent('drawer'));
    }

    _refreshPage(event) {
        event.stopImmediatePropagation();
        this.$.refresh.refresh();
    }
}

customElements.define(AppMainHeader.is, AppMainHeader);
