import remark from "remark";
import visit from "unist-util-visit";
import strip from "strip-markdown";
import squeezeParagraphs from "remark-squeeze-paragraphs";

import "isomorphic-fetch";

import { italicize, bolden, monospace } from "./unicodeTransformer";

if (global) {
    global.btoa = function(str) {
        return new Buffer(str).toString("base64");
    };
}

// This is a remark plugin
function utf8(options = {}) {
    return transformer;

    function transformer(tree, file) {
        return new Promise(async (resolve, reject) => {
            visit(tree, "emphasis", italic);
            visit(tree, "strong", bold);
            visit(tree, "inlineCode", inlineCode);

            const codeNodesToChange = [];
            visit(tree, "code", node => {
                codeNodesToChange.push({ node });
            });

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

            function inlineCode(node) {
                node.value = monospace(node.value);
            }

            for (const obj of codeNodesToChange) {
                const src = btoa(obj.node.value),
                    codeType = "javascript";

                try {
                    const res = await fetch(
                            `https://84wz7ux5rc.execute-api.us-east-1.amazonaws.com/default/screenshot-as-a-service-dev-screenshot-function?type=code&code=${src}&codeType=${codeType}`
                        ),
                        url = await res.text();

                    console.log(url);
                    obj.node.value = url;
                    console.log(obj.node);
                } catch (e) {
                    console.log("ERROR", e);
                }
            }

            resolve();
        });
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
