import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout';
/**
* @polymer
* @extends HTMLElement
*/
class FiltersElement extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex">
        :host {
          display: block;
          margin-top: 25px;
        }

        .second-header {
          padding: 8px 0;
          margin-bottom: 12px;
          --paper-card-background-color: #ffffff;

          --paper-card: {
            background-color: white;
            margin: 0 24px;
            width: calc(100% - 48px);
          };
        }
      </style>

      <paper-card class="second-header horizontal layout flex">
        <slot></slot>
      </paper-card>
    `;
  }
}

customElements.define('filters-element', FiltersElement);
