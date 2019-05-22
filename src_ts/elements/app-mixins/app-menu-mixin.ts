import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/**
 * App menu functionality mixin
 * @polymer
 * @mixinFunction
 */
const AppMenu = dedupingMixin((superClass: any) => class extends superClass {

  static get properties() {
    return {
      smallMenu: {
        type: Boolean,
        value: false
      }
    };
  }

  ready() {
    super.ready();
    this._initMenuListeners();
    this._initMenuSize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeMenuListeners();
  }

  _initMenuListeners() {
    this._toggleSmallMenu = this._toggleSmallMenu.bind(this);
    this._resizeMainLayout = this._resizeMainLayout.bind(this);
    this._toggleDrawer = this._toggleDrawer.bind(this);

    this.addEventListener('toggle-small-menu', this._toggleSmallMenu);
    this.addEventListener('resize-main-layout', this._resizeMainLayout);
    this.addEventListener('drawer', this._toggleDrawer);
  }

  _removeMenuListeners() {
    this.removeEventListener('toggle-small-menu', this._toggleSmallMenu);
    this.removeEventListener('resize-main-layout', this._resizeMainLayout);
    this.removeEventListener('drawer', this._toggleDrawer);
  }

  _initMenuSize() {
    this.set('smallMenu', this._isSmallMenuActive());
  }

  _isSmallMenuActive() {
    /**
     * etoolsAppSmallMenu localStorage value must be 0 or 1
     */
    let menuTypeStoredVal = localStorage.getItem('etoolsAppSmallMenuIsActive');
    if (!menuTypeStoredVal) {
      return false;
    }
    return !!parseInt(menuTypeStoredVal, 10);
  }

  _toggleSmallMenu(e: any) {
    e.stopImmediatePropagation();
    this.set('smallMenu', !this.smallMenu);
    this._smallMenuValueChanged(this.smallMenu);
  }

  _resizeMainLayout(e: any) {
    e.stopImmediatePropagation();
    this._updateDrawerStyles();
    this._notifyLayoutResize();
  }

  _smallMenuValueChanged(newVal: boolean) {
    let localStorageVal: string = newVal ? '1' : '0';
    localStorage.setItem('etoolsAppSmallMenuIsActive', localStorageVal);
  }

  _updateDrawerStyles() {
    let drawerLayout = this.$.layout;
    if (drawerLayout) {
      drawerLayout.updateStyles();
    }
    let drawer = this.$.drawer;
    if (drawer) {
      drawer.updateStyles();
    }
  }

  _notifyLayoutResize() {
    let layout = this.$.layout;
    if (layout) {
      layout.notifyResize();
    }
    let headerLayout = this.$.appHeadLayout;
    if (headerLayout) {
      headerLayout.notifyResize();
    }
  }

  _toggleDrawer() {
    this.$.drawer.toggle();
  }

});

export default AppMenu;