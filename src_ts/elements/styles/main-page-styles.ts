import {html} from 'lit-element';
import {moduleStyles} from './module-styles';

export const mainPageStyles = html`
  ${moduleStyles}
  <style>
    :host {
      position: relative;
      display: block;
      --paper-tab-content-unselected: {
        color: var(--gray-light);
      }
      --ecp-header-bg: var(--module-primary);
    }
    :host .view-container {
      position: relative;
      width: 100%;
      display: flex;
      padding: 25px 265px 25px 25px;
      box-sizing: border-box;
    }
    :host .tab-selector {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
      -ms-flex-pack: start;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      margin-top: -13px;
      padding-left: 22px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 1px -3px 9px 0 #000;
    }
    :host .tab-selector paper-tabs {
      color: var(--module-primary);
      font-size: 14px;
      font-weight: bold;
    }
    :host .tab-selector paper-tabs span {
      text-transform: uppercase;
    }
    :host .tab-selector .tab-content {
      padding: 0 13px;
    }
    :host #pageContent {
      position: relative;
      width: 100%;
    }
    :host .submitted-message {
      position: relative;
      width: 100%;
      height: 48px;
      text-align: center;
      line-height: 48px;
      background-color: var(--gray-08);
      color: var(--gray-28);
      font-size: 14px;
      font-weight: 600;
    }
    etools-content-panel.cancellation-tab::part(ecp-header-title) {
      font-weight: 500;
      line-height: 51px;
    }
    etools-content-panel.cancellation-tab::part(ecp-content) {
      padding-left: 100px;
    }
    etools-content-panel.cancellation-tab::part(ecp-header-title) {
      font-weight: 500;
      line-height: 51px;
    }
    etools-content-panel.cancellation-tab::part(ecp-header-btns-wrapper) {
      opacity: 1;
    }
    etools-content-panel.cancellation-tab {
      margin-bottom: 20px;
      --epc-toolbar: {
        height: 4px;
        padding: 2px;
        background-color: var(--module-warning);
      }
    }
    etools-content-panel.cancellation-tab .cancellation-title {
      font-weight: 500;
      font-size: 19px;
      text-transform: uppercase;
      color: var(--module-warning);
      margin: 15px 0 26px;
      padding-left: 80px;
    }
    etools-content-panel.cancellation-tab .cancellation-text {
      font-size: 17px;
      white-space: pre-wrap;
      color: var(--gray-darkest);
      padding-left: 80px;
    }
    div[slot='panel-btns'].bookmark {
      position: absolute;
      top: 2px;
      right: auto;
      left: 20px;
      color: var(--module-warning);
      -webkit-transform: scale(0.9, 1.5);
      -moz-transform: scale(0.9, 1.5);
      -ms-transform: scale(0.9, 1.5);
      -o-transform: scale(0.9, 1.5);
      transform: scale(0.9, 1.5);
    }
    div[slot='panel-btns'].bookmark iron-icon {
      width: 70px !important;
      height: 70px !important;
    }
    paper-tab {
      margin-right: 10px;
      --paper-tab-content: {
        width: auto;
      }
    }
  </style>
`;
