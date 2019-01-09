import expect from "expect";
import fetchMock from "fetch-mock";

import lib from "src/index";

describe("italic", () => {
    it("converts _italic_ into utf8 italics", done => {
        lib("_italic_").then(result => {
            expect(result).toEqual("𝘪𝘵𝘢𝘭𝘪𝘤");
            done();
        });
    });
});

describe("bold", () => {
    it("converts **bold** into utf8 bolds", done => {
        lib("**bold**")
            .then(result => {
                expect(result).toEqual("𝗯𝗼𝗹𝗱");
                done();
            })
            .catch(e => {
                console.log(e);
            });
    });
});

describe("code", () => {
    fetchMock.get(
        "glob:https://*screenshot-as-a-service-dev-screenshot-function*",
        "https://this.is.the.result.url"
    );

    it("converts `code` into monospace font", done => {
        lib("`code`").then(result => {
            expect(result).toEqual("𝚌𝚘𝚍𝚎");
            done();
        });
    });

    it("converts code blocks into carbon.now.sh screenshots", done => {
        lib('```\nconst bla = "hello world";\n```')
            .then(result => {
                expect(result).toEqual("    https://this.is.the.result.url");
                done();
            })
            .catch(e => {
                console.log(e);
                done();
            });
    });
});
