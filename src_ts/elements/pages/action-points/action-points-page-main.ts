import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';
import {set} from '@polymer/polymer/lib/utils/path';

@customElement('action-points-page-main')
export class ActionPointsPageMain extends LitElement {
  @property({type: Object})
  route: any = {};

  @property({type: Object})
  routeData: any = {};

  @property({type: Object})
  listRoute: any = {};

  @property({type: Object})
  detailRoute: any = {};

  @property({type: Object})
  staticDataLoaded: any = {};

  render() {
    return html`
      <app-route
        .route="${this.route}"
        @route-changed="${this._routeChanged}"
        pattern="/:view"
        @data-changed="${this._routeDataChanged}"
      >
      </app-route>

      <app-route .route="${this.route}" pattern="/list" @tail-changed="${this._listRouteChanged}"> </app-route>
      <app-route .route="${this.route}" pattern="/new"></app-route>
      <app-route .route="${this.route}" pattern="/detail" @tail-changed="${this._detailRouteChanged}"></app-route>
      <iron-pages .selected="${this.routeData.view}" attr-for-selected="name">
        <action-points-new
          name="new"
          .route="${this.route}"
          @route-changed="${({detail}: CustomEvent) => {
            if (JSON.stringify(this.route) !== JSON.stringify(detail.value)) {
              this.route = detail.value;
            }
          }}"
        ></action-points-new>
        <action-points-item
          name="detail"
          .route="${this.detailRoute}"
          @route-changed="${({detail}: CustomEvent) => {
            if (JSON.stringify(this.detailRoute) !== JSON.stringify(detail.value)) {
              this.detailRoute = detail.value;
            }
          }}"
        ></action-points-item>
        <action-points-list name="list" .route="${this.listRoute}" .staticDataLoaded="${this.staticDataLoaded}">
        </action-points-list>
      </iron-pages>
    `;
  }

  _routeChanged({detail}: CustomEvent) {
    const path = detail.value.path;
    if (!path || !path.match(/[^\\/]/g)) {
      this.route = {...this.route, path: '/list'};
      new CustomEvent('route-changed', {
        detail: this.route,
        bubbles: true,
        composed: true
      });
      return;
    }

    if (!['detail', 'list', 'new', 'not-found'].includes(path.split('/')[1])) {
      this.route = {...this.route, path: '/not-found'};
      return;
    }
  }

  _routeDataChanged({detail}: CustomEvent) {
    this.routeData = detail.value;
    switch (this.routeData.view) {
      case 'new':
        import('./action-points-new.js');
        break;
      case 'detail':
        import('./detail/action-points-item.js');
        break;
      default:
        import('./action-points-list.js');
        break;
    }
  }

  _listRouteChanged({detail}: CustomEvent) {
    if (this.routeData.view !== 'list') return;

    if (detail.path) {
      set(this, detail.path.replace('tail.', 'listRoute.'), detail.value);
      this.listRoute = {...this.listRoute};
      return;
    }

    this.listRoute = detail.value;
  }

  _detailRouteChanged({detail}: CustomEvent) {
    if (this.routeData.view !== 'detail') return;

    if (detail.path) {
      set(this, detail.path.replace('tail.', 'detailRoute.'), detail.value);
      this.detailRoute = {...this.detailRoute};
      return;
    }

    this.detailRoute = detail.value;
  }
}
