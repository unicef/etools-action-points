// This file will be dedicated to page layout and related layout elements

import {html} from 'lit-element';

export const pageLayoutStyles = html`
  <style>
    @media only screen and (max-width: 1359px) {
      #sidebar {
        width: 100% !important;
        padding-left: 0 !important;
        margin-bottom: 24px !important;
      }
      #main {
        flex-direction: column-reverse !important;
      }
    }

    @media only screen and (min-width: 1360px) {
      #pageContent {
        flex: 1;
        flex-basis: 0.000000001px;
      }
    }
    /* -------------------*/

    [hidden] {
      display: none;
    }

    #main {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 24px;
    }

    #pageContent {
      width: 100%;
    }

    #sidebar {
      display: flex;
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
