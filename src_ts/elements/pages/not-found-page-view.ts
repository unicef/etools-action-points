import {LitElement, html, customElement} from 'lit-element';
import '@polymer/paper-material/paper-material.js';
import {sharedStyles} from '../styles/shared-styles-lit';
import {pageLayoutStyles} from '../styles/page-layout-styles-lit';

@customElement('not-found-page-view')
export class NotFoundPageView extends LitElement {
  render() {
    return html`
      ${sharedStyles} ${pageLayoutStyles}
      <style>
        :host {
          display: block;
        }

        a.link {
          color: #40c4ff;
        }
        .container {
          padding: 15px;
        }
      </style>

      <div class="container">
        <paper-material elevation="1">
          <h2>Oops! You hit a 404.</h2>
          <p>The page you're looking for doesn't seem to exist.</p>
          <p>
            <a href="/apd/action-points/list" class="link">Head back home.</a>
          </p>
        </paper-material>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent('clear-loading-messages', {
        bubbles: true,
        composed: true
      })
    );
  }

  openDrawer() {
    this.dispatchEvent(
      new CustomEvent('drawer', {
        bubbles: true,
        composed: true
      })
    );
  }
}
