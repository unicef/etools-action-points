import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
import {Constructor} from '../../typings/globals.types';
import {PolymerElement} from '@polymer/polymer';
import {property} from '@polymer/decorators';
import {AppDrawerElement} from '@polymer/app-layout/app-drawer/app-drawer.js';
import {AppDrawerLayoutElement} from '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import {AppHeaderLayoutElement} from '@polymer/app-layout/app-header-layout/app-header-layout.js';

/**
 * App menu functionality mixin
 * @polymer
 * @mixinFunction
 */
export function AppMenu<T extends Constructor<PolymerElement>>(superClass: T) {
  class AppMenuClass extends dedupingMixin(superClass as Constructor<PolymerElement>) {
    @property({type: Boolean})
    smallMenu = false;

    ready() {
      super.ready();
      this._initMenuListeners();
      this._initMenuSize();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._removeMenuListeners();
    }

    public _initMenuListeners() {
      this._toggleSmallMenu = this._toggleSmallMenu.bind(this);
      this._resizeMainLayout = this._resizeMainLayout.bind(this);
      this._toggleDrawer = this._toggleDrawer.bind(this);

      this.addEventListener('toggle-small-menu', this._toggleSmallMenu);
      this.addEventListener('resize-main-layout', this._resizeMainLayout);
      this.addEventListener('drawer', this._toggleDrawer);
    }

    public _removeMenuListeners() {
      this.removeEventListener('toggle-small-menu', this._toggleSmallMenu);
      this.removeEventListener('resize-main-layout', this._resizeMainLayout);
      this.removeEventListener('drawer', this._toggleDrawer);
    }

    public _initMenuSize() {
      this.set('smallMenu', this._isSmallMenuActive());
    }

    public _isSmallMenuActive() {
      /**
       * etoolsAppSmallMenu localStorage value must be 0 or 1
       */
      let menuTypeStoredVal = localStorage.getItem('etoolsAppSmallMenuIsActive');
      if (!menuTypeStoredVal) {
        return false;
      }
      return !!parseInt(menuTypeStoredVal, 10);
    }

    public _toggleSmallMenu(e: any) {
      e.stopImmediatePropagation();
      this.set('smallMenu', !this.smallMenu);
      this._smallMenuValueChanged(this.smallMenu);
    }

    public _resizeMainLayout(e: any) {
      e.stopImmediatePropagation();
      this._updateDrawerStyles();
      this._notifyLayoutResize();
    }

    public _smallMenuValueChanged(newVal: boolean) {
      let localStorageVal: string = newVal ? '1' : '0';
      localStorage.setItem('etoolsAppSmallMenuIsActive', localStorageVal);
    }

    public _updateDrawerStyles() {
      const drawerLayout: AppDrawerLayoutElement = this.shadowRoot.querySelector('#layout');
      if (drawerLayout) {
        drawerLayout.updateStyles();
      }
      const drawer: AppDrawerElement = this.shadowRoot.querySelector('#drawer');
      if (drawer) {
        drawer.updateStyles();
      }
    }

    public _notifyLayoutResize() {
      const drawerLayout: AppDrawerLayoutElement = this.shadowRoot.querySelector('#layout');
      if (drawerLayout) {
        drawerLayout.notifyResize();
      }
      const headerLayout: AppHeaderLayoutElement = this.shadowRoot.querySelector('#appHeadLayout');
      if (headerLayout) {
        headerLayout.notifyResize();
      }
    }

    public _toggleDrawer() {
      const drawer: AppDrawerElement = this.shadowRoot.querySelector('#drawer');
      drawer.toggle();
    }

  }
  return AppMenuClass;
}
