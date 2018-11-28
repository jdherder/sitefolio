export interface Scenario {
  label: string;
  screenWidth: number;
  screenHeight: number;
  aemAuthor: boolean;
  puppeteerArgs: string[];
  pages: Page[];
}

export interface Page {
  url: string;
}