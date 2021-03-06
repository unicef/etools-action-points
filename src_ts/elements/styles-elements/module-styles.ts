import {html} from '@polymer/polymer';

export const moduleStyles = html`
  <style>
    :host {
      --gray-06: rgba(0, 0, 0, .06);
      --gray-08: rgba(0, 0, 0, .08);
      --gray-lighter: rgba(0, 0, 0, .12);
      --gray-20: rgba(0, 0, 0, .20);
      --gray-28: rgba(0, 0, 0, .28);
      --gray-light: rgba(0, 0, 0, .38);
      --gray-50: rgba(0, 0, 0, .50);
      --gray-mid: rgba(0, 0, 0, .54);
      --gray-mid-dark: rgba(0, 0, 0, .70);
      --gray-dark: rgba(0, 0, 0, .87);
      --gray-darkest: #000;
      --gray-border: rgba(0, 0, 0, .15);
    /*--module-primary: #00AEEF;
    */
      --module-primary: #09f;
      --module-color: #00b8d4;
    /*--module-primary-dark: #4893ff;
    */
      --module-sec-blue: #0061e9;
      --module-sec-green: #009a54;
      --module-sec-lightgreen: #72c300;
      --module-sec-gray: #233944;
      --module-error: #ea4022;
      --module-error-2: #f1b8ae;
      --module-warning: #ff9044;
      --module-warning-2: #ffc8a2;
      --module-success: #72c300;
      --module-success-2: #bef078;
      --module-info: #cebc06;
      --module-info-2: #fff176;
      --module-planned: rgba(250, 237, 119, .6);
      --module-approved: rgba(141, 198, 63, .45);
      --module-submitted: rgba(206, 188, 6, .6);
      --module-sent: rgba(30, 134, 191, .45);
      --module-completed: rgba(141, 198, 63, 1);
    }
    *[hidden] {
      display: none;
    }
    .readonly {
      pointer-events: none;
    }
    pages-header-element {
      box-shadow: 1px -3px 9px 0 #000;
    }
    /* TABS */
    paper-tabs {
      --paper-tabs-selection-bar-color: var(--module-primary);
    }
    paper-tab {
      --paper-tab-content: {
        color: var(--module-primary);
        text-transform: none;
        font-size: 14px;
        font-weight: 500;
        width: 140px;
      };
      --paper-tab-content-unselected: {
        color: var(--gray-mid);
      };
    }
    /* PAPER-TOGGLE-BUTTON */
    paper-toggle-button {
      --paper-toggle-button-checked-button-color: var(--module-primary);
      --paper-toggle-button-checked-bar-color: rgba(0, 174, 239, .5);
      --paper-toggle-button-unchecked-button-color: rgba(241, 241, 241, 1);
      --paper-toggle-button-unchecked-bar-color: rgba(31, 31, 31, .26);
    }
    /* CHECKBOX */
    paper-checkbox {
      --paper-checkbox-unchecked-color: var(--gray-mid);
      --paper-checkbox-checked-color: var(--module-primary);
      --paper-checkbox-label: {
        font-size: 17px;
        padding-left: 15px;
      };
      --paper-checkbox-margin: 0;
      --paper-checkbox-label-color: var(--gray-mid);
    }
    paper-radio-button {
      --paper-radio-button-unchecked-color: var(--gray-mid);
      --paper-radio-button-checked-color: var(--module-primary);
    }
    etools-data-table-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.26);
    }
    etools-data-table-row {
      --list-divider-color: #e0e0e0;
    }
    etools-dialog[no-padding] {
      --etools-dialog-scrollable: {padding-top: 0 !important};
    }
    etools-dialog {
      --etools-dialog-primary-color: var(--module-primary);
      --etools-dialog-scrollable: {
        margin-top: 0;
        padding-top: 12px; !important;
      }
      --etools-dialog-content: {
        min-height: 80px;
        padding-bottom: 8px !important;
      }
      --etools-dialog-button-styles: {margin-top: 0;};
    }
    etools-dialog > etools-loading {
      margin-bottom: -56px;
    }
    etools-content-panel {
      position: relative;
      --ecp-header-title: {line-height: 48px};
      --ecp-expand-btn: {
        position: absolute;
        top: 3px;
        left: 13px;
        width: 45px;
        height: 45px;
      }
      --ecp-header-title: {
        font-weight: 500;
        line-height: 48px;
        padding: 0 30px;
      }
      --ecp-header-btns-wrapper: {opacity: 1};
    }
    div[slot="panel-btns"] {
      position: absolute;
      top: 4px;
      right: 16px;
    }
    div[slot="panel-btns"] .panel-button {
      opacity: 0.7;
    }
    div[slot="panel-btns"] .panel-button:hover {
      opacity: 0.87;
    }
    .pr-25 {
      padding-right: 25px !important;
    }
    .pr-45 {
      padding-right: 45px !important;
    }
    .f1 {
      flex: 1;
    }
    .f2 {
      flex: 2;
    }
    .f3 {
      flex: 3;
    }
    .f4 {
      flex: 4;
    }
    .f5 {
      flex: 5;
    }
    .f6 {
      flex: 6;
    }
    .f7 {
      flex: 7;
    }
    .f8 {
      flex: 8;
    }
    .w4 {
      width: 4%;
    }
    .w5 {
      width: 5%;
    }
    .w7 {
      width: 7%;
    }
    .w8 {
      width: 8%;
    }
    .w9 {
      width: 9%;
    }
    .w10 {
      width: 10%;
    }
    .w13 {
      width: 13%;
    }
    .w14 {
      width: 14%;
    }
    .w15 {
      width: 15%;
    }
    .w16 {
      width: 16%;
    }
    .w17 {
      width: 17%;
    }
    .w18 {
      width: 18%;
    }
    .w20 {
      width: 20%;
    }
    .w25 {
      width: 25%;
    }
    .w30 {
      width: 30%;
    }
    .w35 {
      width: 35%;
    }
    .w45 {
      width: 45%;
    }
    .w40 {
      width: 40%;
    }
    .w50 {
      width: 50%;
    }
    .w60 {
      width: 60%;
    }
    .w65 {
      width: 65%;
    }
    .w70 {
      width: 70%;
    }
    .w75 {
      width: 75%;
    }
    .w80 {
      width: 80%;
    }
    .w90 {
      width: 90%;
    }
    .w95 {
      width: 95%;
    }
    .w96 {
      width: 96%;
    }
    .w100 {
      width: 100%;
    }
    .w30px {
      width: 30px;
    }
    .w35px {
      width: 35px;
    }
    .w40px {
      width: 40px;
    }
    .w45px {
      width: 45px;
    }
    .w50px {
      width: 50px;
    }
    .w60px {
      width: 60px;
    }
    .w80px {
      width: 80px;
    }
    .w100px {
      width: 100px;
    }
    .w120px {
      width: 120px;
    }
    .w130px {
      width: 130px;
    }
    .w140px {
      width: 140px;
    }
    .w150px {
      width: 150px;
    }
    .w160px {
      width: 160px;
    }
    .w180px {
      width: 180px;
    }
    .w200px {
      width: 200px;
    }
  </style>
`;
