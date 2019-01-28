import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import 'etools-ajax/etools-ajax.js';
import '../core-elements/etools-app-config.js';

class ActionPointsData extends APDMixins.AppConfig(APDMixins.QueryParamsMixin(PolymerElement)) {
  static get template() {
    return html`
      <etools-ajax endpoint="[[endpoint]]" on-success="_actionPointsLoaded" on-fail="_responseError">
      </etools-ajax>
    `;
  }

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
    this.endpoint = this.getEndpoint('actionPointsList');
    this.endpoint.url += this.getQueriesString();
  }

  _actionPointsLoaded(e, detail) {
    if (!detail || !detail.results || detail.count === undefined) {
      this._responseError(e, detail);
      return;
    }

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
