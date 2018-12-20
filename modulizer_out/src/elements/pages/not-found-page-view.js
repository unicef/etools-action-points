import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '../styles-element/shared-styles';
import '../styles-elements/page-layout-styles';
import '../core-elements/etools-app-config';

class NotFoundPageView extends APDMixins.AppConfig(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }
      
        a.link {
          color: #40c4ff;
        }
      </style>
      <style include="page-layout-styles shared-styles"></style>
      
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
