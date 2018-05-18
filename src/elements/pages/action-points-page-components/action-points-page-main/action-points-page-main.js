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

    connectedCallback() {
        super.connectedCallback();
    }

    static get observers() {
        return [
            '_setRoutePath(route.path)'
        ];
    }

    _setRoutePath(path) {
        console.log(path);
    }
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
