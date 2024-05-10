import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {DateMixin} from '../../../mixins/date-mixin';
import {moduleStyles} from '../../../styles/module-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';

@customElement('action-points-history')
export class ActionPointsHistory extends DateMixin(InputAttrsMixin(LitElement)) {
  @property({type: Array})
  history: any[] = [];

  @property({type: String})
  permissionPath?: string;

  @property({type: Boolean})
  lowResolutionLayout = false;
  render() {
    return html`
      ${moduleStyles}
      <style>
        ${dataTableStylesLit} etools-data-table-header::part(edt-data-table-header) {
          margin-left: 0;
        }
        .w-100 {
          width: 100%;
        }
      </style>
      <etools-media-query
        query="(max-width: 767px)"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></etools-media-query>
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="col-md-4 col-12" field="date">Date</etools-data-table-column>
        <etools-data-table-column
          class="col-md-4 col-12"
          field="${this.getLabel('history.by_user_display', this.permissionPath)}"
          >${this.getLabel('history.by_user_display', this.permissionPath)}
        </etools-data-table-column>
        <etools-data-table-column
          class="col-md-4 col-12"
          field="${this.getLabel('history.action', this.permissionPath)}"
          >${this.getLabel('history.action', this.permissionPath)}
        </etools-data-table-column>
      </etools-data-table-header>
      ${this.history?.map(
        (historyItem) => html`
          <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data">
              <span class="col-data col-md-4 col-12" data-col-header-label="date"
                >${this.prettyDate(historyItem.created)}</span
              >
              <span
                class="col-data col-md-4 col-12"
                data-col-header-label="${this.getLabel('history.by_user_display', this.permissionPath)}"
                >${historyItem.by_user_display}</span
              >
              <span
                class="col-data col-md-4 col-12"
                data-col-header-label="${this.getLabel('history.action', this.permissionPath)}"
                >${historyItem.action}</span
              >
            </div>
          </etools-data-table-row>
        `
      )}
    `;
  }
  static get styles() {
    // language=CSS
    return [layoutStyles];
  }
}
