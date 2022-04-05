import {LitElement, html, customElement, property} from 'lit-element';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin-lit';
import {_addToCollection, _updateCollection, collectionExists} from '../../../mixins/permission-controller';
import {DateMixin} from '../../../mixins/date-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import '../../../common-elements/pages-header-element';
import './action-point-details';
import './action-point-comments';
import './open-view-history';
import '../../../common-elements/status-element';
import {pageLayoutStyles} from '../../../styles/page-layout-styles-lit';
import {sharedStyles} from '../../../styles/shared-styles-lit';
import {mainPageStyles} from '../../../styles/main-page-styles';
import {moduleStyles} from '../../../styles/module-styles-lit';
import {ActionPointDetails} from './action-point-details';
import {sendRequest} from '@unicef-polymer/etools-ajax';

@customElement('action-points-item')
export class ActionPointsItem extends ErrorHandlerMixin(InputAttrsMixin(DateMixin(LitElement))) {
  @property({type: Object}) // , notify: true
  route: any;

  @property({type: String})
  routeData: string;

  @property({type: Object})
  actionPoint: any = {};

  @property({type: Object})
  originalActionPoint: any = {};

  @property({type: Object}) // , notify: true
  permissionPath: string;

  @property({type: Object})
  historyDialog: any;

  @property({type: Number})
  actionPointId: number;

