import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import {getData} from '../mixins/static-data-mixin';
import './etools-action-buttons';
import {etoolsStatusStyles} from '../styles/status-styles';
import {noActionsAllowed, getActions} from '../mixins/permission-controller';

@customElement('status-element')
export class StatusElement extends LitElement {
  render() {
    return html`
      ${etoolsStatusStyles}
      <etools-content-panel panel-title="Status">
        <div class="top-container" id="statusList">
          ${this.statuses?.map(
            (status: any, index: number) => html`
              <div class="divider-line"></div>
              <div class="status-container ${this._getStatusClass(this.actionPoint, status.value)}">
                <div class="status-icon">
                  <span class="icon-wrapper">
                    <span class="status-nr">${index + 1}</span>
                    <iron-icon icon="done"></iron-icon>
                    <iron-icon icon="cancel"></iron-icon>
                  </span>
                </div>

                <div class="status">
                  <span class="status-header">${status.display_name}</span>
                </div>
              </div>

              <div class="divider" ?hidden="${this.hideDivider(status.value, this.statuses)}">
                <div class="status-divider"></div>
              </div>
            `
          )}
        </div>

        <div class="bottom-container" ?hidden="${this.noActionsAllowed(this.permissionPath)}">
          <etools-action-button .actions="${this.getActions(this.permissionPath)}"></etools-action-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  dateProperties: any = () => {
    return {
      open: 'created',
      completed: 'date_of_completion'
    };
  };

  @property({type: Object})
  actionPoint: any;

  @property({type: Array})
  actions: any[];

  @property({type: String})
  permissionPath: string;

  @property({type: Array}) // notify: true
  statuses: any[];

  firstUpdated() {
    this.statuses = getData('statuses') || [];
  }

  _isStatusFinish(actionPoint: any, status: string) {
    const currentStatus = actionPoint.status;
    if (!currentStatus) {
      return false;
    }
    const currentStatusIndex = this.statuses.findIndex((x: any) => x.value === currentStatus);
    const statusIndex = this.statuses.findIndex((x: any) => x.value === status);
    return currentStatusIndex >= statusIndex;
  }

  noActionsAllowed(path: string) {
    return noActionsAllowed(path);
  }

  _getStatusClass(actionPoint: any, status: string) {
    const currentStatus = actionPoint.status;

    if (!currentStatus && status === 'open') {
      return 'active';
    } else if (this._isStatusFinish(actionPoint, status)) {
      return 'completed';
    } else {
      return 'pending';
    }
  }

  hideDivider(status: string, statuses: any) {
    const lastStatus = statuses[statuses.length - 1];
    return !!(lastStatus && lastStatus.value === status);
  }

  getActions(path: string) {
    return getActions(path);
  }
}
