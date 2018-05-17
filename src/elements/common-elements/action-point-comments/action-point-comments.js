'use strict';

class ActionPointComments extends APDMixins.InputAttrs(Polymer.Element) {
    static get is() { return 'action-point-comments'; }

    static get properties() {
        return {
            basePermissionPath: String,
            comments: {
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

    _openAddComment() {
        this.openedCommentDialog = true;
    }
}

customElements.define(ActionPointComments.is, ActionPointComments);
