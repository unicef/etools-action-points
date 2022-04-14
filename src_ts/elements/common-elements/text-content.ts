import {LitElement, html, property, customElement} from 'lit-element';

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
