class ActionPointsPageMain extends APDMixins.QueryParamsMixin(Polymer.Element) {
    static get is() { return 'action-points-page-main'; }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: Object,
            queryParams: {
                type: Object,
                notify: true
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    static get observers() {
        return [
            '_setRoutePath(route.path)'
        ];
    }

    _setRoutePath(path) {
        if (!path.length) {
            //todo rework query params
            this.updateQueries({
                page: 1,
                page_size: 10
            });
            this.set('view', 'list');
        } else if (path.startsWith('/new')) {
            this.set('view', 'new');
        } else {
            this.set('view', 'detail');
            this.set('actionPointId', path.replace('/', ''));
        }
    }
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
