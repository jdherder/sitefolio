const scenario = {
  label: 'Humira Derm Pro (Local Test)',

  screen_width: 1440,
  screen_height: 800, // when applicable

  // Should be site home page. The nav will be crawled and used to find additional pages.
  primary_url: 'http://localhost:4502/content/humiradermpro/en.html',
  main_nav_selector: '.int-nav-main.navbar-default',
  main_nav_link_selector: '.nav-link',

  // Pages that are not present in site navigation.
  additional_urls: [
    'http://localhost:4502/content/humiradermpro/en/page-not-found.html'
  ],
};

module.exports = scenario;
