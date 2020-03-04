import {PolymerElement} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {getEndpoint} from '../app-mixins/endpoint-mixin';
import {QueryParams} from '../app-mixins/query-params-mixin';
import {ErrorHandler} from '../app-mixins/error-handler-mixin';
import {customElement, property} from '@polymer/decorators';

@customElement('action-points-data')
export class ActionPointsData extends
  EtoolsAjaxRequestMixin(
      ErrorHandler(
          QueryParams(
              PolymerElement))) {

  @property({type: Array, notify: true})
  public actionPoints: object[]

  @property({type: Object})
  public requestQueries: object

  @property({type: Number, notify: true})
  public listLength: number

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('request-action-points', () => this._loadList());
  }

  _loadList(this) {
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'action-points-list',
        active: true,
        message: 'Loading of action points list...'
      },
      bubbles: true,
      composed: true
    }));
    let endpoint = getEndpoint('actionPointsList');
    endpoint.url += this.getQueriesString();

    this.sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url
      }
    }).then((resp: any) => this._actionPointsLoaded(resp)).catch((err: any) => this._responseError(err));
  }

  _actionPointsLoaded(detail: any) {
    this.set('actionPoints', detail.results);
    this.set('listLength', detail.count);

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {type: 'action-points-list'},
      bubbles: true,
      composed: true
    }));
  }
}

// customElements.define('action-points-data', ActionPointsData);
