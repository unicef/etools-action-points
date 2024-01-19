const documentContainer = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {
        --sl-font-mono: Roboto, Noto, sans-serif;
        --sl-font-sans: Roboto, Noto, sans-serif;
        --sl-font-serif: Roboto, Noto, sans-serif;
        
        --primary-color: #0099ff;
        --primary-background-color: white;
        --secondary-text-color: rgba(0, 0, 0, 0.54);
        --secondary-background-color: var(--paper-indigo-700);
        --ternary-background-color: var(--paper-indigo-800);
        --accent-color: var(--paper-light-blue-a200);
        --error-color: #ea4022;
        --dark-primary-text-color: rgba(0, 0, 0, 0.87);
        --light-primary-text-color: rgba(255, 255, 255, 1);
        --dark-secondary-text-color: rgba(0, 0, 0, 0.54);
        --light-secondary-text-color: rgba(255, 255, 255, 0.7);
        --dark-disabled-text-color: rgba(0, 0, 0, 0.38);
        --light-disabled-text-color: rgba(255, 255, 255, 0.5);
        --dark-icon-color: rgba(0, 0, 0, 0.54);
        --light-icon-color: rgba(255, 255, 255, 1);
        --dark-disabled-icon-color: rgba(0, 0, 0, 0.38);
        --light-disabled-icon-color: rgba(255, 255, 255, 0.5);
        --dark-divider-color: rgba(0, 0, 0, 0.12);
        --light-divider-color: rgba(255, 255, 255, 0.12);
        --dark-hover-color: rgba(0, 0, 0, 0.01);
        --light-hover-color: rgba(255, 255, 255, 0.01);
        --dark-ink-color: rgba(0, 0, 0, 0.3);
        --light-ink-color: rgba(255, 255, 255, 0.30);
        --light-theme-background-color: var(--paper-grey-50);
        --light-theme-content-color: #FFFFFF;
        --dark-theme-background-color: #233944;
        --primary-text-color: rgba(0, 0, 0, 0.87);
        --default-btn-bg-color: rgba(0, 0, 0, 0.45);
        --error-box-heading-color: var(--error-color);
        --error-box-bg-color: #f2dede;
        --error-box-border-color: #ebccd1;
        --error-box-text-color: var(--error-color);
        --primary-color-hover: #027ac9;
        --default-btn-bg-hover-color: rgba(0, 0, 0, 0.55);
        --error-hover-color: #d1391e;


        --nonprod-header-color: #a94442;
        --nonprod-text-warn-color: #e6e600;
        --header-bg-color: var(--dark-theme-background-color);

        --partnership-management-color: var(--primary-background-color);
        --work-planning-color: var(--paper-light-green-500);
        --field-monitering-color: var(--paper-green-500);

        --title-toolbar-secondary-text-color : #C7CED2;

        --toolbar-height: 60px;
        --side-bar-scrolling: hidden;

        --esmm-external-wrapper: {
            width: 100%;
            margin: 0;
        };

        /* etools-action-button styles*/
        /*--etools-action-button-main-color: var(--primary-color);*/
        /*--etools-action-button-text-color: var(--light-primary-text-color);*/
        /*--etools-action-button-dropdown-higlight-bg: var(--list-second-bg-color);*/
        /*--etools-action-button-divider-color: var(--light-divider-color);*/
        
        /*!* etools-status styles *!*/
        --etools-status-divider-color: var(--dark-divider-color);
        /*--etools-status-icon-inactive-color: var(--medium-icon-color);*/
        /*--etools-status-icon-pending-color: var(--primary-color);*/
        /*--etools-status-icon-completed-color: var(--success-color);*/
        /*--etools-status-icon-text-color: var(--light-primary-text-color);*/
        /*--etools-status-text-color: var(--medium-primary-text-color);*/
        /*--etools-status-inactive-text-color: var(--primary-text-color);*/

           /* sl-tooltip styles */
        --sl-tooltip-background-color: rgba(97, 97, 97, 0.9);
      
        /* etools-dialog styles */
        --etools-dialog-primary-color: #ffffff;
        --etools-dialog-contrast-text-color: var(--primary-text-color);
        --epd-profile-dialog-border-b: solid 1px var(--dark-divider-color);
      
        /* global loading box content */
        --etools-loading-border-color: rgba(255, 255, 255, 0.12);
        --etools-loading-shadow-color: #333333;
      
        --required-star-style: {
          background: url('./assets/images/required.svg') no-repeat 99% 20%/8px;
          width: auto !important;
          max-width: 100%;
          right: auto;
          padding-inline-end: 15px;
        }
      }
    </style>
  </custom-style>
`;

// @ts-ignore
document.head.appendChild(documentContainer.content);
