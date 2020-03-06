import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {getEndpoint} from '../../app-mixins/endpoint-mixin';
import {ErrorHandler} from '../../app-mixins/error-handler-mixin';
import {_addToCollection, _updateCollection, collectionExists} from '../../app-mixins/permission-controller';
import {DateMixin} from '../../app-mixins/date-mixin';
import {InputAttrs} from '../../app-mixins/input-attrs-mixin';
import '../../common-elements/pages-header-element';
import './action-point-details';
import './action-point-comments';
import './open-view-history';
import '../../common-elements/status-element';
import {pageLayoutStyles} from '../../styles-elements/page-layout-styles';
import {sharedStyles} from '../../styles-elements/shared-styles';
import {mainPageStyles} from '../../styles-elements/main-page-styles';
import {moduleStyles} from '../../styles-elements/module-styles';
import {customElement, property, observe} from '@polymer/decorators';
import {ActionPointDetails} from './action-point-details';

@customElement('action-points-item')
export class ActionPointsItem extends
  EtoolsAjaxRequestMixin(
      ErrorHandler(
          InputAttrs(
              DateMixin(PolymerElement)))) {

  public static get template() {
    return html`
      ${pageLayoutStyles}
      ${sharedStyles}
      ${mainPageStyles}
      ${moduleStyles}
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

      <app-route route="{{route}}" pattern="/:id" data="{{routeData}}"></app-route>
      <div hidden$="[[!actionPoint.id]]">
        <pages-header-element page-title="[[actionPoint.reference_number]]" 
                              export-links="[[_setExportLinks(actionPoint)]]">
          <template is="dom-if" if="[[hasHistory(actionPoint.history)]]">
            <paper-button icon="history" class="header-btn" on-tap="showHistory">
              <iron-icon icon="history"></iron-icon>
              History
            </paper-button>
          </template>
        </pages-header-element>

        <div class="view-container" id="main">
          <div id="pageContent">
            <action-point-details action-point="[[actionPoint]]" original-action-point="[[originalActionPoint]]"
              permission-path="[[permissionPath]]"></action-point-details>
            <action-point-comments action-point="{{actionPoint}}" permission-path="[[permissionPath]]">
            </action-point-comments>
          </div>

          <div id="sidebar">
            <status-element action-point="[[actionPoint]]" permission-path="[[permissionPath]]"></status-element>
          </div>
        </div>
      </div>
    `;
  }

  @property({type: Object, notify: true})
  route: object;

  @property({type: String})
  routeData: string;

  @property({type: Object})
  actionPoint: object = {};

  @property({type: Object, notify: true})
  permissionPath: string;

  @property({type: Object})
  historyDialog: any;

  @property({type: Number})
  actionPointId: number;

  ready() {
    super.ready();
    this._createHistoryDialog();
    this.addEventListener('action-activated', ({detail}: any) => {
      if (detail.type === 'save') {
        let request = this._update();
        request && request.then(() => {
          this._loadOptions(this.actionPointId);
        }).catch((err: any) => console.log(err));
      } else if (detail.type === 'complete') {
        let request = this._complete();
        request && request.then(() => {
          this._loadOptions(this.actionPointId);
        }).catch((err: any) => console.log(err));
      }
    });
  }

  _createHistoryDialog() {
    this.set('historyDialog', document.createElement('open-view-history'));
    document.querySelector('body').appendChild(this.historyDialog);
  }

  @observe('actionPoint')
  _updateHistoryProp() {
    if (this.historyDialog) {
      this.historyDialog.actionPoint = this.actionPoint;
    }
  }

  @observe('route.path')
  _changeRoutePath(path: string) {
    if (!path) {
      return;
    }
    if (!path.match(/[^\\/]/g)) {
      this.dispatchEvent(new CustomEvent('404', {
        bubbles: true,
        composed: true
      }));
    }
    this.shadowRoot.querySelector('action-point-details').dispatchEvent(new CustomEvent('reset-validation'));
  }

  @observe('routeData')
  _changeActionPointId(data: any) {
    this.set('actionPointId', data.id);
    if (!this.actionPointId) {
      return;
    }
    this.set('actionPoint', {});
    let endpoint = getEndpoint('actionPoint', this.actionPointId);
    this._loadOptions(this.actionPointId);
    this.sendRequest({
      method: 'GET',
      endpoint
    })
        .then((result: any) => {
          this.set('originalActionPoint', JSON.parse(JSON.stringify(result)));
          this.set('actionPoint', this._prepareActionPoint(result));
        }).catch((err: any) => console.log(err));
  }

  _loadOptions(id: number) {
    let permissionPath = `action_points_${id}`;
    let endpoint = getEndpoint('actionPoint', id);
    return this.sendRequest({
      method: 'OPTIONS',
      endpoint
    })
        .then((data: any) => {
          let actions = data && data.actions;
          if (!collectionExists(permissionPath)) {
            _addToCollection(permissionPath, actions);
          } else {
            _updateCollection(permissionPath, actions);
            this.set('permissionPath', '');
          }
          this.set('permissionPath', permissionPath);
        })
        .catch(() => {
          this._responseError('Action Point Permissions', 'request error');
          this.dispatchEvent(new CustomEvent('404', {
            bubbles: true,
            composed: true
          }));
          this.set('permissionPath', permissionPath);
        });
  }

  _prepareActionPoint(actionPoint: object) {
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

  _resolveFields(actionPoint: object, fields: string[]) {
    let data: any = actionPoint || {};
    for (let field of fields) {
      let fieldValue = data[field];
      if (fieldValue && fieldValue.id) {
        data[field] = fieldValue.id;
      }
    }
    return data;
  }

  _complete() {
    let endpoint = getEndpoint('actionPointComplete', this.actionPointId);

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'ap-complete',
        active: true,
        message: 'Completing Action Point...'
      },
      bubbles: true,
      composed: true
    }));

    return this.sendRequest({
      method: 'POST',
      endpoint
    })
        .then((data: any) => {
          this.dispatchEvent(new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully completed.'
            },
            bubbles: true,
            composed: true
          }));
          this.set('originalActionPoint', JSON.parse(JSON.stringify(data)));
          this.set('actionPoint', this._prepareActionPoint(data));
        })
        .catch((err: any) => {
          this.errorHandler(err, this.permissionPath);
        })
        .finally(() => {
          this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {
              type: 'ap-complete'
            },
            bubbles: true,
            composed: true
          }));
        });
  }

  _getChangedData(oldData: any, newData: any) {
    let obj: any = {};
    Object.keys(newData).forEach((key) => {
      if (oldData[key] !== newData[key]) {
        obj[key] = newData[key];
      }
    });
    return obj;
  }

  _update() {
    let detailsElement: ActionPointDetails = this.shadowRoot.querySelector('action-point-details');
    if (!detailsElement || !detailsElement.validate()) {
      return;
    }

    let editedData = JSON.parse(JSON.stringify(detailsElement.editedItem));
    let data = this._getChangedData(this.actionPoint, editedData);
    let endpoint = getEndpoint('actionPoint', this.actionPointId);

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'ap-update',
        active: true,
        message: 'Update Action Point...'
      },
      bubbles: true,
      composed: true
    }));

    return this.sendRequest({
      method: 'PATCH',
      endpoint,
      body: data
    })
        .then((data: any) => {
          this.dispatchEvent(new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully updated.'
            },
            bubbles: true,
            composed: true
          }));
          this.set('originalActionPoint', JSON.parse(JSON.stringify(data)));
          this.set('actionPoint', this._prepareActionPoint(data));
          this.dispatchEvent(new CustomEvent('global-loading', {
            detail: {
              type: 'ap-update'
            },
            bubbles: true,
            composed: true
          }));
        })
        .catch((err: any) => {
          this.errorHandler(err, this.permissionPath);
        });
  }

  showHistory() {
    this.historyDialog.open();
  }

  hasHistory(history: string[]) {
    return history && history.length > 0;
  }

  _setExportLinks(actionPoint: any) {
    if (!actionPoint || !actionPoint.id) {
      return '';
    }

    return [{
      name: 'Export CSV',
      url: getEndpoint('actionPointExport', actionPoint.id).url
    }];
  }
}
