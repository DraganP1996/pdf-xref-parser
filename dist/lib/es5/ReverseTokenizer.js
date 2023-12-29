"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseTokenizer = void 0;
var Tokenizer_1 = require("./Tokenizer");
var util_1 = require("./util");
/**
 * Used to retrieve tokens from the PDF raw data from the end
 */
var ReverseTokenizer = /** @class */ (function (_super) {
    __extends(ReverseTokenizer, _super);
    function ReverseTokenizer(dataView) {
        var _this = _super.call(this, dataView) || this;
        _this.lastReadIndex = dataView.byteLength - 1;
        return _this;
    }
    Object.defineProperty(ReverseTokenizer.prototype, "byte", {
        /**
         * Get the next byte from the bytes Int8Array
         */
        get: function () {
            var byte = this._bytes[this.lastReadIndex];
            --this.lastReadIndex;
            return byte;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReverseTokenizer.prototype, "token", {
        /**
         * Composes PDF tokens from the bytes in the Int8Array
         */
        get: function () {
            var token = [];
            while (true) {
                var byte = this.byte;
                var isWhiteSpace = (0, util_1.isEmptySpace)(byte);
                var isEOL = (0, util_1.isEOLChar)(byte);
                if (isWhiteSpace || isEOL || this.lastReadIndex <= 0) {
                    break;
                }
                token.unshift(byte);
            }
            var allBytesAreRead = this.lastReadIndex <= 0;
            this.complete = allBytesAreRead;
            if (!token.length && allBytesAreRead) {
                return undefined;
            }
            return token.length ? String.fromCharCode.apply(String, token) : this.token;
        },
        enumerable: false,
        configurable: true
    });
    return ReverseTokenizer;
}(Tokenizer_1.Tokenizer));
exports.ReverseTokenizer = ReverseTokenizer;
