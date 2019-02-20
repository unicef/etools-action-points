import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
// import 'etools-ajax/etools-ajax';
// @ts-ignore
import EtoolsAjaxRequestMixin from 'etools-ajax/etools-ajax-request-mixin';
import '../../common-elements/pages-header-element';
import '../../common-elements/status-element';
import ErrorHandlerMixin from '../../app-mixins/error-handler-mixin';
import './action-point-details';
// @ts-ignore
// import EtoolsMixinFactory from 'etools-behaviors/etools-mixin-factory';
// import cloneDeep from 'lodash/cloneDeep';
// import * as _ from 'lodash';
import EndpointMixin from '../../app-mixins/endpoint-mixin';
import {pageLayoutStyles} from '../../styles-elements/page-layout-styles';
import {sharedStyles} from '../../styles-elements/shared-styles';
import {mainPageStyles} from '../../styles-elements/main-page-styles';
/**
 * @polymer
 * @customElement
 */
class ActionPointsNew extends EndpointMixin(
    EtoolsAjaxRequestMixin(
      ErrorHandlerMixin(
        PolymerElement))) {

  static get template() {
    return html`
      ${pageLayoutStyles}
      ${sharedStyles}
      ${mainPageStyles}
      
      <pages-header-element page-title="Add New Action Point"></pages-header-element>

      <div class="view-container">
        <div id="pageContent">
          <action-point-details id="ap-details" action-point="[[actionPoint]]" permission-path="[[permissionPath]]">
          </action-point-details>
        </div>

        <div id="sidebar">
          <status-element action-point="[[actionPoint]]" permission-path="[[permissionPath]]"></status-element>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      route: {
        type: Object,
        notify: true
      },
      actionPoint: {
        type: Object,
        value: () => ({})
      },
      permissionPath: {
        type: String,
        value: 'action_points'
      }
    };
  }

  static get observers() {
    return [
      '_changeRoutePath(route.path)'
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('action-activated', () => this._createAP());
  }

  _changeRoutePath() {
    let details: any = this.shadowRoot.querySelector('action-point-details');
    this.set('actionPoint', {});
    details.dispatchEvent(new CustomEvent('reset-validation'));
  }

  _createAP() {
    let detailsElement = this.shadowRoot.querySelector('#ap-details');
    if (!detailsElement || !detailsElement.validate()) {
      return;
    }

    let data = JSON.parse(JSON.stringify(detailsElement.editedItem));
    let endpoint = this.getEndpoint('actionPointsList');

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'ap-creation',
        active: true,
        message: 'Creating Action Point...'
      },
      bubbles: true,
      composed: true
    }));

    this.sendRequest({
        method: 'POST',
        endpoint: {
          url: endpoint
        },
        body: data
      })
      .then((data: any) => {
        this.actionPoint = {};
        this.dispatchEvent(new CustomEvent('toast', {
          detail: {
            text: ' Action Point successfully created.'
          },
          bubbles: true,
          composed: true
        }));
        this.set('route.path', `detail/${data.id}`);
        this.dispatchEvent(new CustomEvent('global-loading', {
          detail: {
            type: 'ap-creation'
          },
          bubbles: true,
          composed: true
        }));
      }).catch((err: any) => {
        this.errorHandler(err, this.permissionPath);
      });
  }
}

customElements.define('action-points-new', ActionPointsNew);
