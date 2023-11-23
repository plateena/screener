import { watchs } from './config.js';
import klsescreener from './src/klsescreener.js';
import { sma, bullish } from 'technicalindicators'
import fs from 'fs'
import { transformArrayToObject } from './src/function/transform-array-to-object.js'


async function init() {
    const data = await fs.readFileSync('data/historical_INFOM.json', 'utf-8')
    console.log()
    const newData = transformArrayToObject(JSON.parse(data).reverse().slice(0, 7), ['open', 'high', 'close', 'low'])
    // Check if the array is empty
    // if (watchs.length === 0) {
    //   console.log('The array is empty. No stocks to watch.');
    // } else {
    //   // Loop through the array
    //   console.log('Stocks to watch:');
    //   for (const stock of watchs) {
    //     // Use await to wait for the asynchronous operation to complete
    //     let info = await klsescreener.scrapeStockInfo(stock);
    //     console.log(info);
    //   }
    // }

    // let a = sma({ period: 2, values: [1, 2, 3, 4, 5, 6, 7, 8, 9], reversedInput: true });
    console.log(bullish(newData))
}


init();
