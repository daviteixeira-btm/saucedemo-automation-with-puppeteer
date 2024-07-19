const { users, data } = require("./login.data");

describe("login", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            slowMo: 20,
            headless: false,
            userDataDir: "./tmp",
            defaultViewport: false,
        });

        page = await browser.newPage();
    });

    afterAll(async() => {
        await browser.close();
    });

    require("./test.main.js")(_mockData);
});