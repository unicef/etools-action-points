'use strict';

(function() {
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

    customElements.define(ActionPointsNew.is, ActionPointsNew);
})();
