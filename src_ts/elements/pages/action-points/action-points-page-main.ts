import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util.js';
import {connect} from 'pwa-helpers';
import {RootState, store} from '../../../redux/store';
import get from 'lodash-es/get';
import {isJsonStrMatch} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';

@customElement('action-points-page-main')
export class ActionPointsPageMain extends connect(store)(LitElement) {
  @property({type: Object})
  route: any = {};

  @property({type: Object})
  routeData: any = {};

  @property({type: Boolean})
  staticDataLoaded?: boolean;

  render() {
    return html`
      <style>
        :host([hidden]) {
          display: none;
        }
      </style>
      ${this.renderPage(this.routeData.subRouteName)}
    `;
  }

  renderPage(view: string) {
    switch (view) {
      case 'new':
        return html` <action-points-new .route="${this.route}" ?hidden="true"></action-points-new>`;
      case 'detail':
        return html` <action-points-item .route="${this.routeData}"></action-points-item>`;
      default:
        return html` <action-points-list .route="${this.routeData}" .staticDataLoaded="${this.staticDataLoaded}">
        </action-points-list>`;
    }
  }

  routeDataChanged(view: string) {
    switch (view) {
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

  stateChanged(state: RootState) {
    if (this.pageIsNotCurrentlyActive(get(state, 'app.routeDetails.routeName'), 'action-points')) {
      return;
    }
    if (state.app.routeDetails && !isJsonStrMatch(state.app.routeDetails, this.routeData)) {
      this.routeData = state.app.routeDetails;
      this.route = this.route.path;
      this.routeDataChanged(this.routeData.subRouteName);
      fireEvent(this, 'global-loading', {
        loadingSource: 'action-points'
      });
    }
  }

  pageIsNotCurrentlyActive(routeName: string, pageName: string) {
    if (!routeName) {
      return true;
    }
    const arrPageName = pageName.split('|');
    return !arrPageName.includes(routeName);
  }
}
