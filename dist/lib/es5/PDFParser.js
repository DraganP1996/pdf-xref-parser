"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFParser = void 0;
var ReverseTokenizer_1 = require("./ReverseTokenizer");
var XRef_1 = require("./XRef");
var util_1 = require("./util");
var PDFParser = /** @class */ (function () {
    function PDFParser(data) {
        this.data = data;
        this._reverseTokenizer = new ReverseTokenizer_1.ReverseTokenizer(data);
        this.read();
    }
    PDFParser.prototype.read = function () {
        while (!this._reverseTokenizer.complete) {
            var token = this._reverseTokenizer.token;
            if (!token) {
                continue;
            }
            var isEOF = (0, util_1.isEOFString)(token);
            if (!isEOF) {
                continue;
            }
            var xRefOffset = this._reverseTokenizer.token;
            if (!xRefOffset) {
                return;
            }
            var xRefBinaryView = this.data.slice(+xRefOffset, this._reverseTokenizer.lastReadIndex + 1);
            this.xRef = new XRef_1.Xref(xRefBinaryView);
        }
    };
    return PDFParser;
}());
exports.PDFParser = PDFParser;
