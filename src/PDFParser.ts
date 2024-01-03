import { ReverseTokenizer } from "./ReverseTokenizer";
import { Xref } from "./XRef";

import { isEOFString } from "./util";
import { XRefEntry } from "./xref.model";

export class PDFParser {
  private _buffer: Int8Array;
  private _xRef?: Xref;

  private _reverseTokenizer: ReverseTokenizer;

  constructor(buffer: ArrayBuffer) {
    const pdfBinary = new Int8Array(buffer);

    this._buffer = pdfBinary;
    this._reverseTokenizer = new ReverseTokenizer(pdfBinary);

    this._read();
  }

  getXRefEntries(): XRefEntry[] {
    if (!this._xRef) {
      return [];
    }

    return this._xRef.getXRefEntries();
  }

  private _read() {
    debugger;
    while (!this._reverseTokenizer.complete) {
      const token = this._reverseTokenizer.token;

      if (!token) {
        continue;
      }

      const isEOF = isEOFString(token);

      if (!isEOF) {
        continue;
      }

      const xRefOffset = this._reverseTokenizer.token;

      if (!xRefOffset) {
        return;
      }

      const xRefBinaryView = this._buffer.slice(
        +xRefOffset,
        this._reverseTokenizer.lastReadIndex + 1
      );

      this._xRef = new Xref(xRefBinaryView);
    }
  }
}
