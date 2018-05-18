'use strict';

class ActionPointComments extends APDMixins.AppConfig(EtoolsAjaxRequestMixin(APDMixins.DateMixin(APDMixins.InputAttrs(APDMixins.DataTableMixin(Polymer.Element))))) {
    static get is() { return 'action-point-comments'; }

    static get properties() {
        return {
            basePermissionPath: String,
            actionPoint: {
                type: Array,
                value() { return {};}
            },
            filteredComments: {
                type: Array,
                value() { return [];}
            },
            pageSize: {
                type: Number,
                value: 10
            },
            pageNumber: {
                type: Number,
                value: 1
            },
            openedCommentDialog: Boolean
        };
    }

    static get observers() {
        return [
            '_filterComments(actionPoint.comments, pageNumber, pageSize)'
        ];
    }

    _openAddComment() {
        this.openedCommentDialog = true;
    }

    saveComment() {
        this.validate();
        let endpoint = this.getEndpoint('actionPoint', {id: this.actionPoint.id});
        let data = _.cloneDeep(this.actionPoint);
        data.comments.push({
            comment: this.commentText
        });
        this.isSaveComment = true;
        this.sendRequest({method: 'PUT', endpoint, body: data})
            .then((response) => {
                this.set('actionPoint.comments', response.comments);
                this.openedCommentDialog = false;
            })
            .finally(() => {
                this.isSaveComment = false;
            });
    }

    closeSaveDialog() {
        this.commentText = '';
    }

    validate() {
        let elements = this.shadowRoot.querySelectorAll('.validate-input');
        let valid = true;
        _.each(elements, element => {
            if (element.required && !element.disabled && !element.validate()) {
                let label = element.label || 'Field';
                element.errorMessage = `${label} is required`;
                element.invalid = true;
                valid = false;
            }
        });

        return valid;
    }

    _filterComments(comments, pageNumber, pageSize) {
        if (!comments) { return; }
        let from = (pageNumber - 1) * pageSize;
        let to = pageNumber * pageSize;
        this.set('filteredComments', comments.slice(from, to));
    }
}

customElements.define(ActionPointComments.is, ActionPointComments);
