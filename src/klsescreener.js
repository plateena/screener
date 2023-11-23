import { chromium } from 'playwright';
import fs from 'fs/promises';
import { scrapeInformation } from './helpers/scraper.js'

/**
 * Write data to a file with the provided file name.
 * @param {string} fileName - The name of the file to save the data.
 * @param {string} data - The data to write to the file.
 * @returns {Promise<void>}
 */
const writeFile = async (fileName, data) => {
  try {
    await fs.writeFile(fileName, data);
    console.log(`Data written to file: ${fileName}`);
  } catch (writeError) {
    console.error(`Error writing to file: ${fileName}`, writeError);
  }
};

/**
 * Get today's date as a string in the format YYYYMMDD.
 * @returns {string} - The formatted date string.
 */
const getFormattedDate = () => {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
};

/**
 * Scrapes various information for a specific stock from klsescreener.com.
 * @param {string} stockCode - The code of the stock to scrape information for (e.g., "5171").
 * @param {string} fileName - The name of the file to save the scraped data.
 * @returns {Promise<void>}
 */
export const scrapeStockInfo = async (stockCode, fileName) => {
  const todayDate = getFormattedDate();

  // Use the || operator for a default value if fileName is not provided
  fileName = fileName || `data/${todayDate}_${stockCode}_kscreener.json`;

  let browser;

  try {
    browser = await chromium.launch();

    const context = await browser.newContext({ storageState: 'auth/klsescreener.json' });
    const page = await context.newPage();

    await page.goto(`https://www.klsescreener.com/v2/stocks/view/${stockCode}`);

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

    const scrapedData = {
      date: todayDate,
      bidSize,
      bidPrice,
      askSize,
      askPrice,
      shariahCompliantStatus,
      buyPercentage,
      open: priceOpen,
      high: priceHigh,
      low: priceLow,
    };

    const jsonData = JSON.stringify(scrapedData, null, 2);

    await writeFile(fileName, jsonData);

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
  }
};

export default { scrapeStockInfo };
