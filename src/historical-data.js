import fs from 'fs/promises';
import { chromium } from 'playwright';
import { baseUrl } from './config.js';

/**
 * Scrapes historical stock data from Yahoo Finance.
 *
 * @param {string} code - The stock symbol or ticker (e.g., 'AAPL').
 * @param {Object} options - Additional options for customization.
 * @param {string} [options.startDate] - The start date for historical data (format: 'YYYY-MM-DD'). Defaults to a year from endDate.
 * @param {string} [options.endDate] - The end date for historical data (format: 'YYYY-MM-DD'). Defaults to today.
 * @param {string} [options.events] - Specify events to include (e.g., 'div' for dividends).
 * @param {string} [options.frequency] - The frequency of the data ('d' for daily, 'w' for weekly, 'm' for monthly).
 */
export async function scrapeHistoricalStockData(symbol, code, { startDate, endDate = new Date().toISOString().split('T')[0], events, frequency = 'd' } = {}) {
    // If startDate is not provided, set it to a year before endDate
    if (!startDate) {
        const endYear = parseInt(endDate.split('-')[0], 10);
        startDate = `${endYear - 1}${endDate.slice(4)}`;
    }

    const eventsParam = events ? `&e=${events}` : '';  // Include events parameter only if provided
    const url = `${baseUrl}${code}.KL/history?p=${code}&a=${startDate}&b=${endDate}&f=${frequency}${eventsParam}`;

    const browser = await chromium.launch({
        // headless: false
    });
    const page = await browser.newPage();

    try {
        // Navigate to the Yahoo Finance page
        await page.goto(url);

        // Extract historical data from the table
        const historicalData = await page.evaluate(() => {
            const dataRows = Array.from(document.querySelectorAll("table[data-test='historical-prices'] tbody tr"));
            return dataRows.map(row => {
                const columns = Array.from(row.querySelectorAll('td'));
                const date = columns[0].innerText;
                const open = columns[1].innerText;
                const high = columns[2].innerText;
                const low = columns[3].innerText;
                const close = columns[4].innerText;
                const adjClose = columns[5].innerText;
                const volume = columns[6].innerText.replace(/,/g, ''); // Remove commas from volume

                // Assuming the date is in the format 'YYYY-MM-DD'
                // You might need to adjust the date parsing based on the actual format
                const parsedDate = new Date(date);

                return {
                    date: parsedDate,
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                    adjClose: parseFloat(adjClose),
                    volume: parseInt(volume, 10)
                };
            });
        });
        // Save historicalData to a file in JSON format
        await saveDataToFile(`data/historical_${symbol}.json`, historicalData);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Close the browser
        await browser.close();
    }
}

/**
 * Saves data to a file in JSON format.
 *
 * @param {string} filename - The name of the file.
 * @param {Array} data - The data to be saved.
 */
async function saveDataToFile(filename, data) {
    try {
        // Convert data to JSON format
        const jsonData = JSON.stringify(data, null, 2);

        // Write data to file
        await fs.writeFile(filename, jsonData);

        console.log(`Data saved to ${filename}`);
    } catch (error) {
        console.error('Error saving data to file:', error.message);
    }
}
