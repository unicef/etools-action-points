class ActionPointsList extends Polymer.Element {
    static get is() { return 'action-points-list'; }

    static get properties() {
        return {
            actionPoints: {
                type: Array,
                value() {
                    return [
                        {id: 1},
                        {id: 2},
                        {id: 3}
                    ];
                }
            },
            route: {
                type: Object,
                notify: true
            }
        };
    }

    _toActionPoint({model}) {
        this.set('route.path', `/${model.item.id}`);
    }

    _toNew() {
        this.set('route.path', '/new');
    }
}

window.customElements.define(ActionPointsList.is, ActionPointsList);
