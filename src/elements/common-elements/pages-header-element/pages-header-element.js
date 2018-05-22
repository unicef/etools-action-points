class PagesHeader extends APDMixins.AppConfig(Polymer.Element) {

    static get is() {
        return 'pages-header-element';
    }

    static get properties() {
        return {
            pageTitle: String,
            btnText: String,
            showAddButton: {
                type: Boolean,
                value: false
            },
            link: {
                type: String,
                value: ''
            },
            pageData: {
                type: Object,
                value: function() {
                    return {};
                }
            },
            exportLinks: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            downloadLetterUrl: {
                type: String,
                value: ''
            }
        };
    }

    _toggleOpened() {
        this.$.dropdownMenu.select(null);
    }

    _hideAddButton(show) {
        return !show;
    }

    addNewTap() {
        this.dispatchEvent(new CustomEvent('add-new-tap'));
    }

    _showLink(link) {
        return !!link;
    }

    _setTitle(pageData, title) {
        if (!pageData || !pageData.unique_id) {return title;}
        return pageData.unique_id;
    }

    exportData(e) {
        if (this.exportLinks < 1) {throw new Error('Can not find export link!');}
        let url = (e && e.model && e.model.item) ? e.model.item.url : this.exportLinks[0].url;
        window.open(url, '_blank');
    }

    _isDropDown(exportLinks) {
        return exportLinks && (exportLinks.length > 1 ||
            (exportLinks[0] && exportLinks[0].useDropdown));
    }

}

customElements.define(PagesHeader.is, PagesHeader);
