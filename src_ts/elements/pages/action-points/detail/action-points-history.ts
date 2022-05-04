import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {DateMixin} from '../../../mixins/date-mixin';
import {moduleStyles} from '../../../styles/module-styles-lit';
import {gridLayoutStylesLit} from '@unicef-polymer/etools-modules-common/dist/styles/grid-layout-styles-lit';
import {dataTableStylesLit} from '@unicef-polymer/etools-data-table/data-table-styles-lit';

@customElement('action-points-history')
export class ActionPointsHistory extends DateMixin(InputAttrsMixin(LitElement)) {
  @property({type: Array})
  history: any[] = [];

  @property({type: String})
  permissionPath: string;

  static get styles() {
    // language=CSS
    return [gridLayoutStylesLit];
  }

  render() {
    return html`
      ${moduleStyles}
      <style include="iron-flex">
        ${dataTableStylesLit} etools-data-table-header::part(edt-data-table-header) {
          margin-left: 0;
        }

        etools-data-table-row::part(edt-list-row-wrapper) {
          height: 48px;
        }
      </style>

      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="flex-c">Date</etools-data-table-column>
        <etools-data-table-column class="flex-c"
          >${this.getLabel('history.by_user_display', this.permissionPath)}
        </etools-data-table-column>
        <etools-data-table-column class="flex-c"
          >${this.getLabel('history.action', this.permissionPath)}
        </etools-data-table-column>
      </etools-data-table-header>
      ${this.history?.map(
        (historyItem) => html`
          <etools-data-table-row no-collapse>
            <div slot="row-data" class="layout horizontal">
              <span class="col-data flex-c">${this.prettyDate(historyItem.created)}</span>
              <span class="col-data flex-c">${historyItem.by_user_display}</span>
              <span class="col-data flex-c">${historyItem.action}</span>
            </div>
          </etools-data-table-row>
        `
      )}
    `;
  }
}
