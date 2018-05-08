class ActionPointsNew extends Polymer.Element {
    static get is() { return 'action-points-new'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            }
        };
    }
}

window.customElements.define(ActionPointsNew.is, ActionPointsNew);
