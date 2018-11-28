/* Node Dependencies */
import * as puppeteer from 'puppeteer';

/* Internal Module Dependencies */
import * as interfaces from './interfaces';
import Util from './modules/Util';
import AemHandler from './modules/AemHandler';
import PdfHandler from './modules/PdfHandler';
import ScreenshotHandler from './modules/ScreenshotHandler';

/* Global Vars */
const screenshotRootPath = `screenshots/${new Date().toISOString().slice(0,10)}`;
const screenshotFormatExt = 'jpg';

/* Main */

export function run(scenario: interfaces.Scenario) {

  if (!scenario) {
    throw new Error('No scenario configuration provided!');
  }

  puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: scenario.puppeteerArgs || [],
  }).then(async browser => {
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
        width: scenario.screenWidth,
        height: scenario.screenHeight,
        deviceScaleFactor: 2, // For higher DPI screenshots.
      });
      
      console.log('Navigating to: ', url);
      await page.goto(url, {
        timeout: 10000,
        waitUntil: 'load'
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
        scenario,
        pageTitle: title,
        pageUrl: url,
      });
    }
  
    pdfHandler.close();
  
    await ScreenshotHandler.deleteImageFiles(screenshotRootPath, screenshotFormatExt);
  
    await browser.close();
  });
};
