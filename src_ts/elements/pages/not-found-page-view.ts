import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-material/paper-material.js';
import {EndpointMixin} from '../app-mixins/endpoint-mixin';
import {sharedStyles} from '../styles-elements/shared-styles';
import {pageLayoutStyles} from '../styles-elements/page-layout-styles';
import {customElement} from '@polymer/decorators';

@customElement('not-fount-page-view')
export class NotFoundPageView extends EndpointMixin(PolymerElement) {
  public static get template() {
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
