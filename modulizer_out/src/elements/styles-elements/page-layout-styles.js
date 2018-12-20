// This file will be dedicated to page layout and related layout elements

import {html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';

export const pageLayoutStyles = html`
  <style>
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

    #pages {
      padding-top: 60px;
      min-height: calc(100vh - 160px);
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
  </style>
`;
