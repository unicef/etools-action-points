import {PolymerElement, html} from '@polymer/polymer';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import '@polymer/paper-input/paper-input.js';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {tabInputsStyles} from '../../../styles/tab-inputs-styles';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {customElement, property} from '@polymer/decorators';
import {GenericObject} from '../../../../typings/globals.types';
import {isReadOnly} from '../../../mixins/permission-controller';

@customElement('open-add-comments')
export class OpenAddComments extends EtoolsAjaxRequestMixin(ErrorHandlerMixin(InputAttrsMixin(PolymerElement))) {
  public static get template() {
    return html`
      ${tabInputsStyles}
      <etools-dialog
        id="commentDialog"
        size="md"
        dialog-title="Add [[getLabel('comments', permissionPath)]]"
        keep-dialog-open
        ok-btn-text="SAVE"
        on-confirm-btn-clicked="saveComment"
        on-iron-overlay-closed="_resetInputs"
        show-spinner="[[requestInProcess]]"
        spinner-text="Save comment"
      >
        <div class="row-h group">
          <div class="input-container input-container-l">
            <paper-input
              class$="validate-input disabled-as-readonly [[_setRequired('comments.comment', permissionPath)]]"
              value="{{commentText}}"
              label="[[getLabel('comments.comment', permissionPath)]]"
              placeholder="[[getPlaceholderText('comments.comment', permissionPath)]]"
              required$="[[_setRequired('comments.comment', permissionPath)]]"
              disabled$="[[isReadOnly('comments.comment', permissionPath)]]"
              maxlength="3000"
              invalid$="{{errors.comments.comment}}"
              error-message="{{errors.comments.comment}}"
              on-focus="_resetFieldError"
              on-tap="_resetFieldError"
              no-title-attr
            >
            </paper-input>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  @property({type: String})
  commentText: string;

  @property({type: Array})
  actionPoint: any;

  @property({type: String})
  permissionPath: string;

  @property({type: Boolean})
  requestInProcess = false;

  open() {
    (this.$.commentDialog as EtoolsDialog).opened = true;
  }

  saveComment() {
    if (!this.validate()) return;
    const dialog: EtoolsDialog = this.$.commentDialog as EtoolsDialog;
    const endpoint = getEndpoint('actionPoint', this.actionPoint.id);
    const comments = [
      {
        comment: this.commentText
      }
    ];
    this.set('requestInProcess', true);
    this.sendRequest({
      method: 'PATCH',
      endpoint: endpoint,
      body: {
        comments: comments
      }
    })
      .then((response: any) => {
        this.dispatchEvent(
          new CustomEvent('new-comment-added', {
            bubbles: true,
            composed: true,
            detail: response
          })
        );
        dialog.opened = false;
        this.set('requestInProcess', false);
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
        this.set('requestInProcess', false);
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

  isReadOnly(path) {
    return isReadOnly(path);
  }
}
