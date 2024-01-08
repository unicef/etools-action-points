import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * @polymer
 * @extends HTMLElement
 */
@customElement('text-content')
export class TextContent extends LitElement {
  render() {
    return html`
      <style>
        #content {
          max-height: 4.4em;
          overflow: hidden;
        }
      </style>
      <div id="content">${this.text}</div>
    `;
  }

  @property({type: String})
  text: string;
}
