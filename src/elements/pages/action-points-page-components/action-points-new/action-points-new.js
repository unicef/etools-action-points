let ActionPointsNewMixins = EtoolsMixinFactory.combineMixins([
    APDMixins.AppConfig,
    APDMixins.ErrorHandlerMixin,
    EtoolsAjaxRequestMixin], Polymer.Element);

class ActionPointsNew extends ActionPointsNewMixins {
    static get is() {return 'action-points-new';}

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            actionPoint: {
                type: Object,
                value: () => ({})
            },
            permissionPath: {
                type: String,
                value: 'action_points'
            }
        };
    }

    static get observers() {
        return [
            '_changeRoutePath(route.path)'
        ];
    }

    ready() {
        super.ready();
        this.addEventListener('action-activated', () => this._createAP());
    }

    _changeRoutePath() {
        let details = this.shadowRoot.querySelector('action-point-details');
        this.set('actionPoint', {});
        details.dispatchEvent(new CustomEvent('reset-validation'));
    }

    _createAP() {
        let detailsElement = this.shadowRoot.querySelector('#ap-details');
        if (!detailsElement || !detailsElement.validate()) {return;}

        let data = _.clone(detailsElement.editedItem);
        let endpoint = this.getEndpoint('actionPointsList');

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-creation', active: true, message: 'Creating Action Point...'},
            bubbles: true,
            composed: true
        }));

        this.sendRequest({method: 'POST', endpoint, body: data})
            .then((data) => {
                this.actionPoint = {};
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: ' Action Point successfully created.'},
                    bubbles: true,
                    composed: true
                }));
                this.set('route.path', `detail/${data.id}`);
            }, (err) => {
                this.errorHandler(err, this.permissionPath);
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
