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
            this.set('view', 'list');
            this.updateQueries({
                page: 1,
                page_size: 10
            });
        } else if (path.startsWith('/new')) {
            this.clearQueries();
            this.set('view', 'new');
        } else {
            this.clearQueries();
            this.set('view', 'detail');
            this.set('actionPointId', this.routeData.id);
        }
    }
}

window.customElements.define(ActionPointsPageMain.is, ActionPointsPageMain);
