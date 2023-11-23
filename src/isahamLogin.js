import playwright from 'playwright'

const login = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://www.isaham.my')
    await page.getByText('Log In').click()
    await page.getByText('Sign in with Facebook').click()
    const popup = await page.waitForEvent('popup')
    await popup.locator('#email').fill('plateena711@gmail.com')
    await popup.locator('#pass').fill('aku@9075')
    await popup.getByLabel('Log in').click()
    await page.getByRole('button', { name: 'Features' }).hover()
    // await page.context().storageState({path: 'auth/user.json'})
    await browser.close()
}

login()
