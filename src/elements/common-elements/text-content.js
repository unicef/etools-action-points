import {PolymerElement, html} from '@polymer/polymer/polymer-element';
/**
* @polymer
* @extends HTMLElement
*/
class TextContent extends PolymerElement {
  static get template() {
    return html`
      <style>
        #content {
          max-height: 4.4em;
          overflow: hidden;
        }
      </style>
      <div id="content">[[text]]</div>
    `;
  }

  static get properties() {
    return {
      text: String
    };
  }
}

customElements.define('text-content', TextContent);
