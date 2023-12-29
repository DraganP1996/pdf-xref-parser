import { Dictionary } from "./Dictionary";
import { Tokenizer } from "./Tokenizer";
import { TableXRefSubSection } from "./XRefSubsection";
var Xref = /** @class */ (function () {
    function Xref(xRefBinary) {
        this._tableXRefSubSections = [];
        this._tokenizer = new Tokenizer(xRefBinary);
        this.read();
    }
    Object.defineProperty(Xref.prototype, "token", {
        get: function () {
            return this._tokenizer.token;
        },
        enumerable: false,
        configurable: true
    });
    Xref.prototype.read = function () {
        while (!this._tokenizer.complete) {
            var token = this._tokenizer.token;
            if (token === undefined) {
                continue;
            }
            // Only the table-based Xrefs starts with the xref keyword
            if (token === "xref") {
                this._isTableXref = true;
                this._handleXRefTableInterpretation();
                break;
            }
        }
    };
    Xref.prototype._handleXRefTableInterpretation = function () {
        while (!this._tokenizer.complete) {
            var first = this._tokenizer.token;
            if (!first) {
                continue;
            }
            if (first === "trailer") {
                this._trailerDictionary = Dictionary.from(this._tokenizer.getUnreadData(true));
                break;
            }
            if (isNaN(+first)) {
                continue;
            }
            var second = this._tokenizer.token;
            if (!second || isNaN(+second)) {
                continue;
            }
            var isTheStartObjNum = first.length === 10;
            var isTheGeneratorNum = second.length === 5;
            var isASubsectionHeader = !isTheStartObjNum || !isTheGeneratorNum;
            if (!isASubsectionHeader) {
                continue;
            }
            this._tableXRefSubSections.push(new TableXRefSubSection(+first, +second, this));
        }
    };
    return Xref;
}());
export { Xref };
