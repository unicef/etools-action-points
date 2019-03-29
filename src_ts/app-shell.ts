import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-selector/iron-selector';
import '@polymer/iron-pages/iron-pages';
import '@polymer/iron-collapse/iron-collapse';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/av-icons';
import LoadingMixin from 'etools-loading/etools-loading-mixin';
import './elements/pages/action-points-page-components/action-points-page-main'
import './elements/core-elements/app-main-header/app-main-header.js';
import './elements/core-elements/app-sidebar-menu.js';
import './elements/common-elements/multi-notifications/multi-notification-list.js';
import './elements/app-mixins/permission-controller.js';
import EndpointMixin from './elements/app-mixins/endpoint-mixin';
import UserController from './elements/app-mixins/user-controller.js';
import AppMenu from './elements/app-mixins/app-menu-mixin'
import './elements/core-elements/side-bar-item';
import './elements/core-elements/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/core-elements/page-footer';
import {pageLayoutStyles} from './elements/styles-elements/page-layout-styles.js';
import {sharedStyles} from './elements/styles-elements/shared-styles.js';
import {appDrawerStyles} from './elements/styles-elements/app-drawer-styles';
import './elements/styles-elements/app-theme.js';
import {basePath} from './elements/core-elements/etools-app-config'
import {setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import { EtoolsMixinFactory } from 'etools-behaviors/etools-mixin-factory';
setRootPath(basePath);

const AppShellMixin = EtoolsMixinFactory.combineMixins([
  EndpointMixin, UserController, AppMenu, LoadingMixin
], PolymerElement)

class AppShell extends AppShellMixin {

  public static get template() {
    return html `
      ${pageLayoutStyles}
      ${sharedStyles}
      ${appDrawerStyles}
      <style>
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
        app-header {
          padding-left: 73px;
        }
        app-header:not([small-menu]){
          padding-left: 220px;
        }

        app-header {
          background-color: var(--header-bg-color);
        }
      </style>

      <static-data></static-data>

      <app-location route="{{route}}"></app-location>

      <app-route route="{{route}}"
                 pattern="[[rootPath]]:page"
                 data="{{routeData}}"
                 tail="{{subroute}}">
      </app-route>

      <app-route route="{{route}}"
                 pattern="[[rootPath]]action-points"
                 tail="{{actionPointsRoute}}">
      </app-route>
      
      <!-- Drawer content -->
      <app-drawer-layout id="layout" responsive-width="850px"
                       fullbleed narrow="{{narrow}}" small-menu$="[[smallMenu]]">
        <app-drawer slot="drawer" id="drawer" transition-duration="350" swipe-open="[[narrow]]" small-menu$="[[smallMenu]]">
          <app-sidebar-menu route="{{route}}" page="[[page]]" small-menu$="[[smallMenu]]"></app-sidebar-menu>
        </app-drawer>
        
        <!-- Main content -->
        
        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header id="header" slot="header" fixed shadow small-menu$="[[smallMenu]]">
            <app-main-header id="pageheader" user="[[user]]"></app-main-header>
          </app-header>
          
          <iron-pages id="pages" selected="[[page]]" attr-for-selected="name"
                      fallback-selection="not-found" role="main" small-menu$="[[smallMenu]]">
            <action-points-page-main name="action-points" id="action-points" route="{{actionPointsRoute}}">
            </action-points-page-main>
            <not-found-page-view name="not-found" id="not-found"></not-found-page-view>
          </iron-pages>
          
          <multi-notification-list></multi-notification-list>
          <page-footer small-menu$="[[smallMenu]]"></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  public static get properties() {
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
      queryParams: Object,
      staticDataLoaded: {
        type: Boolean,
        value: false
      },
      basePath: String
    };
  }

  public static get observers() {
    return [
      '_routePageChanged(route.path)'
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('404', () => this._pageNotFound());
    this.addEventListener('static-data-loaded', (e: CustomEvent) => this._staticDataLoaded(e));
    this.addEventListener('global-loading', (e: any) => this.handleLoading(e));
    this._setBgColor();
  }

  connectedCallback() {
    super.connectedCallback();
    let eventData = {
      message: 'Loading...',
      active: true,
      type: 'initialisation'
    };
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: eventData
    }));
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
    this.$.pages.style.paddingLeft = drawerWidth;
    this.$.header.style.paddingLeft = drawerWidth;

    this.$.drawer.querySelector('app-sidebar-menu').classList.toggle('opened', isClosed);
    this.$.drawer.toggleClass('opened', isClosed);
    this.$.drawer.toggleAttribute('opened', isClosed);
  }

  _staticDataLoaded(e: CustomEvent) {
    if (e && e.type === 'static-data-loaded') {
      this.staticDataLoaded = true;
    }
    if (this.staticDataLoaded) {
      this.user = this.getUserData();
      this.page = this.routeData.page ? this.routeData.page : this._initRoute();
    }
  }

  queueToast(e: CustomEvent) {
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
    this.page = this.routeData.page ? this.routeData.page : this._initRoute();
    this.scroll(0, 0);
  }

  _pageChanged(page: string) {
    // if (this.$[`${page}`] instanceof PolymerElement) {
    //   return;
    // }
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        message: 'Loading...',
        active: true,
        type: 'initialisation'
      }
    }));

    // var resolvedPageUrl;
    // if (page === 'not-found') {
    //   resolvedPageUrl = 'elements/pages/not-found-page-view.ts';
    // } else {
    //   resolvedPageUrl =
    //     `./elements/pages/${page}-page-components/${page}-page-main.ts`;
    // }
    // import(resolvedPageUrl).then(() => this._loadPage(), event => this._pageNotFound(event));
    if (page === "action-points") {
      this._loadPage()
    } else {
      this._pageNotFound()
    }
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
    if (this.route.path === '/') { this._initRoute();}
  }

  _pageNotFound() {
    // console.log(event)
    this.page = 'not-found';
    // let message = event && event.detail && event.detail.message ?
    //   `${event.detail.message}` :
    //   'Oops you hit a 404!';
    let message = 'Oops you hit a 404!'

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
    let path = `${this.rootPath}action-points`;
    this.set('route.path', path);
    return 'action-points';
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
