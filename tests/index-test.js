import expect from "expect";

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
        lib("**bold**").then(result => {
            expect(result).toEqual("𝗯𝗼𝗹𝗱");
            done();
        });
    });
});

// describe('italic', () => {
//     it('converts _italic_ into utf8 italics', () => {
//         expect(lib('_italic_')).toEqual('');
//     });
// })
