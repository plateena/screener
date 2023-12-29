import { chromium } from 'playwright';
import { scrapeInformation } from '../helpers/scraper.js'

const statusHandler = async (statusCode) => {
    // Your logic for handling the status code goes here
    console.log(`Handling status code: ${statusCode}`);
    let browser;

    try {
        browser = await chromium.launch({
            headless: true
        });

        const context = await browser.newContext({ storageState: './auth/klsescreener.json' });
        const page = await context.newPage();

        await page.goto(`https://www.klsescreener.com/v2/stocks/view/${statusCode}`);

        const [company, legend, price] = await Promise.all([
            scrapeInformation(page, ".col-xl-6 > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)"),
            scrapeInformation(page, "h2.mr-2"),
            scrapeInformation(page, "#price")
        ])

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

        console.log(`Company: ${company} (${legend})`);
        console.log(`Price: ${price}`);
        console.log(`Bid Size: ${bidSize}, Bid Price: ${bidPrice}, Ask Size: ${askSize}, Ask Price: ${askPrice}`);
        console.log(`Price: Open: ${priceOpen} High: ${priceHigh} Low: ${priceLow}`)
        console.log(`Shariah Compliant Status: ${shariahCompliantStatus}`);
        console.log(`Buy Percentage: ${buyPercentage}%`);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    };
}

    export default statusHandler;
