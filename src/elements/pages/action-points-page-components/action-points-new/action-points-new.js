'use strict';

(function() {
    let mixins = [
        APDMixins.AppConfig,
        EtoolsAjaxRequestMixin
    ];

    class ActionPointsNew extends generateBaseClass(mixins) {
        static get is() { return 'action-points-new'; }

        static get properties() {
            return {
                route: {
                    type: Object,
                    notify: true
                },
                actionPoint: {
                    type: Object,
                    value: () => ({})
                }
            };
        }

        ready() {
            super.ready();
            this.addEventListener('action-activated', () => this._createAP());
        }

        _createAP() {
            let detailsElement = Polymer.dom(this.root).querySelector('#ap-details');
            if (!detailsElement || !detailsElement.validate()) { return; }

            let data = _.clone(detailsElement.editedItem);
            let endpoint = this.getEndpoint('actionPointsList');

            this.dispatchEvent(new CustomEvent('global-loading', {
                detail: {type: 'ap-creation', active: true, message: 'Creating Action Point...'},
                bubbles: true,
                composed: true
            }));

            this.sendRequest({method: 'POST', endpoint, body: data})
                .then(data => {
                    this.actionPoint = {};
                    this.dispatchEvent(new CustomEvent('toast', {
                        detail: {text: ' Action Point successfully created.'},
                        bubbles: true,
                        composed: true
                    }));
                    this.set('route.path', `detail/${data.id}`);
                }, () => {
                    this.dispatchEvent(new CustomEvent('toast', {
                        detail: {text: 'Can not create Action Point. Please check all fields and try again.'},
                        bubbles: true,
                        composed: true
                    }));
                })
                .finally(() => {
                    this.dispatchEvent(new CustomEvent('global-loading', {
                        detail: {type: 'ap-creation'},
                        bubbles: true,
                        composed: true
                    }));
                });
        }

    }

    customElements.define(ActionPointsNew.is, ActionPointsNew);
})();
