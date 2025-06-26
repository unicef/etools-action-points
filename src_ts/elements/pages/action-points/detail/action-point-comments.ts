import {LitElement, PropertyValues, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel.js';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {LocalizationMixin} from '../../../mixins/localization-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {tabInputsStyles} from '../../../styles/tab-inputs-styles';
import {moduleStyles} from '../../../styles/module-styles';
import {canAddComments} from '../../../mixins/permission-controller';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {DateMixin} from '../../../mixins/date-mixin';
import './open-add-comments';
import {OpenAddComments} from './open-add-comments';
import PaginationMixin from '@unicef-polymer/etools-unicef/src/mixins/pagination-mixin';
import linkifyStr from 'linkify-string';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {GenericObject} from '@unicef-polymer/etools-types';

@customElement('action-point-comments') // Actions Taken
export class ActionPointComments extends PaginationMixin(
  LocalizationMixin(DateMixin(ErrorHandlerMixin(InputAttrsMixin(LitElement))))
) {
  static get styles() {
    return [layoutStyles];
  }

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
        .wrap-text {
          word-break: break-word;
        }
        .ml-6 {
          margin-left: 6px;
        }
        .layout-horizontal {
          align-items: flex-start;
        }
        .warning {
          color: var(--error-color);
          margin-inline-start: 12px;
          margin-block-start: 2px;
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
            ?hidden="${!canAddComments(this.permissionPath)}"
            name="add-box"
            @click="${this._openAddComment}"
          ></etools-icon-button>
        </div>
        <div class="warning" ?hidden="${!this.showAttachmentWarning(this.actionPoint, this.profile)}">
          *At least one attachment is required to complete the high priority Action Point
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
                <div class="comment-item__body row" id="commentArea">
                  <span class="col-sm-8 col-12 wrap-text">${this.checkLinks(item.comment)}</span>
                  <span class="col-sm-4 col-12 layout-horizontal">
                    ${item.supporting_document
                      ? html` <etools-icon name="attachment" class="download-icon"> </etools-icon>
                          <a
                            href="${item.supporting_document.file}"
                            class="ml-6 wrap-text"
                            title="${item.supporting_document.filename}"
                            target="_blank"
                            >${item.supporting_document.filename}
                          </a>`
                      : ``}
                  </span>
                </div>
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

  @property({type: Object})
  profile!: GenericObject;

  @property({type: String})
  permissionPath!: string;

  @property({type: Array}) // notify: true
  actionPoint: any;

  @property({type: Array})
  filteredComments!: any[];

  @property({type: Boolean})
  lowResolutionLayout = false;

  @property({type: String})
  commentText!: string;

  @property({type: Object})
  commentDialog!: OpenAddComments;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('new-comment-added', (e: any) => this._newCommentAdded(e));
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('actionPoint')) {
      this._resetPaginator();
      this.paginatorChanged();
    }

    if (changedProperties.has('permissionPath')) {
      this._updateCommentProp();
    }
  }

  _updateCommentProp() {
    if (this.commentDialog) {
      this.commentDialog.actionPoint = this.actionPoint;
      this.commentDialog.permissionPath = this.permissionPath;
    }
  }

  _resetPaginator() {
    this.paginator.page = 1;
    this.paginator.page_size = 10;
    this.paginator.count = this.actionPoint?.comments?.length;
  }

  checkLinks(comment: any) {
    comment = this.getStringValue(comment);
    comment = linkifyStr(comment);
    comment = comment.trim();
    return comment;
  }

  showAttachmentWarning(actionPoint: any, profile: any) {
    if (!actionPoint || !profile) {
      return false;
    }
    return (
      actionPoint.high_priority &&
      actionPoint.assigned_to === profile.user &&
      (actionPoint.comments || []).length &&
      !(actionPoint.comments || []).some((comm: any) => comm.supporting_document?.id)
    );
  }

  _openAddComment() {
    openDialog({
      dialog: 'open-add-comments',
      dialogData: {
        permissionPath: this.permissionPath,
        actionPoint: {...this.actionPoint}
      }
    }).then(({confirmed, response}) => {
      if (confirmed) {
        this._newCommentAdded(response);
      }
    });
  }

  _newCommentAdded(actionPoint: any) {
    fireEvent(this, 'data-changed', actionPoint);
    fireEvent(this, 'load-options');
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
