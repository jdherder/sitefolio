const scenario = {
  label: 'Humira Derm Pro (Local Test)',

  screen_width: 1440,
  screen_height: 800, // when applicable

  // Should be site home page.
  primary_url: 'http://localhost:4502/content/humiradermpro/en.html',

  // Define selectors to find the nav and crawl link selectors within it to build the main page list.
  main_nav_selector: '.int-nav-main.navbar-default',
  main_nav_link_selector: '.nav-link',

  // Include additional pages that are not present in the main site navigation.
  additional_urls: [
    'http://localhost:4502/content/humiradermpro/en/page-not-found.html'
  ],
};

module.exports = scenario;
