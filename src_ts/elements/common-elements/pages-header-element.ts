import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
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

  @property({type: Boolean})
  lowResolutionLayout = false;

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

        etools-button-group.mw-150 {
          min-width: 150px;
          white-space: nowrap;
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

        .side-heading .grey-buttons etools-icon {
          margin-right: 8px;
        }
        .side-heading .add-btn {
          margin: 11px 4px 12px 18px;
        }
        @media (max-width: 576px) {
          .side-heading .add-btn {
            margin: unset;
          }
          etools-button {
            --sl-spacing-medium: 0px;
            min-width: var(--sl-input-height-medium);
          }
          .side-heading {
            padding: 0 20px;
          }
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
      <etools-media-query
        query="(max-width: 576px)"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></etools-media-query>
      <div class="header-wrapper">
        <div class="side-heading layout-horizontal align-items-center around-justified">
          <span class="flex-c title">${this._setTitle(this.pageData, this.pageTitle)}</span>

          <div class="layout-horizontal align-items-center">
            <div class="export-buttons" ?hidden="${!this.exportLinks?.length}">
              <etools-button-group
                id="dropdown"
                ?hidden="${!this._isDropDown(this.exportLinks)}"
                @click="${this._toggleOpened}"
                horizontal-align="right"
              >
                <etools-button slot="dropdown-trigger" class="grey-buttons">
                  <etools-icon name="file-download"></etools-icon>
                  Export
                </etools-button>

                <sl-dropdown
                  id="dropdownMenu"
                  placement="bottom-end"
                  @click="${(event: MouseEvent) => event.stopImmediatePropagation()}"
                >
                  <sl-menu>
                    ${this.exportLinks?.map(
                      (item) =>
                        html`
                          <sl-menu-item tracker="Export ${item.name}" @tap="${this.exportData}"
                            >${item.name}</sl-menu-item
                          >
                        `
                    )}
                  </sl-menu>
                </sl-dropdown>
              </etools-button-group>
              <etools-button
                class="neutral"
                variant="text"
                tracker="Export"
                ?hidden="${!this.showExportButton || this._isDropDown(this.exportLinks)}"
                @click="${this.exportData}"
              >
                <etools-icon name="file-download"></etools-icon>
                ${this.lowResolutionLayout ? '' : 'Export'}
              </etools-button>
            </div>

            <etools-button
              class="add-btn"
              variant="primary"
              tracker="Add Action Point"
              ?hidden="${this._hideAddButton(this.showAddButton)}"
              @click="${this.addNewTap}"
              href="${this.link}"
            >
              <etools-icon name="add" slot="prefix"></etools-icon>
              ${this.lowResolutionLayout ? '' : this.btnText}
            </etools-button>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  _toggleOpened() {
    const dropdown: any = this.shadowRoot?.querySelector('#dropdownMenu');
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
