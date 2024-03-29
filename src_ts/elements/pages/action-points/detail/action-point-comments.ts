import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel.js';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query';
import {LocalizationMixin} from '../../../mixins/localization-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {tabInputsStyles} from '../../../styles/tab-inputs-styles';
import {moduleStyles} from '../../../styles/module-styles';
import {noActionsAllowed} from '../../../mixins/permission-controller';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {DateMixin} from '../../../mixins/date-mixin';
import './open-add-comments';
import {OpenAddComments} from './open-add-comments';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';
import linkifyStr from 'linkify-string';

@customElement('action-point-comments') // Actions Taken
export class ActionPointComments extends PaginationMixin(
  LocalizationMixin(DateMixin(ErrorHandlerMixin(InputAttrsMixin(LitElement))))
) {
  render() {
    return html`
      ${tabInputsStyles} ${moduleStyles}
      <style>
        .comments-list {
          padding: 8px 12px;
          text-align: justify;
        }

        .comment-item {
          margin-bottom: 12px;
        }

        .comment-item:last-of-type {
          margin-bottom: 0;
        }

        .comment-item__user {
          font-size: var(--etools-font-size-13, 13px);
          margin-right: 5px;
          font-weight: bold;
        }
        .comment-item__date {
          font-size: var(--etools-font-size-11, 11px);
          color: var(--list-secondary-text-color, #757575);
        }

        etools-dialog {
          --etools-dialog-default-btn-bg: var(--module-primary);
        }
      </style>

      <etools-media-query
        query="(max-width: 767px)"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></etools-media-query>

      <etools-content-panel panel-title="${this.getLabel('comments', this.permissionPath)}">
        <div slot="panel-btns">
          <etools-icon-button
            class="panel-button"
            ?hidden="${this.noActionsAllowed(this.permissionPath)}"
            name="add-box"
            @click="${this._openAddComment}"
          ></etools-icon-button>
        </div>
        <div class="comments-list">
          <span ?hidden=${this.filteredComments?.length}>No actions taken</span>
          ${this.filteredComments?.map(
            (item) => html`
              <div class="comment-item">
                <div class="comment-item__header">
                  <span class="comment-item__user">${item.user?.name}</span>
                  <span class="comment-item__date">${this.prettyDate(item.submit_date)}</span>
                </div>
                <div class="comment-item__body" id="commentArea" .innerHTML="${this.checkLinks(item.comment)}"></div>
              </div>
            `
          )}
        </div>
        <etools-data-table-footer
          .lowResolutionLayout="${this.lowResolutionLayout}"
          .pageSize="${this.paginator.page_size}"
          .pageNumber="${this.paginator.page}"
          .totalResults="${this.paginator.count}"
          .visibleRange="${this.paginator.visible_range}"
          @visible-range-changed="${this.visibleRangeChanged}"
          @page-size-changed="${this.pageSizeChanged}"
          @page-number-changed="${this.pageNumberChanged}"
        >
        </etools-data-table-footer>
      </etools-content-panel>
    `;
  }

  @property({type: String})
  permissionPath: string;

  @property({type: Array}) // notify: true
  actionPoint: any;

  @property({type: Array})
  filteredComments: any[];

  @property({type: Boolean})
  lowResolutionLayout = false;

  @property({type: String})
  commentText: string;

  @property({type: Object})
  commentDialog: OpenAddComments;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('new-comment-added', (e: any) => this._newCommentAdded(e));
  }

  firstUpdated() {
    this._createCommentDialog();
  }

  updated(changedProperties) {
    if (changedProperties.has('actionPoint')) {
      this._resetPaginator();
      this.paginatorChanged();
    }

    if (changedProperties.has('permissionPath')) {
      this._updateCommentProp();
    }
  }

  noActionsAllowed(path: string) {
    return noActionsAllowed(path);
  }

  _createCommentDialog() {
    this.commentDialog = document.createElement('open-add-comments') as OpenAddComments;
    document.querySelector('body')?.appendChild(this.commentDialog);
  }

  _updateCommentProp() {
    if (this.commentDialog) {
      this.commentDialog.actionPoint = this.actionPoint;
      this.commentDialog.permissionPath = this.permissionPath;
    }
  }

  _newCommentAdded(response) {
    this.actionPoint.comments = response.detail.comments;
    this.actionPoint.history = response.detail.history;
    this.actionPoint = {...this.actionPoint};
  }

  _resetPaginator() {
    this.paginator.page = 1;
    this.paginator.page_size = 10;
    this.paginator.count = this.actionPoint?.comments?.length;
  }

  checkLinks(comment) {
    comment = this.getStringValue(comment);
    comment = linkifyStr(comment);
    comment = comment.trim();
    return comment;
  }

  _openAddComment() {
    this.commentDialog.open();
  }

  paginatorChanged() {
    if (!this.actionPoint.comments) {
      return;
    }

    const from = (this.paginator.page - 1) * this.paginator.page_size;
    const to = this.paginator.page * this.paginator.page_size;
    this.filteredComments = this.actionPoint.comments.slice(from, to);
  }
}
