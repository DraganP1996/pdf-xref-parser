import { Tokenizer } from "./Tokenizer";
/**
 * Used to retrieve tokens from the PDF raw data from the end
 */
export declare class ReverseTokenizer extends Tokenizer {
    constructor(dataView: Int8Array);
    /**
     * Get the next byte from the bytes Int8Array
     */
    protected get byte(): number;
    /**
     * Composes PDF tokens from the bytes in the Int8Array
     */
    get token(): string | undefined;
}
