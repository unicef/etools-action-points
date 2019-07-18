import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {flush} from '@polymer/polymer/lib/utils/flush.js';
import './multi-notification-item';
/**
* @polymer
* @extends HTMLElement
*/
class MultiNotificationList extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
            display: block;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 105;
            left: var(--app-drawer-width);
        }
      </style>

      <template is="dom-repeat" items="[[notifications]]">
        <multi-notification-item id="[[item.id]]" opened text="{{item.text}}"></multi-notification-item>
      </template>
    `;
  }

  static get properties() {
    return {
      notifications: {
        type: Array,
        value() {
          return [];
        },
        notify: true
      },
      notificationsQueue: {
        type: Array,
        value() {
          return [];
        }
      },
      limit: {
        type: Number,
        value: 3
      },
      count: {
        type: Number,
        value: 1
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('notification-push', e => this._onNotificationPush(e));
    this.addEventListener('notification-shift', e => this._onNotificationShift(e));
    this.addEventListener('reset-notifications', () => this._resetNotifications());
  }

  _onNotificationShift(this: any, {detail}: any) {
    let index = this.notifications.findIndex((notification: any) => {
      return notification.id === detail.id;
    });

    if (index !== undefined) {
      this.splice('notifications', index, 1);
    }

    flush();
    // Check and show notifications from queue
    if (this.notificationsQueue.length) {
      this.push('notifications', this.shift('notificationsQueue'));
    }
  }

  _onNotificationPush(this: any, {detail}: any) {
    let notification = detail;
    notification.id = `toast___${this.count++}`;

    if (this.limit > this.notifications.length) {
      this.push('notifications', notification);
    } else {
      this.push('notificationsQueue', notification);
    }
  }

  _resetNotifications() {
    this.set('notifications', []);
    this.set('notificationsQueue', []);
  }
}

window.customElements.define('multi-notification-list', MultiNotificationList);
