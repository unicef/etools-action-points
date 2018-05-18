class ActionPointsPageMain extends Polymer.Element {
    static get is() { return 'action-points-page-main'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: Object
        };
    }

    static get observers() {
        return [
            '_setRoutePath(route.path)'
        ];
    }

    _setRoutePath(path) {
        if (!path.length) {
            this.set('route.path', '/list');
        }
    }
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
