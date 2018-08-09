'use strict';

class AppMainHeader extends APDMixins.AppConfig(Polymer.Element) {
    static get is() {return 'app-main-header';}

    static get properties() {
        return {
            user: {
                type: Object
            },
            menuOptions: {
                type: Array,
                value: function() {
                    return [
                        {
                            title: 'Dashboards',
                            icon: 'app-selector-icons:dashIcon',
                            url: 'dash'
                        },
                        {
                            title: 'Partnership Management',
                            icon: 'app-selector-icons:pmpIcon',
                            url: 'pmp'
                        },
                        {
                            title: 'Trip Management',
                            icon: 'app-selector-icons:tripsIcon',
                            url: 't2f'
                        },
                        {
                            title: 'Financial Assurance Module',
                            icon: 'app-icons:auditor',
                            url: 'ap'
                        },
                        {
                            title: 'Action Points',
                            icon: 'app-icons:apd',
                            url: 'apd'
                        },
                        {
                            title: 'Admin (Permission Required)',
                            icon: 'app-selector-icons:adminIcon',
                            url: 'admin'
                        }

                    ];
                }
            }
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
