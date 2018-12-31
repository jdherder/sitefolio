import { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as interfaces from '../../interfaces';

export default class ScreenshotHandler {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  takeFullPageScreenshot(path: string, scenarioPage: interfaces.Page) {
    return this.page.screenshot({
      path: path,
      fullPage: !(scenarioPage.captureFullPage === false),
    });
  }

  static deleteImageFiles(directory: string, ext = 'png') {
    return fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        if (file.endsWith(`.${ext}`)) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      }
    });
  }
}
