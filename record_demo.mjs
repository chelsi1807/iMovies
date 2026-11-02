import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDemoRecorder() {
  const outputDir = path.join(__dirname, 'demo_recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Launching Chromium for automated demo recording...');
  const browser = await chromium.launch({
    headless: true, // Headless recording ensures smooth 60fps video capture
    slowMo: 60,     // Smooth, natural human-like movements
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  console.log('🎥 1. Navigating to iMovies LUXE...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // 1. Show the landing page and hero carousel
  console.log('🎥 2. Showcasing Hero Premiere Carousel & LUXE aesthetics...');
  await page.mouse.wheel(0, 250);
  await sleep(1500);

  // 2. Demo User 1-Click Login
  console.log('🎥 3. Logging in via 1-Click Demo User...');
  const demoUserBtn = page.locator('text=Demo User').first();
  if (await demoUserBtn.isVisible()) {
    await demoUserBtn.click();
    await sleep(2000);
  }

  // 3. Category & Genre filtering
  console.log('🎥 4. Exploring Genre Filter pills...');
  const sciFiBtn = page.locator('button:has-text("Sci-Fi")').first();
  if (await sciFiBtn.isVisible()) {
    await sciFiBtn.click();
    await sleep(1500);
  }

  const actionBtn = page.locator('button:has-text("Action")').first();
  if (await actionBtn.isVisible()) {
    await actionBtn.click();
    await sleep(1500);
  }

  const allBtn = page.locator('button:has-text("All")').first();
  if (await allBtn.isVisible()) {
    await allBtn.click();
    await sleep(1500);
  }

  // 4. Search bar demo
  console.log('🎥 5. Demonstrating Live Debounced Search...');
  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.click();
  await searchInput.fill('Dune');
  await sleep(2000);
  await searchInput.fill('');
  await sleep(1500);

  // 5. Watch Trailer Modal
  console.log('🎥 6. Opening 4K Trailer Modal...');
  const firstTrailerBtn = page.locator('button[title="Watch Trailer"]').first();
  if (await firstTrailerBtn.isVisible()) {
    await firstTrailerBtn.click();
    await sleep(4000); // Let trailer preview display
    
    // Switch to Cinema HD Stream
    const hdStreamBtn = page.locator('text=Cinema HD Stream').first();
    if (await hdStreamBtn.isVisible()) {
      await hdStreamBtn.click();
      await sleep(3000);
    }

    // Click "Book Luxury Seats" directly from inside the trailer modal!
    console.log('🎥 7. Clicking "Book Luxury Seats" from Trailer Modal...');
    const bookInTrailerBtn = page.locator('text=Book Luxury Seats').first();
    if (await bookInTrailerBtn.isVisible()) {
      await bookInTrailerBtn.click();
      await sleep(3000);
    } else {
      const closeBtn = page.locator('button[aria-label="Close"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await sleep(1500);
      }
      const firstReserveBtn = page.locator('.movie-card .btn-cinema').first();
      await firstReserveBtn.click();
      await sleep(2500);
    }
  } else {
    const firstReserveBtn = page.locator('.movie-card .btn-cinema').first();
    await firstReserveBtn.click();
    await sleep(2500);
  }

  // Pick screening date
  console.log('🎥 8. Selecting Screening Date & Showtimes...');
  const datePills = page.locator('.date-pill');
  if (await datePills.count() > 1) {
    await datePills.nth(1).click();
    await sleep(1500);
    await datePills.nth(0).click();
    await sleep(1500);
  }

  // Pick 2 VIP / Gold seats
  console.log('🎥 8. Selecting VIP Recliner & Gold seats...');
  const availableSeats = page.locator('.seat-unit:not(.booked):not(.seat-row-label)');
  const seatCount = await availableSeats.count();
  if (seatCount >= 2) {
    await availableSeats.nth(0).click();
    await sleep(800);
    await availableSeats.nth(1).click();
    await sleep(1500);
  }

  // Step 2: Gourmet Concessions
  console.log('🎥 9. Adding Gourmet Cinema Concessions...');
  const continueToSnacksBtn = page.locator('text=Continue to Snacks').first();
  if (await continueToSnacksBtn.isVisible()) {
    await continueToSnacksBtn.click();
    await sleep(2000);

    const plusBtns = page.locator('.modal-body .btn-cinema.rounded-circle');
    if (await plusBtns.count() > 0) {
      await plusBtns.nth(0).click();
      await sleep(800);
      if (await plusBtns.count() > 1) {
        await plusBtns.nth(1).click();
        await sleep(1000);
      }
    }
  }

  // Step 3: Checkout & Pay
  console.log('🎥 10. Proceeding to Checkout & Confetti Celebration...');
  const proceedPayBtn = page.locator('text=Proceed to Payment').first();
  if (await proceedPayBtn.isVisible()) {
    await proceedPayBtn.click();
    await sleep(2000);

    const confirmPayBtn = page.locator('button:has-text("Confirm & Pay")').first();
    if (await confirmPayBtn.isVisible()) {
      await confirmPayBtn.click();
      await sleep(4000); // Watch confetti and boarding pass
    }
  }

  // View Digital Pass Modal
  console.log('🎥 11. Inspecting Digital Barcode Boarding Pass...');
  await sleep(3000);

  // Navigate to Passes view
  const viewPassesBtn = page.locator('text=View in Passes').first();
  if (await viewPassesBtn.isVisible()) {
    await viewPassesBtn.click();
    await sleep(3000);
  }

  // 7. Check Theaters View
  console.log('🎥 12. Showcasing Partner Cinemas & Theaters...');
  const theatersNavBtn = page.locator('nav button:has-text("Theaters")').first();
  if (await theatersNavBtn.isVisible()) {
    await theatersNavBtn.click();
    await sleep(3000);
  }

  // 8. Check Admin Portal
  console.log('🎥 13. Demonstrating Executive Admin Portal KPIs & Scheduling...');
  // Log in as Admin
  const adminDemoBtn = page.locator('button:has-text("Demo Admin")').first();
  if (await adminDemoBtn.isVisible()) {
    await adminDemoBtn.click();
    await sleep(1500);
  }

  const adminNavBtn = page.locator('button:has-text("Admin Portal")').first();
  if (await adminNavBtn.isVisible()) {
    await adminNavBtn.click();
    await sleep(2500);

    // Switch to Catalog
    const catalogTab = page.locator('button:has-text("Catalog")').first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await sleep(2000);
    }

    // Switch to Scheduler
    const schedulerTab = page.locator('button:has-text("Schedule Shows")').first();
    if (await schedulerTab.isVisible()) {
      await schedulerTab.click();
      await sleep(2000);
    }
  }

  console.log('🎥 14. Finishing and saving video recording...');
  await page.mouse.wheel(0, -500);
  await sleep(2000);

  // Close page and context to finalize the video
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    const finalPath = path.join(outputDir, 'iMovies_LUXE_Demo_Video.webm');
    fs.copyFileSync(videoPath, finalPath);
    console.log(`\n🎉 DEMO VIDEO RECORDED SUCCESSFULLY!`);
    console.log(`📁 Video Saved to: ${finalPath}`);
    return finalPath;
  }
}

runDemoRecorder().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});

