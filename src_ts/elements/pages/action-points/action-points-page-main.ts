import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';
import {customElement, property, observe} from '@polymer/decorators';

@customElement('action-points-page-main')
export class ActionPointsPageMain extends PolymerElement {
  public static get template() {
    return html`
      <app-route route="{{route}}" pattern="/:view" data="{{routeData}}"></app-route>
      <app-route route="{{route}}" pattern="/list" tail="{{listRoute}}"></app-route>
      <app-route route="{{route}}" pattern="/new"></app-route>
      <app-route route="{{route}}" pattern="/detail" tail="{{detailRoute}}"></app-route>
      <iron-pages selected="[[routeData.view]]" attr-for-selected="name">
        <action-points-new name="new" route="{{route}}"></action-points-new>
        <action-points-item name="detail" route="{{detailRoute}}"></action-points-item>
        <action-points-list name="list" route="{{listRoute}}" static-data-loaded="[[staticDataLoaded]]">
        </action-points-list>
      </iron-pages>
    `;
  }

  @property({type: Object, notify: true})
  route: any = {};

  @property({type: Object})
  routeData: any = {};

  @observe('route.path')
  _setRoutePath(path: string) {
    if (path === null || path === undefined) {
      return;
    }
    if (!path.match(/[^\\/]/g)) {
      this.set('route.path', '/list');
    }
  }

  @observe('routeData.view')
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
