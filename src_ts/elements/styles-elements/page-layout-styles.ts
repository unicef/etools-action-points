// This file will be dedicated to page layout and related layout elements

import {html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

export const pageLayoutStyles = html`
  <style include="iron-flex">
    app-header {
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: var(--primary-background-color);
      z-index: 1;
    }

    app-drawer {
      z-index: 1;
    }

    .page {
      @apply --layout-horizontal;
      @apply --layout-wrap;
      padding: 25px;
    }

    #pageContent {
      @apply --layout-vertical;
      @apply --layout-flex;
    }

    #sidebar {
      @apply --layout-flex-3;
      padding-left: 25px;
    }

    <!-- what is this stuff? -->

    app-header-layout {
      min-height: calc(100% + 100px);
    }

    @media only screen and (max-width: 1359px)  {
      #sidebar {
        width: 100% !important;
        padding-left: 0 !important;
        margin-bottom: 24px !important;
      }
      #main {
        flex-direction: column-reverse !important;
      }
    }

    @media only screen and (min-width: 1360px)  {
      #pageContent {
        @apply --layout-flex;
      }
    }
   /* -------------------*/

    [hidden] {
      display: none;
    }

    #main {
      @apply --layout-horizontal;
      @apply --layout-wrap;
      padding: 24px;
    }

    #pageContent {
      width: 100%;
    }

    #sidebar {
      @apply --layout;
      width: 224px;
      padding-left: 24px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    @media print {
      #main {
        padding: 0;
      }
    }
  </style>
`;
