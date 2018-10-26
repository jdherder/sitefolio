/* Node Dependencies */
const puppeteer = require('puppeteer');

/* Internal Module Dependencies */
const Util = require('./modules/Util');
const AemHandler = require('./modules/AemHandler');
const PdfHandler = require('./modules/PdfHandler');
const ScreenshotHandler = require('./modules/ScreenshotHandler');

/* Global Vars */
const screenshotRootPath = `screenshots/${new Date().toISOString().slice(0,10)}`;
const screenshotFormatExt = 'png';

/* Main */

exports.run = (scenario) => {

  if (!scenario) {
    throw new Error('No scenario configuration provided!');
  }

  puppeteer.launch({ ignoreHTTPSErrors: true }).then(async browser => {
    const page = await browser.newPage();
  
    const aemHandler = new AemHandler(page);
  
    Util.mkDirByPathSync(screenshotRootPath);

    let scenarioPages = scenario.pages || [];
  
    const pdfFilePath = Util.generateFilePath(
      screenshotRootPath,
      [scenario.label, Util.getTimestamp()],
      'pdf'
    );
    const pdfHandler = new PdfHandler();
    pdfHandler.open(pdfFilePath);
  
    for (const scenarioPage of scenarioPages) {

      let url = typeof scenarioPage === 'string' ? scenarioPage : scenarioPage.url;
  
      if (scenario.aemAuthor) {
        url = AemHandler.setWcmModeOnUrl(url);
      }

      await page.setViewport({
        width: scenario.screen_width,
        height: scenario.screen_height,
      });
      
      console.log('Navigating to: ', url);
      await page.goto(url, {
        waitUntil: 'networkidle0'
      });
  
      if (scenario.aemAuthor) {
        await aemHandler.localAuthorLoginCheck();
      }
  
      const title = await page.title();
  
      console.log(`Processing: ${title}`);
  
      const imgFilePath = Util.generateFilePath(
        screenshotRootPath,
        [scenario.label, title, Util.getTimestamp()],
        screenshotFormatExt
      );
      const screenshotHandler = new ScreenshotHandler(page);
      await screenshotHandler.takeFullPageScreenshot(imgFilePath);
  
      /* Add screenshot to full site PDF */
      pdfHandler.addScreenshotPage(imgFilePath, {
        pageTitle: title,
        pageUrl: url
      });
    }
  
    pdfHandler.close();
  
    await ScreenshotHandler.deleteImageFiles(screenshotRootPath, screenshotFormatExt);
  
    await browser.close();
  });
};
