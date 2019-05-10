import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-button/paper-button';
import 'etools-content-panel';
import StaticData from '../app-mixins/static-data-mixin';
import PermissionController from '../app-mixins/permission-controller';
import './action-buttons';
import {moduleStyles} from '../styles-elements/module-styles';

class StatusElement extends
  PermissionController(
    StaticData(
      PolymerElement)) {

  static get template() {
      return html`
        ${moduleStyles}
        <style>
          :host {
            display: block;
          }

          :host --ecp-content: {
            padding: 0;
          }

          :host .actions {
            border-top: solid 1px #e8e8e8;
            padding: 24px;
          }

          :host .status-list {
            width: 100%;
            padding: 25px;
            box-sizing: border-box;
          }

          :host .status-buttons {
            width: 100%;
            padding: 25px;
            border-top: solid 1px #e8e8e8;
            text-align: center;
            box-sizing: border-box;
          }

          :host .status-buttons paper-button {
            height: 35px;
            color: #fff;
            background-color: var(--module-primary);
          }

          :host .status-buttons paper-button.with-actions {
            padding-right: 0;
          }

          :host .status-buttons paper-button span {
            padding: 0 29px;
          }

          :host .status-buttons paper-menu-button {
            padding: 0;
            border-left: solid 1px rgba(255, 255, 255, 0.5);
          }

          :host .status-buttons .dropdown-content {
            padding: 6px 0;
          }

          :host .status-buttons .other-title {
            cursor: default;
            padding: 10px 20px;
            text-transform: uppercase;
            color: var(--gray-mid);
            white-space: nowrap;
            font-weight: 500;
          }

          :host .status-buttons .other-options {
            min-width: 150px;
            text-align: left;
            padding: 13px;
            color: var(--gray-dark);
            font-weight: 500;
            white-space: nowrap;
          }

          :host .status-buttons .other-options:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }

          :host .status-buttons .other-options .option-icon {
            width: 22px;
            height: 22px;
            margin-right: 15px;
            margin-left: 5px;
            color: var(--gray-mid);
            vertical-align: top;
          }

          :host .status-buttons .other-options span {
            vertical-align: top;
            margin-top: 1px;
            padding: 0;
            display: inline-block;
            height: 22px;
          }

          :host .status-container, :host .divider {
            height: 40px;
          }

          :host .status-container {
            position: relative;
          }

          @apply --layout-horizontal;
          @apply --layout-center;
          .status-icon, .status {
            @apply --layout-vertical;
            @apply --layout-center-justified;
            @apply --layout-warp;
          }

          iron-icon {
            display: inline-block;
          }

          :host .status-container .status-icon .icon-wrapper {
            background-color: var(--gray-light);
            text-align: center;
            width: 24px;
            height: 24px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            color: #fff;
          }

          :host .status-container .status-icon .icon-wrapper iron-icon {
            display: none;
            --iron-icon-height: 18px;
            --iron-icon-width: 18px;
            width: 18px;
            height: 18px;
            top: 1px;
            color: #fff;
          }

          :host .status-container .status-icon .icon-wrapper span {
            height: 24px;
            line-height: 24px;
            font-size: 13px;
          }

          :host .status-container .status {
            margin-left: 10px;
            margin-top: 15px;
            margin-bottom: 15px;
            box-sizing: border-box;
            text-transform: capitalize;
            color: var(--gray-mid);
          }

          :host .status-container .status .status-date {
            color: var(--gray-mid);
            font-size: 12px;
            font-weight: 400;
            white-space: nowrap;
          }

          :host .status-container .status.multi-line .status-date {
            position: absolute;
            bottom: -18px;
            left: 33px;
          }

          :host .status-container .status.multi-line .status-header {
            position: absolute;
            bottom: 0;
          }

          :host .status-container.active .status-icon .icon-wrapper iron-icon, :host .status-container.completed .status-icon .icon-wrapper iron-icon {
            display: inline-block;
            --iron-icon-height: 100%;
            --iron-icon-width: 100%;
          }

          :host .status-container.active .status-icon .icon-wrapper iron-icon[icon="warning"], :host .status-container.completed .status-icon .icon-wrapper iron-icon[icon="warning"], :host .status-container.active .status-icon .icon-wrapper iron-icon[icon="cancel"], :host .status-container.completed .status-icon .icon-wrapper iron-icon[icon="cancel"] {
            display: none;
          }

          :host .status-container.active .status-icon .icon-wrapper .status-nr, :host .status-container.completed .status-icon .icon-wrapper .status-nr {
            display: none;
          }

          :host .status-container.active .status, :host .status-container.completed .status {
            color: inherit;
            font-weight: bold;
          }

          :host .status-container.active .status-icon .icon-wrapper {
            background: var(--module-primary);
          }

          :host .status-container.active .status-icon .icon-wrapper .status-nr {
            display: inline-block;
          }

          :host .status-container.completed .status-icon .icon-wrapper {
            background: var(--module-success);
          }

          :host .status-container.active iron-icon, :host .status-container.pending iron-icon {
            display: none !important;
          }

          :host .status-container.report_rejected .status-icon .icon-wrapper, :host .status-container.rejected .status-icon .icon-wrapper, :host .status-container.cancelled .status-icon .icon-wrapper {
            background: transparent;
          }

          :host .status-container.report_rejected .status-icon .icon-wrapper .status-nr, :host .status-container.rejected .status-icon .icon-wrapper .status-nr, :host .status-container.cancelled .status-icon .icon-wrapper .status-nr {
            display: none;
          }

          :host .status-container.report_rejected .status-icon .icon-wrapper iron-icon[icon="check"], :host .status-container.rejected .status-icon .icon-wrapper iron-icon[icon="check"], :host .status-container.cancelled .status-icon .icon-wrapper iron-icon[icon="check"] {
            display: none;
          }

          :host .status-container.report_rejected .status-icon .icon-wrapper iron-icon[icon="cancel"], :host .status-container.rejected .status-icon .icon-wrapper iron-icon[icon="cancel"], :host .status-container.cancelled .status-icon .icon-wrapper iron-icon[icon="cancel"] {
            display: inline-block;
            width: 25px;
            height: 25px;
            color: var(--gray-darkest);
          }

          :host .status-container.report_rejected .status, :host .status-container.rejected .status, :host .status-container.cancelled .status {
            color: inherit;
            font-weight: bold;

          .divider {
            @apply --layout-vertical;
            width: 100%;
          }

          .divider .status-divider {
            height: 100%;
            width: 11px;
            border-right: 1px solid var(--gray-mid);
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
      permissionPath: String,
      statuses: {
        type: Array
      }
    };
  }

  ready() {
    super.ready();
    this.statuses = this.getData('statuses') || [];
  }

  _isStatusFinish(actionPoint: any, status: string) {
    let currentStatus = actionPoint.status;
    if (!currentStatus) {return false;}
    let currentStatusIndex = this.statuses.findIndex({value: currentStatus})
    let statusIndex = this.statuses.findIndex({value: status});
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
