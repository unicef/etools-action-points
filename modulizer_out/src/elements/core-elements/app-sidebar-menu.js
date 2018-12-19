import { PolymerElement, html } from '@polymer/polymer/polymer-element'
import '@polymer/paper-icon-button'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import '@polymer/iron-selector'
import 'side-bar-item.js'
import '@polymer/iron-icons/maps-icons'
import '../styles-elements/module-styles.html'
/**
 * @polymer
 * @customElement
 */
class AppSidebarMenu extends APDMixins.AppConfig(PolymerElement) {
  static get template() {
    return html `
      <style include="module-styles"></style>
      <!-- inject styles './app-sidebar-menu.scss'-->
          
      <app-toolbar class="menu-header">
        <iron-icon icon="flag" on-tap="_toggleDrawer"></iron-icon>
        <!--<img src$="[[getAbsolutePath('images/ap_icon_v2.svg')]]" on-tap="_toggleDrawer">-->
        <div main-title>Action Points</div>
        <paper-icon-button id="close-drawer" on-tap="_toggleDrawer" icon="icons:chevron-left" drawer-toggle></paper-icon-button>
      </app-toolbar>
          
      <div class="nav-menu">
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

        <div class="divider"></div>

        <div class="secondary-header">eTools Community Channels</div>

        <side-bar-item class="lighter-item" name="Knowledge Base" icon="maps:local-library" side-bar-link="http://etools.zendesk.com" external></side-bar-item>

        <side-bar-item class="lighter-item" name="Discussion" icon="icons:question-answer" external side-bar-link="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"></side-bar-item>

        <side-bar-item class="lighter-item" name="Information" icon="icons:info" external side-bar-link="http://etoolsinfo.unicef.org"></side-bar-item>
      </div>
    `;
  }

  static get properties() {
    return {
      page: String
    };
  }

  _toggleDrawer() {
    this.dispatchEvent(new CustomEvent('drawer-toggle-tap', {
      bubbles: true,
      composed: true
    }));
  }
}

window.customElements.define('app-sidebar-menu', AppSidebarMenu);