import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import EtoolsDialog from '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {tabInputsStyles} from '../../../styles/tab-inputs-styles';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {GenericObject} from '../../../../typings/globals.types';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('open-add-comments')
export class OpenAddComments extends ErrorHandlerMixin(InputAttrsMixin(LitElement)) {
  @property({type: String})
  commentText: string;

  @property({type: Array})
  actionPoint: any;

  @property({type: String})
  permissionPath: string;

  @property({type: Boolean})
  requestInProcess = false;

  render() {
    return html`
      ${tabInputsStyles}
      <style>
        .group {
          padding: 16px 0px;
        }
      </style>
      <etools-dialog
        id="commentDialog"
        size="md"
        .dialogTitle="Add ${this.getLabel('comments', this.permissionPath)}"
        keep-dialog-open
        ok-btn-text="SAVE"
        @confirm-btn-clicked="${this.saveComment}"
        @iron-overlay-closed="${this._resetInputs}"
        ?show-spinner="${this.requestInProcess}"
        spinner-text="Save comment"
      >
        <div class="row-h group">
          <div class="input-container input-container-l">
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
      </etools-dialog>
    `;
  }

  open() {
    const dialog = this.shadowRoot!.querySelector<any>('#commentDialog') as EtoolsDialog;
    this.commentText = '';
    dialog.opened = true;
  }

  saveComment() {
    if (!this.validate()) return;
    const dialog = this.shadowRoot!.querySelector<any>('#commentDialog') as EtoolsDialog;
    const endpoint = getEndpoint('actionPoint', this.actionPoint.id);
    const comments = [
      {
        comment: this.commentText
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
        fireEvent(this, 'new-comment-added', response);
        dialog.opened = false;
        this.requestInProcess = false;
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
        this.requestInProcess = false;
      });
  }

  validate() {
    const elements: NodeList = this.shadowRoot.querySelectorAll('.validate-input');
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
