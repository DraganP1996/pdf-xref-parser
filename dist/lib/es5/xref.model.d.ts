export interface XRefEntry {
    type: XREF_ENTRY_TYPES;
    num: number;
    generator: number;
    byteOffset: number;
}
export declare enum XREF_ENTRY_TYPES {
    FREE = 0,
    IN_USE = 1,
    IN_USE_COMPRESSED = 2
}
