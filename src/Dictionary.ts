import { Ref } from "./Ref";
import { Tokenizer } from "./Tokenizer";

export interface GenericDictionaryParams {
  [key: string]: Ref | number | string | [] | boolean;
}

export class Dictionary {
  constructor(values: GenericDictionaryParams) {
    Object.assign(this, values);
  }

  /**
   * It is necessary to send bytes that contains << and >> or at least >>
   * @param bytes
   * @returns
   */
  static from(bytes: Int8Array): Dictionary {
    const tokenizer = new Tokenizer(bytes);
    const genericObject: GenericDictionaryParams = {};

    while (!tokenizer.complete) {
      const key = findDictionaryKey(tokenizer);
      const value = findDictionaryValue(tokenizer);

      genericObject[key.split("/")[1].toLowerCase()] = value;
    }

    return new Dictionary(genericObject);
  }
}

export const findDictionaryKey = (tokenizer: Tokenizer) => {
  let name = "";

  while (!name) {
    const token = tokenizer.token;

    if (token?.charAt(0) === "/") {
      name = token;
      break;
    }

    if (token === ">>") {
      tokenizer.complete = true;
      break;
    }
  }

  return name;
};

export const findDictionaryValue = (tokenizer: Tokenizer): any => {
  let isANameToken = false;
  let isAnArrayToken = false;
  let isANumberToken = false;
  let isRefToken = false;

  let value: any[] = [];

  while (!tokenizer.complete) {
    const token = tokenizer.token;

    if (token === undefined) {
      continue;
    }

    if (token === ">>") {
      tokenizer.complete = true;
      break;
    }

    isANameToken = token.charAt(0) === "/";
    isAnArrayToken =
      (!value.length && token.charAt(0) === "[") ||
      (!!value.length && token.charAt(token.length - 1) === "]");
    isANumberToken = !value.length && !isNaN(+token);
    isRefToken =
      (value.length === 1 && !isNaN(+value[0])) ||
      (value.length === 2 && !isNaN(+value[0]) && !isNaN(+value[1])) ||
      (token === "R" &&
        value.length === 2 &&
        !isNaN(+value[0]) &&
        !isNaN(+value[1]));

    // Entry value of dictionary od Name type
    if (isANameToken) {
      value.unshift(token);
      break;
    }

    // Entry value of dictionary od Number type
    if (isANumberToken && !isANameToken) {
      value.unshift(token);
    }

    // Entry value of number type - difference from Ref token since there is just one number followed by another name
    // TODO: Probably a bug here, what if the last value is a number token followed by >>, a solution is probably to ignore << and >>
    if (isANameToken && isANumberToken && token?.charAt(0) === "/") {
      // need to use the last read token from tokenizer for the key of the next dictionary entry
      break;
    }

    // Entry value of dictionary od Array type
    if (isAnArrayToken) {
      if (!value.length && token.charAt(0) === "[" && token.charAt(1) === "<") {
        value.unshift(token.split("[<")[1]);
      } else if (
        value.length &&
        token.charAt(token.length - 1) === "]" &&
        token.charAt(token.length - 2) === ">"
      ) {
        value.unshift(token.split("]>")[0]);
        break;
      }
    }

    if (isRefToken && (token === "R" || !isNaN(+token))) {
      value.push(token);

      if (token === "R") {
        break;
      }
    }
  }
  return value;
};
