# SiteFolio

This is a tool to allow you to easily capture images of your static site and save to a single PDF. This might come in handy to save a visual record of your site, or for a review process to make annotations and markups easier.

## Usage

```javascript
const sitefolio = require('sitefolio');

// Desired screen width in pixels for screenshots.
const width = 1440;

const scenario = {
  label: `Testing at ${width}px`,

  // Set browser width and height for screenshots.
  screenWidth: width,
  screenHeight: 800,

  // Configure Puppeteer startup arguments.
  puppeteerArgs: [
    // '--no-sandbox',
    // '--disable-setuid-sandbox',
    // '--disable-dev-shm-usage',
    // '--ignore-certificate-errors',
  ],

  // Define pages for screenshots. Each page here will be represented by an individual page in the output PDF.
  pages: [
    {
      // Required: Fully qualified URL of page.
      url: 'https://jh.fyi/',

      // Optional: Capture full height of page in screenshot, default is `true`.
      captureFullPage: true,

      // Optional: Run your own async code on page load before screenshot. Puppeteer's `page` object is injected. Must return promise.
      // See: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
      screenshotSetupFn: async (page) => {
        return await page.hover('.contact-links a');
      },
    },
    {
      url: 'https://jh.fyi/projects/',
    },
    {
      url: 'https://jh.fyi/projects/stop-the-shame/',
    }
  ],
};

sitefolio.run(scenario);

```

Your PDF is saved in a new 'screenshots' folder under today's date.
- screenshots
  - 2019-01-01
    - testing-at-1440px_[timestamp].pdf