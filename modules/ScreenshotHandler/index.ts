import { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export default class ScreenshotHandler {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  takeFullPageScreenshot(path: string) {
    return this.page.screenshot({
      path: path,
      fullPage: true,
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
