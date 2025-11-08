import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { testUser } from './data';
import chalk from 'chalk';

const authFile = path.join(import.meta.dirname, '.auth/user.json');

setup.describe('Setup flow', () => {
	setup.describe.configure({ mode: 'serial' });

	setup.beforeAll(async () => {
		console.log('[Test]', chalk.blue('Clearing database before setup tests'));
		await import('../scripts/clear-database').then(({ clearDatabase }) => clearDatabase());
	});
	
	setup('Create initial user', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/welcome/);
		await page.fill('input[name="username"]', testUser.username);
		await page.fill('input[name="email"]', testUser.email);
		await page.fill('input[name="_password"]', testUser.password);
		await page.fill('input[name="passwordConfirm"]', testUser.password);
		await page.click('button[type="submit"]');
		await expect(page).toHaveURL('/login');

		console.log('[Test]', chalk.green('First User Created'));
	});

	setup('Verify that we cannot access welcome page after initial setup', async ({ page }) => {
		await page.goto('/welcome');
		await expect(page).toHaveURL('/login');
	});

	setup('Log test user in', async ({ baseURL, page }) => {
		await page.goto(baseURL!);
		await expect(page).toHaveURL(/\/login/);

		await page.fill('input[name="username"]', testUser.username);
		await page.fill('input[name="_password"]', testUser.password);
		await page.click('button[type="submit"]');

		await expect(page).toHaveURL('/');
		await page.context().storageState({ path: authFile });

		console.log('[Test]', chalk.green('Test User Logged In and Storage State Saved'));
	});
});