# SiteFolio

This is a tool to allow you to easily capture images of your static site and save to a single PDF. This might come in handy to save a visual record of your site, or for a review process to make annotations and markups easier.

## Usage

```javascript
const sitefolio = require('sitefolio');

// Desired screen width in pixels for screenshots.
const width = 1440;

const scenario = {
  label: `Testing at ${width}px`,
  screenWidth: width,
  screenHeight: 800, // when applicable, by default the full page length is captured.

  // Pass arguments to puppeteer
  puppeteerArgs: [
    // '--no-sandbox',
    // '--disable-setuid-sandbox',
    // '--disable-dev-shm-usage',
    // '--ignore-certificate-errors',
  ],

  // Define pages for screenshots. Each page here will be represented by an individual page in the output PDF.
  pages: [
    {
      url: 'https://jh.fyi/projects/',
      captureFullPage: true,
    },
    {
      url: 'https://jh.fyi/projects/stop-the-shame/',
      captureFullPage: false,
    }
  ],
};

sitefolio.run(scenario);

```

Your PDF is saved in a new 'screenshots' folder under today's date.
- screenshots
  - 2019-01-01
    - testing-at-1440px_[timestamp].pdf