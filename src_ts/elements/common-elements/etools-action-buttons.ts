import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
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
          display: flex;
          flex-direction: row;
        }

        etools-button-group {
          --etools-button-group-color: var(--primary-color);
        }

        etools-button.sl-button-group__button {
          margin-inline: 0px !important;
          --sl-spacing-medium: 10px;
        }

        etools-button[slot='trigger'] {
          width: 45px;
          min-width: 45px;
          border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
          margin-inline: 0px;
          --sl-spacing-medium: 0;
        }
        etools-button#primary {
          flex: 1;
        }
        .main-action {
          width: 100%;
        }
        etools-button.arrowBtn {
          min-width: 0px;
          --sl-spacing-medium: 0px;
          --sl-spacing-small: 5px;
        }

        sl-menu-item::part(label) {
          text-transform: uppercase;
        }
      </style>
      <etools-button-group>
        <etools-button
          variant="primary"
          raised
          @click="${this._btnClicked}"
          class="main-action ${this.withActionsMenu(this.actions?.length)}"
        >
          <span class="main-action">${this._setButtonText(this.actions?.[0])}</span>
        </etools-button>

        <sl-dropdown
          .opened="${this.statusBtnMenuOpened}"
          ?hidden="${!this._showOtherActions(this.actions?.length)}"
          @click="${(event: MouseEvent) => event.stopImmediatePropagation()}"
          placement="bottom-end"
        >
          <etools-button slot="trigger" class="option-icon" variant="primary" caret></etools-button>
          <sl-menu>
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
      </etools-button-group>
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
