import { Xref } from "./XRef";
export declare class PDFParser {
    data: Int8Array;
    xRef?: Xref;
    private _reverseTokenizer;
    constructor(data: Int8Array);
    read(): void;
}
