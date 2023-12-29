export declare class Xref {
    private _isTableXref;
    private _tableXRefSubSections;
    private _tokenizer;
    private _trailerDictionary?;
    constructor(xRefBinary: Int8Array);
    get token(): string | undefined;
    read(): void;
    private _handleXRefTableInterpretation;
}
