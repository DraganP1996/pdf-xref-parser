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
  static from(tokenizer: Tokenizer): Dictionary {
    const genericObject: GenericDictionaryParams = {};
    const keyGen = findKey(tokenizer);
    const valueGen = findValue(tokenizer);

    while (true) {
      const { value: key, done: keyDone } = keyGen.next();

      if (keyDone || key === ">>") {
        break;
      }

      if (!key || key === "<<") {
        continue;
      }

      const { value, done } = valueGen.next();

      if (done || value === undefined || value === ">>") {
        break;
      }

      genericObject[key.split('/')[1]] = value;
    }

    return new Dictionary(genericObject);
  }
}

function* findKey(tokenizer: Tokenizer) {
  const tokenGen = tokenizer.peekValidToken();

  while (true) {
    const { value, done } = tokenGen.next();

    if (done) {
      break;
    }

    const isNamePDFObj = value?.charAt(0) === "/";
    const isEndOfDictionary = value === ">>";
    const isStartOfDictionary = value === "<<";

    if (isNamePDFObj) {
      yield value;
    }

    if (isStartOfDictionary) {
      continue;
    }

    if (!isNamePDFObj || isEndOfDictionary) {
      break;
    }
  }
}

function* findValue(tokenizer: Tokenizer): Generator<any> {
  const generator = tokenizer.peekValidToken();

  while (true) {
    const { value, done } = generator.next();

    if (done || undefined) {
      break;
    }

    const isEndOfDictionary = value === ">>";
    const isStartOfDictionary = value === "<<";
    const isNamePDFObj = value.charAt(0) === "/";
    const isANumber = !isNaN(+value);
    const startsPDFArrayObj = value.charAt(0) === "[";

    if (isStartOfDictionary) {
      continue;
    }

    if (isEndOfDictionary) {
      return;
    }

    // If it is a name, we can yield the value
    if (isNamePDFObj) {
      yield value;
    }

    // If it is a number, we need to verify if is just a number or a Ref
    // If the following token it is not a number, the current token is just a number
    // If the following token it is another number, we can yield together the num and gen
    // number with the R keyord together
    if (isANumber) {
      const { value: nextTokenValue, done: nextTokenDone } = generator.next();

      if (nextTokenDone) {
        return;
      }

      if (isNaN(nextTokenValue)) {
        tokenizer.lastReadIndex =
          tokenizer.lastReadIndex - nextTokenValue.length - 2;

        yield value;
        continue;
      }

      const { value: refKeyword, done: refKeyWordDone } = generator.next();

      if (refKeyWordDone || refKeyword !== 'R') {
        return;
      }

      yield new Ref(+value, +nextTokenValue);
    }

    // If it is an array, we need to find all the tokens until the symbol ],
    // and finally yield the values together
    if (startsPDFArrayObj) {
      const pdfArrayObj = [value.split("[")[1]];

      while (true) {
        const { value: nextToken, done: nextTokenDone } = generator.next();

        if (nextTokenDone) {
          // INVALID PDF FILE, ARRAY WITHOUT CLOSING TAG
          return;
        }

        const endsPDFArrayObj = nextToken.charAt(value.length - 1) === "]";

        if (endsPDFArrayObj) {
          pdfArrayObj.push(nextToken.split("]")[0]);
          yield pdfArrayObj;
        }

        pdfArrayObj.push(nextToken);
      }
    }
  }
}
