import {html, TemplateResult} from 'lit';

// language=HTML
export const headerDropdownStyles: TemplateResult = html`
  <style>
    *[hidden] {
      display: none !important;
    }

    :host {
      display: block;
      --sl-spacing-small: 0;
    }

    :host(:hover) {
      cursor: pointer;
    }

    etools-dropdown::part(display-input) {
      text-align: end;
    }

    countries-dropdown[dir='rtl'] {
      margin-inline: 30px 20px;
    }

    organizations-dropdown {
      width: 170px;
    }

    countries-dropdown {
      width: 160px;
    }

    #languageSelector {
      width: 120px;
    }
    .w100 {
      width: 100%;
    }

    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
      padding: 4px;
    }

    etools-dropdown::part(display-input)::placeholder {
      color: var(--sl-input-color);
      opacity: 1;
    }

    etools-dropdown::part(display-input)::-ms-input-placeholder {
      /* Edge 12-18 */
      color: var(--sl-input-color);
    }

    #menuButton {
      display: block;
      color: var(--light-secondary-text-color);
    }

    @media (max-width: 1024px) {
      .envWarning {
        display: none;
      }
      .envLong {
        display: none;
      }
      .titlebar img {
        margin: 0 8px 0 12px;
      }
      etools-profile-dropdown {
        margin-left: 12px;
        width: 40px;
      }
      etools-dropdown {
        min-width: 130px;
        width: 130px;
      }
      organizations-dropdown {
        width: 130px;
      }

      countries-dropdown {
        width: 130px;
      }
    }

    @media (max-width: 576px) {
      #app-logo {
        display: none;
      }
      etools-dropdown {
        min-width: auto;
      }
      organizations-dropdown {
        width: 120px;
      }

      countries-dropdown {
        width: 120px;
      }
      .titlebar img {
        margin: 0 8px 0 4px;
      }
      .envWarning {
        font-size: var(--etools-font-size-10, 10px);
        line-height: 12px;
        white-space: nowrap;
        margin-left: 2px;
      }
      app-toolbar {
        --toolbar-height: auto;
        padding-inline-end: 0px;
      }
      .column-r {
        flex-direction: column-reverse !important;
      }
    }
    @media (min-width: 850px) {
      #menuButton {
        display: none;
      }
    }
  </style>
`;
