import { Tokenizer } from "./Tokenizer";
import { Xref } from "./XRef";
import { XREF_ENTRY_TYPES, XRefEntry } from "./xref.model";

export class TableXRefSubSection {
  startingObjNumber: number;
  numberOfEntries: number;
  prevSubsection?: TableXRefSubSection;

  entries: XRefEntry[] = [];
  tokenizer: Tokenizer;

  constructor(
    startingObjNumber: number,
    numberOfEntries: number,
    tokenizer: Tokenizer
  ) {
    this.startingObjNumber = startingObjNumber;
    this.numberOfEntries = numberOfEntries;
    this.tokenizer = tokenizer;

    this.findEntries();
  }

  findEntries(): void {
    const tokenGen = this.tokenizer.peekValidToken();

    while (this.entries.length < this.numberOfEntries) {
      const { value: byteOffset, done: byteOffsetDone } = tokenGen.next();
      const { value: generator, done: generatorDone } = tokenGen.next();
      const { value: type, done: typeDone } = tokenGen.next();

      if (
        !byteOffset ||
        !generator ||
        !type ||
        byteOffsetDone ||
        generatorDone ||
        typeDone
      ) {
        return;
      }

      this.entries.push({
        byteOffset: +byteOffset,
        generator: +generator,
        type: type === "f" ? XREF_ENTRY_TYPES.FREE : XREF_ENTRY_TYPES.IN_USE,
        num: this.startingObjNumber + this.entries.length,
      });
    }
  }
}
