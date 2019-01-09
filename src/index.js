import remark from "remark";
import visit from "unist-util-visit";
import strip from "strip-markdown";
import squeezeParagraphs from "remark-squeeze-paragraphs";

import { italicize, bolden, monospace } from "./unicodeTransformer";

// if (global) {
//     global.btoa = function(str) {
//         return new Buffer(str).toString("base64");
//     };
// }

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

async function getCodeScreenshot(src) {
    const codeType = "javascript",
        srcArg = btoa(src);

    const res = await fetch(
        `https://84wz7ux5rc.execute-api.us-east-1.amazonaws.com/default/screenshot-as-a-service-dev-screenshot-function?type=code&code=${srcArg}&codeType=${codeType}`
    );

    return res.text();
}
function codeScreenshot() {
    return tree =>
        new Promise(async (resolve, reject) => {
            const nodesToChange = [];
            visit(tree, "code", node => {
                nodesToChange.push({ node });
            });
            for (const { node } of nodesToChange) {
                try {
                    const url = await getCodeScreenshot(node.value);
                    node.value = url;
                } catch (e) {
                    console.log("ERROR", e);
                    return reject(e);
                }
            }

            resolve();
        });
}

function converter(string) {
    return new Promise(function(resolve, reject) {
        remark()
            .use(utf8)
            .use(codeScreenshot)
            .process(string, function(err, output) {
                if (err) return reject(err);

                let result = output.contents;
                result = result.replace(/\n$/, "");

                resolve(result);
            });
    });
}

export default converter;
