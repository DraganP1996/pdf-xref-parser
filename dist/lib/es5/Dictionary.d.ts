import { Ref } from "./Ref";
import { Tokenizer } from "./Tokenizer";
export interface GenericDictionaryParams {
    [key: string]: Ref | number | string | [] | boolean;
}
export declare class Dictionary {
    constructor(values: GenericDictionaryParams);
    /**
     * It is necessary to send bytes that contains << and >> or at least >>
     * @param bytes
     * @returns
     */
    static from(bytes: Int8Array): Dictionary;
}
export declare const findDictionaryKey: (tokenizer: Tokenizer) => string;
export declare const findDictionaryValue: (tokenizer: Tokenizer) => any;
