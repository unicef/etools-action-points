import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@unicef-polymer/etools-dialog/etools-dialog';
import EtoolsDialog from '@unicef-polymer/etools-dialog/etools-dialog'; // eslint-disable-line
import './action-points-history';

class OpenViewHistory extends PolymerElement {
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

  static get properties() {
    return {
      actionPoint: {
        type: Array
      }
    };
  }

  open() {
    (this.$.historyDialog as EtoolsDialog).opened = true;
  }
}

customElements.define('open-view-history', OpenViewHistory);
