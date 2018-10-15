/* Node Dependencies */
const puppeteer = require('puppeteer');
const fs = require('fs');

/* Config Dependencies */
const scenario = require('./config/scenario');

/* Internal Module Dependencies */
const Util = require('./modules/Util');
const AemHandler = require('./modules/AemHandler');
const PdfHandler = require('./modules/PdfHandler');
const ScreenshotHandler = require('./modules/ScreenshotHandler');

/* Global Vars */
const screenshotRootPath = `screenshots/${new Date().toISOString().slice(0,10)}`;
const screenshotFormatExt = 'png';

/* Main */

puppeteer.launch({ ignoreHTTPSErrors: true }).then(async browser => {
  const page = await browser.newPage();

  await page.goto(scenario.primary_url, {
    waitUntil: 'networkidle0'
  });

  const aemHandler = new AemHandler(page);
  await aemHandler.localAuthorLoginCheck();

  Util.createDirectory(screenshotRootPath);

  /* Crawl Intouch Accelerator main nav and grab appropriate links */
  const navLinks = await page.evaluate(() => {
    const nav = document.querySelector('.int-nav-main.navbar-default');
    const links = Array.from(nav.querySelectorAll('.nav-link'));
    return links
      .filter((link) => {
        /* Filter out nav links with a 'pointer-events: none' style applied */
        const style = window.getComputedStyle(link);
        const filter = Boolean(style.pointerEvents !== 'none');
        return filter;
      })
      .map(link => link.href);
  });

  const processedLinks = navLinks
    // .slice(0, 3) // FIXME - For faster testing.
    .map(href => AemHandler.setWcmModeOnUrl(href));

  console.log(processedLinks);

  const pdfFilePath = Util.generateFilePath(
    screenshotRootPath,
    [scenario.label, scenario.screen_width, new Date()],
    'pdf'
  );
  const pdfHandler = new PdfHandler();
  pdfHandler.open(pdfFilePath);

  for (const href of processedLinks) {

    try {
      await page.setViewport({
        width: scenario.screen_width,
        height: scenario.screen_height,
      });
      
      await page.goto(href, {
        waitUntil: 'networkidle0'
      });

      await aemHandler.localAuthorLoginCheck();

      const title = await page.title();

      console.log(`Processing: ${title}`);

      const imgFilePath = Util.generateFilePath(
        screenshotRootPath,
        [scenario.label, title, new Date()],
        screenshotFormatExt
      );
      const screenshotHandler = new ScreenshotHandler(page);
      await screenshotHandler.takeFullPageScreenshot(imgFilePath);

      /* Add screenshot to full site PDF */
      pdfHandler.addScreenshotPage(imgFilePath, {
        pageTitle: title,
        pageUrl: href
      });

    } catch (e) {
      console.log('ERROR', e);
    } 

  }

  pdfHandler.close();

  await ScreenshotHandler.deleteImageFiles(screenshotRootPath, screenshotFormatExt);

  await browser.close();
});

