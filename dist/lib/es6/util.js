import { EOF_KEYWORD, EOL_CHARACTERS, WHITE_SPACE_CHARACTERS } from "./syntax";
export var areArraysEqual = function (a, b) {
    return a.every(function (val, idx) { return val === b[idx]; });
};
export var isEmptySpace = function (charCode) {
    return WHITE_SPACE_CHARACTERS.includes(charCode);
};
export var isEOLChar = function (charCode) {
    return EOL_CHARACTERS.includes(charCode);
};
export var isEOFChar = function (charCodes) {
    return areArraysEqual(EOF_KEYWORD, charCodes);
};
export var isEOFString = function (token) {
    return String.fromCharCode.apply(String, EOF_KEYWORD) === token;
};
export var isPDFArray = function (token) {
    return token.charAt(0) === "[" || token.charAt(token.length - 1) === "]";
};
export var extractPDFString = function (token) {
    return token.replace(/^</g, "").replace(/$>/g, "");
};
