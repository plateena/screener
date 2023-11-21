import playwright from 'playwright'

const isaham = async () => {
    const browser = await playwright.chromium.launch({
        // headless: false
    })
    const context = await browser.newContext({ storageState: 'auth/user.json' })
    const page = await context.newPage()
    await page.goto('https://finance.yahoo.com/quote/0265.KL/history')

    const data = await page.$eval("table[data-test='historical-prices'] tbody", elem => {
        let data = []
        let obj = {}
        const lists = elem.querySelectorAll('tr')
        Array.from(lists).forEach(elm => {
            obj.date = elm.querySelector('td:first-child').innerText
            obj.open = elm.querySelector('td:nth-child(2)').innerText
            obj.high = elm.querySelector('td:nth-child(3)').innerText
            obj.low = elm.querySelector('td:nth-child(4)').innerText
            obj.close = elm.querySelector('td:nth-child(5)').innerText
            obj.adj_close = elm.querySelector('td:nth-child(6)').innerText
            obj.volume = elm.querySelector('td:nth-child(7)').innerText
            data.push(obj)
        });
        return data
    })

    console.log(data)
    await page.waitForTimeout(5000)
    await browser.close()
}

isaham()
