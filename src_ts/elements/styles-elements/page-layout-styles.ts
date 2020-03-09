// This file will be dedicated to page layout and related layout elements

import {html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

export const pageLayoutStyles = html`
  <style include="iron-flex">
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
