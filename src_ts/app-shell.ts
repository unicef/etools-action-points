import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/av-icons.js';
import {createDynamicDialog} from '@unicef-polymer/etools-dialog/dynamic-dialog';
import {setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import '@unicef-polymer/etools-piwik-analytics/etools-piwik-analytics.js';
import {LoadingMixin} from '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading-mixin.js';
import {_checkEnvironment} from './endpoints/endpoint-mixin';
import {UserControllerMixin} from './elements/mixins/user-controller';
import {AppMenuMixin} from './elements/mixins/app-menu-mixin';
import './elements/app-shell-components/app-main-header/app-main-header';
import './elements/app-shell-components/app-sidebar-menu';
import './elements/app-shell-components/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/app-shell-components/page-footer';
import {basePath} from './config/config';
import './elements/styles/app-theme';
import {appShellStyles} from './elements/styles/app-shell-styles';
import {GenericObject} from './typings/globals.types';
import '@unicef-polymer/etools-toasts/src/etools-toasts';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

setRootPath(basePath);
declare const dayjs: any;
declare const dayjs_plugin_utc: any;
dayjs.extend(dayjs_plugin_utc);
window.EtoolsLanguage = 'en';

@customElement('app-shell')
export class AppShell extends LoadingMixin(UserControllerMixin(AppMenuMixin(LitElement))) {
  static get styles() {
    return [gridLayoutStylesLit];
  }

  _page: string;
  @property({type: String, reflect: true, attribute: 'page'})
  get page() {
    return this._page;
  }

  set page(value) {
    this._page = value;
    this._pageChanged(value);
  }

  @property({type: Boolean})
  narrow: boolean;

  @property({type: Object})
  _toast: any;

  @property({type: Array})
  _toastQueue: any[];

  @property({type: Array})
  globalLoadingQueue: any[];

  @property({type: Object})
  user: any;

  actionPointsRoute: any = {};

  private _route: GenericObject;
  @property({type: Object})
  get route() {
    return this._route;
  }

  set route(value) {
    this._route = value;
  }

  private _routeData: GenericObject;
  @property({type: Object})
  get routeData() {
    return this._routeData;
  }

  set routeData(value) {
    this._routeData = value;
    this._routePageChanged();
  }

  @property({type: Object})
  queryParams: any;

  @property({type: String})
  environment: string;

  @property({type: Boolean})
  staticDataLoaded = false;

  @property({type: Boolean})
  smallMenu: boolean;

  @property({type: Boolean})
  initLoadingComplete = false;

  render() {
    return html`
      ${appShellStyles}
      <static-data></static-data>
      <etools-toasts></etools-toasts>

      <app-location @route-changed=${this.routeChanged} .route="${this.route}" url-space-regex="^${basePath}">
      </app-location>

      <app-route
        .route="${this.route}"
        @route-changed=${this.routeChanged}
        pattern="${basePath}action-points"
        @tail-changed="${this.actionPointsRouteChanged}"
      >
      </app-route>
      <app-route
        .route="${this.route}"
        @route-changed=${this.routeChanged}
        pattern="${basePath}action-points/:page"
        @data-changed="${this.routeDataChanged}"
      >
      </app-route>

      <etools-piwik-analytics .user="${this.user}" .page="${this.page}" .toast="${this._toast}">
      </etools-piwik-analytics>

      <app-drawer-layout
        id="layout"
        responsive-width="850px"
        fullbleed
        .narrow="${this.narrow}"
        ?small-menu="${this.smallMenu}"
      >
        <!-- Drawer content -->
        <app-drawer
          slot="drawer"
          id="drawer"
          transition-duration="350"
          ?swipe-open="${this.narrow}"
          ?small-menu="${this.smallMenu}"
        >
          <app-sidebar-menu
            .route="${this.route}"
            .page="${this.page}"
            ?small-menu="${this.smallMenu}"
          ></app-sidebar-menu>
        </app-drawer>

        <!-- Main content -->

        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header id="header" slot="header" fixed shadow>
            <app-main-header id="pageheader" .user="${this.user}" .environment="${this.environment}"></app-main-header>
          </app-header>

          <main role="main" id="page-container">
            <action-points-page-main
              .hidden="${this.shouldShowPageNotFound()}"
              id="action-points"
              .staticDataLoaded="${this.staticDataLoaded}"
              .route="${this.actionPointsRoute}"
            >
            </action-points-page-main>
            <not-found-page-view .hidden="${this.shouldShowPageNotFound()}" id="not-found"></not-found-page-view>
          </main>

          <page-footer ?small-menu="${this.smallMenu}"></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('404', () => this._pageNotFound());
    this.addEventListener('static-data-loaded', (e: CustomEvent) => this._staticDataLoaded(e));
    this.addEventListener('global-loading', (e: any) => this.handleLoading(e));
    this.environment = _checkEnvironment();

    this.checkAppVersion();
    window.EtoolsEsmmFitIntoEl = this.shadowRoot
      .querySelector('#appHeadLayout')
      ?.shadowRoot?.querySelector('#contentContainer');

    const eventData = {
      message: 'Loading...',
      active: true,
      loadingSource: 'initialisation'
    };
    fireEvent(this, 'global-loading', eventData);
  }

  _staticDataLoaded(e: CustomEvent) {
    if (e && e.type === 'static-data-loaded') {
      this.staticDataLoaded = true;
    }
    if (this.staticDataLoaded) {
      this.user = this.getUserData();
      this.page = this.routeData?.page ? this.routeData.page : this._initRoute();
    }
  }

  _routePageChanged() {
    if (!this.initLoadingComplete || !this.routeData.page || !this.staticDataLoaded) {
      return;
    }
    this.page = this.routeData?.page ? this.routeData.page : this._initRoute();
    this.scroll(0, 0);
  }

  _pageChanged(page: string) {
    fireEvent(this, 'global-loading', {
      message: 'Loading...',
      active: true,
      loadingSource: 'initialisation'
    });

    switch (page) {
      case 'not-found':
        import('./elements/pages/not-found-page-view.js');
        break;
      default:
        import('./elements/pages/action-points/action-points-page-main.js');
        this._loadPage();
        break;
    }
    if (!this.initLoadingComplete) {
      this.initLoadingComplete = true;
    }
  }

  _loadPage() {
    fireEvent(this, 'global-loading', {
      loadingSource: 'initialisation'
    });
    if (this.route.path === '/') {
      this._initRoute();
    }
  }

  _pageNotFound() {
    fireEvent(this, 'global-loading', {
      loadingSource: 'initialisation'
    });
    this.route = {...this.route, path: `${basePath}action-points/not-found`};
  }

  _initRoute() {
    this.route = {...this.route, path: `${basePath}action-points/list`};
    return 'action-points';
  }

  checkAppVersion() {
    fetch('version.json')
      .then((res) => res.json())
      .then((version) => {
        if (version.revision != document.getElementById('buildRevNo')!.innerText) {
          console.log('version.json', version.revision);
          console.log('buildRevNo ', document.getElementById('buildRevNo')!.innerText);
          this._showConfirmNewVersionDialog();
        }
      });
  }

  _showConfirmNewVersionDialog() {
    const msg = document.createElement('span');
    msg.innerText = 'A new version of the app is available. Refresh page?';
    const conf: any = {
      size: 'md',
      closeCallback: this._onConfirmNewVersion.bind(this),
      content: msg
    };
    const confirmNewVersionDialog = createDynamicDialog(conf);
    // @ts-ignore
    setTimeout(() => {
      const dialog = confirmNewVersionDialog.shadowRoot?.querySelector('#dialog') as any;
      if (dialog) {
        dialog.style.zIndex = 9999999;
      }
    }, 0);
    confirmNewVersionDialog.opened = true;
  }

  _onConfirmNewVersion(e: CustomEvent) {
    if (e.detail.confirmed) {
      if (navigator.serviceWorker) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
          location.reload();
        });
      }
    }
  }

  shouldShowPageNotFound() {
    return this.page === 'not-found';
  }

  actionPointsRouteChanged({detail}: CustomEvent) {
    if (!detail.value?.path) {
      return;
    }

    this.actionPointsRoute = detail.value;
    this.requestUpdate();
  }

  routeDataChanged({detail}: CustomEvent) {
    if (!detail.value?.page) {
      return;
    }

    this.routeData = detail.value;
    this.requestUpdate();
  }

  routeChanged({detail}: CustomEvent) {
    if (!detail.value?.path) {
      return;
    }

    this.route = detail.value;
    this.requestUpdate();
  }
}
