import {PolymerElement, html} from '@polymer/polymer';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@polymer/paper-input/paper-input';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog'; // eslint-disable-line
import EndpointMixin from '../../app-mixins/endpoint-mixin';
import {EtoolsMixinFactory} from '@unicef-polymer/etools-behaviors/etools-mixin-factory';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import ErrorHandlerMixin from '../../app-mixins/error-handler-mixin';
import PermissionController from '../../app-mixins/permission-controller';
import InputAttrs from '../../app-mixins/input-attrs-mixin';

const OpenAddCommentsMixin = EtoolsMixinFactory.combineMixins([
  EndpointMixin,
  InputAttrs,
  PermissionController,
  ErrorHandlerMixin,
  EtoolsAjaxRequestMixin
], PolymerElement);

class OpenAddComments extends OpenAddCommentsMixin {
  static get template() {
    return html`
      <etools-dialog id="commentDialog" size="md" 
                      dialog-title="Add [[getLabel('comments', permissionPath)]]"
                      keep-dialog-open ok-btn-text="SAVE"
                      on-confirm-btn-clicked="saveComment"
                      on-iron-overlay-closed="_resetInputs">
        <etools-loading active="{{isSaveComment}}" loading-text="Save comment"></etools-loading>
        <div class="row-h group">
          <div class="input-container input-container-l">
            <paper-input 
                  class$="validate-input disabled-as-readonly [[_setRequired('comments.comment', permissionPath)]]"
                  value="{{commentText}}" label="[[getLabel('comments.comment', permissionPath)]]" 
                  placeholder="[[getPlaceholderText('comments.comment', permissionPath)]]"
                  required$="[[_setRequired('comments.comment', permissionPath)]]" 
                  disabled$="[[isReadOnly('comments.comment', permissionPath)]]"
                  maxlength="3000" 
                  invalid$="{{errors.comments.comment}}"
                  error-message="{{errors.comments.comment}}" on-focus="_resetFieldError" on-tap="_resetFieldError"
                  no-title-attr>
            </paper-input>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  static get properties() {
    return {
      commentText: {
        type: String
      },
      actionPoint: {
        type: Array
      }
    };
  }

  open() {
    (this.$.commentDialog as EtoolsDialog).opened = true;
  }

  saveComment() {
    if (!this.validate()) return;
    const dialog: EtoolsDialog = this.$.commentDialog as EtoolsDialog;
    let endpoint = this.getEndpoint('actionPoint', this.actionPoint.id);
    let comments = [{
      comment: this.commentText
    }];
    this.set('isSaveComment', true);
    this.sendRequest({
      method: 'PATCH',
      endpoint: endpoint,
      body: {
        comments: comments
      }
    })
        .then((response: any) => {
          this.dispatchEvent(new CustomEvent('new-comment-added', {
            bubbles: true,
            composed: true,
            detail: response
          }));
          dialog.opened = false;
          this.set('isSaveComment', false);
        })
        .catch((err: any) => {
          this.errorHandler(err, this.permissionPath);
          this.set('isSaveComment', false);
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
}

customElements.define('open-add-comments', OpenAddComments);
