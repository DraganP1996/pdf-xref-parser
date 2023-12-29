import { Xref } from "./XRef";
import { XREF_ENTRY_TYPES, XRefEntry } from "./xref.model";

export class TableXRefSubSection {
  startingObjNumber: number;
  numberOfEntries: number;
  prevSubsection?: TableXRefSubSection;

  xRef: Xref;
  entries: XRefEntry[] = [];

  constructor(startingObjNumber: number, numberOfEntries: number, xRef: Xref) {
    this.startingObjNumber = startingObjNumber;
    this.numberOfEntries = numberOfEntries;
    this.xRef = xRef;

    this.findEntries();
  }

  findEntries(): void {
    for (let i = 0; i <= this.numberOfEntries - 1; i++) {
      const byteOffset = this.xRef.token;
      const generator = this.xRef.token;
      const type = this.xRef.token;

      console.log("byteOffset     :", byteOffset);
      console.log("generator      :", generator);
      console.log("type           :", type);
      console.log("index          :", i);

      if (!byteOffset || !generator || !type) {
        return;
      }

      this.entries.push({
        byteOffset: +byteOffset,
        generator: +generator,
        type: type === "f" ? XREF_ENTRY_TYPES.FREE : XREF_ENTRY_TYPES.IN_USE,
        num: this.startingObjNumber + i,
      });
    }
  }
}
