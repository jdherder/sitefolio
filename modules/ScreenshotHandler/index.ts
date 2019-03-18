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

  static getViewportDimensions(scenario: interfaces.Scenario, scenarioPage: interfaces.Page): interfaces.ViewportDimensions {
    let width = 1440;
    let height = 800;

    if (typeof scenarioPage.screenWidth === 'number') {
      width = scenarioPage.screenWidth;
    } else if (typeof scenario.screenWidth === 'number') {
      width = scenario.screenWidth;
    }

    if (typeof scenarioPage.screenHeight === 'number') {
      height = scenarioPage.screenHeight;
    } else if (typeof scenario.screenHeight === 'number') {
      height = scenario.screenHeight;
    }

    return {
      width,
      height,
    }
  }
}
