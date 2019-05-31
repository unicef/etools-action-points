import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-tooltip/paper-tooltip';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import EndpointMixin from '../app-mixins/endpoint-mixin';
import {sharedStyles} from '../styles-elements/shared-styles';
import {moduleStyles} from '../styles-elements/module-styles';

class PagesHeaderElement extends EndpointMixin(PolymerElement) {

  static get template() {
    return html`
      ${sharedStyles}
      ${moduleStyles}
      <style include="iron-flex">
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
        <div class="side-heading horizontal layout center around-justified">
          <span class="flex title">[[_setTitle(pageData, pageTitle)]]</span>
      
          <div class="horizontal layout center">
            <div class="export-buttons" hidden$="[[!exportLinks.length]]">
              <paper-menu-button id="dropdown" hidden$="[[!_isDropDown(exportLinks)]]" on-tap="_toggleOpened"
                horizontal-align="right">
                <paper-button slot="dropdown-trigger" class="grey-buttons">
                  <iron-icon icon="file-download"></iron-icon>
                  Export
                </paper-button>
      
                <paper-listbox id="dropdownMenu" slot="dropdown-content">
                  <template is="dom-repeat" items="[[exportLinks]]">
                    <paper-item on-tap="exportData">[[item.name]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-menu-button>
      
              <paper-button class="grey-buttons" hidden$="[[_isDropDown(exportLinks)]]" on-tap="exportData">
                <iron-icon icon="file-download"></iron-icon>
                Export
              </paper-button>
            </div>
      
            <paper-button class="add-btn" raised hidden$="[[_hideAddButton(showAddButton)]]" on-tap="addNewTap">
              <template is="dom-if" if="{{_showLink(link)}}"><a href$="{{link}}" class="btn-link"></a></template>
              <iron-icon icon="add"></iron-icon>
              <span>[[btnText]]</span>
            </paper-button>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      pageTitle: String,
      btnText: String,
      showAddButton: {
        type: Boolean,
        value: false
      },
      link: {
        type: String,
        value: ''
      },
      pageData: {
        type: Object,
        value: () => {
          return {};
        }
      },
      exportLinks: {
        type: Array,
        value: () => {
          return [];
        }
      },
      downloadLetterUrl: {
        type: String,
        value: ''
      }
    };
  }

  _toggleOpened() {
    this.$.dropdownMenu.select(null);
  }

  _hideAddButton(show: boolean) {
    return !show;
  }

  addNewTap() {
    this.dispatchEvent(new CustomEvent('add-new-tap'));
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
    if (this.exportLinks < 1) {
      throw new Error('Can not find export link!');
    }
    let url = (e && e.model && e.model.item) ? e.model.item.url : this.exportLinks[0].url;
    window.open(url, '_blank');
  }

  _isDropDown(exportLinks: any[]) {
    return exportLinks && (exportLinks.length > 1 ||
      (exportLinks[0] && exportLinks[0].useDropdown));
  }

}

customElements.define('pages-header-element', PagesHeaderElement);
