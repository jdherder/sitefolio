class ScreenshotHandler {
  constructor(page) {
    this.page = page;
  }

  takeFullPageScreenshot(path) {
    return this.page.screenshot({
      path: path,
      fullPage: true,
    });
  }
}

module.exports = ScreenshotHandler;
