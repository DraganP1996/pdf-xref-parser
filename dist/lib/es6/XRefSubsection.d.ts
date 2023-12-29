import { Xref } from "./XRef";
import { XRefEntry } from "./xref.model";
export declare class TableXRefSubSection {
    startingObjNumber: number;
    numberOfEntries: number;
    prevSubsection?: TableXRefSubSection;
    xRef: Xref;
    entries: XRefEntry[];
    constructor(startingObjNumber: number, numberOfEntries: number, xRef: Xref);
    findEntries(): void;
}
