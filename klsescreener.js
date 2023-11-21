import playwright from 'playwright'

const isaham = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })
    const context = await browser.newContext({ storageState: 'auth/klsescreener.json' })
    const page = await context.newPage()
    await page.goto('https://www.klsescreener.com/v2/stocks/view/5173')
    let bs = await page.$eval("[data-original-title='Bid Size Lvl 1']", elem => {
        return elem.innerText
    })
    let bp = await page.$eval("[data-original-title='Bid Price Lvl 1']", elem => {
        return elem.innerText
    })
    let as = await page.$eval("[data-original-title='Ask Size Lvl 1']", elem => {
        return elem.innerText
    })
    let ap = await page.$eval("[data-original-title='Ask Price Lvl 1']", elem => {
        return elem.innerText
    })

    console.log(bs,bp,as,ap)
    await page.waitForTimeout(3000)
    // await browser.close()
}

isaham()
