"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPDFString = exports.isPDFArray = exports.isEOFString = exports.isEOFChar = exports.isEOLChar = exports.isEmptySpace = exports.areArraysEqual = void 0;
var syntax_1 = require("./syntax");
var areArraysEqual = function (a, b) {
    return a.every(function (val, idx) { return val === b[idx]; });
};
exports.areArraysEqual = areArraysEqual;
var isEmptySpace = function (charCode) {
    return syntax_1.WHITE_SPACE_CHARACTERS.includes(charCode);
};
exports.isEmptySpace = isEmptySpace;
var isEOLChar = function (charCode) {
    return syntax_1.EOL_CHARACTERS.includes(charCode);
};
exports.isEOLChar = isEOLChar;
var isEOFChar = function (charCodes) {
    return (0, exports.areArraysEqual)(syntax_1.EOF_KEYWORD, charCodes);
};
exports.isEOFChar = isEOFChar;
var isEOFString = function (token) {
    return String.fromCharCode.apply(String, syntax_1.EOF_KEYWORD) === token;
};
exports.isEOFString = isEOFString;
var isPDFArray = function (token) {
    return token.charAt(0) === "[" || token.charAt(token.length - 1) === "]";
};
exports.isPDFArray = isPDFArray;
var extractPDFString = function (token) {
    return token.replace(/^</g, "").replace(/$>/g, "");
};
exports.extractPDFString = extractPDFString;
