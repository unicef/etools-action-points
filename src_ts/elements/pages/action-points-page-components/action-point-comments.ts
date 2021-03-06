import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {LocalizationMixin} from '../../app-mixins/localization-mixin';
import {ErrorHandler} from '../../app-mixins/error-handler-mixin';
import {tabInputsStyles} from '../../styles-elements/tab-inputs-styles';
import {moduleStyles} from '../../styles-elements/module-styles';
import {noActionsAllowed} from '../../app-mixins/permission-controller';
import {InputAttrs} from '../../app-mixins/input-attrs-mixin';
import {DateMixin} from '../../app-mixins/date-mixin';
import './open-add-comments';
import {OpenAddComments} from './open-add-comments';
import {customElement, property, observe} from '@polymer/decorators';

@customElement('action-point-comments')
export class ActionPointComments extends LocalizationMixin(
    DateMixin(
        ErrorHandler(
            InputAttrs(
                PolymerElement)))) {
  static get template() {
    return html`
      ${tabInputsStyles}
      ${moduleStyles}
      <style>
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
              <div class="comment-item__body" id="commentArea" inner-h-t-m-l="[[checkLinks(item.comment)]]">
              </div>
            </div>
          </template>
        </div>
        <etools-data-table-footer page-size="{{pageSize}}" page-number="{{pageNumber}}" 
                                  total-results="[[actionPoint.comments.length]]">
        </etools-data-table-footer>
      </etools-content-panel>
    `;
  }

  @property({type: String})
  permissionPath: string;

  @property({type: Array, notify: true})
  actionPoint: object[];

  @property({type: Array})
  filteredComments: object[];

  @property({type: Number})
  pageSize: number = 10;

  @property({type: String})
  pageNumber: Number = 1;

  @property({type: String})
  commentText: string;

  @property({type: Object})
  commentDialog: OpenAddComments;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('new-comment-added', (e: CustomEvent) => this._newCommentAdded(e));
  }

  ready() {
    super.ready();
    this._createCommentDialog();
  }

  noActionsAllowed(path: string) {
    return noActionsAllowed(path);
  }

  _createCommentDialog() {
    this.set('commentDialog', document.createElement('open-add-comments'));
    document.querySelector('body').appendChild(this.commentDialog);
  }

  @observe('actionPoint')
  _updateCommentProp() {
    if (this.commentDialog) {
      this.commentDialog.actionPoint = this.actionPoint;
    }
  }

  _newCommentAdded(response) {
    this.set('actionPoint.comments', response.detail.comments);
    this.set('actionPoint.history', response.detail.history);
  }

  @observe('permissionPath')
  _updatePermission() {
    this.set('pageNumber', 1);
    this.set('pageSize', 10);
  }

  checkLinks(comment) {
    comment = this.getStringValue(comment);
    // @ts-ignore
    comment = linkifyStr(comment); // eslint-disable-line
    comment = comment.trim();
    return comment;
  }

  _openAddComment() {
    this.commentDialog.open();
  }

  @observe('actionPoint.comments', 'pageNumber', 'pageSize')
  _filterComments(comments: string[], pageNumber: number, pageSize: number) {
    if (!comments) {
      return;
    }
    let from = (pageNumber - 1) * pageSize;
    let to = pageNumber * pageSize;
    this.set('filteredComments', comments.slice(from, to));
  }
}
