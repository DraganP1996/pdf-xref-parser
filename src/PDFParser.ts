import { ReverseTokenizer } from "./ReverseTokenizer";
import { Xref } from "./XRef";

import { isEOFString } from "./util";

export class PDFParser {
  data: Int8Array;
  xRef?: Xref;

  private _reverseTokenizer: ReverseTokenizer;

  constructor(data: Int8Array) {
    this.data = data;
    this._reverseTokenizer = new ReverseTokenizer(data);

    this.read();
  }

  read() {
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

      const xRefBinaryView = this.data.slice(
        +xRefOffset,
        this._reverseTokenizer.lastReadIndex + 1
      );

      this.xRef = new Xref(xRefBinaryView);
    }
  }
}
