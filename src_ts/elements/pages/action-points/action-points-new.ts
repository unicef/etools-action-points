import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ErrorHandlerMixin} from '../../mixins/error-handler-mixin';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/status-element';
import './detail/action-point-details';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {sharedStyles} from '../../styles/shared-styles';
import {mainPageStyles} from '../../styles/main-page-styles';
import {ActionPointDetails} from './detail/action-point-details';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';

/**
 * @customElement
 */
@customElement('action-points-new')
export class ActionPointsNew extends ErrorHandlerMixin(LitElement) {
  render() {
    return html`
      ${pageLayoutStyles} ${sharedStyles} ${mainPageStyles}

      <pages-header-element page-title="Add New Action Point"> </pages-header-element>

      <div class="view-container" id="main">
        <div id="pageContent">
          <action-point-details
            id="ap-details"
            .isAdd="${true}"
            .actionPoint="${this.actionPoint}"
            .permissionPath="${this.permissionPath}"
            .apUnicefUsers="${[]}"
          >
          </action-point-details>
        </div>

        <div id="sidebar">
          <status-element .actionPoint="${this.actionPoint}" .permissionPath="${this.permissionPath}"> </status-element>
        </div>
      </div>
    `;
  }

  @property({type: Object}) // notify: true
  route: any;

  @property({type: Object})
  actionPoint: any = {};

  @property({type: String})
  permissionPath = 'action_points';

  updated(changedProperties: any) {
    if (changedProperties.has('route')) {
      this._changeRoutePath();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('action-activated', () => this._createAP());
  }

  _changeRoutePath() {
    const details: any = this.shadowRoot!.querySelector('action-point-details');
    this.actionPoint = {};
    details.dispatchEvent(new CustomEvent('reset-validation'));
    fireEvent(this, 'route-changed', {
      value: this.route
    });
  }

  _createAP() {
    const detailsElement: ActionPointDetails | null = this.shadowRoot!.querySelector('#ap-details');
    if (!detailsElement || !detailsElement.validate()) {
      return;
    }

    const data = JSON.parse(JSON.stringify(detailsElement.editedItem));
    const endpoint = getEndpoint('actionPointsList');

    fireEvent(this, 'global-loading', {
      loadingSource: 'ap-creation',
      active: true,
      message: 'Creating Action Point...'
    });

    sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: data
    })
      .then((data: any) => {
        this.actionPoint = {};
        fireEvent(this, 'toast', {
          text: ' Action Point successfully created.'
        });

        fireEvent(this, 'global-loading', {
          loadingSource: 'ap-creation',
          active: false
        });

        EtoolsRouter.replaceAppLocation(`action-points/detail/${data.id}`);
      })
      .catch((err: any) => {
        fireEvent(this, 'global-loading', {
          loadingSource: 'ap-creation',
          active: false
        });
        this.errorHandler(err, this.permissionPath);
      });
  }
}
