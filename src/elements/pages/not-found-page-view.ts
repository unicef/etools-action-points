import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import EndpointMixin from '../app-mixins/endpoint-mixin';
import {sharedStyles} from '../styles-elements/shared-styles.js';
import {pageLayoutStyles} from '../styles-elements/page-layout-styles.js';

class NotFoundPageView extends EndpointMixin(PolymerElement) {
  static get template() {
    return html`
      ${sharedStyles}
      ${pageLayoutStyles}
      <style>
        :host {
          display: block;
        }
      
        a.link {
          color: #40c4ff;
        }
      </style>
      
      <div id="pageContent">
        <paper-material elevation="1">
          404 <a href$="[[getLink()]]" class="link">Head back home.</a>
        </paper-material>
      </div>
    `;
  }

  getLink() {
      return this.getAbsolutePath('action-points');
  }

  openDrawer() {
      this.dispatchEvent(new CustomEvent('drawer', {
          bubbles: true,
          composed: true
      }));
  }
}

customElements.define('not-found-page-view', NotFoundPageView);
