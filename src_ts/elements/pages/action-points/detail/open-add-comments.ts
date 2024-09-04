import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {GenericObject} from '../../../../typings/globals.types';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import apdEndpoints from '../../../../endpoints/endpoints';

@customElement('open-add-comments')
export class OpenAddComments extends ErrorHandlerMixin(InputAttrsMixin(LitElement)) {
  @property({type: String})
  commentText!: string;

  @property({type: Array})
  actionPoint: any;

  @property({type: String})
  permissionPath!: string;

  @property({type: Boolean})
  requestInProcess = false;

  @property({type: String})
  attachment!: string;

  render() {
    return html`
      <etools-dialog
        id="commentDialog"
        size="md"
        .dialogTitle="Add ${this.getLabel('comments', this.permissionPath)}"
        keep-dialog-open
        ok-btn-text="SAVE"
        @confirm-btn-clicked="${this.saveComment}"
        ?show-spinner="${this.requestInProcess}"
        @close="${this.onClose}"
        spinner-text="Save comment"
      >
        <div class="row">
          <div class="col-12">
            <etools-input
              class="validate-input ${this._setRequired('comments.comment', this.permissionPath)}"
              .value="${this.commentText}"
              label="${this.getLabel('comments.comment', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('comments.comment', this.permissionPath)}"
              ?required="${this._setRequired('comments.comment', this.permissionPath)}"
              ?readonly="${this.isReadOnly('comments.comment', this.permissionPath)}"
              maxlength="3000"
              ?invalid="${this.errors?.comments?.comment}"
              error-message="${this.errors?.comments?.comment}"
              @value-changed="${({detail}: CustomEvent) => (this.commentText = detail.value)}"
              @focus="${this._resetFieldError}"
              @click="${this._resetFieldError}"
              no-title-attr
            >
            </etools-input>
          </div>
        </div>
        ${this.actionPoint?.high_priority
          ? html`<div class="row">
              <div class="col-12">
                <etools-upload
                  id="uploadFile"
                  label="${this.getLabel('comments.supporting_document', this.permissionPath)}"
                  .fileUrl="${this.attachment}"
                  .uploadEndpoint="${apdEndpoints.attachmentsUpload.url}"
                  @upload-started="${this._onUploadStarted}"
                  @upload-finished="${this._attachmentUploadFinished}"
                  ?required="${this._setRequired('comments.supporting_document', this.permissionPath)}"
                  ?disabled="${this.isReadOnly('comments.supporting_document', this.permissionPath)}"
                  ?invalid="${this.errors.file}"
                  .errorMessage="${this.errors.file}"
                >
                </etools-upload>
              </div>
            </div>`
          : ``}
      </etools-dialog>
    `;
  }

  static get styles() {
    // language=CSS
    return [layoutStyles];
  }

  set dialogData(data: any) {
    if (!data) {
      return;
    }
    const {permissionPath, actionPoint} = data;
    this.actionPoint = actionPoint;
    this.permissionPath = permissionPath;
    this.commentText = '';
  }

  saveComment() {
    if (!this.validate()) return;
    const endpoint = getEndpoint('actionPoint', this.actionPoint.id);
    const comments = [
      {
        comment: this.commentText,
        supporting_document: this.attachment
      }
    ];
    this.requestInProcess = true;
    sendRequest({
      method: 'PATCH',
      endpoint: endpoint,
      body: {
        comments: comments
      }
    })
      .then((response: any) => {
        this.requestInProcess = false;
        fireEvent(this, 'dialog-closed', {confirmed: true, response: response});
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
        this.requestInProcess = false;
      });
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  _onUploadStarted() {
    this.requestInProcess = true;
  }

  _attachmentUploadFinished(e: CustomEvent) {
    this.requestInProcess = false;

    if (e.detail.success) {
      const uploadResponse = e.detail.success;
      this.attachment = uploadResponse?.id || null;
    } else if (e.detail.error && e.detail.error.error) {
      this.attachment = '';
      fireEvent(this, 'toast', {text: e.detail.error.error.message});
    }
  }

  validate() {
    const elements: NodeList = this.shadowRoot!.querySelectorAll('.validate-input');
    let valid = true;
    elements.forEach((element: GenericObject) => {
      if (element.required && !element.disabled && !element.validate()) {
        const label = element.label || 'Field';
        element.errorMessage = `${label} is required`;
        element.invalid = true;
        valid = false;
      }
    });

    return valid;
  }
}
