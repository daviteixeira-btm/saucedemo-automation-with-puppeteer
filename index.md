const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
        slowMo: 20
    });

    const page = await browser.newPage();
    
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

    await page.screenshot({ path: "example.png"});
    await jestPuppeteer.debug();
    
    await browser.close();
})();