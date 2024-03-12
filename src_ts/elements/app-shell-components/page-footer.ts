import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {basePath} from '../../config/config';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';

/**
 * @extends HTMLElement
 */
@customElement('page-footer')
export class PageFooter extends LitElement {
  static get styles() {
    return [layoutStyles];
  }

  public render() {
    return html`
      <style>
        :host {
          display: flex;
          padding: 18px 24px;
          width: 100%;
          height: 60px;
          align-items: flex-end;
          padding-top: 50px;
          box-sizing: border-box;
        }

        #footer-content {
          padding-left: 24px;
        }

        #unicef-logo img {
          height: 28px;
          width: 118px;
        }

        .footer-link {
          margin: auto 15px;
          color: #6d6d6d;
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
        <div id="footer-content" class="layout-horizontal">
          <span id="unicef-logo" class="layout-horizontal layout-inline">
            <img src="${basePath}assets/images/UNICEF_logo.webp" alt="UNICEF logo" />
          </span>
        </div>
      </footer>
    `;
  }
}
