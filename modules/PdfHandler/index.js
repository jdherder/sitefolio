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

  addScreenshotPage(imgFilePath, pageData) {
    /* Determine image dimensions */
    const dimensions = sizeOf(imgFilePath);
    const dataBlockHeight = 70;

    /* Add a new page for this image at the exact image size */
    this.doc.addPage({
      size: [dimensions.width, dimensions.height + dataBlockHeight],
      //size: 'LETTER' <- For standard US letter size.
    })
    .text(`Page Title: ${pageData.pageTitle}   |   As of: ${new Date()}`, 20, 20)
    .text(`URL: ${pageData.pageUrl}`, 20, 40)
    .image(imgFilePath, 0, dataBlockHeight, {});
  }

  close() {
    this.doc.end();
  }
}

module.exports = PdfHandler;
