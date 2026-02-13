import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Tapes', () => {

  test('Create multiple tapes', async ({ page }) => {
    await page.goto('/');

    const newTapes = [
      `Tape-${randomUUID()}`,
      `Tape-${randomUUID()}`,
      `Tape-${randomUUID()}`
    ];
	
    // Create multiple tapes
    for (const tapeName of newTapes) {
      await page.getByTestId('create-tape-button').click();
      await page.getByTestId('tape-name-input').fill(tapeName);
      await page.getByTestId('new-tape-button').click();
      await expect(page.getByText(tapeName)).toBeAttached();
    }
  });

  test('Navigate back from tape page', async ({ page }) => {
    await page.goto('/');
	
    const tapeName = `Tape-${randomUUID()}`;
	
    // Create tape
    await page.getByTestId('create-tape-button').click();
    await page.getByTestId('tape-name-input').fill(tapeName);
    await page.getByTestId('new-tape-button').click();
	
    // Go to tape page
    await page.getByText(tapeName).click();
    await expect(page).toHaveURL(`http://localhost:4173/tape/${tapeName}`);
	
    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:4173/');
    await expect(page.getByTestId('HomeHeading')).toBeVisible();
  });

  test('Direct navigation to non-existent tape', async ({ page }) => {
    const nonExistentTapeName = `NonExistent-${randomUUID()}`;
	
    await page.goto(`/tape/${nonExistentTapeName}`);
	
    // Should handle non-existent tape gracefully
    await expect(page).toHaveURL(`http://localhost:4173/tape/${nonExistentTapeName}`);

    // TODO: better 404 handling UI
    await expect(page.getByText('Tape not found')).toBeVisible();
  });

  test('Create same named tape twice', async ({ page }) => {
    await page.goto('/');
	
    const tapeName = `Tape-${randomUUID()}`;
	
    // Create first tape
    await page.getByTestId('create-tape-button').click();
    await page.getByTestId('tape-name-input').fill(tapeName);
    await page.getByTestId('new-tape-button').click();
    await expect(page.getByText(tapeName)).toBeAttached();
	
    // Attempt to create second tape with same name
    await page.getByTestId('create-tape-button').click();
    await page.getByTestId('tape-name-input').fill(tapeName);
    const createTapeReq = page.waitForRequest(/createTape/);
    await page.getByTestId('new-tape-button').click();
    const req = await createTapeReq;
    const res = await req.response();

    expect(await res?.text()).toContain('Tape with this name already exists');

    // Verify second tape is not created
    await expect(page.getByText(tapeName)).toHaveCount(1);
  });

});