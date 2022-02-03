import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-material/paper-material.js';
import {getAbsolutePath} from '../../endpoints/endpoint-mixin';
import {sharedStyles} from '../styles/shared-styles';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {customElement} from '@polymer/decorators';

@customElement('not-found-page-view')
export class NotFoundPageView extends PolymerElement {
  public static get template() {
    return html`
      ${sharedStyles} ${pageLayoutStyles}
      <style>
        :host {
          display: block;
        }

        a.link {
          color: #40c4ff;
        }
      </style>

      <div id="pageContent">
        <paper-material elevation="1"> 404 <a href$="[[getLink()]]" class="link">Head back home.</a> </paper-material>
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

  getLink() {
    return getAbsolutePath('action-points');
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
