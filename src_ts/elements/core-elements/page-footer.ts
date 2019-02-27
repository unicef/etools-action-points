import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

/**
* @polymer
* @extends HTMLElement
*/
class PageFooter extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex">
        :host {
          display: flex;
          padding: 18px 24px;
          width: 100%;
          height: 60px;
          align-items: flex-end;
          padding-top: 50px;
        }

        #footer-content {
          @apply --layout-horizontal;
          padding-left: 24px;
        }

        #unicef-logo {
          @apply --layout-horizontal;
          @apply --layout-inline;
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
