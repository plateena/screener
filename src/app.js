import { scrapeHistoricalStockData } from './historical-data.js'

async function run() { 
    let data = scrapeHistoricalStockData('INFOM','0265');
}

run()
