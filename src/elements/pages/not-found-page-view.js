import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '../core-elements/etools-app-config';
import {sharedStyles} from '../styles-elements/shared-styles';
import {pageLayoutStyles} from '../styles-elements/page-layout-styles';

class NotFoundPageView extends APDMixins.AppConfig(PolymerElement) {
  static get template() {
    return html`
      <style>
        ${sharedStyles}
        ${pageLayoutStyles}
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
