import { PDFParser } from "./PDFParser";

export class XRefReader {
  constructor() {}

  async read(buffer: ArrayBuffer): Promise<void> {
    const pdfBinary = new Int8Array(buffer);
    const pdf = new PDFParser(pdfBinary);

    console.log('PDF PARSER', pdf);
  }
}
