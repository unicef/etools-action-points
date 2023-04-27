import {LitElement, customElement, property} from 'lit-element';
import {getEndpoint} from '../../endpoints/endpoint-mixin';
import {getQueriesString} from '../mixins/query-params-helper';
import {ErrorHandlerMixin} from '../mixins/error-handler-mixin';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import { fireEvent } from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('action-points-data')
export class ActionPointsData extends ErrorHandlerMixin(LitElement) {
  @property({type: Array}) // notify: true
  public actionPoints: any[];

  @property({type: Object})
  public requestQueries: any;

  @property({type: Number}) // notify: true
  public listLength: number;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('request-action-points', () => this._loadList());
  }

  _loadList() {
    fireEvent(this, 'global-loading', {
      loadingSource: 'action-points-list',
      active: true,
      message: 'Loading of action points list...'
    });
    const endpoint = getEndpoint('actionPointsList');
    endpoint.url += getQueriesString();

    sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url
      }
    })
      .then((resp: any) => this._actionPointsLoaded(resp))
      .catch((err: any) => this._responseError(err));
  }

  _actionPointsLoaded(detail: any) {
    this.actionPoints = detail.results;
    this.listLength = detail.count;

    fireEvent(this, 'list-length-changed', {
      value: this.listLength
    });
    fireEvent(this, 'action-points-changed', {
      value: this.actionPoints
    });
    fireEvent(this, 'global-loading', {
      loadingSource: 'action-points-list'
    });
  }
}
