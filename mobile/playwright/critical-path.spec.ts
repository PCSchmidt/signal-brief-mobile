import { expect, Page, test } from '@playwright/test';

async function completeOnboarding(page: Page) {
  await page.goto('/');

  await expect(page.getByText('Daily setup')).toBeVisible();
  await expect(page.getByText('Build your brief')).toBeVisible();

  await page.getByText('Continue').click();

  await expect(page.getByText('A compact scan of what matters today')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Top five papers')).toBeVisible();
}

async function waitForBriefReady(page: Page) {
  const openPaperAction = page.getByText(/^Open$/).first();

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (await openPaperAction.isVisible().catch(() => false)) {
      return;
    }

    const digestPreparing = page.getByText("Today's brief is still being prepared.");

    if (await digestPreparing.isVisible().catch(() => false)) {
      await page.getByLabel('Refresh brief').click();
    }

    await page.waitForTimeout(5_000);
  }

  await expect(openPaperAction).toBeVisible({ timeout: 60_000 });
}

test('first launch to brief, detail, save, and reload persistence', async ({ page }) => {
  await completeOnboarding(page);
  await waitForBriefReady(page);

  const openPaperAction = page.getByText(/^Open$/).first();
  await openPaperAction.click();

  await expect(page.getByText('Why it matters')).toBeVisible();
  await expect(page.getByText('Abstract snapshot')).toBeVisible();
  await page.getByText('Back').click();

  const savePaperAction = page.getByText(/^Save$/).first();
  await expect(savePaperAction).toBeVisible();
  await savePaperAction.click();

  await page.getByRole('tab', { name: /Saved/ }).click();
  await expect(page.getByText('Papers worth revisiting')).toBeVisible();
  await expect(page.getByText('No saved papers yet')).toHaveCount(0);
  await expect(page.getByText('Remove')).toBeVisible();

  await page.reload();

  await expect(page.getByText('Daily setup')).toHaveCount(0);
  await page.getByRole('tab', { name: /Saved/ }).click();
  await expect(page.getByText('Papers worth revisiting')).toBeVisible();
  await expect(page.getByText('No saved papers yet')).toHaveCount(0);
});

test('settings topic editing persists across reload', async ({ page }) => {
  await completeOnboarding(page);
  await waitForBriefReady(page);

  await page.getByRole('tab', { name: /Settings/ }).click();
  await expect(page.getByText('Keep the brief narrow and useful')).toBeVisible();

  await page.getByText('Edit').click();
  await expect(page.getByText('Build your brief')).toBeVisible();

  await page.getByText(/^Inference$/).click();
  await page.getByText(/^Vision$/).click();
  await page.getByText('Save topics').click();

  await expect(page.getByText('Keep the brief narrow and useful')).toBeVisible();
  await expect(page.getByText('LLMS, EVALUATION, VISION')).toBeVisible();

  await page.reload();
  await page.getByRole('tab', { name: /Settings/ }).click();
  await expect(page.getByText('LLMS, EVALUATION, VISION')).toBeVisible();
});

test('digest error state recovers through retry', async ({ page }) => {
  let failFirstBriefRequest = true;

  await page.route('**/brief/today?**', async (route) => {
    if (failFirstBriefRequest) {
      failFirstBriefRequest = false;
      await route.fulfill({
        body: JSON.stringify({ detail: 'Unable to assemble today\'s brief from arXiv.' }),
        contentType: 'application/json',
        status: 502,
      });
      return;
    }

    await route.continue();
  });

  await completeOnboarding(page);

  await expect(page.getByText("We couldn't load today's brief.")).toBeVisible();
  await expect(page.getByText(/Brief request failed with status 502/)).toBeVisible();

  await page.getByText('Retry').click();
  await waitForBriefReady(page);

  await expect(page.getByText('Top five papers')).toBeVisible();
  await expect(page.getByText(/^Open$/).first()).toBeVisible();
});