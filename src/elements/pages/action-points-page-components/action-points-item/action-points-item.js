class ActionPointsItem extends Polymer.Element {
    static get is() { return 'action-points-item'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            }
        };
    }
}

window.customElements.define(ActionPointsItem.is, ActionPointsItem);
