import remark from "remark";

import squeezeParagraphs from "remark-squeeze-paragraphs";

import utf8 from "./utf8transform";
import codeScreenshot from "./codeScreenshotTrasform";

function converter(string) {
    return new Promise(function(resolve, reject) {
        remark()
            .use(utf8)
            .use(codeScreenshot)
            .use(squeezeParagraphs)
            .process(string, function(err, output) {
                if (err) return reject(err);

                let result = output.contents;
                result = result.replace(/\n$/, "");

                resolve(result);
            });
    });
}

export default converter;
