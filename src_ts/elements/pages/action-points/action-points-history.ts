import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {InputAttrsMixin} from '../../mixins/input-attrs-mixin';
import {DateMixin} from '../../mixins/date-mixin';
import {moduleStyles} from '../../styles/module-styles';
import {customElement, property} from '@polymer/decorators';

@customElement('action-points-history')
export class ActionPointsHistory extends DateMixin(InputAttrsMixin(PolymerElement)) {
  public static get template() {
    return html`
      ${moduleStyles}
      <style include="iron-flex">
        etools-data-table-header::part(edt-data-table-header) {
          margin-left: 0;
        }

        etools-data-table-row::part(edt-list-row-wrapper) {
          height: 48px;
        }
      </style>

      <etools-data-table-header no-title>
        <etools-data-table-column class="flex">Date</etools-data-table-column>
        <etools-data-table-column class="flex"
          >[[getLabel('history.by_user_display', permissionPath)]]
        </etools-data-table-column>
        <etools-data-table-column class="flex"
          >[[getLabel('history.action', permissionPath)]]
        </etools-data-table-column>
      </etools-data-table-header>
      <template id="rows" is="dom-repeat" items="[[history]]" as="historyItem">
        <etools-data-table-row no-collapse>
          <div slot="row-data" class="layout horizontal">
            <span class="layout horizontal center flex col-data">[[prettyDate(historyItem.created)]]</span>
            <span class="layout horizontal center flex col-data">[[historyItem.by_user_display]]</span>
            <span class="layout horizontal center flex col-data">[[historyItem.action]]</span>
          </div>
        </etools-data-table-row>
      </template>
    `;
  }

  @property({type: Array})
  history: any[] = [];

  @property({type: String})
  permissionPath: string;
}
