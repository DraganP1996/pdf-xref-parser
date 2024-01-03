export interface XRefEntry {
  type: XREF_ENTRY_TYPES;
  num: number;
  generator: number;
  byteOffset: number;
}

export enum XREF_ENTRY_TYPES {
  FREE,
  IN_USE,
  IN_USE_COMPRESSED,
}
