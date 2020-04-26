import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import {customElement} from '@polymer/decorators';

/**
* @polymer
* @extends HTMLElement
*/
@customElement('page-footer')
export class PageFooter extends PolymerElement {
  public static get template() {
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
