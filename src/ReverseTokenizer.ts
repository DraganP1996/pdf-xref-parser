import { Tokenizer } from "./Tokenizer";

import { isEOLChar, isEmptySpace } from "./util";

/**
 * Used to retrieve tokens from the PDF raw data from the end
 */
export class ReverseTokenizer extends Tokenizer {
  constructor(dataView: Int8Array) {
    super(dataView);

    this.lastReadIndex = dataView.byteLength - 1;
  }

  /**
   * Get the next byte from the bytes Int8Array
   */
  protected override get byte(): number {
    const byte = this._bytes[this.lastReadIndex];

    --this.lastReadIndex;

    return byte;
  }

  /**
   * Composes PDF tokens from the bytes in the Int8Array
   */
  get token(): string | undefined {
    const token: number[] = [];

    while (true) {
      const byte = this.byte;
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
