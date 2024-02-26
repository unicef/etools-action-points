import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer-layout';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header-layout';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import {createDynamicDialog} from '@unicef-polymer/etools-unicef/src/etools-dialog/dynamic-dialog';
import '@unicef-polymer/etools-piwik-analytics/etools-piwik-analytics.js';
import {LoadingMixin} from '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading-mixin';
import {_checkEnvironment} from './endpoints/endpoint-mixin';
import {UserControllerMixin} from './elements/mixins/user-controller';
import {AppMenuMixin} from './elements/mixins/app-menu-mixin';
import './elements/app-shell-components/app-main-header/app-main-header';
import './elements/app-shell-components/app-sidebar-menu';
import './elements/app-shell-components/app-main-header/countries-dropdown';
import './elements/data-elements/static-data';
import './elements/app-shell-components/page-footer';
import './routing/routes.js';
import {basePath} from './config/config';
import {appShellStyles} from './elements/styles/app-shell-styles';
import '@unicef-polymer/etools-unicef/src/etools-toasts/etools-toasts';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import {initializeIcons} from '@unicef-polymer/etools-unicef/src/etools-icons/etools-icons';
import {connect, installMediaQueryWatcher, installRouter} from 'pwa-helpers';
import {RootState, store} from './redux/store';
import {handleUrlChange} from './redux/actions/app.js';
import {RouteDetails} from '@unicef-polymer/etools-types';
import {setStore} from '@unicef-polymer/etools-utils/dist/store.util';

setStore(store as any);
window.EtoolsLanguage = 'en';

setBasePath(basePath);
initializeIcons();
@customElement('app-shell')
export class AppShell extends connect(store)(LoadingMixin(UserControllerMixin(AppMenuMixin(LitElement)))) {
  static get styles() {
    return [layoutStyles];
  }

  @property({type: Object})
  public routeDetails!: RouteDetails;

  @property({type: String})
  public mainPage = ''; // routeName

  @property({type: String})
  public subPage: string | null = null; // subRouteName

  @property({type: Boolean, reflect: true})
  narrow = false;

  @property({type: Object})
  _toast: any;

  @property({type: Object})
  user: any;

  actionPointsRoute: any = {};

  @property({type: Object})
  queryParams: any;

  @property({type: String})
  environment: string | null = null;

  @property({type: Boolean})
  staticDataLoaded?: boolean;

  @property({type: Boolean})
  initLoadingComplete = false;

  render() {
    return html`
      ${appShellStyles}
      <static-data></static-data>
      <etools-toasts></etools-toasts>

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
          @app-drawer-transitioned="${this.onDrawerToggle}"
          ?opened="${this.drawerOpened}"
          ?swipe-open="${this.narrow}"
          ?small-menu="${this.smallMenu}"
        >
          <app-sidebar-menu .page="${this.mainPage}" ?small-menu="${this.smallMenu}"></app-sidebar-menu>
        </app-drawer>

        <!-- Main content -->

        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header id="header" slot="header" fixed shadow>
            <app-main-header id="pageheader" .user="${this.user}" .environment="${this.environment}"></app-main-header>
          </app-header>

          <main role="main" id="page-container">
            ${this.isActivePage(this.mainPage, 'action-points') && this.staticDataLoaded
              ? html` <action-points-page-main
                  id="action-points"
                  .staticDataLoaded="${this.staticDataLoaded}"
                  .route="${this.actionPointsRoute}"
                ></action-points-page-main>`
              : html``}
            ${this.isActivePage(this.page, 'not-found')
              ? html`<not-found-page-view
                  ?hidden="${!this.isActivePage(this.page, 'not-found')}"
                  id="not-found"
                ></not-found-page-view>`
              : ``}
          </main>

          <page-footer ?small-menu="${this.smallMenu}"></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    installMediaQueryWatcher(`(min-width: 460px)`, () => fireEvent(this, 'change-drawer-state'));
    const eventData = {
      message: 'Loading...',
      active: true,
      loadingSource: 'initialisation'
    };
    fireEvent(this, 'global-loading', eventData);
    this.addEventListener('404', () => this._pageNotFound());
    this.addEventListener('static-data-loaded', (e: any) => this._staticDataLoaded(e));
    this.addEventListener('global-loading', (e: any) => this.handleLoading(e));
    this.environment = _checkEnvironment();
    this.checkAppVersion();
    window.EtoolsEsmmFitIntoEl = this.shadowRoot
      ?.querySelector('#appHeadLayout')
      ?.shadowRoot?.querySelector('#contentContainer');
    installRouter((location) =>
      store.dispatch(handleUrlChange(decodeURIComponent(location.pathname + location.search)))
    );
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('404', () => this._pageNotFound());
    this.removeEventListener('static-data-loaded', (e: any) => this._staticDataLoaded(e));
    this.removeEventListener('global-loading', (e: any) => this.handleLoading(e));
  }

  public stateChanged(state: RootState) {
    if (!state.app.routeDetails?.routeName) {
      return;
    }
    if (
      state.app.routeDetails.path.includes('/new') &&
      (!this.routeDetails || !this.routeDetails.path.includes('/new'))
    )
      fireEvent(this, 'global-loading', {
        message: 'Loading...',
        active: true,
        loadingSource: state.app.routeDetails.routeName
      });
    this.routeDetails = state.app!.routeDetails;
    this.mainPage = state.app!.routeDetails!.routeName;
    this.subPage = state.app!.routeDetails!.subRouteName;
  }
  _pageNotFound(event?: any) {
    const message = event && event.detail && event.detail.message ? `${event.detail.message}` : 'Oops you hit a 404!';
    fireEvent(this, 'toast', {text: message});
    this.goToPageNotFound();
  }
  goToPageNotFound() {
    history.pushState(window.history.state, '', 'not-found');
    window.dispatchEvent(new CustomEvent('popstate'));
  }
  _staticDataLoaded(e: CustomEvent) {
    if (e && e.type === 'static-data-loaded') {
      this.staticDataLoaded = true;
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: 'initialisation'
      });
    }
    if (this.staticDataLoaded) {
      this.user = this.getUserData();
    }
  }

  checkAppVersion() {
    if (!document.getElementById('buildDate')!.innerText) {
      this.clearAllCaches();
      return;
    }

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
      this.clearAllCaches();
    }
  }

  clearAllCaches(){
     if (navigator.serviceWorker) {
       caches.keys().then((cacheNames) => {
         cacheNames.forEach((cacheName) => {
           caches.delete(cacheName);
         });
         location.reload();
       });
     }
  }

  isActivePage(activeModule: string, expectedModule: string) {
    const pagesToMatch = expectedModule.split('|');
    return pagesToMatch.indexOf(activeModule) > -1;
  }
}
