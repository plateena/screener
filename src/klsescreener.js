import { chromium } from 'playwright';
import fs from 'fs';

/**
 * Scrapes various information for a specific stock from klsescreener.com.
 * @param {string} stockCode - The code of the stock to scrape information for (e.g., "5171").
 * @param {string} fileName - The name of the file to save the scraped data.
 * @returns {Promise<void>}
 */
const scrapeStockInfo = async (stockCode, fileName) => {
    try {
        // Launch a new Chromium browser
        const browser = await chromium.launch({
            // headless: false
        });

        // Create a new browser context with stored authentication state
        const context = await browser.newContext({ storageState: 'auth/klsescreener.json' });

        // Create a new page within the context
        const page = await context.newPage();

        // Navigate to the stock's page on klsescreener.com using the provided stock code
        await page.goto(`https://www.klsescreener.com/v2/stocks/view/${stockCode}`);

        // Extract bid and ask information from the page
        const bidSizeStr = await page.$eval("[data-original-title='Bid Size Lvl 1']", elem => elem.innerText);
        const bidPriceStr = await page.$eval("[data-original-title='Bid Price Lvl 1']", elem => elem.innerText);
        const askSizeStr = await page.$eval("[data-original-title='Ask Size Lvl 1']", elem => elem.innerText);
        const askPriceStr = await page.$eval("[data-original-title='Ask Price Lvl 1']", elem => elem.innerText);

        // Extract Shariah Compliant status from the page
        const shariahCompliantStatus = await page.isVisible("[data-original-title='Shariah Compliant']");

        // Extract additional financial information
        // const roe = await page.$eval("[data-original-title='Return On Equity (ROE)']", elem => elem.innerText);
        // const peRatio = await page.$eval("[data-original-title='PE Ratio (TTM)']", elem => elem.innerText);
        // const fiftyTwoWeekRange = await page.$eval("[data-original-title='52 Weeks Range']", elem => elem.innerText);
        const buyPercentage = await page.$eval("#buy_rate", elem => elem.innerText);

        // Convert the string values to appropriate formats
        const bidSize = parseInt(bidSizeStr, 10);
        const bidPrice = parseFloat(bidPriceStr);
        const askSize = parseInt(askSizeStr, 10);
        const askPrice = parseFloat(askPriceStr);

        // Parse and format additional financial information
        // const parsedRoe = parseFloat(roe.replace('%', '')); // Remove percentage sign and parse
        // const parsedPeRatio = parseFloat(peRatio.replace('x', '')); // Remove 'x' and parse
        const parsedBuyPercentage = parseFloat(buyPercentage.replace('%', '')); // Remove percentage sign and parse

        // Extract 52 Weeks Range and format as an object
        // const [low52Week, high52Week] = fiftyTwoWeekRange.split('-').map(range => parseFloat(range.trim()));

        // Get today's date as a string in the format YYYY-MM-DD
        const todayDate = new Date().toISOString().split('T')[0];

        // Create a data object with the scraped information and date
        const scrapedData = {
            date: todayDate,
            bidSize,
            bidPrice,
            askSize,
            askPrice,
            shariahCompliantStatus,
            // roe: parsedRoe,
            // peRatio: parsedPeRatio,
            // fiftyTwoWeekRange: { low: low52Week, high: high52Week },
            buyPercentage: parsedBuyPercentage
        };

        // Convert the data object to a JSON string
        const jsonData = JSON.stringify(scrapedData, null, 2);

        // Write the JSON data to a file with the provided file name
        fs.writeFileSync(fileName, jsonData);

        // Display the extracted and formatted information
        console.log(`Bid Size: ${bidSize}, Bid Price: ${bidPrice}, Ask Size: ${askSize}, Ask Price: ${askPrice}`);
        console.log(`Shariah Compliant Status: ${shariahCompliantStatus}`);
        console.log(`Buy Percentage: ${parsedBuyPercentage}%`);
        // console.log(`ROE: ${parsedRoe}%, P/E Ratio: ${parsedPeRatio}, 52 Weeks Range: ${low52Week} - ${high52Week}, Buy Percentage: ${parsedBuyPercentage}%`);
        console.log(`Data written to file: ${fileName}`);

        // Close the browser immediately after scraping
        await browser.close();
    } catch (error) {
        // Log the error if any occurs
        console.error('An error occurred:', error);
    }
};

// Example usage with stock code "5171" and custom file name "custom_data.json"
scrapeStockInfo("5173", "custom_data.json");
