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
      max-width: 180px;
      margin-inline-start: 10px;
    }

    countries-dropdown {
      max-width: 160px;
      margin-inline-start: 10px;
    }

    #languageSelector {
      max-width: 160px;
    }
    .w100 {
      width: 100%;
    }
    app-toolbar {
      height: auto !important;
    }
    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
      padding: 4px;
    }

    etools-dropdown {
      --sl-input-placeholder-color: var(--light-secondary-text-color);
      opacity: 1;
    }

    #menuButton {
      display: block;
      color: var(--light-secondary-text-color);
    }

    @media (max-width: 1024px) {
      .envWarning {
        font-size: var(--etools-font-size-14, 14px);
        line-height: 16px;
      }
      .envLong {
        display: none;
      }
      etools-profile-dropdown {
        margin-left: 12px;
        width: 40px;
      }
      etools-dropdown {
        max-width: 130px;
      }
    }

    @media (max-width: 576px) {
      #app-logo {
        display: none;
      }
      etools-dropdown {
        min-width: auto;
      }
      organizations-dropdown,
      countries-dropdown {
        max-width: 150px !important;
      }
      support-btn {
        margin: 0 0 0 12px !important;
      }
      etools-profile-dropdown {
        margin-inline-start: 0px !important;
      }
      .envWarning {
        font-size: var(--etools-font-size-10, 10px);
        line-height: 12px;
        white-space: nowrap;
        margin-left: 2px;
      }
      app-toolbar {
        padding-inline-end: 0px;
      }
    }
    @media (min-width: 950px) {
      #menuButton {
        display: none;
      }
    }
  </style>
`;
