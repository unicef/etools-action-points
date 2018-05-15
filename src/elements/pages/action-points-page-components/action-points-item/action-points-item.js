class ActionPointsItem extends APDMixins.AppConfig(EtoolsAjaxRequestMixin(Polymer.Element)) {
    static get is() { return 'action-points-item'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            actionPointId: {
                type: String,
                observer: '_changeActionPointId'
            },
            actionPoint: {
                type: Object,
                value: () => ({})
            }
        };
    }

    ready() {
        super.ready();
        this.addEventListener('action-activated', () => this._updateAP());
    }

    _changeActionPointId(id) {
        if (!id) { return; }
        let endpoint = this.getEndpoint('actionPointsList');
        endpoint.url += id;
        this.sendRequest({method: 'GET', endpoint})
            .then((result) => {
                this.set('actionPoint', result);
            });
    }

    _updateAP() {
        let detailsElement = this.shadowRoot.querySelector('#ap-details');
        if (!detailsElement || !detailsElement.validate()) { return; }

        let data = _.clone(detailsElement.editedItem);
        let endpoint = this.getEndpoint('actionPointsList');

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-update', active: true, message: 'Update Action Point...'},
            bubbles: true,
            composed: true
        }));

        this.sendRequest({method: 'PUT', endpoint, body: data})
            .then(data => {
                this.actionPoint = {};
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: ' Action Point successfully updated.'},
                    bubbles: true,
                    composed: true
                }));
                this.set('route.path', `${data.id}`);
            }, () => {
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: 'Can not update Action Point. Please check all fields and try again.'},
                    bubbles: true,
                    composed: true
                }));
            })
            .finally(() => {
                this.dispatchEvent(new CustomEvent('global-loading', {
                    detail: {type: 'ap-update'},
                    bubbles: true,
                    composed: true
                }));
            });
    }

}

customElements.define(ActionPointsItem.is, ActionPointsItem);
