import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {moduleStyles} from '../styles/module-styles';
import {GenericObject} from '../../typings/globals.types';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('etools-action-button')
export class EtoolsActionButton extends LitElement {
  render() {
    return html`
      ${moduleStyles}
      <style>
        :host {
          position: relative;
          display: block;
          text-align: center;
        }
        :host .main-action.text {
          font-weight: 500;
        }
        :host etools-button {
          height: 34px;
          color: #fff;
          margin: 0;
          width: 100%;
        }
        :host etools-button span {
          padding: 0 29px;
        }

        etools-icon[slot='trigger'] {
          padding: 4px 10px;
          border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
        }
        :host etools-button-group {
          padding: 0;
          border-left: solid 1px rgba(255, 255, 255, 0.5);
          position: absolute;
          right: 0;
          top: 0;
          height: 34px;
          overflow: hidden;
        }
        :host etools-button-group etools-icon-button {
          top: -2px;
        }
        :host [slot='dropdown-content'] {
          padding: 6px 0;
        }
        :host .other-title {
          cursor: default;
          padding: 10px 20px;
          text-transform: uppercase;
          color: var(--gray-mid);
          white-space: nowrap;
          font-weight: 500;
        }
        :host .other-options {
          outline: none;
          text-align: center;
          padding: 6px;
          font-weight: 500;
          color: var(--gray-mid);
          white-space: nowrap;
        }
        :host .other-options .option-icon {
          width: 22px;
          height: 22px;
          margin-left: 5px;
          color: var(--gray-mid);
          vertical-align: top;
        }
        :host .other-options span {
          vertical-align: top;
          margin-top: 1px;
          padding: 0;
          display: inline-block;
        }
      </style>

      <etools-button
        variant="primary"
        raised
        @click="${this._btnClicked}"
        class="main-action status-tab-button ${this.withActionsMenu(this.actions?.length)}"
      >
        <span class="main-action text">${this._setButtonText(this.actions?.[0])}</span>

        <sl-dropdown
          dynamic-align
          .opened="${this.statusBtnMenuOpened}"
          class="option-button"
          ?hidden="${!this._showOtherActions(this.actions?.length)}"
        >
          <etools-icon name="expand-more" slot="trigger" class="option-button"></etools-icon>

          <sl-menu placement="bottom-end" @click="${(event: MouseEvent) => event.stopImmediatePropagation()}">
            ${this.actions?.filter(this._filterActions.bind(this)).map(
              (item) => html`
                <sl-menu-item
                  class="other-options"
                  @click="${(e: any) => {
                    this._btnClicked(e);
                    this.closeMenu();
                  }}"
                  action-code="${this._setActionCode(item)}"
                >
                  <etools-icon name="${this._setIcon(item, this.icons)}" class="option-icon"></etools-icon>
                  <span>${this._setButtonText(item)}</span>
                </sl-menu-item>
              `
            )}
          </sl-menu>
        </sl-dropdown>
      </etools-button>
    `;
  }

  @property({type: Array})
  actions: GenericObject[] = [];

  @property({type: Object})
  icons = () => {
    return {
      cancel: 'cancel',
      save: 'save',
      complete: 'assignment-turned-in'
    };
  };

  @property({type: Boolean})
  statusBtnMenuOpened = false;

  closeMenu() {
    this.statusBtnMenuOpened = false;
  }

  _setButtonText(item: any) {
    if (!item) {
      return '';
    }
    const text = item.display_name || item.replace('_', ' ');

    if (!text) {
      throw new Error('Can not get button text!');
    }

    return text.toUpperCase();
  }

  _btnClicked(event: any) {
    if (!event || !event.target) {
      return;
    }
    const target = event.target.classList.contains('other-options')
      ? event.target
      : event.target.parentElement || event.target;
    const isMainAction = event.target.classList.contains('main-action');

    const action = isMainAction
      ? this.actions[0].code || this.actions[0]
      : target && target.getAttribute('action-code');

    if (action) {
      fireEvent(this, 'close-toasts');
      fireEvent(this, 'action-activated', {
        type: action
      });
    }
  }

  _showOtherActions(length: number) {
    return length > 1;
  }

  withActionsMenu(length: number) {
    return length > 1 ? 'with-menu' : '';
  }

  _filterActions(action: any) {
    return !(action === this.actions?.[0]);
  }

  _setIcon(item: any, icons: any) {
    if (!icons || !item) {
      return '';
    }
    return icons[item.code || item] || '';
  }

  _setActionCode(item: any) {
    return item && (item.code || item);
  }
}
