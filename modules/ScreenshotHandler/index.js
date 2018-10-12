const fs = require('fs');
const path = require('path');

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

  static deleteImageFiles(directory, ext = 'png') {
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

module.exports = ScreenshotHandler;
