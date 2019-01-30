import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/app-layout/app-layout.js';
import './side-bar-item.js';
import {moduleStyles} from '../styles-elements/module-styles.js';
import { navMenuStyles } from '../styles-elements/nav-menu-styles.js';

/**
 * @polymer
 * @customElement
 */
class AppSidebarMenu extends APDMixins.AppConfig(PolymerElement) {
  static get template() {
    return html`
      ${navMenuStyles}
      ${moduleStyles}
      <style>
        :host {
          @apply --layout-vertical;
        
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: 0 0 3px -1px #000;
          //outline: 1px solid var(--dark-divider-color);
        }
        .menu-header {
          @apply --layout-horizontal;
          @apply --layout-center;
      
          background-color: var(--module-color);
          color: white;
          min-height: 60px;
          font-size: 14px;
          line-height: 18px;
          text-transform: uppercase;
        }
      
        img {
          width: 55%;
          margin: auto;
          cursor: pointer;
        }
      
        #toggle-drawer {
          height: 100%;
          width: 100%;
          padding: 12px;
        }

        .nav-menu {
          @apply --layout-vertical;
          background: #fff;
          padding-top: 8px;
          margin-bottom: 18px;
          width: 100%;
          overflow: hidden;
        }
      
        .nav-menu,
        .nav-menu iron-selector[role="navigation"] {
          @apply --layout-flex;
        }
      
        .secondary-header {
          color: var(--primary-text-color);
          height: 48px;
          line-height: 49px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }
        
        [small-menu].secondary-header {
          display: none;
        }

          app-toolbar {
            padding: 0;
        
            [main-title] {
              display: none;
            }
          
        
        }
      </style>

      <div class="menu-header">
        <span id="app-name" main-title>Action Points</span>

        <span class="ripple-wrapper main menu-header">
          <iron-icon id="menu-header-top-icon"
                     icon="flag"
                     on-tap="_toggleSmallMenu"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <paper-tooltip for="menu-header-top-icon" position="right">
          Action Points
        </paper-tooltip>

        <span class="ripple-wrapper">
          <iron-icon id="minimize-menu"
                      icon="chevron-left"
                      on-tap="_toggleSmallMenu"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>
      </div>
          
      <!--<app-toolbar class="menu-header">-->
      <!--<iron-icon icon="flag" on-tap="_toggleSmallMenu"></iron-icon>-->
      <!--<img src$="[[getAbsolutePath('images/ap_icon_v2.svg')]]" on-tap="_toggleDrawer">-->
      <!--<div main-title>Action Points</div>-->
      <!--<paper-icon-button id="close-drawer" on-tap="_toggleSmallMenu" icon="icons:chevron-left" drawer-toggle>-->
      <!--</paper-icon-button>-->
      <!--</app-toolbar>-->
          
      <div class="nav-menu" smallMenu$="[[smallMenu]]">
        <iron-selector
                selected="action-points"
                attr-for-selected="view"
                selectable="side-bar-item"
                role="navigation">
          <side-bar-item
                  view="action-points"
                  name="Action Points"
                  icon="av:playlist-add-check"
                  side-bar-link="action-points/list?reload=true">
          </side-bar-item>
        </iron-selector>

        <div class="secondary-header nav-menu-item section-title" small-menu$="[[smallMenu]]">eTools Community Channels</div>

        <side-bar-item class="lighter-item" name="Knowledge Base" icon="maps:local-library" 
                       side-bar-link="http://etools.zendesk.com" external>
        </side-bar-item>

        <side-bar-item class="lighter-item" name="Discussion" icon="icons:question-answer" external 
                       side-bar-link="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560">
        </side-bar-item>

        <side-bar-item class="lighter-item" name="Information" icon="icons:info" external 
                       side-bar-link="http://etoolsinfo.unicef.org">
        </side-bar-item>
      </div>
    `;
  }

  static get properties() {
    return {
      page: String,
      smallMenu: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_menuSizeChange'
      }
    };
  }

  _menuSizeChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.dispatchEvent(new CustomEvent('resize-main-layout', {
        bubbles: true,
        composed: true
      }));
    }
  }

  _toggleSmallMenu(e) {
    e.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent('toggle-small-menu', {
      bubbles: true,
      composed: true
    }));
  }
}

window.customElements.define('app-sidebar-menu', AppSidebarMenu);
