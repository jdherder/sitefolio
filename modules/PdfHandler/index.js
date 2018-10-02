const PDFDocument = require('pdfkit');
const fs = require('fs');
const sizeOf = require('image-size');

class PdfHandler {
  constructor() {
    this.doc = new PDFDocument({
      autoFirstPage: false,
    });
  }

  open(filePath) {
    this.doc.pipe(fs.createWriteStream(filePath));
  }

  addImg(imgFilePath) {
    /* Determine image dimensions */
    const dimensions = sizeOf(imgFilePath);

    /* Add a new page for this image at the exact image size */
    this.doc.addPage({
      size: [dimensions.width, dimensions.height],
      //size: 'LETTER' <- For standard US letter size.
    });

    /* Place image on the page */
    this.doc.image(imgFilePath, 0, 0, {});
  }

  close() {
    this.doc.end();
  }
}

module.exports = PdfHandler;
