import { isEOLChar, isEmptySpace } from "./util";

/**
 * Used to retrieve tokens from the PDF raw data
 */
export class Tokenizer {
  /**
   * true - all the bytes are read, otherwise false
   */
  complete = false;

  /**
   * Stores the information about the last read index from the bytes
   * Int8Array
   */
  lastReadIndex = -1;

  protected _bytes: Int8Array;

  constructor(dataView: Int8Array) {
    this._bytes = dataView;
  }

  /**
   * Get the next byte from the bytes Int8Array
   */
  protected *__peekByte(): Generator<number> {
    while (this.lastReadIndex <= this._bytes.length - 1) {
      yield this._bytes[++this.lastReadIndex];
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

      console.log("TOKENIZER PEEKED BYTE: ", byte, String.fromCharCode(byte));

      if (done) {
        break;
      }

      const isWhiteSpace = isEmptySpace(byte);
      const isEOL = isEOLChar(byte);

      if (
        isWhiteSpace ||
        isEOL ||
        this.lastReadIndex > this._bytes.byteLength - 1
      ) {
        break;
      }

      token.push(byte);
    }

    const allBytesAreRead = this.lastReadIndex >= this._bytes.byteLength - 1;

    this.complete = allBytesAreRead;

    if (!token.length && allBytesAreRead) {
      return undefined;
    }

    return token.length ? String.fromCharCode(...token) : this.token;
  }

  /**
   * Returns if the tokenizer is completed or not
   * It is possible to complete programmatically by using the following param
   * @param setIsCompleted
   * @returns
   */
  public getUnreadData(setIsCompleted?: boolean): Int8Array {
    setIsCompleted && this.completeTokenizer();

    return this._bytes.slice(this.lastReadIndex, this._bytes.byteLength);
  }

  public completeTokenizer() {
    this.complete = true;
  }
}
