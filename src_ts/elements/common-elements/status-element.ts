import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import {EtoolsMixinFactory} from '@unicef-polymer/etools-behaviors/etools-mixin-factory.js';
import StaticData from '../app-mixins/static-data-mixin';
import PermissionController from '../app-mixins/permission-controller';
import './etools-action-buttons';
import { etoolsStatusStyles } from '../styles-elements/status-styles';

const StatusElementMixin = EtoolsMixinFactory.combineMixins([
  PermissionController,
  StaticData
], PolymerElement);

class StatusElement extends StatusElementMixin {
  static get template() {
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

  static get properties() {
    return {
      dateProperties: {
        type: Object,
        value: function() {
          return {
            open: 'created',
            completed: 'date_of_completion'
          };
        }
      },
      actionPoint: {
        type: Object
      },
      actions: {
        type: Array,
        value() {return [];}
      },
      permissionPath: String,
      statuses: {
        type: Array,
        notify: true
      }
    };
  }

  ready() {
    super.ready();
    this.set('statuses', this.getData('statuses') || []);
  }

  _isStatusFinish(actionPoint: any, status: string) {
    let currentStatus = actionPoint.status;
    if (!currentStatus) {return false;}
    let currentStatusIndex = this.statuses.findIndex((x: any) => x.value === currentStatus);
    let statusIndex = this.statuses.findIndex((x: any) => x.value === status);
    return (currentStatusIndex >= statusIndex);
  }

  _getStatusClass(actionPoint: any, status: string) {
    let currentStatus = actionPoint.status;

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
    let lastStatus = statuses[statuses.length - 1];
    return !!(lastStatus && lastStatus.value === status);
  }
}

customElements.define('status-element', StatusElement);
