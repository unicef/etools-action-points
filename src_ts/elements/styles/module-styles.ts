import {html} from 'lit';

export const moduleStyles = html`
  <style>
    *[hidden] {
      display: none;
    }

    .readonly {
      pointer-events: none;
    }

    pages-header-element {
      box-shadow: 1px -3px 9px 0 #000;
    }

    /* CHECKBOX */
    etools-checkbox {
      font-size: var(--etools-font-size-16,16px);
    }

    etools-data-table-header {
      border-bottom: 1px solid var(--list-header-divider-color, rgba(0, 0, 0, 0.26));
    }

    etools-dialog[no-padding]::part(ed-scrollable) {
      padding-top: 0 !important;
    }

    etools-dialog::part(ed-scrollable) {
      margin-top: 0;
      padding-top: 12px;
    !important;
    }

    etools-dialog::part(ed-button-styles) {
      margin-top: 0;
    }

    etools-dialog {
      --etools-dialog-primary-color: var(--module-primary);
      --etools-dialog-content: {
        min-height: 80px;
        padding-bottom: 8px !important;
      }
    }

    etools-dialog > etools-loading {
      margin-bottom: -56px;
    }

    etools-content-panel::part(ecp-header-title) {
      font-weight: 500;
      line-height: 48px;
      padding: 0 30px;
    }

    etools-content-panel::part(ecp-toggle-btn) {
      position: absolute;
      top: 3px;
      left: 13px;
      width: 45px;
      height: 45px;
    }

    etools-content-panel {
      position: relative;
    }

    div[slot="panel-btns"] {
      position: absolute;
      top: 4px;
      right: 16px;
      opacity: 1;
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
