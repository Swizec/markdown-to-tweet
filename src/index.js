import remark from "remark";
import visit from "unist-util-visit";
import strip from "strip-markdown";
import squeezeParagraphs from "remark-squeeze-paragraphs";
// import { italicize } from "html2unicode";

import { italicize, bolden, monospace } from "./unicodeTransformer";

// This is a remark plugin
function utf8(options = {}) {
    return transformer;

    function transformer(tree, file) {
        visit(tree, "emphasis", italic);
        visit(tree, "strong", bold);
        visit(tree, "inlineCode", code);

        function italic(node) {
            node.children.forEach(function(child, index) {
                child.value = italicize(child.value);
            });
        }

        function bold(node) {
            node.children.forEach(function(child, index) {
                child.value = bolden(child.value);
            });
        }

        function code(node) {
            node.value = monospace(node.value);
        }
    }
}

function converter(string) {
    return new Promise(function(resolve, reject) {
        remark()
            .use(utf8)
            .use(squeezeParagraphs)
            .use(strip)
            .process(string, function(err, output) {
                if (err) return reject(err);

                let result = output.contents;
                result = result.replace(/\n$/, "");

                resolve(result);
            });
    });
}

export default converter;
