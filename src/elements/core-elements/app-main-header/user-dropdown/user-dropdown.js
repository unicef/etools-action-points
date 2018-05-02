class UserDropdown extends window.EtoolsMixins.AppConfig(Polymer.Element) {
    static get is() { return 'user-dropdown'; }

    static get properties() {
        return {
            opened: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            isAdmin: {
                type: Boolean,
                value: false
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.$.dropdown.addEventListener('paper-dropdown-close', (e) => this._toggleOpened(e));
        this.$.dropdown.addEventListener('paper-dropdown-open', (e) => this._toggleOpened(e));
    }

    _toggleOpened() {
        this.$.dropdownMenu.select(null);
        this.set('opened', this.$.dropdown.opened);
    }

    _changeLocation(path) {
        window.location.href = window.location.origin + '/' + path + '/';
    }

    _logout() {
        this.resetOldUserData();
        this._changeLocation('accounts/logout');
    }
}

window.customElements.define(UserDropdown.is, UserDropdown);
