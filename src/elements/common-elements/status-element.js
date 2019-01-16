import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-button/paper-button';
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory';
import 'etools-content-panel';
import '../app-mixins/static-data-mixin';
import '../app-mixins/permission-controller';
import './action-buttons';
import {moduleStyles} from '../styles-elements/module-styles';

class StatusElement extends EtoolsMixinFactory.combineMixins([
  APDMixins.PermissionController,
  APDMixins.StaticDataMixin], PolymerElement) {
  static get template() {
      return html`
        ${moduleStyles}
        <style>
          :host {
            display: block;
        
            --ecp-content: #{'{
                padding: 0;
            }'};
        
            .actions {
              border-top: solid 1px #e8e8e8;
              padding: 24px;
            }
        
            .status-list { width: 100%; padding: 25px; box-sizing: border-box; }
            .status-buttons {
              width: 100%;
              padding: 25px;
              border-top: solid 1px #e8e8e8;
              text-align: center;
              box-sizing: border-box;
      
              paper-button {
                height: 35px;
                color: #ffffff;
                background-color: var(--module-primary);
                &.with-actions { padding-right: 0; }
    
                span { padding: 0 29px; }
              }
              paper-menu-button {
                padding: 0;
                border-left: solid 1px rgba(255, 255, 255, 0.5);
              }
      
              .dropdown-content { padding: 6px 0; }
      
              .other-title {
                cursor: default;
                padding: 10px 20px;
                text-transform: uppercase;
                color: var(--gray-mid);
                white-space: nowrap;
                font-weight: 500;
              }
      
              .other-options {
                min-width: 150px;
                text-align: left;
                padding: 13px;
                color: var(--gray-dark);
                font-weight: 500;
                white-space: nowrap;
                &:hover { background-color: rgba(0, 0, 0, 0.1); }
    
                .option-icon {
                  width: 22px;
                  height: 22px;
                  margin-right: 15px;
                  margin-left: 5px;
                  color: var(--gray-mid);
                  vertical-align: top;
                }
    
                span {
                  vertical-align: top;
                  margin-top: 1px;
                  padding: 0;
                  display: inline-block;
                  height: 22px;
                }
              }
            }
        
            .status-container, .divider {
              height: 40px;
            }
        
            .status-container {
              position: relative;
              @apply --layout-horizontal;
              @apply --layout-center;
      
              .status-icon, .status {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                @apply --layout-warp;
              }
      
              iron-icon { display: inline-block;}
      
              .status-icon {
                .icon-wrapper {
                  background-color: var(--gray-light);
                  text-align: center;
                  width: 24px;
                  height: 24px;
                  -webkit-border-radius: 50%;
                  -moz-border-radius: 50%;
                  border-radius: 50%;
                  color: #ffffff;
  
                  iron-icon {
                    display: none;
                    --iron-icon-height: 18px;
                    --iron-icon-width: 18px;
                    width: 18px;
                    height: 18px;
                    top: 1px;
                    color: #fff;
                  }
  
                  span {
                    height: 24px;
                    line-height: 24px;
                    font-size: 13px;
                  }
                }
              }
      
              .status {
                margin-left: 10px;
                margin-top: 15px;
                margin-bottom: 15px;
                box-sizing: border-box;
                text-transform: capitalize;
                color: var(--gray-mid);
    
                .status-date {
                  color: var(--gray-mid);
                  font-size: 12px;
                  font-weight: 400;
                  white-space: nowrap;
                }
    
                &.multi-line .status-date {
                  position: absolute;
                  bottom: -18px;
                  left: 33px;
                }
    
                &.multi-line .status-header {
                  position: absolute;
                  bottom: 0;
                }
              }
      
              &.active,
              &.completed {
                .status-icon .icon-wrapper {
                  iron-icon {
                    display: inline-block;
                    --iron-icon-height: 100%;
                    --iron-icon-width: 100%;
                  }
                  iron-icon[icon="warning"],
                  iron-icon[icon="cancel"] { display: none; }
                  .status-nr { display: none; }
                }
                .status {
                  color: inherit;
                  font-weight: bold;
                }
              }
      
              &.active .status-icon .icon-wrapper {
                background: var(--module-primary);
                .status-nr { display: inline-block; }
              }
      
              &.completed .status-icon .icon-wrapper {
                background: var(--module-success);
              }
      
              &.active iron-icon,
              &.pending iron-icon { display: none !important; }
      
              &.report_rejected,
              &.rejected,
              &.cancelled {
                .status-icon .icon-wrapper {
                  background: transparent;
                  .status-nr { display: none; }
                  iron-icon[icon="check"] { display: none; }
                  iron-icon[icon="cancel"] {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    color: var(--gray-darkest);
  
                  }
                }
                .status {
                  color: inherit;
                  font-weight: bold;
                }
              }
            }
        
            .divider {
              @apply --layout-vertical;
              width: 100%;
              .status-divider {
                height: 100%;
                width: 11px;
                border-right: 1px solid var(--gray-mid);
              }
            }
          }
        </style>

        <etools-content-panel panel-title="Status">
        
          <div class="status-list" id="statusList">
            <template is="dom-repeat" items="{{statuses}}" as="status">
              <div class$="status-container [[_getStatusClass(actionPoint, status.value, statuses)]]">
                <div class="status-icon">
                  <span class="icon-wrapper">
                    <span class="status-nr">[[setIndex(index)]]</span>
                    <iron-icon icon="check"></iron-icon>
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
        
          <div class="actions" hidden$="[[noActionsAllowed(permissionPath)]]">
            <action-buttons actions="[[getActions(permissionPath)]]"></action-buttons>
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
      actions: {
        type: Array,
        value() {return [];}
      },
      permissionPath: String
    };
  }

  ready() {
    super.ready();
    this.statuses = this.getData('statuses') || [];
  }

  _isStatusFinish(actionPoint, status) {
    let currentStatus = actionPoint.status;
    if (!currentStatus) {return false;}
    let currentStatusIndex = _.findIndex(this.statuses, {value: currentStatus});
    let statusIndex = _.findIndex(this.statuses, {value: status});
    return (currentStatusIndex >= statusIndex);
  }

  _getStatusClass(actionPoint, status) {
    let currentStatus = actionPoint.status;

    if (!currentStatus && status === 'open') {
      return 'active';
    } else if (this._isStatusFinish(actionPoint, status)) {
    return 'completed';
  } else {
      return 'pending';
    }
  }

  setIndex(index) {
    return index + 1;
  }

  hideDivider(status, statuses) {
    let lastStatus = statuses[statuses.length - 1];
    return !!(lastStatus && lastStatus.value === status);
  }
}

customElements.define('status-element', StatusElement);
