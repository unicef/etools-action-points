import {PolymerElement, html} from '@polymer/polymer';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog.js';
import './action-points-history';
import {customElement, property} from '@polymer/decorators';

@customElement('open-view-history')
export class OpenViewHistory extends PolymerElement {
  static get template() {
    return html`
    <etools-dialog id="historyDialog"
                   size="md"
                   no-padding
                   opened="{{isOpenedHistory}}"
                   dialog-title="History"
                   cancel-btn-text="Close"
                   hide-confirm-btn>
      <action-points-history history="[[actionPoint.history]]"
                             permission-path="[[permissionPath]]">
      </action-points-history>
    </etools-dialog>
    `;
  }

  @property({type: Array})
  actionPoint: object[];

  open() {
    (this.$.historyDialog as EtoolsDialog).opened = true;
  }
}
