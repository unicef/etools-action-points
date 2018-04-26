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

    connectCallback() {
        super.connectCallback();
        this.addEventListener('paper-dropdown-close', this._toggleOpened);
        this.addEventListener('paper-dropdown-open', this._toggleOpened);
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
