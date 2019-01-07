import remark from "remark";
import visit from "unist-util-visit";
import strip from "strip-markdown";
import squeezeParagraphs from "remark-squeeze-paragraphs";

// This is a remark plugin
function utf8(options = {}) {
    return transformer;

    function transformer(tree, file) {
        visit(tree, "emphasis", italic);

        function italic(node) {
            node.children.forEach(function(child, index) {
                child.value = "hello world";
            });
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

                resolve(output.contents);
            });
    });
}

export default converter;
