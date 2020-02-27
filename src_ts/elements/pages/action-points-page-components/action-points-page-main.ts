import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';

class ActionPointsPageMain extends PolymerElement {
  static get template() {
    return html`
      <app-route route="{{route}}" pattern="/:view" data="{{routeData}}"></app-route>
      <app-route route="{{route}}" pattern="/list" tail="{{listRoute}}"></app-route>
      <app-route route="{{route}}" pattern="/new"></app-route>
      <app-route route="{{route}}" pattern="/detail" tail="{{detailRoute}}"></app-route>
      <iron-pages selected="[[routeData.view]]" attr-for-selected="name">
        <action-points-new name="new" route="{{route}}"></action-points-new>
        <action-points-item name="detail" route="{{detailRoute}}"></action-points-item>
        <action-points-list name="list" route="{{listRoute}}" static-data-loaded="[[staticDataLoaded]]"></action-points-list>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      route: {
        type: Object,
        notify: true,
        value: () => {}
      },
      routeData: {
        type: Object,
        value: () => {}
      }
    };
  }

  static get observers() {
    return ['_setRoutePath(route.path)', '_pageChanged(routeData.view)'];
  }

  _setRoutePath(path: string) {
    if (path === null || path === undefined) {
      return;
    }
    if (!path.match(/[^\\/]/g)) {
      this.set('route.path', '/list');
    }
  }

  _pageChanged(page: string) {
    switch (page) {
      case 'new':
        import('./action-points-new.js');
        break;
      case 'detail':
        import('./action-points-item.js');
        break;
      default:
        import('./action-points-list.js');
        break;
    }
  }
}

customElements.define('action-points-page-main', ActionPointsPageMain);
