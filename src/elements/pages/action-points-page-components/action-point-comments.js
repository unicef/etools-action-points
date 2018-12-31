import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-textarea';
import 'etools-content-panel';
import 'etools-data-table';
import 'etools-dialog';
import '../../app-mixins/localization-mixin';
import '../../app-mixins/error-handler-mixin';
import '../../app-mixins/input-attrs-mixin';
import '../../app-mixins/textarea-max-rows-mixin';
import {tabInputsStyles} from '../../styles-elements/tab-inputs-styles';
import {moduleStyles} from '../../styles-elements/module-styles';

class ActionPointComments extends EtoolsMixinFactory.combineMixins([
  APDMixins.AppConfig,
  APDMixins.InputAttrs,
  APDMixins.PermissionController,
  APDMixins.LocalizationMixin,
  APDMixins.DateMixin,
  APDMixins.ErrorHandlerMixin,
  APDMixins.TextareaMaxRowsMixin,
  EtoolsAjaxRequestMixin
], PolymerElement) {

  static get template() {
    return html`
      <style>
        ${tabInputsStyles}
        ${moduleStyles}
        .comments-list {
          padding: 8px 12px;
        }
        
        .comment-item {
          margin-bottom: 12px;
        }
        
        .comment-item:last-of-type {
          margin-bottom: 0;
        }
        
        .comment-item__user {
          font-size: 13px;
          margin-right: 5px;
          font-weight: bold;
        }
        .comment-item__date {
          font-size: 11px;
          color: var(--list-secondary-text-color, #757575);
        }
        
        etools-dialog {
          --etools-dialog-default-btn-bg: var(--module-primary);
        }
      </style>
      
      <etools-content-panel panel-title="[[getLabel('comments', permissionPath)]]">
        <div slot="panel-btns">
          <paper-icon-button class="panel-button" hidden$="[[noActionsAllowed(permissionPath)]]" 
                             icon="add-box" on-tap="_openAddComment"></paper-icon-button>
        </div>
        <div class="comments-list">
          <template is="dom-if" if="[[!filteredComments.length]]">
            <span>No actions taken</span>
          </template>
          <template id="rows" is="dom-repeat" items="[[filteredComments]]" as="item">
            <div class="comment-item">
              <div class="comment-item__header">
                <span class="comment-item__user">[[item.user.name]]</span>
                <span class="comment-item__date">[[prettyDate(item.submit_date)]]</span>
              </div>
              <div class="comment-item__body">
                [[getStringValue(item.comment)]]
              </div>
            </div>
          </template>
        </div>
        <etools-data-table-footer page-size="{{pageSize}}" page-number="{{pageNumber}}" 
                                  total-results="[[actionPoint.comments.length]]">
        </etools-data-table-footer>
      </etools-content-panel>
      <etools-dialog size="md" opened="{{openedCommentDialog}}" 
                     dialog-title="Add [[getLabel('comments', permissionPath)]]"
        keep-dialog-open ok-btn-text="SAVE" on-confirm-btn-clicked="saveComment" on-iron-overlay-closed="_resetInputs">
        <etools-loading active="{{isSaveComment}}" loading-text="Save comment">
        </etools-loading>
        <div class="row-h group">
          <div class="input-container input-container-l">
            <paper-textarea 
              class$="validate-input disabled-as-readonly [[_setRequired('comments.comment', permissionPath)]]"
              value="{{commentText}}" label="[[getLabel('comments.comment', permissionPath)]]" 
              placeholder="[[getPlaceholderText('comments.comment', permissionPath)]]"
              required$="[[_setRequired('comments.comment', permissionPath)]]" 
              disabled$="[[isReadOnly('comments.comment', permissionPath)]]"
              readonly$="[[isReadOnly('comments.comment', permissionPath)]]" max-rows="4" maxlength="3000" 
              invalid$="{{errors.comments.comment}}"
              error-message="{{errors.comments.comment}}" on-focus="_resetFieldError" on-tap="_resetFieldError"
              no-title-attr>
            </paper-textarea>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  static get properties() {
    return {
      permissionPath: String,
      actionPoint: {
        type: Array,
        value() {
          return {};
        },
        notify: true
      },
      filteredComments: {
        type: Array,
        value() {
          return [];
        }
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
        type: Boolean
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
    let endpoint = this.getEndpoint('actionPoint', {
      id: this.actionPoint.id
    });
    let comments = [{
      comment: this.commentText
    }];
    this.isSaveComment = true;
    this.sendRequest({
        method: 'PATCH',
        endpoint,
        body: {
          comments: comments
        }
      })
      .then((response) => {
        this.set('actionPoint.comments', response.comments);
        this.set('actionPoint.history', response.history);
        this.openedCommentDialog = false;
        this.isSaveComment = false;
      })
      .catch((err) => {
        this.errorHandler(err, this.permissionPath);
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
    if (!comments) {
      return;
    }
    let from = (pageNumber - 1) * pageSize;
    let to = pageNumber * pageSize;
    this.set('filteredComments', comments.slice(from, to));
  }
}

customElements.define(ActionPointComments.is, ActionPointComments);