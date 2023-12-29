"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELIMITER_CHARACTERS = exports.END_DICTIONARY = exports.START_DICTIONARY = exports.START_XREF_KEYWORD = exports.XREF_KEYWORD = exports.EOF_KEYWORD = exports.EOL_CHARACTERS = exports.WHITE_SPACE_CHARACTERS = void 0;
exports.WHITE_SPACE_CHARACTERS = [0, 9, 12, 32];
exports.EOL_CHARACTERS = [10, 13];
exports.EOF_KEYWORD = [37, 37, 69, 79, 70];
exports.XREF_KEYWORD = [120, 114, 101, 102];
exports.START_XREF_KEYWORD = [115, 116, 97, 114, 116, 120, 114, 101, 102];
exports.START_DICTIONARY = [60, 60]; // <<
exports.END_DICTIONARY = [62, 62]; // >>
exports.DELIMITER_CHARACTERS = [
    40, // (
    41, // )
    60, // <
    62, // >
    91, // [
    93, // ]
    123, // {
    125, // }
    47, // /
    37, // %
];
