/* Node Dependencies */
const puppeteer = require('puppeteer');
const fs = require('fs');

/* Config Dependencies */
const scenarios = require('./config/scenarios');
const breakpoints = require('./config/breakpoints');

/* Internal Module Dependencies */
const Util = require('./modules/Util');
const AemHandler = require('./modules/AemHandler');
const PdfHandler = require('./modules/PdfHandler');
const ScreenshotHandler = require('./modules/ScreenshotHandler');

/* Global Vars */
const screenshotRootPath = `screenshots/${new Date().toISOString().slice(0,10)}`;


/* Main */

if (!fs.existsSync(screenshotRootPath)){
  fs.mkdirSync(screenshotRootPath);
}

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();

  // TODO, error state for no scenarios
  for (const scenario of scenarios) {

    // TODO, error state for no breakpoints
    for (const breakpoint of breakpoints) {

      await page.setViewport({
        ...breakpoint
      });
      
      await page.goto(scenario.url, {
        waitUntil: 'networkidle0'
      });

      const aemHandler = new AemHandler(page);
      await aemHandler.localAuthorLoginCheck();

      console.log(`Processing: ${scenario.label} - ${breakpoint.label}`);

      const title = await page.title();
      console.log('Page Title: ', title);

      // const links = await page.evaluate(() => {
      //   const links = Array.from(document.querySelectorAll('a'));
      //   return links.map(link => ({
      //     text: link.innerHTML,
      //     href: link.href,
      //   }));
      // });
      // console.log('Page Links: ', links);

      const screenshotHandler = new ScreenshotHandler(page);
      const imgFilePath = Util.generateFilePath(
        screenshotRootPath,
        scenario.label,
        breakpoint.label,
        'jpg'
      );

      await screenshotHandler.takeFullPageScreenshot(imgFilePath);

      const pdfHandler = new PdfHandler();
      const pdfFilePath = Util.generateFilePath(
        screenshotRootPath,
        scenario.label,
        breakpoint.label,
        'pdf'
      );
      pdfHandler.open(pdfFilePath);
      pdfHandler.addImg(imgFilePath);
      pdfHandler.close();
    }

  }
  
  await browser.close();
});

