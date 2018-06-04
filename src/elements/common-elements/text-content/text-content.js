class TextContent extends Polymer.Element {
    static get is() {return 'text-content';}

    static get properties() {
        return {
            text: String
        };
    }
}

customElements.define(TextContent.is, TextContent);
