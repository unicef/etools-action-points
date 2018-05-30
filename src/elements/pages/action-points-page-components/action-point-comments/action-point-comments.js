const ActionPointCommentsMixins = EtoolsMixinFactory.combineMixins([
    APDMixins.AppConfig,
    APDMixins.InputAttrs,
    APDMixins.PermissionController,
    APDMixins.LocalizationMixin,
    APDMixins.DateMixin,
    APDMixins.ErrorHandlerMixin,
    EtoolsAjaxRequestMixin], Polymer.Element);

class ActionPointComments extends ActionPointCommentsMixins {
    static get is() {return 'action-point-comments';}

    static get properties() {
        return {
            permissionPath: String,
            actionPoint: {
                type: Array,
                value() {return {};}
            },
            filteredComments: {
                type: Array,
                value() {return [];}
            },
            pageSize: {
                type: Number,
                value: 10
            },
            pageNumber: {
                type: Number,
                value: 1
            },
            openedCommentDialog: {
                type: Boolean,
                observer: '_resetDialog'
            },
            commentText: String
        };
    }

    static get observers() {
        return [
            '_updatePermission(permissionPath)',
            '_filterComments(actionPoint.comments, pageNumber, pageSize)'
        ];
    }

    _updatePermission() {
        this.pageNumber = 1;
        this.pageSize = 10;
    }

    _openAddComment() {
        this.openedCommentDialog = true;
    }

    saveComment() {
        if (!this.validate()) return;
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPoint.id});
        let comments = [{
            comment: this.commentText
        }];
        this.isSaveComment = true;
        this.sendRequest({method: 'PATCH', endpoint, body: {comments: comments}})
            .then((response) => {
                this.set('actionPoint.comments', response.comments);
                this.openedCommentDialog = false;
            })
            .catch(err => this.errorHandler(err, this.permissionPath))
            .finally(() => {
                this.isSaveComment = false;
            });
    }

    validate() {
        let elements = this.shadowRoot.querySelectorAll('.validate-input');
        let valid = true;
        for (let element of elements) {
            if (element.required && !element.disabled && !element.validate()) {
                let label = element.label || 'Field';
                element.errorMessage = `${label} is required`;
                element.invalid = true;
                valid = false;
            }
        }

        return valid;
    }

    _filterComments(comments, pageNumber, pageSize) {
        if (!comments) {return;}
        let from = (pageNumber - 1) * pageSize;
        let to = pageNumber * pageSize;
        this.set('filteredComments', comments.slice(from, to));
    }
}

customElements.define(ActionPointComments.is, ActionPointComments);
