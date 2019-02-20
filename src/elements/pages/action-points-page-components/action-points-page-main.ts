import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-pages/iron-pages';
import './action-points-list';
import './action-points-item';
import './action-points-new';
// import * as _ from 'lodash';
// import {customElement, property} from '@polymer/decorators';

/**
* @polymer
* @extends HTMLElement
*/
// @customElement('action-points-page-main')
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
        <action-points-list name="list" route="{{listRoute}}"></action-points-list>
      </iron-pages>
    `;
  }
// @property()
// route: object = {}
// routeData: object = {}
  static get properties() {
    return {
      route: {
        type: Object,
        notify: true
      },
      routeData: Object
    };
  }

  static get observers() {
    return ['_setRoutePath(route.path)'];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _setRoutePath(path: string) {
    // if (!path) {
    //   return
    // }
    if (!path.match(/[^\\/]/g)) {
      this.set('route.path', '/list');
    }
  }
}

window.customElements.define('action-points-page-main', ActionPointsPageMain);
