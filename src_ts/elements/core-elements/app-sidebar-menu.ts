import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-selector/iron-selector';
import '@polymer/iron-icons/maps-icons';
import '@polymer/app-layout/app-layout';
import './side-bar-item';
import EndpointMixin from '../app-mixins/endpoint-mixin';
import {moduleStyles} from '../styles-elements/module-styles';
import {navMenuStyles} from '../styles-elements/nav-menu-styles';

/**
 * @polymer
 * @customElement
 */
class AppSidebarMenu extends EndpointMixin(PolymerElement) {
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
          }
        
        [small-menu][main-title] {
          display: none;
        }
      </style>

      <div class="menu-header">
        <span id="app-name" small-menu="[[smallMenu]]" main-title>Action Points</span>

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

      <div class="nav-menu" small-menu$="[[smallMenu]]">
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

        <div class="secondary-header nav-menu-item section-title" small-menu$="[[smallMenu]]">
          eTools Community Channels
        </div>

        <side-bar-item class="lighter-item" name="Knowledge Base" icon="maps:local-library" 
                       side-bar-link="http://etools.zendesk.com" external>
        </side-bar-item>

        <side-bar-item class="lighter-item" name="Discussion" icon="icons:question-answer" external 
                       side-bar-link="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560">
        </side-bar-item>

        <side-bar-item class="lighter-item" name="Information" icon="icons:info" external 
                       side-bar-link="/landing/">
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

  _menuSizeChange() {
    this.dispatchEvent(new CustomEvent('resize-main-layout', {
      bubbles: true,
      composed: true
    }));
  }

  _toggleSmallMenu(e: CustomEvent) {
    e.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent('toggle-small-menu', {
      bubbles: true,
      composed: true
    }));
  }
}

window.customElements.define('app-sidebar-menu', AppSidebarMenu);
