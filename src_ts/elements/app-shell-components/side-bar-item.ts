import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import {moduleStyles} from '../styles/module-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('side-bar-item')
export class SideBarItem extends LitElement {
  @property({type: String})
  name?: string;

  @property({type: String})
  icon?: string;

  @property({type: String, attribute: 'side-bar-link'})
  sideBarLink?: string;

  @property({type: Boolean})
  external = false;

  @property({type: Boolean, attribute: 'selected'})
  selected? = false;

  @property({type: Boolean})
  opened = false;

  @property({type: Boolean, attribute: 'disabled'})
  disabled = true;

  static get styles() {
    return [layoutStyles];
  }

  render() {
    return html`
      ${moduleStyles}
      <style>
        :host {
          display: block;
          font-size: var(--etools-font-size-14, 14px);
          font-weight: 500;
        }

        :host([hidden]) {
          display: none;
        }

        :host([nested-nav]) etools-collapse {
          display: block;
        }

        .selected#main {
          background-color: #eeeeee;
        }

        .selected#main:active {
          background-color: #eeeeee;
        }

        .selected:not([nested-nav])#main > * {
          color: var(--primary-color);
        }

        :host(.lighter-item:not([nested-nav])) #main > * {
          color: var(--dark-secondary-text-color);
        }

        #main {
          position: inherit;
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

        :host a#main etools-icon#icon {
          margin: 0 16px;
          min-width: 24px;
          min-height: 24px;
        }

        :host(:not(.lighter-item)) {
          color: var(--module-color);
        }

        etools-collapse {
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
      </style>
      <a
        id="main"
        class="layout-horizontal align-items-center ${this.selected ? 'selected' : ''}"
        target="${this._setTarget()}"
        href="${this.sideBarLink}"
        @click="${this._handleMainTap}"
      >
        <sl-tooltip placement="right" ?disabled="${this.disabled}" content="${this.name}">
          <etools-icon name="${this.icon}" id="icon"></etools-icon>
          <div id="name">${this.name}</div>
        </sl-tooltip>
      </a>

      <etools-collapse id="collapse" .opened="${this.opened}">
        <div class="content-wrapper">
          <slot></slot>
        </div>
      </etools-collapse>
    `;
  }

  _handleMainTap() {
    fireEvent(this, 'selected');
  }

  _setTarget() {
    return this.external ? '_blank' : null;
  }
}
