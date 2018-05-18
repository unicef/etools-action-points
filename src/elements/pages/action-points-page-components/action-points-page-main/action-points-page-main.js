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
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
