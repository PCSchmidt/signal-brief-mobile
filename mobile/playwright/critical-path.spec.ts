import { expect, test } from '@playwright/test';

test('first launch to brief, detail, save, and reload persistence', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Daily setup')).toBeVisible();
  await expect(page.getByText('Build your brief')).toBeVisible();

  await page.getByText('Continue').click();

  await expect(page.getByText('A compact scan of what matters today')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Top five papers')).toBeVisible();

  const openPaperAction = page.getByText(/^Open$/).first();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (await openPaperAction.isVisible().catch(() => false)) {
      break;
    }

    const digestPreparing = page.getByText("Today's brief is still being prepared.");

    if (await digestPreparing.isVisible().catch(() => false)) {
      await page.getByLabel('Refresh brief').click();
    }

    await page.waitForTimeout(5_000);
  }

  await expect(openPaperAction).toBeVisible({ timeout: 60_000 });
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