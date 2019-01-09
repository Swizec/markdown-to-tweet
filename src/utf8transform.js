import visit from "unist-util-visit";
import { italicize, bolden, monospace } from "./unicodeTransformer";

// This is a remark plugin
function utf8(options = {}) {
    return function transformer(tree, file) {
        visit(tree, "emphasis", italic);
        visit(tree, "strong", bold);
        visit(tree, "inlineCode", inlineCode);

        function italic(node) {
            node.type = "text";
            node.value = node.children
                .map(child => italicize(child.value))
                .join(" ");
        }

        function bold(node) {
            node.type = "text";
            node.value = node.children
                .map(child => bolden(child.value))
                .join(" ");
        }

        function inlineCode(node) {
            node.type = "text";
            node.value = monospace(node.value);
        }
    };
}

export default utf8;
