class ActionPointsItem extends APDMixins.AppConfig(EtoolsAjaxRequestMixin(APDMixins.PermissionController(Polymer.Element))) {
    static get is() { return 'action-points-item'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: {
                type: String,
                observer: '_changeActionPointId'
            },
            actionPoint: {
                type: Object,
                value() { return {};}
            },
            basePermissionPath: String
        };
    }

    ready() {
        super.ready();
        this.addEventListener('action-activated', ({detail}) => {
            if (detail.type === 'save') {
                this._updateAP();
            } else if (detail.type === 'complete') {
                this._completeAP();
            }
        });
    }

    _changeActionPointId(data) {
        this.actionPointId = data.id;
        if (!this.actionPointId) { return; }
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPointId});
        this._loadOptions(this.actionPointId);
        this.sendRequest({method: 'GET', endpoint})
            .then((result) => {
                this.set('actionPoint', this._getActionPoint(result));
            });
    }

    _loadOptions(id) {
        let permissionPath = `action_points_${id}`;
        let endpoint = this.getEndpoint('actionPoint', {id: id});
        this.sendRequest({method: 'OPTIONS', endpoint})
            .then(data => {
                let actions = data && data.actions;
                this._addToCollection(permissionPath, actions);
            }, () => this._responseError('Partners', 'request error'))
            .finally(() => {
                this.basePermissionPath = permissionPath;
            });
    }

    _getActionPoint(actionPoint) {
        let item = actionPoint || {};
        //todo rework and remove
        item.partner = this._getObjectId(actionPoint.partner);
        item.intervention = this._getObjectId(actionPoint.intervention);
        item.office = this._getObjectId(actionPoint.office);
        item.location = this._getObjectId(actionPoint.location);
        item.section = this._getObjectId(actionPoint.section);
        item.assigned_to = this._getObjectId(actionPoint.assigned_to);
        item.assigned_by = this._getObjectId(actionPoint.assigned_by);
        item.cp_output = this._getObjectId(actionPoint.cp_output);
        item.author = this._getObjectId(actionPoint.author);
        return item;
    }

    _getObjectId(field) {
        return _.isObject(field) ? field.id : field;
    }

    _completeAP() {
        let endpoint = this.getEndpoint('actionPointComplete', {id: this.actionPointId});

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-complete', active: true, message: 'Completing Action Point...'},
            bubbles: true,
            composed: true
        }));

        this.sendRequest({method: 'POST', endpoint})
            .then(data => {
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: ' Action Point successfully completed.'},
                    bubbles: true,
                    composed: true
                }));
                this.set('route.path', `${data.id}`);
            }, () => {
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: 'Can not complete Action Point. Please check all fields and try again.'},
                    bubbles: true,
                    composed: true
                }));
            })
            .finally(() => {
                this.dispatchEvent(new CustomEvent('global-loading', {
                    detail: {type: 'ap-complete'},
                    bubbles: true,
                    composed: true
                }));
            });
    }

    _updateAP() {
        let detailsElement = this.shadowRoot.querySelector('action-point-details');
        if (!detailsElement || !detailsElement.validate()) { return; }

        let data = _.clone(detailsElement.editedItem);
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPointId});

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-update', active: true, message: 'Update Action Point...'},
            bubbles: true,
            composed: true
        }));

        this.sendRequest({method: 'PUT', endpoint, body: data})
            .then(data => {
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
