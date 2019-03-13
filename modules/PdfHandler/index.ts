import * as interfaces from '../../interfaces';
import * as PDFKit from 'pdfkit';
import * as sizeOf from 'image-size';
import * as fs from 'fs';

interface PageData {
  scenario: interfaces.Scenario;
  scenarioPage: interfaces.Page;
  pageTitle: string;
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
    const pageWidth = usLetterPtHeight; // set width to landscape letter

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

    const headerText = [
      `Page Title: ${pageData.pageTitle}`,
      `URL: ${pageData.scenarioPage.url}`,
      `As of: ${new Date()} - Browser width: ${pageData.scenario.screenWidth}px`,
    ];

    if (pageData.scenarioPage.description) {
      headerText.push(`\n${pageData.scenarioPage.description}`);
    }

    /* Add a new page for this image */
    this.doc.addPage({
      size: [pageWidth, imgRenderPtHeight + dataBlockHeight],
    })
    .fontSize(8)
    .text(headerText.join('\n'), 20, 10, {
      width: pageWidth - 40,
      align: 'left',
    })
    .image(imgFilePath, 0, dataBlockHeight, { width: imgRenderPtWidth });
  }

  close() {
    this.doc.end();
  }
}
