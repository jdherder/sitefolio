# SiteFolio

This is a tool to allow you to easily capture images of your static site and save to a single PDF. This might come in handy to save a visual record of your site, or for a review process to make annotations and markups easier.

## Usage

```javascript
const sitefolio = require('sitefolio');

// Desired screen width in pixels for screenshots.
const width = 1440;

const scenario = {
  label: `Testing at ${width}px`,

  // Set browser viewport dimensions for screenshots.
  screenWidth: width,
  screenHeight: 800,

  // Configure Puppeteer startup arguments.
  puppeteerArgs: [
    // '--no-sandbox',
    // '--disable-setuid-sandbox',
    // '--disable-dev-shm-usage',
    // '--ignore-certificate-errors',
  ],

  // Define page level scenarios for screenshots. Each item here represents an individual page in the output PDF.
  pages: [
    {
      // Required: Fully qualified URL of page.
      url: 'https://jh.fyi/',

      // Optional: Description of this page level scenario.
      description: 'Capturing full home page.',

      // Optional: Capture full height of page in screenshot, default is `true`.
      captureFullPage: true,

      // Optional: Override the global scenario browser viewport dimensions
      screenWidth: 1920,
      screenHeight: 1080,

      // Optional: Run your own async code on page load before screenshot. Puppeteer's `page` object is injected.
      // For more information on Puppeteer's page object: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
      screenshotSetupFn: async (page) => {
        return await page.hover('.contact-links a');
      },
    },
    {
      url: 'https://jh.fyi/projects/',
    }
  ],
};

sitefolio.run(scenario);

```

Your PDF is saved in a new 'screenshots' folder under today's date.
- screenshots
  - 2019-01-01
    - testing-at-1440px_[timestamp].pdf