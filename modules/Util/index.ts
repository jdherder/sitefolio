const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

export default class Util {
  constructor() { }

  static generateFilePath(rootPath: string, namesArr: (string | number)[], format: string) {
    return `${rootPath}/${this.slugify(namesArr.join('_'))}.${format}`;
  }

  static slugify(s: string) {
    const _slugify_strip_re = /[^\w\s-]/g;
    const _slugify_hyphenate_re = /[-\s]+/g;
    s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
    s = s.replace(_slugify_hyphenate_re, '-');
    return s;
  }

  // Thanks to Mouneer on SO for the below method.
  static mkDirByPathSync(targetDir: string, { isRelativeToScript = false } = {}) {
    if (fs.existsSync(targetDir)){
      return;
    }

    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
  
    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }
  
        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }
  
        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
          throw err; // Throw if it's just the last created dir.
        }
      }
  
      return curDir;
    }, initDir);
  }

  static getTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
  }

  static getUuid() {
    return uuidv4();
  }
}
