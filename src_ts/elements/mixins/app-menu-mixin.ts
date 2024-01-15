import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {Constructor} from '@unicef-polymer/etools-types';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../config/config';

/**
 * App menu functionality mixin
 * @LitElement
 * @mixinFunction
 */
export function AppMenuMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class AppMenuClass extends baseClass {
    @property({type: Boolean})
    smallMenu = false;

    @property({type: Boolean})
    drawerOpened = false;

    public connectedCallback() {
      super.connectedCallback();
      this._initMenuListeners();
      this._initMenuSize();
    }

    public disconnectedCallback() {
      super.disconnectedCallback();
      this._removeMenuListeners();
    }

    private _initMenuListeners(): void {
      this._toggleMenu = this._toggleMenu.bind(this);

      this.addEventListener('toggle-small-menu', this._toggleMenu as any);
      this.addEventListener('change-drawer-state', this.changeDrawerState);
    }

    private _removeMenuListeners(): void {
      this.removeEventListener('toggle-small-menu', this._toggleMenu as any);
      this.removeEventListener('change-drawer-state', this.changeDrawerState);
    }

    private _initMenuSize(): void {
      const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
      if (!menuTypeStoredVal) {
        this.smallMenu = false;
      } else {
        this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
      }
    }

    public changeDrawerState() {
      this.drawerOpened = !this.drawerOpened;
    }

    // public onDrawerToggle() {
    //   const drawerOpened = (this.drawer as any).opened;
    //   if (this.drawerOpened !== drawerOpened) {
    //     this.drawerOpened = drawerOpened;
    //   }
    // }
    private _toggleMenu(e: CustomEvent): void {
      // e.stopImmediatePropagation();
      this.smallMenu = e.detail.value; // !this.smallMenu;
    }
  }

  return AppMenuClass;
}
