Polymer({
    is: 'app-sidebar-menu',

    properties: {
        page: String
    },

    behaviors: [
        etoolsAppConfig.globals
    ],

    _toggleDrawer: function() {
        this.fire('drawer-toggle-tap');
    }
});
