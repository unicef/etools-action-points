import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-radio/etools-radio-group';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';

@customElement('verify-dialog')
export class OpenAddComments extends ErrorHandlerMixin(InputAttrsMixin(LitElement)) {
  static get styles() {
    // language=CSS
    return [layoutStyles];
  }

  render() {
    return html`
      <style>
        .error {
          color: #ea4022;
          font-size: 12px;
        }
        .col-sm-6,
        .col-12 {
          background-color: #f9f9f9;
          border: solid 12px #ffffff;
          padding: 12px 24px;
        }
        .centered {
          margin: 0 auto;
        }
        sl-radio::part(base) {
          --sl-input-label-color: var(--primary-color);
          font-weight: 500;
          margin-top: 10px;
          margin-bottom: 6px;
        }
        etools-radio-group::part(form-control-input) {
          width: 100%;
          margin-left: -6px;
          display: flex;
          flex-wrap: wrap;
        }
        .warning {
          color: var(--error-color);
          text-align: center;
          margin-block-start: 2px;
        }
      </style>
      <etools-dialog
        id="commentDialog"
        size="md"
        dialog-title="Select Verification result"
        keep-dialog-open
        ok-btn-text="SAVE"
        @confirm-btn-clicked="${this.addVerifier}"
        @close="${this.onClose}"
        spinner-text="Saving..."
      >
        <etools-radio-group
          required
          .value="${this.isAdequate}"
          @sl-change="${(e: any) => {
            this.isAdequate = e.target.value;
          }}"
        >
          <div class="col-sm-6 col-12 layout-vertical">
            <div>
              I confirm that the implementation of this Action Point is evidenced by supporting documents and/or
              satisfactory justification.
            </div>
            <div class="centered">
              <sl-radio value="true" ?disabled="${!this.hasCommentAttachment(this.comments)}">Adequate</sl-radio>
            </div>
            <div class="warning centered" ?hidden="${this.hasCommentAttachment(this.comments)}">
              Disabled due to missing at least one attachment
            </div>
          </div>
          <div class="col-sm-6 col-12 layout-vertical">
            <div>
              The implementation of AP is not evidenced by supporting documents and/or satisfactory justification.
            </div>
            <div class="centered">
              <sl-radio value="false">Not Adequate</sl-radio>
            </div>
          </div>
          <label class="error" ?hidden="${!this.showError}">Verification result is required</label>
        </etools-radio-group>
      </etools-dialog>
    `;
  }

  @property({type: String})
  isAdequate!: string;

  @property({type: Boolean})
  showError = false;

  @property({type: Array})
  comments!: any[];

  set dialogData(data: any) {
    if (!data) {
      return;
    }
    const {comments} = data;
    this.comments = comments || [];
  }

  hasCommentAttachment(comments: any[]) {
    return comments.some((comm: any) => comm.supporting_document?.id);
  }

  addVerifier(): void {
    if (typeof this.isAdequate === 'undefined') {
      this.showError = true;
      return;
    }
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.isAdequate === 'true'});
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }
}
