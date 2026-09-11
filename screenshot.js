import puppeteer from 'puppeteer';

const takeScreenshots = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a mobile device, as this is a mobile-focused web app
  await page.setViewport({ width: 375, height: 812 });

  console.log("Navigating to app...");
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // Enable dark mode
  console.log("Setting dark theme...");
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('theme-switching');
    setTimeout(() => document.documentElement.classList.remove('theme-switching'), 300);
  });
  // Wait for transition
  await new Promise(r => setTimeout(r, 500));

  console.log("Taking home screenshot...");
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\home.png' });

  console.log("Opening calendar popup...");
  // Attempt to open calendar popup (assuming there's a button for it)
  // The app might have an 'Add Report' or similar date selector. If we can't find it, we'll skip it or try to click on the date element.
  try {
    await page.click('button[class*="calendar"]'); // Attempt to click a calendar icon/button
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\calendar_popup.png' });
    // Click outside to close or just reload
    await page.reload({ waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 500));
  } catch (e) {
    console.log("Could not find calendar popup button.");
  }

  console.log("Navigating to dashboard...");
  await page.goto('http://localhost:4173/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\dashboard.png' });

  console.log("Navigating to past reports...");
  await page.goto('http://localhost:4173/past-reports', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\past_reports.png' });

  console.log("Navigating to admin...");
  await page.goto('http://localhost:4173/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\admin.png' });

  console.log("Navigating to settings...");
  await page.goto('http://localhost:4173/settings', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\2f7c687a-94f3-4b5e-ab90-86f452b238c8\\scratch\\settings.png' });

  await browser.close();
  console.log("Done.");
};

takeScreenshots().catch(console.error);
