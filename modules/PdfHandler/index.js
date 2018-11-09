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

    const usLetterPtWidth = 612;
    const usLetterPtHeight = 792;
    const pageWidth = usLetterPtHeight;

    // TODO: 2 is kinda arbitrary here, it matches the scale factor but this is px vs pt anyway.
    const imgScaledWidth = parseInt(dimensions.width / 2); 
    const imgScaledHeight = parseInt(dimensions.height / 2);

    let imgRenderPtWidth = 0;
    let imgRenderPtHeight = 0;

    if (imgScaledWidth >= pageWidth) {
      imgRenderPtWidth = pageWidth;
      imgRenderPtHeight = parseInt(imgScaledHeight * (pageWidth / imgScaledWidth));
    } else {
      imgRenderPtWidth = imgScaledWidth;
      imgRenderPtHeight = imgScaledHeight;
    }

    /* Add a new page for this image */
    this.doc.addPage({
      size: [pageWidth, imgRenderPtHeight + dataBlockHeight],
    })
    .text(`Page Title: ${pageData.pageTitle}`, 20, 10)
    .text(`URL: ${pageData.pageUrl}`, 20, 30)
    .text(`As of: ${new Date()} - Browser width: ${pageData.scenario.screen_width}px`, 20, 50)
    .image(imgFilePath, 0, dataBlockHeight, { width: imgRenderPtWidth });
  }

  close() {
    this.doc.end();
  }
}

module.exports = PdfHandler;
