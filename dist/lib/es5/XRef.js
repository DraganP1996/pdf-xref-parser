"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xref = void 0;
var Dictionary_1 = require("./Dictionary");
var Tokenizer_1 = require("./Tokenizer");
var XRefSubsection_1 = require("./XRefSubsection");
var Xref = /** @class */ (function () {
    function Xref(xRefBinary) {
        this._tableXRefSubSections = [];
        this._tokenizer = new Tokenizer_1.Tokenizer(xRefBinary);
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
                this._trailerDictionary = Dictionary_1.Dictionary.from(this._tokenizer.getUnreadData(true));
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
            this._tableXRefSubSections.push(new XRefSubsection_1.TableXRefSubSection(+first, +second, this));
        }
    };
    return Xref;
}());
exports.Xref = Xref;
