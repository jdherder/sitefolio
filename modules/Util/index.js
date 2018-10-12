class Util {
  constructor() { }

  static generateFilePath(rootPath, namesArr = [], format) {
    return `${rootPath}/${this.slugify(namesArr.join('_'))}.${format}`;
  }

  static slugify(s) {
    const _slugify_strip_re = /[^\w\s-]/g;
    const _slugify_hyphenate_re = /[-\s]+/g;
    s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
    s = s.replace(_slugify_hyphenate_re, '-');
    return s;
  }
}

module.exports = Util;
