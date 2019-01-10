import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/av-icons';
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory';
import 'etools-loading/etools-loading';
import {LoadingMixin} from 'etools-loading/etools-loading-mixin';
import './elements/core-elements/app-main-header/app-main-header.js';
import './elements/core-elements/app-sidebar-menu';
import './elements/common-elements/multi-notifications/multi-notification-list.js';
import './elements/app-mixins/permission-controller.js';
import './elements/core-elements/etools-app-config';
import './elements/app-mixins/user-controller.js';
import './elements/core-elements/side-bar-item';
import './elements/core-elements/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/core-elements/page-footer';
import {pageLayoutStyles} from './elements/styles-elements/page-layout-styles.js';
import {sharedStyles} from './elements/styles-elements/shared-styles.js';
import {appTheme} from './elements/styles-elements/app-theme.js';
import 'web-animations-js/web-animations-next-lite.min.js';

class AppShell extends EtoolsMixinFactory.combineMixins([
  APDMixins.AppConfig,
  APDMixins.UserController,
  LoadingMixin
], PolymerElement) {

  static get template() {
    return html `
      <style>
        ${appTheme}
        ${pageLayoutStyles}
        ${sharedStyles}
        :host {
          display: block;
        }
              
        app-drawer {
          visibility: visible;
          right: auto;
          z-index: 65 !important;
            
          --app-drawer-width: 220px;
          --app-drawer-content-container: {
            transform: translate3d(0, 0, 0);
            background-color: var(--light-theme-content-color);
          };
        }
                
        #layout {
          padding-left: 220px;
          height: calc(100vh - 120px);
        }
                
        app-header {
          padding-left: 220px;
          z-index: 60 !important;
        }
            
        app-header {
          background-color: var(--header-bg-color);
        }
      </style>

      <static-data></static-data>

      <app-location route="{{route}}"></app-location>

      <app-route
              route="{{route}}"
              pattern="[[basePath]]:page"
              data="{{routeData}}">
      </app-route>
      <app-route
              route="{{route}}"
              pattern="[[basePath]]"
              tail="{{actionPointsRoute}}">
      </app-route>

      <etools-loading id="global-loading" absolute></etools-loading>

      <div id="layout">
        <!-- Drawer content -->
        <app-drawer slot="drawer" id="drawer" transition-duration="350" disable-swipe opened>
          <app-sidebar-menu class="opened" route="{{route}}" page="[[page]]"></app-sidebar-menu>
        </app-drawer>

        <!-- Main content -->

        <app-header id="header" fixed shadow>
          <app-main-header user="[[user]]"></app-main-header>
        </app-header>

        <iron-pages
                id="pages"
                selected="[[page]]"
                attr-for-selected="name"
                fallback-selection="not-found"
                role="main">
          <action-points-page-main name="action-points" id="action-points" route="{{actionPointsRoute}}">
          </action-points-page-main>
          <not-found-page-view name="not-found" id="not-found"></not-found-page-view>
        </iron-pages>
        
        <multi-notification-list></multi-notification-list>
        <page-footer></page-footer>
      </div>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      narrow: {
        type: Boolean,
        reflectToAttribute: true
      },
      _toast: {
        type: Object,
        value: null
      },
      _toastQueue: {
        type: Array,
        value: () => {
          return [];
        }
      },
      globalLoadingQueue: {
        type: Array,
        value: () => {
          return [];
        }
      },
      user: {
        type: Object,
        value: () => {
          return {};
        }
      },
      route: {
        type: Object,
        notify: true
      },
      queryParams: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(route.path)'
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('toast', (e, detail) => this.queueToast(e, detail));
    this.addEventListener('drawer-toggle-tap', e => this.toggleDrawer(e));
    this.addEventListener('404', e => this._pageNotFound(e));
    this.addEventListener('static-data-loaded', e => this._staticDataLoaded(e));
    this.addEventListener('global-loading', e => this.handleLoading(e));
    this._setBgColor();
  }

  connectedCallback() {
    super.connectedCallback();
    let eventData = {
      message: 'Loading...',
      active: true,
      type: 'initialisation'
    };
    // this.dispatchEvent(new CustomEvent('global-loading', {
    //   detail: eventData
    // }));
    // this.$.drawer.$.scrim.remove();
  }

  toggleDrawer() {
    let isClosed = !this.$.drawer.opened;
    let drawerWidth;

    if (isClosed) {
      drawerWidth = '220px';
    } else {
      drawerWidth = '70px';
    }

    this.$.drawer.updateStyles({
      '--app-drawer-width': drawerWidth
    });

    this.$.layout.style.paddingLeft = drawerWidth;
    this.$.header.style.paddingLeft = drawerWidth;

    this.$.drawer.querySelector('app-sidebar-menu').classList.toggle('opened', isClosed);
    this.$.drawer.toggleClass('opened', isClosed);
    this.$.drawer.toggleAttribute('opened', isClosed);
  }

  _staticDataLoaded(e) {
    if (e && e.type === 'static-data-loaded') {
      this.staticDataLoaded = true;
    }
    if (this.staticDataLoaded) {
      this.user = this.getUserData();
      this.page = _.get(this, 'routeData.page') || this._initRoute();
    }
  }

  queueToast(e) {
    let detail = e.detail;
    let notificationList = this.shadowRoot.querySelector('multi-notification-list');
    if (!notificationList) {
      return;
    }

    if (detail && detail.reset) {
      notificationList.dispatchEvent(new CustomEvent('reset-notifications'));
    } else {
      notificationList.dispatchEvent(new CustomEvent('notification-push', {
        detail: detail
      }));
    }
  }

  _routePageChanged() {
    if (!this.initLoadingComplete || !this.routeData.page) {
      return;
    }
    this.page = this.routeData.page || 'action-points';
    this.scroll(0, 0);
  }

  _pageChanged(page) {
    if (this.$[`${page}`] instanceof PolymerElement) {
      return;
    }
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        message: 'Loading...',
        active: true,
        type: 'initialisation'
      }
    }));

    // var resolvedPageUrl;
    // if (page === 'not-found') {
    //   resolvedPageUrl = 'elements/pages/not-found-page-view.js';
    // } else {
    //   resolvedPageUrl =
    //     `elements/pages/${page}-page-components/${page}-page-main.js`;
    // }
    // import(resolvedPageUrl).then(() => this._loadPage(), event => this._pageNotFound(event));
  }

  _loadPage() {
    if (!this.initLoadingComplete) {
      this.initLoadingComplete = true;
    }
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'initialisation'
      }
    }));
    // if (this.route.path === '/') { this._initRoute();}
  }

  _pageNotFound(event) {
    this.page = 'not-found';
    let message = event && event.detail && event.detail.message ?
      `${event.detail.message}` :
      'Oops you hit a 404!';

    this.dispatchEvent(new CustomEvent('toast', {
      detail: {
        text: message
      }
    }));
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'initialisation'
      }
    }));
  }

  _initRoute() {
    let path = `${this.basePath}action-points`;
    this.set('route.path', path);
    return 'action-points';
  }

  handleLoading(event) {
    return
    if (!event.detail || !event.detail.type) {
      console.error('Bad details object', JSON.stringify(event.detail));
      return;
    }
    let loadingElement = this.$['global-loading'];

    if (event.detail.active && loadingElement.active) {
      this.globalLoadingQueue.push(event);
    } else if (event.detail.active && typeof event.detail.message === 'string' && event.detail.message !==
      '') {
      loadingElement.loadingText = event.detail.message;
      loadingElement.active = true;
    } else {
      loadingElement.active = false;
      this.globalLoadingQueue = this.globalLoadingQueue.filter((element) => {
        return element.detail.type !== event.detail.type;
      });
      if (this.globalLoadingQueue.length) {
        this.handleLoading(this.globalLoadingQueue.shift());
      }
    }
  }

  _setBgColor() {
    // If not production environment, changing header color to red
    if (!this.isProductionServer()) {
      this.updateStyles({
        '--header-bg-color': 'var(--nonprod-header-color)'
      });
    }
  }
}

window.customElements.define('app-shell', AppShell);
