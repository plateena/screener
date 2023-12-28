import { chromium } from 'playwright';
import { scrapeInformation } from '../helpers/scraper.js'

const statusHandler = async (statusCode) => {
    // Your logic for handling the status code goes here
    console.log(`Handling status code: ${statusCode}`);
    let browser;

    try {
        browser = await chromium.launch({
            headless: false
        });

        const context = await browser.newContext({ storageState: './auth/klsescreener.json' });
        const page = await context.newPage();

        await page.goto(`https://www.klsescreener.com/v2/stocks/view/${statusCode}`);

        await page.waitForTimeout(5000);
        const [bidSize, bidPrice, askSize, askPrice] = await Promise.all([
            scrapeInformation(page, "[data-original-title='Bid Size Lvl 1']").then(value => parseInt(value.replace(',', ''), 10)),
            scrapeInformation(page, "[data-original-title='Bid Price Lvl 1']").then(value => parseFloat(value)),
            scrapeInformation(page, "[data-original-title='Ask Size Lvl 1']").then(value => parseInt(value.replace(',', ''), 10)),
            scrapeInformation(page, "[data-original-title='Ask Price Lvl 1']").then(value => parseFloat(value)),
        ]);

        // Extract other information as needed
        const [priceOpen, priceHigh, priceLow, buyPercentage] = await Promise.all([
            scrapeInformation(page, "#priceOpen").then(value => parseFloat(value)),
            scrapeInformation(page, "#priceHigh").then(value => parseFloat(value)),
            scrapeInformation(page, "#priceLow").then(value => parseFloat(value)),
            scrapeInformation(page, "#buy_rate").then(value => parseFloat(value.replace('%', ''))),
        ]);

        const shariahCompliantStatus = await page.isVisible("[data-original-title='Shariah Compliant']");

        console.log(`Bid Size: ${bidSize}, Bid Price: ${bidPrice}, Ask Size: ${askSize}, Ask Price: ${askPrice}`);
        console.log(`Shariah Compliant Status: ${shariahCompliantStatus}`);
        console.log(`Buy Percentage: ${buyPercentage}%`);
        console.log(`Data written to file: ${fileName}`);

        return jsonData;
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    };
}

    export default statusHandler;
