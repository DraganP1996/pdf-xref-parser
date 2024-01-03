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
      yield this._bytes[--this.lastReadIndex];
    }
  }

  /**
   * Composes PDF tokens from the bytes in the Int8Array
   */
  get token(): string | undefined {
    const byteGenerator = this.__peekByte();
    const token: number[] = [];

    while (true) {
      const { value: byte, done } = byteGenerator.next();

      console.log(
        "REVERSE TOKENIZER PEEKED BYTE: ",
        byte,
        String.fromCharCode(byte)
      );

      if (done) {
        break;
      }

      const isWhiteSpace = isEmptySpace(byte);
      const isEOL = isEOLChar(byte);

      if (isWhiteSpace || isEOL || this.lastReadIndex <= 0) {
        break;
      }

      token.unshift(byte);
    }

    const allBytesAreRead = this.lastReadIndex <= 0;

    this.complete = allBytesAreRead;

    if (!token.length && allBytesAreRead) {
      return undefined;
    }

    return token.length ? String.fromCharCode(...token) : this.token;
  }
}
