import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	fullyParallel: true,
	webServer: {
		command: 'pnpm build --mode test && pnpm preview --mode test',
		port: 4173,
		reuseExistingServer: false
	},
	testDir: 'e2e',
	projects: [
		{
			name: 'Create initial user and login',
			testMatch: /.*\.setup\.ts/,
		},
		{
			name: 'chromium',
			use: { 
				...devices['Desktop Chrome'],
				storageState: './e2e/.auth/user.json',
			},
			dependencies: ['Create initial user and login'],
		},
	],
	use: {
		baseURL: 'http://localhost:4173/',
		screenshot: 'only-on-failure',
	},
});
