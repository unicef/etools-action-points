import {html} from 'lit';
import {pageLayoutStyles} from './page-layout-styles';
import {sharedStyles} from './shared-styles';
import {appDrawerStyles} from './app-drawer-styles';

export const appShellStyles = html`
  ${pageLayoutStyles} ${sharedStyles} ${appDrawerStyles}
  <style>
    :host {
      display: block;
    }

    app-header-layout {
      position: relative;
    }
    /*       
    app-drawer {
      visibility: visible;
      right: auto;
      z-index: 65 !important;
        
      --app-drawer-width: 220px;
      --app-drawer-content-container: {
        transform: translate3d(0, 0, 0);
        background-color: var(--light-theme-content-color);
      };
    }

    app-header {
      padding-left: 73px;
    }

    app-header:not([small-menu]){
      padding-left: 220px;
    }
    
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      app-header {
        padding-left: 0;
      }
      app-header:not([small-menu]){
        padding-left: 0;
      }
    }
    */
  </style>
`;
