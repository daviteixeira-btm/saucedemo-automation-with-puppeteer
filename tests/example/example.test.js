const puppeteer = require('puppeteer');

describe("example", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            slowMo: 20,
            headless: false,
            defaultViewport: false,
        });

        page = await browser.newPage();
    });

    beforeEach(async () => {
        await page.goto('https://www.saucedemo.com');
    });

    afterAll(async () => {
        await browser.close();
    });

    require("./test.main.js")(page);
});