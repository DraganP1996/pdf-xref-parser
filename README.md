# PDF Cross-reference parser

It is a basic PDF parser capable of analyzing the cross-reference section of PDF documents.

NOTE: This library is currently under development and can be used only for PDF files with 
cross-reference sections in table format, avoid to use for PDF files with stream or hybrid
cross reference sections.

## Installation

``npm i pdf-xref-parser``

## Usage

The library exposes the ``PDFParser`` class, it is necessary to create an instance of the PDFParser class and call the ``getXRefEntries`` method in order to retrieve a list of cross-reference entries from the input document.

### Example
`const parser = PDFParser(bufferOfData);`

`const xRefEntries: XRefEntry[] = parser.getXRefEntries();`

### XRefEntry interface

``export interface XRefEntry {
    type: XREF_ENTRY_TYPES;
    num: number;
    generator: number;
    byteOffset: number;
}``
