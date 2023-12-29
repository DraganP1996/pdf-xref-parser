/**
 * Used to retrieve tokens from the PDF raw data
 */
export declare class Tokenizer {
    /**
     * true - all the bytes are read, otherwise false
     */
    complete: boolean;
    /**
     * Stores the information about the last read index from the bytes
     * Int8Array
     */
    lastReadIndex: number;
    protected _bytes: Int8Array;
    constructor(dataView: Int8Array);
    /**
     * Get the next byte from the bytes Int8Array
     */
    protected get byte(): number;
    /**
     * Composes PDF tokens from the bytes in the Int8Array
     */
    get token(): string | undefined;
    /**
     * Returns if the tokenizer is completed or not
     * It is possible to complete programmatically by using the following param
     * @param setIsCompleted
     * @returns
     */
    getUnreadData(setIsCompleted?: boolean): Int8Array;
    completeTokenizer(): void;
}
