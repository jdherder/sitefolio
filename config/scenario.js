const scenario = {
  label: 'Humira Derm Pro (Local Test)',

  screen_width: 1440,
  screen_height: 800, // when applicable

  // Should be site home page. The nav will be crawled and used to find additional pages.
  primary_url: 'http://localhost:4502/content/humiradermpro/en.html',

  // Pages that are not present in site navigation.
  additional_urls: [],
};

module.exports = scenario;
