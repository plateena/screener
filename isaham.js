import { chromium } from 'playwright';

/**
 * Scrapes data from the isaham website using Playwright.
 * Prints the extracted data to the console.
 */
const isaham = async () => {
    // Launch the browser
    const browser = await chromium.launch();

    try {
        // Create a new browser context
        const context = await browser.newContext({ storageState: 'auth/user.json' });
        // Create a new page in the browser context
        const page = await context.newPage();

        // Navigate to the isaham website
        await page.goto('https://www.isaham.my/iscanner');

        // Click on "My Scanners" link
        await page.getByRole('link', { name: 'My Scanners' }).click();

        // Click on "Stochastic Cross stochastic" link
        await page.getByRole('link', { name: 'Stochastic Cross stochastic' }).click();

        // Extract data from the table
        const data = await extractTableData(page, "table#resultTable");

        // Print the extracted data to the console
        console.log(data);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    } finally {
        // Close the browser even if an error occurs
        if (browser) {
            await browser.close();
        }
    }
};

/**
 * Extracts data from a table on the page.
 * @param {Page} page - The Playwright page object.
 * @param {string} tableSelector - The selector for the table on the page.
 * @returns {Promise<Array<Object>>} - An array of objects representing the table data.
 */
const extractTableData = async (page, tableSelector) => {
    return await page.$$eval(`${tableSelector} tbody > tr`, rows => {
        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            return {
                name: columns[0].innerText,
                price: parseFloat(columns[1].innerText.replace(/[^0-9.-]+/g, '')),
                remark: columns[2].innerText,
                stohastic_value: parseFloat(columns[3].innerText.replace(/[^0-9.-]+/g, '')),
                score: parseFloat(columns[4].innerText.replace(/[^0-9.-]+/g, '')),
            };
        });
    });
};

// Call the main function to start the scraping process
isaham();
