import { Dictionary } from "./Dictionary";
import { Tokenizer } from "./Tokenizer";
import { TableXRefSubSection } from "./XRefSubsection";
import { XRefEntry } from "./xref.model";

export class Xref {
  private _isTableXref!: boolean;
  private _tableXRefSubSections: TableXRefSubSection[] = [];

  private _tokenizer: Tokenizer;
  private _trailerDictionary?: Dictionary;

  constructor(xRefBinary: Int8Array) {
    this._tokenizer = new Tokenizer(xRefBinary);

    this._read();
  }

  get token(): string | undefined {
    return this._tokenizer.token;
  }

  getXRefEntries(): XRefEntry[] {
    const entries = [];

    this._tableXRefSubSections.forEach((subsection: TableXRefSubSection) =>
      subsection.entries.forEach((entry: XRefEntry) => entries.push(entry))
    );

    return entries;
  }

  private _read() {
    while (!this._tokenizer.complete) {
      const token = this._tokenizer.token;

      if (token === undefined) {
        continue;
      }

      // Only the table-based Xrefs starts with the xref keyword
      if (token === "xref") {
        this._isTableXref = true;
        this._handleXRefTableInterpretation();
        break;
      }
    }
  }

  private _handleXRefTableInterpretation(): void {
    while (!this._tokenizer.complete) {
      const first = this._tokenizer.token;

      if (!first) {
        continue;
      }

      if (first === "trailer") {
        this._trailerDictionary = Dictionary.from(
          this._tokenizer.getUnreadData(true)
        );

        break;
      }

      if (isNaN(+first)) {
        continue;
      }

      const second = this._tokenizer.token;

      if (!second || isNaN(+second)) {
        continue;
      }

      const isTheStartObjNum = first.length === 10;
      const isTheGeneratorNum = second.length === 5;
      const isASubsectionHeader = !isTheStartObjNum || !isTheGeneratorNum;

      if (!isASubsectionHeader) {
        continue;
      }

      this._tableXRefSubSections.push(
        new TableXRefSubSection(+first, +second, this)
      );
    }
  }
}
