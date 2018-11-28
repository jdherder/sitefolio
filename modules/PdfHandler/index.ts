import * as interfaces from '../../interfaces';
import * as PDFKit from 'pdfkit';
import * as sizeOf from 'image-size';
import * as fs from 'fs';

interface PageData {
  scenario: interfaces.Scenario;
  pageTitle: string;
  pageUrl: string;
}

export default class PdfHandler {
  doc: PDFKit.PDFDocument;

  constructor() {
    this.doc = new PDFKit({
      autoFirstPage: false,
    });
  }

  open(filePath: string) {
    this.doc.pipe(fs.createWriteStream(filePath));
  }

  addScreenshotPage(imgFilePath: string, pageData: PageData) {
    /* Determine image dimensions */
    const dimensions = sizeOf(imgFilePath);
    const dataBlockHeight = 70;

    const usLetterPtWidth = 612;
    const usLetterPtHeight = 792;
    const pageWidth = usLetterPtHeight;

    // TODO: 2 is kinda arbitrary here, it matches the scale factor but this is px vs pt anyway.
    const imgScaledWidth = Number(dimensions.width / 2); 
    const imgScaledHeight = Number(dimensions.height / 2);

    let imgRenderPtWidth = 0;
    let imgRenderPtHeight = 0;

    if (imgScaledWidth >= pageWidth) {
      imgRenderPtWidth = pageWidth;
      imgRenderPtHeight = Number(imgScaledHeight * (pageWidth / imgScaledWidth));
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
    .text(`As of: ${new Date()} - Browser width: ${pageData.scenario.screenWidth}px`, 20, 50)
    .image(imgFilePath, 0, dataBlockHeight, { width: imgRenderPtWidth });
  }

  close() {
    this.doc.end();
  }
}
