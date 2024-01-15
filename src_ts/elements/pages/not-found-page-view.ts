import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {sharedStyles} from '../styles/shared-styles';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

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

      <section class="page-content elevation" elevation="1">
          <h2>Oops! You hit a 404.</h2>
          <p>The page you're looking for doesn't seem to exist.</p>
          <p>
            <a href="/apd/action-points/list" class="link">Head back home.</a>
          </p>
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    fireEvent(this, 'clear-loading-messages');
  }

  openDrawer() {
    fireEvent(this, 'change-drawer-state');
  }
}
