import {html} from 'lit';
import {basePath} from '../../config/config';

export const tabInputsStyles = html`
  <style>
    *[hidden] {
      display: none !important;
    }
    etools-icon-button[hidden] {
      display: inline-block !important;
      visibility: hidden;
    }
    .group:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }
    .input-container {
      position: relative;
      float: left;
      margin-right: 0;
      width: 33.33%;
    }
    .input-container:last-of-type {
      margin-right: 0;
    }
    .input-container.input-container-s {
      width: 30%;
    }
    .input-container.input-container-40 {
      width: 35%;
    }
    .input-container.input-container-m {
      width: 66.66%;
    }
    .input-container.input-container-45 {
      width: 45%;
    }
    .input-container.input-container-ms {
      width: 50%;
    }
    .input-container.input-container-l {
      width: 100%;
    }
    .input-container.input-checkbox-container {
      height: 62px;
      line-height: 62px;
      padding: 12px 12px 0 12px;
      box-sizing: border-box;
    }
    .row-h {
      margin-bottom: 8px;
    }
    .edit-icon {
      padding: 5px;
      width: 33px;
      height: 33px;
      color: var(--gray-mid);
    }
    .edit-icon-slot {
      overflow: visible !important;
      display: flex;
      align-items: center;
      height: 100%;
    }
    .header-content {
      padding: 8px 12px 0;
    }
    .static-text {
      padding: 8px 12px;
    }

    etools-dropdown,
    etools-dropdown-multi,
    etools-input,
    etools-textarea,
    paper-dropdown-menu,
    datepicker-lite,
    etools-currency-amount-input {
      box-sizing: border-box;
      padding: 0 12px;
      outline: none !important;

      --paper-input-container-input-color: var(--gray-dark, rgba(0, 0, 0, 0.87));

      --paper-input-container-input: {
        font-size: 15px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 3px;
      }

      --paper-input-container-label: {
        color: var(--gray-50);
      }
      --paper-input-container-label-floating: {
        color: var(--gray-50);
      }
      --paper-input-container-invalid-color: var(--module-error);

      --paper-input-container-disabled: {
        color: var(--gray-light);
        opacity: 1;
      }
      --paper-input-char-counter: {
        color: var(--gray-light);
      }

      --paper-input-prefix: {
        margin-right: 10px;
        color: var(--gray-mid);
      }

      --paper-input-error: {
        overflow: hidden;
      }

      --etools-currency-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: 12px;
      }
    }

    etools-textarea {
      --paper-input-container-input: {
        white-space: normal;
        display: block !important;
      }

      --iron-autogrow-textarea-placeholder: {
        color: var(--gray-20) !important;
      }
      --iron-autogrow-textarea: {
        overflow: hidden;
        padding: 0;
      }
    }

    etools-dropdown.no-data-fetched,
    etools-dropdown-multi.no-data-fetched,
    etools-input.no-data-fetched {
      --esmm-placeholder-color: var(--gray-dark);
      --paper-input-container-color: var(--gray-dark);
    }

    etools-dropdown-multi.required:not([disabled]),
    etools-dropdown.required:not([disabled]),
    etools-currency-amount-input.required:not([disabled]),
    paper-dropdown-menu.required:not([disabled]),
    etools-textarea.required:not([disabled]),
    etools-input.required:not([disabled]),
    datepicker-lite.required:not([disabled]) {
      --paper-input-container-label: {
        background: url('${basePath}images/required.svg') no-repeat 98% 14%/7px;
        width: auto !important;
        max-width: 90%;
        right: auto;
        padding-right: 15px;
        color: var(--gray-50);
      }
    }

    etools-dropdown-multi.bold,
    etools-dropdown.bold,
    etools-input.bold {
      --paper-input-container-input: {font-weight: 500};
      --paper-input-container-underline-focus: {display: none} !important;
      --paper-input-container-underline-disabled: {display: none} !important;
      --paper-input-container-underline: {display: none} !important;
    }
    etools-dropdown-multi.deleted,
    etools-dropdown.deleted,
    etools-input.deleted {
      --paper-input-container-input: {color: #b0b0b0};
    }

    etools-dropdown.readonly,
    etools-dropdown-multi.readonly,
    etools-currency-amount-input.readonly,
    etools-input.readonly,
    paper-dropdown-menu.readonly,
    etools-textarea.readonly {
      --paper-input-container-underline: {display: none} !important;
    }

    #bottom-actions {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
      -ms-flex-pack: end;
      -webkit-justify-content: flex-end;
      justify-content: flex-end;
      overflow: visible;
    }
    .repeatable-item-container {
      position: relative;
      display: block;
      min-width: 500px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 8% !important;
    }
    .repeatable-item-container .form-title {
      position: relative;
      line-height: 40px;
      color: var(--module-primary);
      font-weight: 600;
      box-sizing: border-box;
      margin: 0 12px 15px !important;
      padding: 0 !important;
    }
    .repeatable-item-container .text {
      background-color: var(--gray-06);
      border-radius: 3px;
      padding: 9px 24px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .whithout-actions {
      padding: 0 !important;
    }
    [without-line] {
      padding: 0 12px !important;
    }
    [without-line] .repeatable-item-content {
      border-left: none;
      margin-left: 0;
      padding-left: 0;
    }
    .repeatable-item-actions {
      display: flex;
      position: absolute;
      top: 0;
      left: 8px;
      width: 8%;
      height: 100%;
    }
    .repeatable-item-actions .actions {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: column;
      -webkit-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -ms-flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
    }
    .repeatable-item-actions .actions .action {
      width: 36px;
      height: 36px;
    }
    .repeatable-item-actions .actions .action.delete {
      color: #ea4022;
    }
    .repeatable-item-actions .actions .action.add {
      color: var(--module-primary);
    }
    .repeatable-item-actions .actions .action[disabled] {
      color: var(--gray-light);
    }
    .repeatable-item-content {
      position: relative;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
      padding-left: 20px;
      padding-bottom: 8px;
      border-left: 1px solid var(--gray-border);
      width: 100%;
      box-sizing: border-box;
    }
    .repeatable-item-content .staff-check-box {
      margin-top: 10px;
    }
    .repeatable-item-content .repeatable-item-index {
      position: absolute;
      top: -5px;
      left: -15px;
      width: 30px;
      height: 30px;
      background-color: #fff;
    }
    .repeatable-item-content .repeatable-item-index .item-index {
      margin: 4px;
      width: 22px;
      height: 22px;
      line-height: 22px;
      border-radius: 50%;
      background-color: var(--gray-light);
      text-align: center;
      color: #fff;
      font-size: 13px;
    }
    etools-checkable-input {
      --etools-checkable-input-label: {
        font-size: 16px;
        font-weight: 400;
        line-height: 21px;
      }
    }
    etools-currency-amount-input {
      padding: 0 12px;
      box-sizing: border-box;
    }
    etools-content-panel:not([list])::part(ecp-content) {
      padding: 8px 12px;
    }
    etools-currency-amount-input {
      --etools-currency-container-input: {line-height: 0};
    }

    etools-dropdown-multi[disabled],
    etools-currency-amount-input[disabled],
    etools-dropdown[disabled],
    etools-textarea[disabled],
    paper-dropdown-menu[disabled],
    etools-input[disabled],
    datepicker-lite[disabled] {
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: 1px dashed var(--gray-20, rgba(0, 0, 0, 0.2));
        display: block !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
    }

    etools-dropdown-multi[readonly],
    etools-currency-amount-input[readonly],
    etools-dropdown[readonly],
    etools-textarea[readonly],
    paper-dropdown-menu[readonly],
    etools-input[readonly],
    datepicker-lite[readonly] {
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: none !important;
        display: none !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
      --paper-input-container-underline-disabled: {
        display: none;
      }
    }
  </style>
`;
