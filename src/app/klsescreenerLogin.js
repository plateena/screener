import playwright from 'playwright'

const login = async () => {
    const browser = await playwright.chromium.launch({
        headless: false,
        // ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],
        // args: ["--disable-dev-shm-usage", "--disable"],
        args: ["--disable-blink-features=AutomationControlled"],
    })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://www.klsescreener.com')
    await page.getByRole('link', { name: ' Login' }).click()
    await page.getByRole('link', { name: ' | Login with Google' }).click()
    await page.getByLabel('Email or phone').fill('plateena711@gmail.com')
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByLabel('Enter your password').fill('platina@711')
    // await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForTimeout(20000)
    await page.context().storageState({path: 'auth/klsescreener.json'})
    console.log("Saved")
    await browser.close()
}

login()
