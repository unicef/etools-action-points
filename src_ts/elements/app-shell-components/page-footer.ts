import {LitElement, html, customElement} from 'lit-element';
import { basePath } from '../../config/config';
import { gridLayoutStylesLit } from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';

/**
 * @polymer
 * @extends HTMLElement
 */
@customElement('page-footer')
export class PageFooter extends LitElement {
  static get styles() {
    return [gridLayoutStylesLit];
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
            <img src="${basePath}images/UNICEF_logo.png" alt="UNICEF logo" />
          </span>
        </div>
      </footer>
    `;
  }
}
