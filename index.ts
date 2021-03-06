/* Node Dependencies */
import * as puppeteer from 'puppeteer';

/* Internal Module Dependencies */
import * as interfaces from './interfaces';
import Util from './modules/Util';
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
  })
  .then(async browser => {
    const page = await browser.newPage();
  
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

      const url = typeof scenarioPage === 'string' ? scenarioPage : scenarioPage.url;

      const viewportDimensions = ScreenshotHandler.getViewportDimensions(scenario, scenarioPage);

      await page.setViewport({
        width: viewportDimensions.width,
        height: viewportDimensions.height,
        deviceScaleFactor: 2, // For higher DPI screenshots.
      });
      
      console.log('Navigating to: ', url);

      if (scenarioPage.description) {
        console.log(scenarioPage.description);
      }

      await page.goto(url, {
        timeout: 10000,
        waitUntil: 'load'
      });

      if (scenarioPage.screenshotSetupFn) {
        await scenarioPage.screenshotSetupFn(page)
          .catch((e: Error) => {
            console.log('Could not execute screenshotSetupFn', e);
          });
      }
  
      const title = await page.title();
  
      console.log(`Processing: ${title}`);
  
      const imgFilePath = Util.generateFilePath(
        screenshotRootPath,
        [scenario.label, title, Util.getUuid()],
        screenshotFormatExt
      );
      const screenshotHandler = new ScreenshotHandler(page);
      await screenshotHandler.takeFullPageScreenshot(imgFilePath, scenarioPage);
  
      /* Add screenshot to full site PDF */
      pdfHandler.addScreenshotPage(imgFilePath, {
        scenario,
        scenarioPage,
        pageTitle: title,
      });
    }
  
    pdfHandler.close();
  
    await ScreenshotHandler.deleteImageFiles(screenshotRootPath, screenshotFormatExt);
  
    await browser.close();
  });
};
