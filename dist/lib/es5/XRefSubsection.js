"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableXRefSubSection = void 0;
var xref_model_1 = require("./xref.model");
var TableXRefSubSection = /** @class */ (function () {
    function TableXRefSubSection(startingObjNumber, numberOfEntries, xRef) {
        this.entries = [];
        this.startingObjNumber = startingObjNumber;
        this.numberOfEntries = numberOfEntries;
        this.xRef = xRef;
        this.findEntries();
    }
    TableXRefSubSection.prototype.findEntries = function () {
        for (var i = 0; i <= this.numberOfEntries - 1; i++) {
            var byteOffset = this.xRef.token;
            var generator = this.xRef.token;
            var type = this.xRef.token;
            console.log("byteOffset     :", byteOffset);
            console.log("generator      :", generator);
            console.log("type           :", type);
            console.log("index          :", i);
            if (!byteOffset || !generator || !type) {
                return;
            }
            this.entries.push({
                byteOffset: +byteOffset,
                generator: +generator,
                type: type === "f" ? xref_model_1.XREF_ENTRY_TYPES.FREE : xref_model_1.XREF_ENTRY_TYPES.IN_USE,
                num: this.startingObjNumber + i,
            });
        }
    };
    return TableXRefSubSection;
}());
exports.TableXRefSubSection = TableXRefSubSection;
