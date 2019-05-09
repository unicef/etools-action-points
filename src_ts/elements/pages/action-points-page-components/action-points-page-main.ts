import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-pages/iron-pages';
import './action-points-list';
import './action-points-item';
import './action-points-new';
import {customElement, property} from '@polymer/decorators';

@customElement('action-points-page-main')
// @ts-ignore
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
        <action-points-list name="list" route="{{listRoute}}" data-loaded="[[dataLoaded]]"></action-points-list>
      </iron-pages>
    `;
  }
    
  @property({type: Object, notify: true})
  route: any = {}
  @property({type: Object})
  routeData: any = {}

  static get observers() {
    return ['_setRoutePath(route.path)'];
  }

  _setRoutePath(path: string) {
    if (path === null || path === undefined) {
      return
    }
    if (!path.match(/[^\\/]/g)) {
      this.set('route.path', '/list');
    }
  }
}
