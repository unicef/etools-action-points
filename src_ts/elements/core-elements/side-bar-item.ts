import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import {moduleStyles} from '../styles-elements/module-styles';
import {customElement, property} from '@polymer/decorators';

/**
* @polymer
* @extends {PolymerElement}
*/
@customElement('side-bar-item')
export class SideBarItem extends PolymerElement {
  public static get template() {
    return html`
      ${moduleStyles}
      <style>
        :host {
          display: block;
          font-size: 14px;
          font-weight: 500;
        }

        :host([hidden]) {
          display: none;
        }

        :host([nested-nav]) iron-collapse {
          display: block;
        }

        :host(.iron-selected) #main {
          background-color: #eeeeee;
        }

        :host(.iron-selected) #main:active {
          background-color: #eeeeee;
        }

        :host(.iron-selected:not([nested-nav])) #main>* {
          color: #0b67e9;
        }

        :host(.lighter-item:not([nested-nav])) #main>* {
          color: var(--dark-secondary-text-color);
        }

        #main {
          @apply --layout-horizontal;
          @apply --layout-center;
          position: relative;
          height: 48px;
          cursor: pointer;
          text-decoration: none;
        }

        #main:active {
          background-color: var(--dark-hover-color);
        }

        #name {
          margin-left: 16px;
        }

        :host a#main iron-icon#icon {
          margin: 0 16px;
          min-width: 24px;
          min-height: 24px;
        }

        :host(:not(.lighter-item)) {
          color: var(--module-color);
        }

        iron-collapse {
          display: none;
        }

        .content-wrapper {
          padding-top: 8px;
          padding-bottom: 24px;
          font-weight: 400;
          text-transform: capitalize;
          color: var(--dark-secondary-text-color);
        }

        .content-wrapper ::slotted a {
          display: block;
          white-space: nowrap;
        }

        paper-tooltip {
          white-space: nowrap;
        }
      </style>

      <a id="main" target$="[[_setTarget(external)]]" href$="[[sideBarLink]]" on-tap="_handleMainTap">
        <iron-icon icon="{{icon}}" id="icon"></iron-icon>
        <div id="name">[[name]]</div>
      </a>
      <paper-tooltip position="right" offset="-10">[[name]]</paper-tooltip>

      <iron-collapse id="collapse" opened="{{opened}}">
        <div class="content-wrapper">
          <slot></slot>
        </div>
      </iron-collapse>
    `;
  }

  @property({type: String})
  name: string;

  @property({type: String})
  icon: string;

  @property({type: String})
  sideBarLink: string;

  @property({type: Boolean})
  external: boolean = false;

  _handleMainTap() {
    this.dispatchEvent(new CustomEvent('selected'));
  }

  _setTarget(this: any) {
    return this.external ? '_blank' : '_self';
  }
}
