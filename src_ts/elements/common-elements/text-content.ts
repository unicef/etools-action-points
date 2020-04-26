import {PolymerElement, html} from '@polymer/polymer';
import {customElement, property} from '@polymer/decorators';

/**
* @polymer
* @extends HTMLElement
*/
@customElement('text-content')
export class TextContent extends PolymerElement {
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

  @property({type: String})
  text: string;
}
