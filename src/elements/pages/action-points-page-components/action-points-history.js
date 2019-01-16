import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory';
import {moduleStyles} from '../../styles-elements/module-styles';
import 'etools-data-table';

class ActionPointsHistory extends EtoolsMixinFactory.combineMixins([
  APDMixins.InputAttrs,
  APDMixins.DateMixin
], PolymerElement) {
  static get template() {
    return html`
      ${moduleStyles}
      <style include="iron-flex">
        etools-data-table-header {
          --header-columns: {
            margin-left: 0;
          }
        }
      
        etools-data-table-row {
          --list-row-wrapper: {
            height: 48px;
          }
        }
      </style>
      
      <etools-data-table-header no-title>
        <etools-data-table-column class="flex">Date</etools-data-table-column>
        <etools-data-table-column class="flex">[[getLabel('history.by_user', permissionPath)]]>
        </etools-data-table-column>
        <etools-data-table-column class="flex">[[getLabel('history.action', permissionPath)]]>
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

  static properties() {
    return {
      history: {
        type: Array,
        value() {
          return [];
        }
      },
      permissionPath: String
    };
  }
}
customElements.define('action-points-history', ActionPointsHistory);
