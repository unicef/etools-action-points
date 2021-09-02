import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import {getData} from '../app-mixins/static-data-mixin';
import './etools-action-buttons';
import {etoolsStatusStyles} from '../styles-elements/status-styles';
import {customElement, property} from '@polymer/decorators';
import {noActionsAllowed, getActions} from '../app-mixins/permission-controller';

@customElement('status-element')
export class StatusElement extends PolymerElement {
  public static get template() {
    return html`
      ${etoolsStatusStyles}
      <etools-content-panel panel-title="Status">
        <div class="top-container" id="statusList">
          <template is="dom-repeat" items="{{statuses}}" as="status">
            <div class="divider-line"></div>
            <div class$="status-container [[_getStatusClass(actionPoint, status.value, statuses)]]">
              <div class="status-icon">
                <span class="icon-wrapper">
                  <span class="status-nr">[[setIndex(index)]]</span>
                  <iron-icon icon="done"></iron-icon>
                  <iron-icon icon="cancel"></iron-icon>
                </span>
              </div>

              <div class="status">
                <span class="status-header">[[status.display_name]]</span>
                <span class="status-date">
                  <!--{{_getFormattedDate('partner_contacted_at', engagementData.partner_contacted_at)}}-->
                </span>
              </div>
            </div>

            <div class="divider" hidden$="[[hideDivider(status.value, statuses)]]">
              <div class="status-divider"></div>
            </div>
          </template>
        </div>

        <div class="bottom-container" hidden$="[[noActionsAllowed(permissionPath)]]">
          <etools-action-button actions="[[getActions(permissionPath)]]"></etools-action-button>
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

  @property({type: Array, notify: true})
  statuses: string[];

  ready() {
    super.ready();
    this.set('statuses', getData('statuses') || []);
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

  setIndex(index: number) {
    return index + 1;
  }

  hideDivider(status: string, statuses: any) {
    const lastStatus = statuses[statuses.length - 1];
    return !!(lastStatus && lastStatus.value === status);
  }

  getActions(path: string) {
    return getActions(path);
  }
}
