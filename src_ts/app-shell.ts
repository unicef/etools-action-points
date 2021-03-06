import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/av-icons.js';
import {setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import 'etools-piwik-analytics/etools-piwik-analytics.js';
import LoadingMixin from '@unicef-polymer/etools-loading/etools-loading-mixin.js';
import {_checkEnvironment} from './elements/app-mixins/endpoint-mixin';
import {UserController} from './elements/app-mixins/user-controller';
import {AppMenu} from './elements/app-mixins/app-menu-mixin';
import './elements/core-elements/app-main-header/app-main-header';
import './elements/core-elements/app-sidebar-menu';
import './elements/common-elements/multi-notifications/multi-notification-list';
import './elements/core-elements/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/core-elements/page-footer';
import {basePath} from './elements/core-elements/etools-app-config';
import './elements/styles-elements/app-theme';
import {appShellStyles} from './elements/styles-elements/app-shell-styles';
import {customElement, property, observe} from '@polymer/decorators';
import {GenericObject} from './typings/globals.types';
setRootPath(basePath);
declare const dayjs: any;
declare const dayjs_plugin_utc: any;
dayjs.extend(dayjs_plugin_utc);

@customElement('app-shell')
export class AppShell extends LoadingMixin(UserController(AppMenu(PolymerElement))) {
  public static get template(): HTMLTemplateElement {
    return html`
      ${appShellStyles}
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

      <app-drawer-layout id="layout" responsive-width="850px"
                         fullbleed narrow="{{narrow}}" small-menu$="[[smallMenu]]">
        <!-- Drawer content -->
        <app-drawer slot="drawer"
                    id="drawer"
                    transition-duration="350"
                    swipe-open="[[narrow]]"
                    small-menu$="[[smallMenu]]">
          <app-sidebar-menu route="{{route}}" page="[[page]]" small-menu$="[[smallMenu]]"></app-sidebar-menu>
        </app-drawer>

        <!-- Main content -->

        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header id="header" slot="header" fixed shadow>
            <app-main-header id="pageheader" user="[[user]]" environment="[[environment]]"></app-main-header>
          </app-header>

          <main role="main" id="page-container">
            <iron-pages id="pages" selected="[[page]]" attr-for-selected="name"
                        fallback-selection="not-found" role="main" small-menu$="[[smallMenu]]">
              <action-points-page-main name="action-points"
                                       id="action-points"
                                       static-data-loaded="[[staticDataLoaded]]"
                                       route="{{actionPointsRoute}}">
              </action-points-page-main>
              <not-found-page-view name="not-found" id="not-found"></not-found-page-view>
            </iron-pages>

            <multi-notification-list></multi-notification-list>
          </main>

          <page-footer small-menu$="[[smallMenu]]"></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  @property({observer: AppShell.prototype._pageChanged, type: String, reflectToAttribute: true})
  page: string;

  @property({type: Boolean})
  narrow: boolean;

  @property({type: Object})
  _toast: Object;

  @property({type: Array})
  _toastQueue: object[];

  @property({type: Array})
  globalLoadingQueue: object[];

  @property({type: Object})
  user: object;

  @property({type: Object, notify: true})
  route: GenericObject;

  @property({type: Object})
  public routeData: GenericObject;

  @property({type: Object})
  queryParams: object;

  @property({type: String})
  environment: string;

  @property({type: Boolean})
  staticDataLoaded = false;

  @property({type: String})
  basePath: string;

  @property({type: Boolean})
  smallMenu: boolean;

  @property({type: Boolean})
  initLoadingComplete: boolean = false;

  public ready(): void {
    super.ready();
    this.addEventListener('404', () => this._pageNotFound());
    this.addEventListener('toast', (e: CustomEvent) => this.queueToast(e));
    this.addEventListener('static-data-loaded', (e: CustomEvent) => this._staticDataLoaded(e));
    this.addEventListener('global-loading', (e: any) => this.handleLoading(e));
    this.set('environment', _checkEnvironment());
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

  @observe('route.path')
  _routePageChanged() {
    if (!this.initLoadingComplete || !this.routeData.page || !this.staticDataLoaded) {
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

    switch (page) {
      case 'not-found':
        import('./elements/pages/not-found-page-view.js');
        break;
      default:
        import('./elements/pages/action-points-page-components/action-points-page-main.js');
        this._loadPage();
        break;
    }
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
    if (this.route.path === '/') {this._initRoute();}
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
