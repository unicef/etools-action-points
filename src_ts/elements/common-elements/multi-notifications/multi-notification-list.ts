import {PolymerElement, html} from '@polymer/polymer';
import {flush} from '@polymer/polymer/lib/utils/flush.js';
import './multi-notification-item';
import {customElement, property} from '@polymer/decorators';

/**
* @polymer
* @extends HTMLElement
*/
@customElement('multi-notification-list')
export class MultiNotificationList extends PolymerElement {
  public static get template() {
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

  @property({type: Array, notify: true})
  notifications: object[];

  @property({type: Array})
  notificationsQueue: object[];

  @property({type: Number})
  limit = 3;

  @property({type: Number})
  count = 1;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('notification-push', e => this._onNotificationPush(e));
    this.addEventListener('notification-shift', e => this._onNotificationShift(e));
    this.addEventListener('reset-notifications', () => this._resetNotifications());
  }

  _onNotificationShift(this: any, {detail}: any) {
    const index = this.notifications.findIndex((notification: any) => {
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
