import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-button/paper-button.js';
import {customElement, property, observe} from '@polymer/decorators';

/**
* @polymer
* @extends HTMLElement
*/
@customElement('multi-notification-item')
export class MultiNotificationItem extends PolymerElement {
  public static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: auto;
          position: relative;
          bottom: 15px;
          left: 15px;
          background-color: var(--paper-toast-background-color, #323232);
          color: var(--paper-toast-color, #f1f1f1);
          min-height: 48px;
          min-width: 288px;
          padding: 16px 0 16px 24px;
          box-sizing: border-box;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          border-radius: 2px;
          margin: 20px 12px;
          font-size: 14px;
          cursor: default;
          -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
          transition: transform 0.3s, opacity 0.3s;
          opacity: 0;
          z-index: 1001;
          @apply --paper-font-common-base;
        }

        :host(.notification-open) {
          opacity: 1;
        }

        span {
          float: left;
          line-height: 41px;
        }

        paper-button {
          float: right;
          color: #0099FF;
        }
      </style>

      <span>{{text}}</span>
      <paper-button on-tap="close">OK</paper-button>
    `;
  }

  @property({type: Boolean})
  opened: boolean;

  @property({type: String})
  text = '';

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('transitionend', e => this._onTransitionEnd(e));
  }

  _onTransitionEnd(e: any) {
    if (e && e.target === this && e.propertyName === 'opacity') {
      if (!this.opened) {
        this.dispatchEvent(new CustomEvent('notification-shift', {
          detail: {
            id: this.id
          },
          bubbles: true,
          composed: true
        }));
      }
    }
  }

  _renderOpened() {
    requestAnimationFrame(() => {
      this.classList.add('notification-open');
    });
  }

  _renderClosed() {
    requestAnimationFrame(() => {
      this.classList.remove('notification-open');
    });
  }

  @observe('opened')
  _openedChanged(opened: boolean) {
    if (opened) {
      this._renderOpened();
    } else {
      this._renderClosed();
    }
  }

  close() {
    this.opened = false;
  }
}
