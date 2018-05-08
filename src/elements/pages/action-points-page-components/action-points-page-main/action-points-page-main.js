class ActionPointsPageMain extends Polymer.Element {
    static get is() { return 'action-points-page-main'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    static get observers() {
        return [
            '_setRoutePath(route.path)'
        ];
    }

    _setRoutePath(path) {
        if (!path.length) {
            this.set('view', 'list');
        } else if (path.startsWith('/new')) {
            this.set('view', 'new');
        } else {
            this.set('view', 'detail');
        }
    }
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
