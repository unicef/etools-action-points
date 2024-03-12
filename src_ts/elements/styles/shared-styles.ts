// shared styles for all views
// not for styling index.html or apd-shell
import {html} from 'lit';

export const sharedStyles = html`
  <style>
    * {
      font-family: var(--sl-font-sans);
    }
    h1 {
      font-size: var(--etools-font-size-24, 24px);
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

    #tabs {
      height: 48px;
    }

    .tab-link {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    etools-icon.dark {
      --etools-icon-fill-color: var(--dark-icon-color);
    }

    etools-icon.light {
      --etools-icon-fill-color: var(--light-icon-color);
    }

    etools-icon-button.dark {
      color: var(--dark-icon-color);
      --etools-icon-fill-color: var(--dark-ink-color);
    }

    etools-icon-button.light {
      color: var(--light-icon-color);
      --etools-icon-fill-color: var(--light-ink-color);
    }
  </style>
`;
