import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './etools-app-config.js';
/**
* @polymer
* @extends HTMLElement
*/
class PageFooter extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          padding: 18px 24px;
          width: 100%;
          height: 60px;
          align-items: flex-end
        }

        #footer-content {
          @apply --layout-horizontal;
        }

        #unicef-logo {
          @apply --layout-horizontal;
          @apply --layout-inline;

          padding-right: 30px;
        }

        #unicef-logo img {
          height: 28px;
          width: 118px;
        }

        .footer-link {
          margin: auto 15px;
          color: #6D6D6D;
          text-decoration: none;
        }

        .footer-link:first-of-type {
          margin-left: 30px;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <footer>
        <div id="footer-content">
          <span id="unicef-logo">
            <img src$="[[rootPath]]../../../../../../apd/images/UNICEF_logo.png" alt="UNICEF logo">
          </span>
        </div>
      </footer>
    `;
  }
}

window.customElements.define('page-footer', PageFooter);
