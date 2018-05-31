const ActionPointsItemMixins = EtoolsMixinFactory.combineMixins([
    APDMixins.AppConfig,
    APDMixins.InputAttrs,
    APDMixins.DateMixin,
    APDMixins.PermissionController,
    APDMixins.ErrorHandlerMixin,
    EtoolsAjaxRequestMixin
], Polymer.Element);

class ActionPointsItem extends ActionPointsItemMixins {
    static get is() {return 'action-points-item';}

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
                value() {return {};}
            },
            permissionPath: String
        };
    }

    static get observers() {
        return [
            '_changeRoutePath(route.path)'
        ];
    }

    ready() {
        super.ready();
        this.addEventListener('action-activated', ({detail}) => {
            if (detail.type === 'save') {
                this._update()
                    .then(() => {
                        this._loadOptions(this.actionPointId);
                    });
            } else if (detail.type === 'complete') {
                this._complete()
                    .then(() => {
                        this._loadOptions(this.actionPointId);
                    });
            }
        });
    }

    _changeRoutePath() {
        this.shadowRoot.querySelector('action-point-details').dispatchEvent(new CustomEvent('reset-validation'));
    }

    _changeActionPointId(data) {
        this.actionPointId = data.id;
        if (!this.actionPointId) {return;}
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPointId});
        this._loadOptions(this.actionPointId);
        this.sendRequest({method: 'GET', endpoint})
            .then((result) => {
                this.set('actionPoint', this._prepareActionPoint(result));
            });
    }

    _loadOptions(id) {
        let permissionPath = `action_points_${id}`;
        let endpoint = this.getEndpoint('actionPoint', {id: id});
        return this.sendRequest({method: 'OPTIONS', endpoint})
            .then((data) => {
                let actions = data && data.actions;
                if (!this.collectionExists(permissionPath)) {
                    this._addToCollection(permissionPath, actions);
                } else {
                    this._updateCollection(permissionPath, actions);
                    this.set('permissionPath', '');
                }
                this.set('permissionPath', permissionPath);
            }, () => this._responseError('Partners', 'request error'))
            .finally(() => {
                this.permissionPath = permissionPath;
            });
    }

    _prepareActionPoint(actionPoint) {
        return this._resolveFields(actionPoint, [
            'partner',
            'intervention',
            'office',
            'location',
            'section',
            'assigned_to',
            'assigned_by',
            'cp_output',
            'author']);
    }

    _resolveFields(actionPoint, fields) {
        let data = actionPoint || {};
        for (let field of fields) {
            let fieldValue = data[field];
            if (fieldValue && fieldValue.id) {
                data[field] = fieldValue.id;
            }
        }
        return data;
    }

    _complete() {
        let endpoint = this.getEndpoint('actionPointComplete', {id: this.actionPointId});

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-complete', active: true, message: 'Completing Action Point...'},
            bubbles: true,
            composed: true
        }));

        return this.sendRequest({method: 'POST', endpoint})
            .then((data) => {
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: ' Action Point successfully completed.'},
                    bubbles: true,
                    composed: true
                }));
                this.actionPoint = this._prepareActionPoint(data);
            }, (err) => {
                this.errorHandler(err, this.permissionPath);
            })
            .finally(() => {
                this.dispatchEvent(new CustomEvent('global-loading', {
                    detail: {type: 'ap-complete'},
                    bubbles: true,
                    composed: true
                }));
            });
    }

    _getChangedData(oldData, newData) {
        return _.pickBy(newData, (value, key) => {
            return !_.isEqual(oldData[key], value);
        });
    }

    _update() {
        let detailsElement = this.shadowRoot.querySelector('action-point-details');
        if (!detailsElement || !detailsElement.validate()) {return;}

        let editedData = _.clone(detailsElement.editedItem);
        let data = this._getChangedData(this.actionPoint, editedData);
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPointId});

        this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {type: 'ap-update', active: true, message: 'Update Action Point...'},
            bubbles: true,
            composed: true
        }));

        return this.sendRequest({method: 'PATCH', endpoint, body: data})
            .then((data) => {
                this.dispatchEvent(new CustomEvent('toast', {
                    detail: {text: ' Action Point successfully updated.'},
                    bubbles: true,
                    composed: true
                }));
                this.actionPoint = this._prepareActionPoint(data);
            }, (err) => {
                this.errorHandler(err, this.permissionPath);
            })
            .finally(() => {
                this.dispatchEvent(new CustomEvent('global-loading', {
                    detail: {type: 'ap-update'},
                    bubbles: true,
                    composed: true
                }));
            });
    }

    showHistory() {
        this.isOpenedHistory = true;
    }

    hasHistory(history) {
        return history && history.length > 0;
    }

}

customElements.define(ActionPointsItem.is, ActionPointsItem);
