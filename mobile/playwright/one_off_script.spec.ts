import { test, expect } from '@playwright/test';

test('one-off script', async ({ page }) => {
  test.setTimeout(120000);
  console.log('Navigating to http://127.0.0.1:19006');
  await page.goto('http://127.0.0.1:19006');
  
  // Wait a bit for the page to load
  await page.waitForTimeout(5000);
  console.log('Current URL:', page.url());

  // Click Continue if it exists
  const continueButton = page.getByRole('button', { name: 'Continue' });
  if (await continueButton.isVisible()) {
    console.log('Clicking Continue button');
    await continueButton.click();
  } else {
    const continueText = page.getByText('Continue');
    if (await continueText.isVisible()) {
      console.log('Clicking Continue text');
      await continueText.click();
    } else {
      console.log('Continue button/text not found');
    }
  }

  // Debug: print current inner text to see what's on screen
  const debugText = await page.evaluate(() => document.body.innerText);
  console.log('Debug - body text snippet:', debugText.substring(0, 500));

  // Wait for 'A compact scan of what matters today'
  console.log('Waiting for "A compact scan of what matters today"');
  try {
    await page.waitForSelector('text=A compact scan of what matters today', { timeout: 30000 });
  } catch (e) {
    console.log('Failed to find specific header, continuing anyway to gather info.');
  }

  const topFivePresent = await page.getByText('Top five papers').isVisible();
  const stillPreparingPresent = await page.getByText('Today\'s brief is still being prepared.').isVisible();
  const couldntLoadPresent = await page.getByText('We couldn\'t load today\'s brief.').isVisible();
  
  const openNodesCount = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let count = 0;
    let node;
    while (node = walker.nextNode()) {
      if (/^Open$/.test(node.textContent || '')) {
        count++;
      }
    }
    return count;
  });

  const bodyInnerText = await page.evaluate(() => document.body.innerText);

  console.log('--- RESULTS START ---');
  console.log('Top five papers present:', topFivePresent);
  console.log('Today\'s brief is still being prepared. present:', stillPreparingPresent);
  console.log('We couldn\'t load today\'s brief. present:', couldntLoadPresent);
  console.log('Count of text nodes matching /^Open$/:', openNodesCount);
  console.log('First 1500 chars of body.innerText:');
  console.log(bodyInnerText.substring(0, 1500));
  console.log('--- RESULTS END ---');
});
