// code borrowed from https://github.com/lovasoa/html2unicode/blob/master/src/index.js
// because we don't need Saxophone and don't want to be async
// and importing functions directly did'nt work

/**
 * Transforms a text according to the given options
 * 
 * @example
 *     transform("world", {bold: true});
 *      // --> "𝘄𝗼𝗿𝗹𝗱"
 *
 * @example
 *     transform("world", {bold: true, italics: true});
 *      // --> "𝙬𝙤𝙧𝙡𝙙"
 *
 * @example
 *     transform("n", {sup: true});
 *      // --> "ⁿ"
 *
 * @example
 *     transform("text", {mono: true});
 *      // --> "𝚝𝚎𝚡𝚝"
 **/
function transform(text, {
    bold,
    italics,
    mono,
    variable,
    sub,
    sup
}) {
    text = text.normalize("NFKD");
    if (sub) text = subscript(text);
    else if (sup) text = superscript(text);
    else if (bold && italics) text = boldenAndItalicize(text);
    else if (bold) text = bolden(text);
    else if (italics) text = italicize(text);
    else if (mono) text = monospace(text);
    else if (variable) text = scriptize(text);
    return text;
}

class CharTransform {
    constructor(startLetter, endLetter, startReplacement) {
        this.startCode = startLetter.charCodeAt(0);
        this.endCode = endLetter.charCodeAt(0);
        this.replacementCodes = startReplacement.split('').map(c => c.charCodeAt(0));
    }

    matches(charCode) {
        return charCode >= this.startCode && charCode <= this.endCode;
    }

    transform(charCode, buffer) {
        buffer.push(...this.replacementCodes);
        buffer[buffer.length - 1] += charCode - this.startCode;
    }
}

class SmallLetterTransform extends CharTransform {
    constructor(startReplacement) {
        super('a', 'z', startReplacement);
    }
}

class CapitalLetterTransform extends CharTransform {
    constructor(startReplacement) {
        super('A', 'Z', startReplacement);
    }
}

class DigitTransform extends CharTransform {
    constructor(startReplacement) {
        super('0', '9', startReplacement);
    }
}

class SingleCharTransform extends CharTransform {
    constructor(origin, transformed) {
        super(origin, origin, transformed);
    }
}

CharTransform.boldenTransforms = [
    new CapitalLetterTransform('𝗔'),
    new SmallLetterTransform('𝗮'),
    new DigitTransform('𝟬'),
];

CharTransform.italicizeTransform = [
    new CapitalLetterTransform('𝘈'),
    new SmallLetterTransform('𝘢'),
];

CharTransform.boldenAndItalicizeTransform = [
    new CapitalLetterTransform('𝘼'),
    new SmallLetterTransform('𝙖'),
    new DigitTransform('𝟬'), // There are no bold italics digits, use simple bold
];

CharTransform.monospaceTransform = [
    new CapitalLetterTransform('𝙰'),
    new SmallLetterTransform('𝚊'),
    new DigitTransform('𝟶'),
];

CharTransform.scriptizeTransform = [
    new CapitalLetterTransform('𝓐'),
    new SmallLetterTransform('𝓪'),
];

CharTransform.subscriptTransform = [
    new DigitTransform('₀'),
    new SingleCharTransform('a', 'ₐ'),
    new SingleCharTransform('e', 'ₑ'),
    new SingleCharTransform('h', 'ₕ'),
    new SingleCharTransform('i', 'ᵢ'),
    new SingleCharTransform('j', 'ⱼ'),
    new CharTransform('k', 'n', 'ₖ'),
    new SingleCharTransform('o', 'ₒ'),
    new SingleCharTransform('p', 'ₚ'),
    new SingleCharTransform('r', 'ᵣ'),
    new CharTransform('s', 't', 'ₛ'),
    new SingleCharTransform('u', 'ᵤ'),
    new SingleCharTransform('v', 'ᵥ'),
    new SingleCharTransform('x', 'ₓ'),
];

CharTransform.superscriptTransform = [
    new SingleCharTransform('1', '¹'),
    new CharTransform('2', '3', '²'),
    new DigitTransform('⁰'),
    new CharTransform('(', ')', '⁽'),
    new SingleCharTransform('+', '⁺'),
    new SingleCharTransform('-', '⁻'),
    new SingleCharTransform('=', '⁼'),
    new SingleCharTransform('n', 'ⁿ'),
    new SingleCharTransform('i', 'ⁱ'),
];

function transformator(transforms) {
    return function transform(text) {
        let codesBuffer = [];
        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            const transform = transforms.find(t => t.matches(code));
            if (transform) transform.transform(code, codesBuffer);
            else codesBuffer.push(code);
        }
        return String.fromCharCode(...codesBuffer);
    };
}

const bolden = transformator(CharTransform.boldenTransforms);
const italicize = transformator(CharTransform.italicizeTransform);
const boldenAndItalicize = transformator(CharTransform.boldenAndItalicizeTransform);
const monospace = transformator(CharTransform.monospaceTransform);
const scriptize = transformator(CharTransform.scriptizeTransform);
const subscript = transformator(CharTransform.subscriptTransform);
const superscript = transformator(CharTransform.superscriptTransform);

export {
    transform,
    bolden,
    italicize,
    boldenAndItalicize,
    monospace,
    scriptize,
    subscript,
    superscript,
};