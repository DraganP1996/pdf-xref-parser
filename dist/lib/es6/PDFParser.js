import { ReverseTokenizer } from "./ReverseTokenizer";
import { Xref } from "./XRef";
import { isEOFString } from "./util";
var PDFParser = /** @class */ (function () {
    function PDFParser(data) {
        this.data = data;
        this._reverseTokenizer = new ReverseTokenizer(data);
        this.read();
    }
    PDFParser.prototype.read = function () {
        while (!this._reverseTokenizer.complete) {
            var token = this._reverseTokenizer.token;
            if (!token) {
                continue;
            }
            var isEOF = isEOFString(token);
            if (!isEOF) {
                continue;
            }
            var xRefOffset = this._reverseTokenizer.token;
            if (!xRefOffset) {
                return;
            }
            var xRefBinaryView = this.data.slice(+xRefOffset, this._reverseTokenizer.lastReadIndex + 1);
            this.xRef = new Xref(xRefBinaryView);
        }
    };
    return PDFParser;
}());
export { PDFParser };
