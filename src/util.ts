import { EOF_KEYWORD, EOL_CHARACTERS, WHITE_SPACE_CHARACTERS } from "./syntax";

export const areArraysEqual = (a: any[], b: any[]) =>
  a.every((val, idx) => val === b[idx]);

export const isEmptySpace = (charCode: number) => {
  return WHITE_SPACE_CHARACTERS.includes(charCode);
};

export const isEOLChar = (charCode: number) => {
  return EOL_CHARACTERS.includes(charCode);
};

export const isEOFChar = (charCodes: number[]) =>
  areArraysEqual(EOF_KEYWORD, charCodes);

export const isEOFString = (token: string) =>
  String.fromCharCode(...EOF_KEYWORD) === token;

export const isPDFArray = (token: string) =>
  token.charAt(0) === "[" || token.charAt(token.length - 1) === "]";

export const extractPDFString = (token: string) =>
  token.replace(/^</g, "").replace(/$>/g, "");
