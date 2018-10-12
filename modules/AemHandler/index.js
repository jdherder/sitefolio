class AemHandler {
  constructor(page) {
    this.page = page;

    this.selectors = {
      loginForm: '#login',
      username: '#username',
      password: '#password',
      submit: '#submit-button',
    };
    
    this.aemAuthorCredentials = {
      username: 'admin',
      password: 'admin',
    }
  }

  async localAuthorLoginCheck() {
    if (this.page.url().includes('login')) {
      await this.page.waitForSelector(this.selectors.loginForm, {
        timeout:  3000,
      });
    }
    
    const aemAuthPrompt = await this.page.$( this.selectors.loginForm ) !== null;
    
    if (aemAuthPrompt) {
      await this.page.type( this.selectors.username, this.aemAuthorCredentials.username );
      await this.page.type( this.selectors.password, this.aemAuthorCredentials.password );
      await Promise.all([
        this.page.click( this.selectors.submit ),
        this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
    }
  }

  static setWcmModeOnUrl(url, mode = 'disabled') {
    const wcmParam = `wcmmode=${mode}`;
    return url.includes('?') ? `${url}&${wcmParam}` : `${url}?${wcmParam}`;
  }
}

module.exports = AemHandler;