  render() {
    return html`
      ${pageLayoutStyles} ${sharedStyles} ${mainPageStyles} ${moduleStyles}
      <style include="iron-flex">
        #pageContent > * {
          display: block;
          margin-bottom: 25px;
        }

        .header-btn {
          color: var(--gray-mid);
          font-weight: 500;
          font-size: 14px;
        }

        .header-btn iron-icon {
          margin-right: 8px;
        }
      </style>

      <app-route
        .route="${this.route}"
        @route-changed="${this._routeChanged}"
        pattern="/:id"
        .data="${this.routeData}"
        @data-changed="${this._routeDataChanged}"
      >
      </app-route>

      <div .hidden="${!this.actionPoint.id}">
        <pages-header-element
          page-title="${this.actionPoint.reference_number}"
          export-links="${this._setExportLinks(this.actionPoint)}"
        >
          <paper-button
            icon="history"
            class="header-btn"
            @tap="${this.showHistory}"
            ?hidden="${!this.hasHistory(this.actionPoint.history)}"
          >
            <iron-icon icon="history"></iron-icon>
            History
          </paper-button>
        </pages-header-element>

        <div class="view-container" id="main">
          <div id="pageContent">
            <action-point-details
              .actionPoint="${this.actionPoint}"
              .originalActionPoint="${this.originalActionPoint}"
              .permissionPath="${this.permissionPath}"
            ></action-point-details>
            <action-point-comments .actionPoint="${this.actionPoint}" .permissionPath="${this.permissionPath}">
            </action-point-comments>
          </div>

          <div id="sidebar">
            <status-element
              .actionPoint="${this.actionPoint}"
              .permissionPath="${this.permissionPath}"
            ></status-element>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._createHistoryDialog();
    this.addEventListener('action-activated', ({detail}: any) => {
      if (detail.type === 'save') {
        const request = this._update();
        request &&
          request
            .then(() => {
              this._loadOptions(this.actionPointId);
            })
            .catch((err: any) => console.log(err));
      } else if (detail.type === 'complete') {
        const request = this._complete();
        request &&
          request
            .then(() => {
              this._loadOptions(this.actionPointId);
            })
            .catch((err: any) => console.log(err));
      }
    });
  }

  _createHistoryDialog() {
    this.historyDialog = document.createElement('open-view-history');
    document.querySelector('body').appendChild(this.historyDialog);
  }

  _routeChanged({detail}: CustomEvent) {
    this._changeRoutePath(detail.value.path);
  }

  _routeDataChanged({detail}: CustomEvent) {
    this._changeActionPointId(detail.value);
  }

  _updateHistoryProp() {
    if (this.historyDialog) {
      this.historyDialog.actionPoint = this.actionPoint;
      this.historyDialog.permissionPath = this.permissionPath;
    }
  }

  _changeRoutePath(path: string) {
    if (!path) {
      return;
    }
    if (!path.match(/[^\\/]/g)) {
      this.dispatchEvent(
        new CustomEvent('404', {
          bubbles: true,
          composed: true
        })
      );
    }
    this.shadowRoot.querySelector('action-point-details').dispatchEvent(new CustomEvent('reset-validation'));
  }

  _changeActionPointId(data: any) {
    this.actionPointId = data.id;
    if (!this.actionPointId) {
      return;
    }
    this.actionPoint = {};
    const endpoint = getEndpoint('actionPoint', this.actionPointId);
    this._loadOptions(this.actionPointId);
    sendRequest({
      method: 'GET',
      endpoint
    })
      .then((result: any) => {
        this.originalActionPoint = JSON.parse(JSON.stringify(result));
        this.actionPoint = this._prepareActionPoint(result);
      })
      .catch((err: any) => {
        console.log(err);
        this.dispatchEvent(
          new CustomEvent('404', {
            bubbles: true,
            composed: true
          })
        );
      });
  }

  _loadOptions(id: number) {
    const permissionPath = `action_points_${id}`;
    const endpoint = getEndpoint('actionPoint', id);
    return sendRequest({
      method: 'OPTIONS',
      endpoint
    })
      .then((data: any) => {
        const actions = data && data.actions;
        this.permissionPath = '';
        if (!collectionExists(permissionPath)) {
          _addToCollection(permissionPath, actions);
        } else {
          _updateCollection(permissionPath, actions);
        }
        setTimeout(() => {
          this.permissionPath = permissionPath;
        });
      })
      .catch((err) => {
        console.log(err);
        this._responseError('Action Point Permissions', 'request error');
        this.dispatchEvent(
          new CustomEvent('404', {
            bubbles: true,
            composed: true
          })
        );
        this.permissionPath = permissionPath;
      });
  }

  _prepareActionPoint(actionPoint: any) {
    return this._resolveFields(actionPoint, [
      'category',
      'partner',
      'intervention',
      'office',
      'location',
      'section',
      'assigned_to',
      'assigned_by',
      'cp_output',
      'author'
    ]);
  }

  _resolveFields(actionPoint: any, fields: string[]) {
    const data: any = actionPoint || {};
    for (const field of fields) {
      const fieldValue = data[field];
      if (fieldValue && fieldValue.id) {
        data[field] = fieldValue.id;
      }
    }
    return data;
  }

  _complete() {
    const endpoint = getEndpoint('actionPointComplete', this.actionPointId);

    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          loadingSource: 'ap-complete',
          active: true,
          message: 'Completing Action Point...'
        },
        bubbles: true,
        composed: true
      })
    );

    return sendRequest({
      method: 'POST',
      endpoint
    })
      .then((data: any) => {
        this.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully completed.'
            },
            bubbles: true,
            composed: true
          })
        );
        this.originalActionPoint = JSON.parse(JSON.stringify(data));
        this.actionPoint = this._prepareActionPoint(data);
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
      })
      .finally(() => {
        this.dispatchEvent(
          new CustomEvent('global-loading', {
            detail: {
              loadingSource: 'ap-complete'
            },
            bubbles: true,
            composed: true
          })
        );
      });
  }

  _getChangedData(oldData: any, newData: any) {
    const obj: any = {};
    Object.keys(newData).forEach((key) => {
      if (oldData[key] !== newData[key]) {
        obj[key] = newData[key];
      }
    });
    return obj;
  }

  _update() {
    const detailsElement = this.shadowRoot!.querySelector('action-point-details') as any as ActionPointDetails;
    if (!detailsElement || !detailsElement.validate()) {
      // @ts-ignore
      return;
    }

    const editedData = JSON.parse(JSON.stringify(detailsElement.editedItem));
    const data = this._getChangedData(this.actionPoint, editedData);
    const endpoint = getEndpoint('actionPoint', this.actionPointId);

    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          loadingSource: 'ap-update',
          active: true,
          message: 'Update Action Point...'
        },
        bubbles: true,
        composed: true
      })
    );

    return sendRequest({
      method: 'PATCH',
      endpoint,
      body: data
    })
      .then((data: any) => {
        this.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully updated.'
            },
            bubbles: true,
            composed: true
          })
        );
        this.originalActionPoint = JSON.parse(JSON.stringify(data));
        this.actionPoint = this._prepareActionPoint(data);
        this.dispatchEvent(
          new CustomEvent('global-loading', {
            detail: {
              loadingSource: 'ap-update'
            },
            bubbles: true,
            composed: true
          })
        );
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
      });
  }

  showHistory() {
    this._updateHistoryProp();
    this.historyDialog.open();
  }

  hasHistory(history: string[]) {
    return history && history.length > 0;
  }

  _setExportLinks(actionPoint: any) {
    if (!actionPoint || !actionPoint.id) {
      return '';
    }

    return [
      {
        name: 'Export CSV',
        url: getEndpoint('actionPointExport', actionPoint.id).url
      }
    ];
  }
}
