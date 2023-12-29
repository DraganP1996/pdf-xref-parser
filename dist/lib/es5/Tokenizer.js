"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var util_1 = require("./util");
/**
 * Used to retrieve tokens from the PDF raw data
 */
var Tokenizer = /** @class */ (function () {
    function Tokenizer(dataView) {
        /**
         * true - all the bytes are read, otherwise false
         */
        this.complete = false;
        /**
         * Stores the information about the last read index from the bytes
         * Int8Array
         */
        this.lastReadIndex = 0;
        this._bytes = dataView;
    }
    Object.defineProperty(Tokenizer.prototype, "byte", {
        /**
         * Get the next byte from the bytes Int8Array
         */
        get: function () {
            var byte = this._bytes[this.lastReadIndex];
            ++this.lastReadIndex;
            return byte;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tokenizer.prototype, "token", {
        /**
         * Composes PDF tokens from the bytes in the Int8Array
         */
        get: function () {
            var token = [];
            while (true) {
                var byte = this.byte;
                var isWhiteSpace = (0, util_1.isEmptySpace)(byte);
                var isEOL = (0, util_1.isEOLChar)(byte);
                if (isWhiteSpace ||
                    isEOL ||
                    this.lastReadIndex > this._bytes.byteLength - 1) {
                    break;
                }
                token.push(byte);
            }
            var allBytesAreRead = this.lastReadIndex >= this._bytes.byteLength - 1;
            this.complete = allBytesAreRead;
            if (!token.length && allBytesAreRead) {
                return undefined;
            }
            return token.length ? String.fromCharCode.apply(String, token) : this.token;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns if the tokenizer is completed or not
     * It is possible to complete programmatically by using the following param
     * @param setIsCompleted
     * @returns
     */
    Tokenizer.prototype.getUnreadData = function (setIsCompleted) {
        setIsCompleted && this.completeTokenizer();
        return this._bytes.slice(this.lastReadIndex, this._bytes.byteLength);
    };
    Tokenizer.prototype.completeTokenizer = function () {
        this.complete = true;
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
