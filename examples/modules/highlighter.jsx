export default {

    highlightCodeBlocks() {
        const els = document.querySelectorAll("pre code");
        for (var i = 0; i < els.length; i++) {
            if (!els[i].classList.contains("hljs")) {
                window.hljs.highlightBlock(els[i]);
            }
        }
    },

    componentDidMount() {
        this.highlightCodeBlocks();
    },

    componentDidUpdate() {
        this.highlightCodeBlocks();
    }
};
