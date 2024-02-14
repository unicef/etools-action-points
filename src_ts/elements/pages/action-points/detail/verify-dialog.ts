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
      </style>
      <etools-dialog
        id="commentDialog"
        size="md"
        dialog-title="Add Verification result"
        keep-dialog-open
        ok-btn-text="SAVE"
        @confirm-btn-clicked="${this.addVerifier}"
        @close="${this.onClose}"
        spinner-text="Saving..."
      >
        <div class="row">
          <div class="col-12">
            <label class="label">Verification result</label>
            <etools-radio-group
              required
              .value="${this.isAdequate}"
              @sl-change="${(e: any) => {
                this.isAdequate = e.target.value;
              }}"
            >
              <sl-radio value="true">OK</sl-radio>
              <sl-radio value="false">Not Adequate</sl-radio>
            </etools-radio-group>
            <label class="error" ?hidden="${!this.showError}">Please select verification result</label>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  @property({type: String})
  isAdequate!: string;

  @property({type: Boolean})
  showError = false;

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
