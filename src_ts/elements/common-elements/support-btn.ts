import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/communication-icons.js';
import {customElement, property} from '@polymer/decorators';

/**
 * @polymer
 * @customElement
 */
@customElement('support-btn')
export class SupportBtn extends PolymerElement {
  public static get template() {
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

      <a href="[[url]]" target="_blank">
        <iron-icon icon="communication:textsms"></iron-icon>
        Support
      </a>
    `;
  }

  @property({type: String})
  url =
    'https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=c8e43760db622450f65a2aea4b9619ad&sysparm_category=99c51053db0a6f40f65a2aea4b9619af';
}
