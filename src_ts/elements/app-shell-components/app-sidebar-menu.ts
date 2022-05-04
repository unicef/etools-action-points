import {customElement, html, LitElement, property} from 'lit-element';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/app-layout/app-layout.js';
import './side-bar-item';
import {moduleStyles} from '../styles/module-styles-lit';
import {navMenuStyles} from '../styles/nav-menu-styles';
import {apdIcons} from '../styles/apd-icons';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';

/**
 * @polymer
 * @customElement
 */
@customElement('app-sidebar-menu')
export class AppSidebarMenu extends MatomoMixin(LitElement) {
  static get styles() {
    return [navMenuStyles];
  }

  public render() {
    return html`
      ${moduleStyles} ${apdIcons}
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: 0 0 3px -1px #000;
        }

        .menu-header {
          justify-content: space-between;
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
          display: flex;
          flex-direction: column;
          background: #fff;
          padding-top: 8px;
          margin-bottom: 18px;
          width: 100%;
          overflow: hidden;
        }

        .nav-menu,
        .nav-menu iron-selector[role='navigation'] {
          flex: 1;
        }

        .secondary-header {
          color: var(--primary-text-color);
          height: 48px;
          line-height: 49px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }

        app-toolbar {
          padding: 0;
        }

        [small-menu][main-title] {
          display: none;
        }
      </style>

      <div class="menu-header">
        <span id="app-name" main-title>Action Points</span>

        <span class="ripple-wrapper main menu-header">
          <iron-icon id="menu-header-top-icon" icon="flag" @tap="${() => this._toggleSmallMenu()}"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <paper-tooltip for="menu-header-top-icon" position="right"> Action Points </paper-tooltip>

        <span class="chev-right">
          <iron-icon id="expand-menu" icon="chevron-right" @tap="${() => this._toggleSmallMenu()}"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <span class="ripple-wrapper">
          <iron-icon id="minimize-menu" icon="chevron-left" @tap="${() => this._toggleSmallMenu()}"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>
      </div>

      <div class="nav-menu">
        <iron-selector selected="action-points" attr-for-selected="view" selectable="side-bar-item" role="navigation">
          <side-bar-item
            view="action-points"
            name="Action Points"
            icon="av:playlist-add-check"
            side-bar-link="action-points/list?reload=true"
          >
          </side-bar-item>
        </iron-selector>

        <div class="secondary-header nav-menu-item section-title">eTools Community Channels</div>

        <side-bar-item
          class="lighter-item no-transform"
          name="Implementation Intelligence"
          icon="apd-icons:power-bi"
          @tap="${this.trackAnalytics}"
          tracker="Implementation Intelligence"
          side-bar-link="https://app.powerbi.com/groups/me/apps/2c83563f-d6fc-4ade-9c10-bbca57ed1ece/reports/9726e9e7-c72f-4153-9fd2-7b418a1e426c/ReportSection?ctid=77410195-14e1-4fb8-904b-ab1892023667"
          external
        >
        </side-bar-item>

        <side-bar-item
          class="lighter-item"
          name="Knowledge Base"
          @tap="${this.trackAnalytics}"
          tracker="Knowledge Base"
          icon="maps:local-library"
          side-bar-link="http://etools.zendesk.com"
          external
        >
        </side-bar-item>

        <side-bar-item
          class="lighter-item"
          name="Discussion"
          icon="icons:question-answer"
          @tap="${this.trackAnalytics}"
          tracker="Discussion"
          external
          side-bar-link="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
        >
        </side-bar-item>

        <side-bar-item
          class="lighter-item"
          name="Information"
          icon="icons:info"
          @tap="${this.trackAnalytics}"
          tracker="Information"
          external
          side-bar-link="/landing/"
        >
        </side-bar-item>
      </div>
    `;
  }

  @property({type: String})
  page: string;

  _smallMenu = false;
  @property({type: Boolean, reflect: true})
  get smallMenu() {
    return this._smallMenu;
  }

  set smallMenu(newVal) {
    this._smallMenu = newVal;
    this.dispatchEvent(
      new CustomEvent('resize-main-layout', {
        bubbles: true,
        composed: true
      })
    );
  }

  _toggleSmallMenu() {
    this.smallMenu = !this.smallMenu;
    this.dispatchEvent(
      new CustomEvent('toggle-small-menu', {
        bubbles: true,
        composed: true
      })
    );
  }
}
