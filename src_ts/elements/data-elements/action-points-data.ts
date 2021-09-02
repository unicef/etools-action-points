import {PolymerElement} from '@polymer/polymer';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {getEndpoint} from '../app-mixins/endpoint-mixin';
import {getQueriesString} from '../app-mixins/query-params-mixin';
import {ErrorHandlerMixin} from '../app-mixins/error-handler-mixin';
import {customElement, property} from '@polymer/decorators';

@customElement('action-points-data')
export class ActionPointsData extends EtoolsAjaxRequestMixin(ErrorHandlerMixin(PolymerElement)) {
  @property({type: Array, notify: true})
  public actionPoints: any[];

  @property({type: Object})
  public requestQueries: any;

  @property({type: Number, notify: true})
  public listLength: number;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('request-action-points', () => this._loadList());
  }

  _loadList() {
    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          type: 'action-points-list',
          active: true,
          message: 'Loading of action points list...'
        },
        bubbles: true,
        composed: true
      })
    );
    const endpoint = getEndpoint('actionPointsList');
    endpoint.url += getQueriesString();

    this.sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url
      }
    })
      .then((resp: any) => this._actionPointsLoaded(resp))
      .catch((err: any) => this._responseError(err));
  }

  _actionPointsLoaded(detail: any) {
    this.set('actionPoints', detail.results);
    this.set('listLength', detail.count);

    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {type: 'action-points-list'},
        bubbles: true,
        composed: true
      })
    );
  }
}
