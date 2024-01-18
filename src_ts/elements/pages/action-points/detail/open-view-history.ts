import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import EtoolsDialog from '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import './action-points-history';

@customElement('open-view-history')
export class OpenViewHistory extends LitElement {
  render() {
    return html`
      <etools-dialog
        id="historyDialog"
        size="md"
        no-padding
        ?opened="${this.isOpenedHistory}"
        dialog-title="History"
        cancel-btn-text="Close"
        hide-confirm-btn
      >
        <action-points-history .history="${this.actionPoint?.history}" .permissionPath="${this.permissionPath}">
        </action-points-history>
      </etools-dialog>
    `;
  }

  @property({type: Boolean})
  isOpenedHistory: boolean;

  @property({type: Object})
  actionPoint: any;

  @property({type: String})
  permissionPath: string;

  open() {
    const dialog = this.shadowRoot!.querySelector<any>('#historyDialog') as EtoolsDialog;
    dialog.opened = true;
  }
}
