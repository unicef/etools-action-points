import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {validateRequiredFields} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {getData} from '../../../mixins/static-data-mixin';

@customElement('add-verifier-dialog')
export class OpenAddComments extends ErrorHandlerMixin(InputAttrsMixin(LitElement)) {
  static get styles() {
    // language=CSS
    return [layoutStyles];
  }

  render() {
    return html`
      <etools-dialog
        id="commentDialog"
        size="md"
        dialog-title="Add Potential Verifier"
        keep-dialog-open
        ok-btn-text="SAVE"
        @confirm-btn-clicked="${this.addVerifier}"
        @close="${this.onClose}"
        spinner-text="Saving..."
      >
        <div class="row">
          <div class="col-12">
            <etools-dropdown
              class="validate-input ${this._setRequired('potential_verifier', this.permissionPath)}"
              .selected="${this.verifierId}"
              label="${this.getLabel('potential_verifier', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('potential_verifier', this.permissionPath, true)}"
              .options="${this.unicefUsers}"
              option-label="name"
              option-value="id"
              required
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              error-message="Potential verifier is required"
              allow-outside-scroll
              dynamic-align
              trigger-value-change-event
              @etools-selected-item-changed="${({detail}: CustomEvent) => (this.verifierId = detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  @property({type: String})
  permissionPath!: string;

  @property({type: Object})
  unicefUsers = [];

  @property() verifierId!: number;

  set dialogData(data: any) {
    if (!data) {
      return;
    }
    const {permissionPath} = data;
    this.permissionPath = permissionPath;
    this.unicefUsers = getData('unicefUsers');
  }

  addVerifier(): void {
    if (!validateRequiredFields(this)) {
      return;
    }
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.verifierId});
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }
}
