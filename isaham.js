import playwright from 'playwright'

const isaham = async () => {
    const browser = await playwright.chromium.launch({
        // headless: false
    })
    const context = await browser.newContext({ storageState: 'auth/user.json' })
    const page = await context.newPage()
    await page.goto('https://www.isaham.my/iscanner')
    await page.getByRole('link', { name: 'My Scanners' }).click();
    await page.getByRole('link', { name: 'Stochastic Cross stochastic' }).click();
    const data = await page.$eval("table#resultTable", elem => {
        let data = []
        let obj = {}
        const lists = elem.querySelectorAll('tbody > tr')
        Array.from(lists).forEach(elm => {
            obj.name = elm.querySelector('td:first-child').innerText
            obj.price = elm.querySelector('td:nth-child(2)').innerText
            obj.remark = elm.querySelector('td:nth-child(3)').innerText
            obj.stohastic_value = elm.querySelector('td:nth-child(4)').innerText
            obj.score = elm.querySelector('td:nth-child(5)').innerText
            data.push(obj)
        });
        return data
    })

    console.log(data)

    await browser.close()
}

isaham()
