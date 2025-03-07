import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import './side-bar-item';
import {moduleStyles} from '../styles/module-styles';
import {navMenuStyles} from '../styles/nav-menu-styles';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../config/config';

/**
 * @customElement
 */
@customElement('app-sidebar-menu')
export class AppSidebarMenu extends MatomoMixin(LitElement) {
  static get styles() {
    return [navMenuStyles];
  }

  public render() {
    return html`
      ${moduleStyles}
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
          font-size: var(--etools-font-size-14, 14px);
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
        .nav-menu side-bar-item[role='navigation'] {
          flex: 1;
        }

        .secondary-header {
          color: var(--primary-text-color);
          height: 48px;
          line-height: 49px;
          text-align: center;
          font-size: var(--etools-font-size-13, 13px);
          font-weight: 500;
        }

        app-toolbar {
          padding: 0;
        }

        :host([small-menu]) [main-title] {
          display: none;
        }
      </style>

      <div class="menu-header">
        <span id="app-name" main-title>Action Points</span>

        <sl-tooltip for="menu-header-top-icon" placement="right" content="Action Points">
          <span class="ripple-wrapper main menu-header">
            <etools-icon id="menu-header-top-icon" name="flag" @click="${this._toggleSmallMenu}"></etools-icon>
          </span>
        </sl-tooltip>

        <span class="chev-right">
          <etools-icon id="expand-menu" name="chevron-right" @click="${this._toggleSmallMenu}"></etools-icon>
        </span>

        <span class="ripple-wrapper">
          <etools-icon id="minimize-menu" name="chevron-left" @click="${this._toggleSmallMenu}"></etools-icon>
        </span>
      </div>

      <div class="nav-menu">
        <side-bar-item
          role="navigation"
          view="action-points"
          name="Action Points"
          ?disabled="${!this.smallMenu}"
          icon="av:playlist-add-check"
          side-bar-link="action-points/list"
          selected="${this.page === 'action-points'}"
        >
        </side-bar-item>
        <div class="secondary-header nav-menu-item section-title">eTools Community Channels</div>

        <side-bar-item
          class="lighter-item"
          name="Knowledge Base"
          ?disabled="${!this.smallMenu}"
          @click="${this.trackAnalytics}"
          tracker="Knowledge Base"
          icon="maps:local-library"
          side-bar-link="http://etools.zendesk.com"
          external
        >
        </side-bar-item>

        <side-bar-item
          class="lighter-item"
          name="Discussion"
          icon="question-answer"
          ?disabled="${!this.smallMenu}"
          @click="${this.trackAnalytics}"
          tracker="Discussion"
          external
          side-bar-link="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
        >
        </side-bar-item>

        <side-bar-item
          class="lighter-item"
          name="Information"
          icon="info"
          ?disabled="${!this.smallMenu}"
          @click="${this.trackAnalytics}"
          tracker="Information"
          external
          side-bar-link="/landing/"
        >
        </side-bar-item>
      </div>
    `;
  }

  @property({type: String})
  page?: string = '';

  @property({type: Boolean, reflect: true, attribute: 'small-menu'})
  smallMenu = false;

  updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('smallMenu')) {
      this._smallMenuChanged();
    }
  }

  _toggleSmallMenu() {
    this.smallMenu = !this.smallMenu;
    const localStorageVal: number = this.smallMenu ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
    fireEvent(this, 'toggle-small-menu', {value: this.smallMenu});
  }

  _smallMenuChanged() {
    setTimeout(() => fireEvent(this, 'resize-main-layout'));
  }
}
