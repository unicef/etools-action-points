import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import {moduleStyles} from '../styles/module-styles';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('side-bar-item')
export class SideBarItem extends LitElement {
  @property({type: String})
  name: string;

  @property({type: String})
  icon: string;

  @property({type: String, attribute: 'side-bar-link'})
  sideBarLink: string;

  @property({type: Boolean})
  external = false;

  @property({type: Boolean})
  opened = false;

  static get styles() {
    return [gridLayoutStylesLit];
  }

  render() {
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

        :host(.iron-selected:not([nested-nav])) #main > * {
          color: #0b67e9;
        }

        :host(.lighter-item:not([nested-nav])) #main > * {
          color: var(--dark-secondary-text-color);
        }

        #main {
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

      <a
        id="main"
        class="layout-horizontal align-items-center"
        target="${this._setTarget()}"
        href="${this.sideBarLink}"
        @click="${this._handleMainTap}"
      >
        <iron-icon .icon="${this.icon}" id="icon"></iron-icon>
        <div id="name">${this.name}</div>
      </a>
      <paper-tooltip position="right" offset="-10">${this.name}</paper-tooltip>

      <iron-collapse id="collapse" .opened="${this.opened}">
        <div class="content-wrapper">
          <slot></slot>
        </div>
      </iron-collapse>
    `;
  }

  _handleMainTap() {
    fireEvent(this, 'selected');
  }

  _setTarget() {
    return this.external ? '_blank' : '_self';
  }
}
