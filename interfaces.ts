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
  description?: string;
  captureFullPage?: boolean;
  screenWidth?: number;
  screenHeight?: number;
  screenshotSetupFn?: Function;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}