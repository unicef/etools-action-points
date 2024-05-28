import {LitElement, html, CSSResult, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';

/**
 * @polymer
 * @customElement
 */
@customElement('support-btn')
export class SupportBtn extends MatomoMixin(LitElement) {
  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host(:hover) {
        cursor: pointer;
      }

      a {
        color: var(--header-color);
        text-decoration: none;
        font-size: var(--etools-font-size-16, 16px);
      }

      etools-icon-button {
        font-size: var(--etools-font-size-14, 14px);
        padding-top: 4px;
        display: flex;
      }
    `;
  }
  render() {
    return html`
      <a
        href="https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=c8e43760db622450f65a2aea4b9619ad&sysparm_category=99c51053db0a6f40f65a2aea4b9619af"
        target="_blank"
      >
        <etools-icon-button name="communication:textsms" label="Support" title="Support"></etools-icon-button>
      </a>
    `;
  }
}
