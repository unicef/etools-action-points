import {LitElement, html, customElement, property} from 'lit-element';
import {ErrorHandlerMixin} from '../../mixins/error-handler-mixin-lit';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/status-element-lit';
import './detail/action-point-details';
import {pageLayoutStyles} from '../../styles/page-layout-styles-lit';
import {sharedStyles} from '../../styles/shared-styles-lit';
import {mainPageStyles} from '../../styles/main-page-styles';
import {ActionPointDetails} from './detail/action-point-details';
import {sendRequest} from '@unicef-polymer/etools-ajax';

/**
 * @polymer
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
            .actionPoint="${this.actionPoint}"
            .permissionPath="${this.permissionPath}"
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

  updated(changedProperties) {
    if (changedProperties.has('route')) {
      this._changeRoutePath();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('action-activated', () => this._createAP());
  }

  _changeRoutePath() {
    const details: any = this.shadowRoot.querySelector('action-point-details');
    this.actionPoint = {};
    details.dispatchEvent(new CustomEvent('reset-validation'));
    this.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: {
          value: this.route
        },
        bubbles: true,
        composed: true
      })
    );
  }

  _createAP() {
    const detailsElement: ActionPointDetails = this.shadowRoot.querySelector('#ap-details');
    if (!detailsElement || !detailsElement.validate()) {
      return;
    }

    const data = JSON.parse(JSON.stringify(detailsElement.editedItem));
    const endpoint = getEndpoint('actionPointsList');

    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          loadingSource: 'ap-creation',
          active: true,
          message: 'Creating Action Point...'
        },
        bubbles: true,
        composed: true
      })
    );

    sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: data
    })
      .then((data: any) => {
        this.actionPoint = {};
        this.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully created.'
            },
            bubbles: true,
            composed: true
          })
        );
        this.route.path = `/detail/${data.id}`;
        this.dispatchEvent(
          new CustomEvent('global-loading', {
            detail: {
              loadingSource: 'ap-creation'
            },
            bubbles: true,
            composed: true
          })
        );
        this.route = {...this.route};
      })
      .catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
      });
  }
}
