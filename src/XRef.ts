import { Dictionary } from "./Dictionary";
import { Tokenizer } from "./Tokenizer";
import { TableXRefSubSection } from "./XRefSubsection";
import { XRefEntry } from "./xref.model";

export class Xref {
  private _bytesView: Int8Array;
  private _isTableXref!: boolean;
  private _tableXRefSubSections: TableXRefSubSection[] = [];
  private _trailerDictionary?: Dictionary;

  tokenizer: Tokenizer;

  constructor(xRefBinary: Int8Array) {
    this._bytesView = xRefBinary;
    this.tokenizer = new Tokenizer(xRefBinary);

    this._read();
  }

  get token(): string | undefined {
    return this.tokenizer.peekValidToken().next().value;
  }

  getXRefEntries(): XRefEntry[] {
    const entries = [];

    this._tableXRefSubSections.forEach((subsection: TableXRefSubSection) =>
      subsection.entries.forEach((entry: XRefEntry) => entries.push(entry))
    );

    return entries;
  }

  private _read() {
    const generator = this.tokenizer.peekValidToken();

    while (true) {
      const { value, done } = generator.next();

      if (done) {
        break;
      }

      if (value === undefined) {
        continue;
      }

      // Only the table-based Xrefs starts with the xref keyword
      if (value === "xref") {
        this._isTableXref = true;
        this._handleXRefTableInterpretation();
        break;
      }
    }
  }

  private _handleXRefTableInterpretation(): void {
    const generator = this.tokenizer.peekValidToken();

    while (true) {
      const { value: firstValue, done: firstDone } = generator.next();

      if (firstDone) {
        break;
      }

      if (!firstValue) {
        continue;
      }

      if (firstValue === "trailer") {
        this._trailerDictionary = Dictionary.from(this.tokenizer);

        const hasPreviousXRefTable = !!this._trailerDictionary["Prev"];

        if (hasPreviousXRefTable) {
          this.tokenizer = new Tokenizer(this._bytesView);
          this.tokenizer.lastReadIndex = +this._trailerDictionary["Prev"] - 1;
          this._read();
        }

        break;
      }

      if (isNaN(+firstValue)) {
        continue;
      }

      const { value: secondValue, done: secondDone } = generator.next();

      if (secondDone) {
        break;
      }

      if (!secondValue || isNaN(+secondValue)) {
        continue;
      }

      const isTheStartObjNum = firstValue.length === 10;
      const isTheGeneratorNum = secondValue.length === 5;
      const isASubsectionHeader = !isTheStartObjNum || !isTheGeneratorNum;

      if (!isASubsectionHeader) {
        continue;
      }

      this._tableXRefSubSections.push(
        new TableXRefSubSection(+firstValue, +secondValue, this.tokenizer)
      );
    }
  }
}
