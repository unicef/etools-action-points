// shared styles for all views
// not for styling index.html or apd-shell
import {html} from 'lit-element';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';

export const sharedStyles = html`
  <style>
    h1 {
      font-size: 25px;
      margin: 16px 0;
      color: var(--primary-text-color);
    }

    a {
      text-decoration: inherit;
      color: inherit;
    }

    a:focus {
      outline: inherit;
    }

    app-toolbar {
      height: var(--toolbar-height);
    }

    #tabs {
      height: 48px;
    }

    paper-tabs {
      color: var(--light-primary-text-color);
      --paper-tabs-selection-bar-color: var(--accent-color);
      --paper-tabs: {
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
      }
    }

    paper-tabs > * {
      --paper-tab-ink: var(--accent-color);
      --paper-tab-content-unselected: {
        color: var(--light-secondary-text-color);
      }
    }

    .tab-link {
      @apply --layout-horizontal;
      @apply --layout-center-center;
    }

    iron-pages[hidden] {
      display: none;
    }

    paper-material {
      padding: 15px 20px;
      background-color: var(--light-theme-content-color);
    }

    iron-icon.dark {
      --iron-icon-fill-color: var(--dark-icon-color);
    }

    iron-icon.light {
      --iron-icon-fill-color: var(--light-icon-color);
    }

    paper-icon-button.dark {
      color: var(--dark-icon-color);
      --paper-icon-button-ink-color: var(--dark-ink-color);
    }

    paper-icon-button.light {
      color: var(--light-icon-color);
      --paper-icon-button-ink-color: var(--light-ink-color);
    }
  </style>
`;
