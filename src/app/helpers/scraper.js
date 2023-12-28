/**
 * Scrape information from the page.
 * @param {Page} page - The Playwright page object.
 * @param {string} selector - The selector to get information from.
 * @returns {Promise<string>} - The scraped information.
 */
export const scrapeInformation = async (page, selector) => {
    return await page.$eval(selector, (elem) => elem.innerText);
};
