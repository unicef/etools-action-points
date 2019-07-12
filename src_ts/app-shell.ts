import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-selector/iron-selector';
import '@polymer/iron-pages/iron-pages';
import '@polymer/iron-collapse/iron-collapse';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/social-icons';
import '@polymer/iron-icons/av-icons';
import 'etools-piwik-analytics/etools-piwik-analytics';
import LoadingMixin from '@unicef-polymer/etools-loading/etools-loading-mixin';
import EndpointMixin from './elements/app-mixins/endpoint-mixin';
import UserController from './elements/app-mixins/user-controller';
import PermissionController from './elements/app-mixins/permission-controller';
import AppMenu from './elements/app-mixins/app-menu-mixin'
import './elements/core-elements/app-main-header/app-main-header';
import './elements/core-elements/app-sidebar-menu';
import './elements/common-elements/multi-notifications/multi-notification-list';
import './elements/core-elements/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/core-elements/page-footer';
import {pageLayoutStyles} from './elements/styles-elements/page-layout-styles';
import {sharedStyles} from './elements/styles-elements/shared-styles';
import {appDrawerStyles} from './elements/styles-elements/app-drawer-styles';
import {basePath} from './elements/core-elements/etools-app-config'
import {setRootPath} from '@polymer/polymer/lib/utils/settings';
import {EtoolsMixinFactory} from '@unicef-polymer/etools-behaviors/etools-mixin-factory';
import './elements/styles-elements/app-theme';
setRootPath(basePath);

const AppShellMixin = EtoolsMixinFactory.combineMixins([
  EndpointMixin, UserController, AppMenu, LoadingMixin, PermissionController
], PolymerElement)

class AppShell extends AppShellMixin {
  public static get template() {
    return html`
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
        
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          app-header {
            padding-left: 0;
          }
          app-header:not([small-menu]){
            padding-left: 0;
          }
        }
      </style>

      <static-data></static-data>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>

      <app-route route="{{route}}"
                 pattern="[[rootPath]]:page"
                 data="{{routeData}}">
      </app-route>

      <app-route route="{{route}}"
                 pattern="[[rootPath]]action-points"
                 tail="{{actionPointsRoute}}">
      </app-route>

      <etools-piwik-analytics user="[[user]]"
                              page="[[page]]"
                              toast="[[_toast]]">
      </etools-piwik-analytics>

      <!-- Drawer content -->
      <app-drawer-layout id="layout" responsive-width="850px"
                       fullbleed narrow="{{narrow}}" small-menu$="[[smallMenu]]">
        <app-drawer slot="drawer" id="drawer" transition-duration="350" swipe-open="[[narrow]]" small-menu$="[[smallMenu]]">
          <app-sidebar-menu route="{{route}}" page="[[page]]" small-menu$="[[smallMenu]]"></app-sidebar-menu>
        </app-drawer>
        
        <!-- Main content -->
        
        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header id="header" slot="header" fixed shadow small-menu$="[[smallMenu]]">
            <app-main-header id="pageheader" user="[[user]]" environment="[[environment]]"></app-main-header>
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
      queryParams: Object,
      environment: String,
      staticDataLoaded: {
        type: Boolean,
        value: false
      },
      basePath: String,
      smallMenu: Boolean
    };
  }

  public static get observers() {
    return ['_routePageChanged(route.path)'];
  }

  ready() {
    super.ready();
    this.addEventListener('404', () => this._pageNotFound());
    this.addEventListener('toast', (e: CustomEvent) => this.queueToast(e));
    this.addEventListener('static-data-loaded', (e: CustomEvent) => this._staticDataLoaded(e));
    this.addEventListener('global-loading', (e: any) => this.handleLoading(e));
    this.set('environment', this._checkEnvironment());
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
  }

  _staticDataLoaded(e: CustomEvent) {
    if (e && e.type === 'static-data-loaded') {
      this.set('staticDataLoaded', true); 
    }
    if (this.staticDataLoaded) {
      this.set('user', this.getUserData());
      this.set('page', this.routeData.page ? this.routeData.page : this._initRoute());
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
    if (!this.initLoadingComplete || !this.routeData.page || !this._staticDataLoaded) {
      return;
    }
    this.set('page', this.routeData.page ? this.routeData.page : this._initRoute());
    this.scroll(0, 0);
  }

  _pageChanged(page: string) {
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        message: 'Loading...',
        active: true,
        type: 'initialisation'
      }
    }));

    var resolvedPageUrl;
    if (page === 'not-found') {
      resolvedPageUrl = 'elements/pages/not-found-page-view.js';
    } else {
      resolvedPageUrl =
        `./elements/pages/action-points-page-components/action-points-page-main.js`;
    }
    import(resolvedPageUrl).then(() => this._loadPage(), () => this._pageNotFound());
  }

  _loadPage() {
    if (!this.initLoadingComplete) {
      this.set('initLoadingComplete', true);
    }
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'initialisation'
      }
    }));
    if (this.route.path === '/') { this._initRoute();}
  }

  _pageNotFound() {
    this.set('page', 'not-found');
    let message = (<CustomEvent>event) && (<CustomEvent>event).detail && (<CustomEvent>event).detail.message ?
      `${(<CustomEvent>event).detail.message}` :
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
    let path = `${this.rootPath}action-points`;
    this.set('route.path', path);
    return 'action-points';
  }
}

window.customElements.define('app-shell', AppShell);
