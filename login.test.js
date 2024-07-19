const puppeteer = require('puppeteer');

describe("Login with Standard User", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false,
            userDataDir: "./tmp",
            slowMo: 20
        });
        page = await browser.newPage();
    });

    afterAll(async() => {
        await browser.close();
    });

    test("Should must log in correctly with the standard user username and password", async() => {
        await page.goto('https://www.saucedemo.com/');

        const userSelector = "#user-name";
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.type(userSelector, "standard_user");

        const passwordSelector = "#password";
        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.type(passwordSelector, "secret_sauce");

        const buttonLoginSelector = "#login-button";
        await page.waitForSelector(buttonLoginSelector);
        await page.click(buttonLoginSelector);
    });  
});