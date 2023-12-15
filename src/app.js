// import { scrapeHistoricalStockData } from './historical-data.js'
import { conn } from './redis.mjs'

async function run() {
    // let data = scrapeHistoricalStockData('INFOM','0265');
    //
    // Use Redis
    const key = 'exampleKey';
    const value = 'exampleValue';


    const db = await conn()
    await db.set(key, value)
    const val = await db.get(key)
    console.log(val)
    db.quit()
}

run()
