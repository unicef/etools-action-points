import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '../common-elements/lodash';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icon/iron-icon';
import {moduleStyles} from '../styles-elements/module-styles';
/**
* @polymer
* @extends HTMLElement
*/
class ActionButtons extends PolymerElement {
  static get template() {
    return html`
      ${moduleStyles}
      <style>
        :host {
          position: relative;
          display: block;
          text-align: center;
          width: 100%;
        
          .main-action.text {
            font-weight: 500;
          }
        
          paper-button {
            height: 34px;
            color: #ffffff;
            background-color: var(--module-primary);
            margin: 0;
            width: 100%;
        
            span {
              padding: 0 29px;
            }
          }
        
          paper-button.with-menu {
            padding-right: calc(0.57em + 41px);
          }
        
          paper-menu-button {
            padding: 0;
            border-left: solid 1px rgba(255, 255, 255, 0.5);
            position: absolute;
            right: 0;
            top: 0;
            height: 34px;
            overflow: hidden;
        
            paper-icon-button {
              top: -2px;
            }
          }
        
          [slot="dropdown-content"] {
            padding: 6px 0;
          }
        
          .other-title {
            cursor: default;
            padding: 10px 20px;
            text-transform: uppercase;
            color: var(--gray-mid);
            white-space: nowrap;
            font-weight: 500;
          }
        
          .other-options {
            outline: none;
            min-width: 150px;
            text-align: left;
            padding: 13px;
            color: var(--gray-dark);
            font-weight: 500;
            white-space: nowrap;
        
            &:hover {
              background-color: rgba(0, 0, 0, 0.1);
            }
        
            .option-icon {
              width: 22px;
              height: 22px;
              margin-right: 15px;
              margin-left: 5px;
              color: var(--gray-mid);
              vertical-align: top;
            }
        
            span {
              vertical-align: top;
              margin-top: 1px;
              padding: 0;
              display: inline-block;
              height: 22px;
            }
          }
        }
      </style>

      <paper-button raised on-tap="_btnClicked"
                    class$="main-action status-tab-button {{withActionsMenu(actions.length)}}">
        <span class="main-action text">[[_setButtonText(actions.0)]]</span>
        <template is="dom-if" if="{{_showOtherActions(actions.length)}}">
          <paper-menu-button dynamic-align opened="{{statusBtnMenuOpened}}" class="option-button">
            <paper-icon-button icon="expand-more" slot="dropdown-trigger" class="option-button"></paper-icon-button>

            <paper-listbox slot="dropdown-content">
              <template is="dom-repeat" items="[[actions]]" filter="_filterActions" class="other-btns-template">
                <div class="other-options" on-tap="_btnClicked"
                     on-click="closeMenu" action-code$="[[_setActionCode(item)]]">
                  <iron-icon icon="[[_setIcon(item, icons)]]" class="option-icon"></iron-icon>
                  <span>{{_setButtonText(item)}}</span>
                </div>
              </template>
            </paper-listbox>
          </paper-menu-button>
        </template>
      </paper-button>
    `;
  }

  static get properties() {
    return {
      actions: {
        type: Array,
        value: () => {
          return [];
        }
      },
      icons: {
        type: Object,
        value: () => {
          return {
            'cancel': 'cancel',
            'save': 'save',
            'complete': 'assignment-turned-in'
          };
        }
      }
    };
  }

  closeMenu() {
    this.statusBtnMenuOpened = false;
  }

  _setButtonText(item) {
    if (!item) {
      return '';
    }
    let text = item.display_name || item.replace('_', ' ');

    if (!text) {
      throw new Error('Can not get button text!');
    }

    return text.toUpperCase();
  }

  _btnClicked(event) {
    if (!event || !event.target) {
      return;
    }
    let target = event.target.classList.contains('other-options') ?
      event.target : event.target.parentElement || event.target;
    let isMainAction = event.target.classList.contains('main-action');

    let action = isMainAction ?
      (this.actions[0].code || this.actions[0]) :
      target && target.getAttribute('action-code');

    if (action) {
      this.dispatchEvent(new CustomEvent('toast', {
        detail: {
          reset: true
        }
      }));
      this.dispatchEvent(new CustomEvent('action-activated', {
        detail: {
          type: action
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  _showOtherActions(length) {
    return length > 1;
  }

  withActionsMenu(length) {
    return length > 1 ? 'with-menu' : '';
  }

  _filterActions(action) {
    return !_.isEqual(action, this.actions[0]);
  }

  _setIcon(item, icons) {
    if (!icons || !item) {
      return '';
    }
    return icons[(item.code || item)] || '';
  }

  _setActionCode(item) {
    return item && (item.code || item);
  }
}

customElements.define('action-buttons', ActionButtons);
