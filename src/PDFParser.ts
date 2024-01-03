import { ReverseTokenizer } from "./ReverseTokenizer";
import { Xref } from "./XRef";

import { isEOFString } from "./util";
import { XRefEntry } from "./xref.model";

export class PDFParser {
  /**
   * Bytes representing the pdf file
   */
  private _pdfBytesView: Int8Array;
  /**
   * Cross-reference section od the PDF
   * (Can be a table, a stream or a hybrid)
   */
  private _xRef?: Xref;
  /**
   * Reverse tokenizer used to create tokens from the bytes
   * of the PDF (reding the PDF from the end)
   */
  private _reverseTokenizer: ReverseTokenizer;

  constructor(buffer: ArrayBuffer) {
    const pdfBinary = new Int8Array(buffer);

    this._pdfBytesView = pdfBinary;
    this._reverseTokenizer = new ReverseTokenizer(pdfBinary);

    this._read();
  }

  /**
   * Returns an array of XRefEntry representing the entries in the cross-reference
   * section of the PDF file
   * Currently supports only PDF files with table cross reference section
   * Stream and hybrid reference sections will be available soon.
   */
  getXRefEntries(): XRefEntry[] {
    if (!this._xRef) {
      return [];
    }

    return this._xRef.getXRefEntries();
  }

  /**
   * Reads the PDF file binary view from the end in order to find the
   * cross-reference section
   */
  private _read() {
    const tokenGen = this._reverseTokenizer.peekValidToken();

    while (true) {
      const { value: token, done } = tokenGen.next();

      if (done) {
        break;
      }

      // We want to find the previous valid token before the EOF
      // token (xRef byte offset), so if the current token is not the EOF,
      // we can skip this iteration
      if (!token || !isEOFString(token)) {
        continue;
      }

      // The previous valid token before EOF is represents the byte offset
      // of the cross-reference section
      const { value: xRefOffset, done: xRefOffsetDone } = tokenGen.next();

      if (!xRefOffset || xRefOffsetDone) {
        break;
      }

      // The cross-reference section is the slice of the binary data between
      // the byte offset for the cross-reference section and the last read index
      // of the reverse tokenizer (since the file is read from the end)
      const xRefBinaryView = this._pdfBytesView.slice(
        +xRefOffset,
        this._reverseTokenizer.lastReadIndex + 1
      );

      // Creates an instance of the XRef class that contains all the data related
      // to the cross-reference section
      this._xRef = new Xref(xRefBinaryView);

      // If the cross-reference section is found, we can stop to read the file
      // from the end
      if (!!this._xRef) {
        return;
      }
    }
  }
}
