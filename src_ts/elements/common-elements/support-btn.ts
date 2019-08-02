import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/communication-icons.js';

/**
 * @polymer
 * @customElement
*/

class SupportBtn extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host(:hover) {
          cursor: pointer;
        }
        a {
          color: inherit;
          text-decoration: none;
          font-size: 16px;
        }
        iron-icon {
          margin-right: 4px;
        }
      </style>

      <a href="[[url]]"
        target="_blank">
        <iron-icon icon="communication:textsms"></iron-icon>
        Support
      </a>
    `;
  }

  static get properties() {
    return {
      url: {
        type: String,
        value: 'https://unicef.service-now.com/' +
               'cc/?id=sc_cat_item&sys_id=35b00b1bdb255f00085184735b9619e6' +
               '&sysparm_category=c6ab1444db5b5700085184735b961920'
      }
    };
  }
}
customElements.define('support-btn', SupportBtn);
