import { chromium } from 'playwright';
import fs from 'fs/promises';
import { klseScreenerURL } from '../config.js';

/**
 * Scrapes company information from the KlseScreener website and saves it to a JSON file.
 * @returns {Promise<void>} A Promise that resolves when the scraping is complete.
 */
export const updateStockListings = async () => {

    let browser;

    try {
        // Launch Playwright browser
        browser = await chromium.launch({
            // headless: false
        });

        // Create a new context
        const context = await browser.newContext({ storageState: 'auth/klsescreener.json' });
        const page = await context.newPage();

        // Navigate to the KlseScreener website
        await page.goto(klseScreenerURL);

        // Click the 'Screen' button to initiate the screen with a timeout of 5000 milliseconds (5 seconds)
        await page.getByRole('button', { name: 'Screen', exact: true }).click()

        // Wait for the table to become visible
        await page.waitForSelector("#result table tbody", { state: 'visible' });

        // Extract data from the table
        const data = await page.$$eval("#result table tbody tr", rows => {
            return rows.map(row => {
                const name = row.querySelector('td:first-child a').innerText;
                const code = row.querySelector('td:nth-child(2)').innerText;
                const shariah = !!row.querySelector('td:first-child span');

                return {
                    [name]: { code, shariah }
                }
        });
    });

    // Write data to a JSON file
    await fs.writeFile('data/companies.json', JSON.stringify(data, null, 4), 'utf-8');
    console.log('JSON data written to file successfully.');
} catch (error) {
    console.error('Error during scraping:', error.message);
} finally {
    // Close the browser in case of success or failure
    if (browser) {
        await browser.close();
    }
}
};

export default updateStockListings

// Run the function if the file is executed directly
if (import.meta.main) {
    updateStockListings();
}
