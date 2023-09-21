import {LitElement, property, html, customElement} from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-listbox/paper-listbox.js';
import {PaperListboxElement} from '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-icon/iron-icon.js';
import {sharedStyles} from '../styles/shared-styles';
import {moduleStyles} from '../styles/module-styles';
import {GenericObject} from '../../typings/globals.types';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('pages-header-element')
export class PagesHeaderElement extends MatomoMixin(LitElement) {
  @property({type: String, attribute: 'page-title'})
  pageTitle: string;

  @property({type: String, attribute: 'btn-text'})
  btnText: string;

  @property({type: Boolean, attribute: 'show-add-button'})
  showAddButton = false;

  @property({type: Boolean, reflect: true, attribute: 'show-export-button'})
  showExportButton = false;

  @property({type: String})
  link = '';

  @property({type: Object})
  pageData: any;

  @property({type: String})
  exportLinks: GenericObject[];

  @property({type: String})
  downloadLetterUrl = '';

  static get styles() {
    return [gridLayoutStylesLit];
  }

  render() {
    return html`
      ${sharedStyles} ${moduleStyles}
      <style>
        :host {
          position: relative;
          display: block;
        }

        paper-menu-button.mw-150 {
          min-width: 150px;
          white-space: nowrap;
        }

        paper-item {
          cursor: pointer;
        }

        .export-buttons:not([hidden]) {
          display: inline-block;
        }

        .visit-letter {
          margin: 8px;
        }

        .header-wrapper {
          background-color: white;
        }

        .side-heading {
          margin: 0;
          height: 80px;
          padding: 0 48px;
          box-sizing: border-box;
        }

        .side-heading span.title {
          font-size: 24px;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .side-heading .grey-buttons {
          color: var(--gray-mid);
          font-weight: 500;
          font-size: 14px;
        }

        .side-heading .grey-buttons iron-icon {
          margin-right: 8px;
        }

        .side-heading paper-button.add-btn {
          background-color: var(--module-primary);
          color: white;
          height: 36px;
          font-weight: 500;
          padding-left: 10px;
          padding-right: 15px;
        }

        .side-heading paper-button.add-btn span {
          margin-left: 4px;
        }

        .side-heading .add-btn {
          margin: 11px 4px 12px 18px;
          background-color: var(--module-primary);
        }

        .btn-link {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }
      </style>

      <div class="header-wrapper">
        <div class="side-heading layout-horizontal align-items-center around-justified">
          <span class="flex-c title">${this._setTitle(this.pageData, this.pageTitle)}</span>

          <div class="layout-horizontal align-items-center">
            <div class="export-buttons" ?hidden="${!this.exportLinks?.length}">
              <paper-menu-button
                id="dropdown"
                ?hidden="${!this._isDropDown(this.exportLinks)}"
                @tap="${this._toggleOpened}"
                horizontal-align="right"
              >
                <paper-button slot="dropdown-trigger" class="grey-buttons">
                  <iron-icon icon="file-download"></iron-icon>
                  Export
                </paper-button>

                <paper-listbox id="dropdownMenu" slot="dropdown-content">
                  ${this.exportLinks?.map(
                    (item) =>
                      html`
                        <paper-item tracker="Export ${item.name}" @tap="${this.exportData}">${item.name}</paper-item>
                      `
                  )}
                </paper-listbox>
              </paper-menu-button>
              <paper-button
                class="grey-buttons"
                tracker="Export"
                ?hidden="${!this.showExportButton || this._isDropDown(this.exportLinks)}"
                @tap="${this.exportData}"
              >
                <iron-icon icon="file-download"></iron-icon>
                Export
              </paper-button>
            </div>

            <paper-button
              class="add-btn"
              raised
              tracker="Add Action Point"
              ?hidden="${this._hideAddButton(this.showAddButton)}"
              @tap="${this.addNewTap}"
            >
              <a href="${this.link}" class="btn-link" ?hidden="${!this._showLink(this.link)}"></a>
              <iron-icon icon="add"></iron-icon>
              <span>${this.btnText}</span>
            </paper-button>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  _toggleOpened() {
    const dropdown: PaperListboxElement = this.shadowRoot.querySelector('#dropdownMenu');
    dropdown.select(null);
  }

  _hideAddButton(show: boolean) {
    return !show;
  }

  addNewTap(e: CustomEvent) {
    this.trackAnalytics(e);
    fireEvent(this, 'add-new-tap');
  }

  _showLink(link: string) {
    return !!link;
  }

  _setTitle(pageData: any, title: string) {
    if (!pageData || !pageData.unique_id) {
      return title;
    }
    return pageData.unique_id;
  }

  exportData(e: any) {
    if (this.exportLinks.length < 1) {
      throw new Error('Can not find export link!');
    }
    this.trackAnalytics(e);
    const url = e && e.model && e.model.item ? e.model.item.url : this.exportLinks[0].url;
    window.open(url, '_blank');
  }

  _isDropDown(exportLinks: any[]) {
    return exportLinks && (exportLinks.length > 1 || (exportLinks[0] && exportLinks[0].useDropdown));
  }
}
