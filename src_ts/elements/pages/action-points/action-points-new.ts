import {PolymerElement, html} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {ErrorHandlerMixin} from '../../mixins/error-handler-mixin';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/status-element';
import './detail/action-point-details';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {sharedStyles} from '../../styles/shared-styles';
import {mainPageStyles} from '../../styles/main-page-styles';
import {customElement, property} from '@polymer/decorators';
import {ActionPointDetails} from './detail/action-point-details';

/**
 * @polymer
 * @customElement
 */
@customElement('action-points-new')
export class ActionPointsNew extends EtoolsAjaxRequestMixin(ErrorHandlerMixin(PolymerElement)) {
  public static get template() {
    return html`
      ${pageLayoutStyles} ${sharedStyles} ${mainPageStyles}

      <pages-header-element page-title="Add New Action Point"> </pages-header-element>

      <div class="view-container" id="main">
        <div id="pageContent">
          <action-point-details id="ap-details" action-point="[[actionPoint]]" permission-path="[[permissionPath]]">
          </action-point-details>
        </div>

        <div id="sidebar">
          <status-element action-point="[[actionPoint]]" permission-path="[[permissionPath]]"> </status-element>
        </div>
      </div>
    `;
  }

  @property({type: Object, notify: true})
  route: any;

  @property({type: Object})
  actionPoint: any = {};

  @property({type: String})
  permissionPath = 'action_points';

  static get observers() {
    return ['_changeRoutePath(route.path)'];
  }

  ready() {
    super.ready();
    this.addEventListener('action-activated', () => this._createAP());
  }

  _changeRoutePath() {
    const details: any = this.shadowRoot.querySelector('action-point-details');
    this.set('actionPoint', {});
    details.dispatchEvent(new CustomEvent('reset-validation'));
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

    this.sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: data
    })
      .then((data: any) => {
        this.set('actionPoint', {});
        this.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              text: ' Action Point successfully created.'
            },
            bubbles: true,
            composed: true
          })
        );
        this.set('route.path', `/detail/${data.id}`);
        this.dispatchEvent(
          new CustomEvent('global-loading', {
            detail: {
              loadingSource: 'ap-creation'
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
}
