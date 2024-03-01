import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {ErrorHandlerMixin} from '../../../mixins/error-handler-mixin';
import {_addToCollection, _updateCollection, collectionExists} from '../../../mixins/permission-controller';
import {DateMixin} from '../../../mixins/date-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import '../../../common-elements/pages-header-element';
import './action-point-details';
import './action-point-comments';
import './open-view-history';
import '../../../common-elements/status-element';
import './add-verifier-dialog';
import './verify-dialog';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {sharedStyles} from '../../../styles/shared-styles';
import {mainPageStyles} from '../../../styles/main-page-styles';
import {moduleStyles} from '../../../styles/module-styles';
import {ActionPointDetails} from './action-point-details';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {connect} from 'pwa-helpers';
import {RootState, store} from '../../../../redux/store';
import get from 'lodash-es/get';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {UserControllerMixin} from '../../../mixins/user-controller';
import {GenericObject} from '@unicef-polymer/etools-types';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';

@customElement('action-points-item')
export class ActionPointsItem extends connect(store)(
  ErrorHandlerMixin(InputAttrsMixin(DateMixin(UserControllerMixin(LitElement))))
) {
  @property({type: Object}) // , notify: true
  route: any;

  @property({type: String})
  routeData?: string;

  @property({type: Object})
  actionPoint: any = {};

  @property({type: Array})
  apUnicefUsers: any = [];

  @property({type: Object})
  originalActionPoint: any = {};

  @property({type: Object}) // , notify: true
  permissionPath!: string;

  @property({type: Object})
  historyDialog: any;

  @property({type: Object})
  profile!: GenericObject;

  @property({type: Number})
  actionPointId!: number;

  render() {
    return html`
      ${pageLayoutStyles} ${sharedStyles} ${mainPageStyles} ${moduleStyles}
      <style>
        #pageContent > * {
          display: block;
          margin-bottom: 25px;
        }

        .header-btn etools-icon {
          margin-right: 8px;
        }
      </style>

      <div .hidden="${!this.actionPoint.id}">
        <pages-header-element
          page-title="${this.actionPoint.reference_number}"
          export-links="${this._setExportLinks(this.actionPoint)}"
        >
          <etools-button
            icon="history"
            class="neutral"
            variant="text"
            @click="${this.showHistory}"
            ?hidden="${!this.hasHistory(this.actionPoint.history)}"
          >
            <etools-icon name="history"></etools-icon>
            History
          </etools-button>
        </pages-header-element>

        <div class="view-container" id="main">
          <div id="pageContent">
            <action-point-details
              .actionPoint="${this.actionPoint}"
              .apUnicefUsers="${this.apUnicefUsers}"
              .originalActionPoint="${this.originalActionPoint}"
              .permissionPath="${this.permissionPath}"
            ></action-point-details>
            <action-point-comments .actionPoint="${this.actionPoint}" .permissionPath="${this.permissionPath}">
            </action-point-comments>
          </div>

          <div id="sidebar">
            ${this.actionPoint.id
              ? html`<status-element
                  .actionPoint="${this.actionPoint}"
                  .permissionPath="${this.permissionPath}"
                ></status-element>`
              : ''}
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback(): void {
    this._changeActionPointId = debounce(this._changeActionPointId.bind(this), 300);
    super.connectedCallback();

    this.profile = this.getUserData();

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
        this._processCompleteAction();
      } else if (detail.type === 'verify') {
        this._processVerifyAction();
      }
    });
  }

  async _processCompleteAction() {
    let confirmed = true;
    let verifierId = null;
    if (this.actionPoint.high_priority && String(this.profile.user) === String(this.actionPoint.author)) {
      const resp = await openDialog({
        dialog: 'add-verifier-dialog',
        dialogData: {
          permissionPath: this.permissionPath,
          actionPoint: this.actionPoint
        }
      }).then(({confirmed, response}) => {
        return {confirmed: confirmed, verifierId: response};
      });
      ({confirmed, verifierId} = resp);
    }

    if (!confirmed) {
      return;
    }

    this._complete(verifierId)
      .then(() => {
        this._loadOptions(this.actionPointId);
      })
      .catch((err: any) => console.log(err));
  }

  async _processVerifyAction() {
    openDialog({
      dialog: 'verify-dialog',
      dialogData: {}
    }).then(({confirmed, response}) => {
      if (confirmed) {
        this._makeUpdateRequest({is_adequate: response}).then(() => {
          this._loadOptions(this.actionPointId);
        });
      }
    });
  }

  _createHistoryDialog() {
    this.historyDialog = document.createElement('open-view-history');
    document.querySelector('body')?.appendChild(this.historyDialog);
  }

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
    if (!(routeDetails?.routeName === 'action-points' && routeDetails?.subRouteName === 'detail')) {
      return; // Avoid code execution while on a different page
    }
    const stateRouteDetails = {...state.app!.routeDetails};
    this._routeDataChanged(stateRouteDetails.params!.id as number);
  }

  _routeChanged({detail}: CustomEvent) {
    this._changeRoutePath(detail.value.path);
  }

  _routeDataChanged(id: number) {
    this._changeActionPointId(id);
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
      fireEvent(this, '404');
    }
    this.shadowRoot!.querySelector('action-point-details')?.dispatchEvent(new CustomEvent('reset-validation'));
  }

  _changeActionPointId(id: number) {
    this.actionPointId = id;
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
        const apData = this._prepareActionPoint(result);
        this.actionPoint = apData.data;
        this.apUnicefUsers = apData.apUnicefUsers;
      })
      .catch((err: any) => {
        console.log(err);
        fireEvent(this, '404');
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
        fireEvent(this, '404');
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
    const apUnicefUsers = this.idName([actionPoint.assigned_by, actionPoint.assigned_to]).filter(
      (user: any) => !!user?.id
    );
    for (const field of fields) {
      const fieldValue = data[field];
      if (fieldValue && fieldValue.id) {
        data[field] = fieldValue.id;
      }
    }
    return {data, apUnicefUsers};
  }

  idName(users: any[]) {
    return users?.map((user: any) => {
      return {id: user.id, name: user.name};
    });
  }

  _complete(verifierId?: number) {
    const endpoint = getEndpoint('actionPointComplete', this.actionPointId);

    fireEvent(this, 'global-loading', {
      loadingSource: 'ap-complete',
      active: true,
      message: 'Completing Action Point...'
    });
    const options = {
      method: 'POST',
      endpoint
    };
    if (verifierId && Number(verifierId) > 0) {
      Object.assign(options, {body: {potential_verifier: verifierId}});
    }

    return sendRequest(options)
      .then((data: any) => {
        fireEvent(this, 'toast', {
          text: ' Action Point successfully completed.'
        });
        this.originalActionPoint = JSON.parse(JSON.stringify(data));
        const apData = this._prepareActionPoint(data);
        this.actionPoint = apData.data;
        this.apUnicefUsers = apData.apUnicefUsers;
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
      })
      .finally(() => {
        fireEvent(this, 'global-loading', {
          loadingSource: 'ap-complete'
        });
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
    this._makeUpdateRequest(data);
  }

  _makeUpdateRequest(updateData: any) {
    const endpoint = getEndpoint('actionPoint', this.actionPointId);

    fireEvent(this, 'global-loading', {
      loadingSource: 'ap-update',
      active: true,
      message: 'Update Action Point...'
    });

    return sendRequest({
      method: 'PATCH',
      endpoint,
      body: updateData
    })
      .then((data: any) => {
        fireEvent(this, 'toast', {
          text: ' Action Point successfully updated.'
        });
        this.originalActionPoint = JSON.parse(JSON.stringify(data));
        const apData = this._prepareActionPoint(data);
        this.actionPoint = apData.data;
        this.apUnicefUsers = apData.apUnicefUsers;
        fireEvent(this, 'global-loading', {
          loadingSource: 'ap-update'
        });
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
