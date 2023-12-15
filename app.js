import { watchs } from './config.js';
import klsescreener from './src/klsescreener.js';
import ti from 'technicalindicators'
import fs from 'fs'
import { transformArrayToObject } from './src/function/transform-array-to-object.js'


async function init() {
    ti.setConfig('precision', 4)
    const data = fs.readFileSync('data/historical_INFOM.json', 'utf-8')
    console.log()
    const newData = transformArrayToObject(JSON.parse(data).reverse(), ['open', 'high', 'close', 'low'])
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

    let a = ti.sma({ period: 20, values: newData.close, reversedInput: true });
    console.log(ti.bullish(newData), a.reverse()[2])
}


init();
