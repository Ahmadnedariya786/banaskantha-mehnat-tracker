import puppeteer from 'puppeteer';

const takeScreenshots = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812 });

  console.log("Navigating to settings...");
  await page.goto('http://localhost:4173/settings', { waitUntil: 'networkidle0' });

  console.log("Setting dark theme and reloading...");
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  console.log("Taking initial settings screenshot...");
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\settings_graphite_rename.png' });

  console.log("Reloading to test persistence...");
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  console.log("Taking post-reload settings screenshot...");
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\settings_graphite_persistence.png' });

  await browser.close();
  console.log("Done.");
};

takeScreenshots().catch(console.error);
