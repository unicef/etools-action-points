import {PolymerElement} from '@polymer/polymer/polymer-element';
import {EtoolsMixinFactory} from 'etools-behaviors/etools-mixin-factory';
import EndpointMixin from '../app-mixins/endpoint-mixin';
import QueryParams from '../app-mixins/query-params-mixin';
import EtoolsAjaxRequestMixin from 'etools-ajax/etools-ajax-request-mixin';
import ErrorHandler from '../app-mixins/error-handler-mixin';

const ActionPointsDataMixin = EtoolsMixinFactory.combineMixins([
  EndpointMixin,
  EtoolsAjaxRequestMixin,
  ErrorHandler,
  QueryParams
], PolymerElement);

class ActionPointsData extends ActionPointsDataMixin {
  static get properties() {
    return {
      actionPoints: {
        type: Array,
        notify: true
      },
      requestQueries: {
        type: Object
      },
      listLength: {
        type: Number,
        notify: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('request-action-points', () => this._loadList());
  }

  _loadList() {
    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {
        type: 'action-points-list',
        active: true,
        message: 'Loading of action points list...'
      },
      bubbles: true,
      composed: true
    }));
    let endpoint = this.getEndpoint('actionPointsList');
    endpoint.url += this.getQueriesString();

    this.sendRequest({
      method: 'GET',
      endpoint: {
        url: endpoint.url
      }
    }).then((resp: any) => this._actionPointsLoaded(resp)).catch((err: any) => this._responseError(err));
  }

  _actionPointsLoaded(detail: any) {
    this.actionPoints = detail.results;
    this.listLength = detail.count;

    this.dispatchEvent(new CustomEvent('global-loading', {
      detail: {type: 'action-points-list'},
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('action-points-data', ActionPointsData);
