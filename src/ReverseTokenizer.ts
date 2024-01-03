import { Tokenizer } from "./Tokenizer";

import { isEOLChar, isEmptySpace } from "./util";

/**
 * Used to retrieve tokens from the PDF raw data from the end
 */
export class ReverseTokenizer extends Tokenizer {
  constructor(dataView: Int8Array) {
    super(dataView);

    this.lastReadIndex = dataView.byteLength;
  }

  /**
   * Get the next byte from the bytes Int8Array
   */
  protected override *__peekByte(): Generator<number> {
    while (!!this.lastReadIndex) {
      yield this._bytesView[--this.lastReadIndex];
    }
  }

  public override *peekValidToken(): Generator<string> {
    const byteGenerator = this.__peekByte();

    let token: number[] = [];

    while (!!this.lastReadIndex) {
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
        token.unshift(byte);
      }
    }
  }
}
