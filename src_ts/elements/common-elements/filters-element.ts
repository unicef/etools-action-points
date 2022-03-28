import {LitElement, html, customElement} from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';

/**
 * @polymer
 * @extends HTMLElement
 */
@customElement('filters-element')
export class FiltersElement extends LitElement {
  static get styles() {
    // language=CSS
    return [gridLayoutStylesLit];
  }

  render() {
    return html`
      <style>
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
          }
        }
      </style>

      <paper-card class="second-header layout-horizontal flex-c">
        <slot></slot>
      </paper-card>
    `;
  }
}
