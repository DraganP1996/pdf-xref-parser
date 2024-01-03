import { isEOLChar, isEmptySpace } from "./util";

/**
 * Used to retrieve tokens from the PDF raw data
 */
export class Tokenizer {
  /**
   * Stores the information about the last read index from the bytes
   * Int8Array
   */
  lastReadIndex = -1;

  protected _bytesView: Int8Array;

  constructor(dataView: Int8Array) {
    this._bytesView = dataView;
  }

  /**
   * Get the next byte from the bytes Int8Array
   */
  protected *__peekByte(): Generator<number> {
    while (this.lastReadIndex <= this._bytesView.length - 1) {
      yield this._bytesView[++this.lastReadIndex];
    }
  }

  public *peekValidToken(): Generator<string> {
    const byteGenerator = this.__peekByte();

    let token: number[] = [];

    while (this.lastReadIndex <= this._bytesView.byteLength - 1) {
      const { value: byte, done } = byteGenerator.next();

      if (done) {
        break;
      }

      const isWhiteSpace = isEmptySpace(byte);
      const isEOL = isEOLChar(byte);
      const isDelimiter = isWhiteSpace || isEOL;
      const isAValidToken = isDelimiter && token.length;
      const isJustEmptySpace = isDelimiter && !token.length;

      // If the current token is a valid token, we can use it
      if (isAValidToken) {
        const validToken = [...token];

        token = [];
        yield String.fromCharCode(...validToken);
      }

      // If the current token is just an empty space, we can reset the
      // char arrays which represent a token and continue
      if (isJustEmptySpace) {
        token = [];
        continue;
      }

      // If the current byte is not a delimiter, we can add it in the
      // array of bytes that represent the current token
      if (!isDelimiter) {
        token.push(byte);
      }
    }
  }
}
