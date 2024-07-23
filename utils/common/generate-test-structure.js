const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const projectRoot = path.resolve(__dirname, '../../');
const testsDir = path.join(projectRoot, 'tests');

const createTestStructure = (module, testName) => {
    const moduleDir = module ? path.join(testsDir, module) : testsDir;
    const testDir = path.join(moduleDir, testName);

    if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
    }

    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    const files = [
        { name: 'test.main.js', content: getTestMainContent(testName) },
        { name: `${testName}.test.js`, content: getTestFileContent(testName) },
        { name: `${testName}.data.js`, content: getDataFileContent() },
        { name: `${testName}.mock.js`, content: getMockFileContent() },
        { name: `${testName}.util.js`, content: getUtilFileContent() }
    ];

    files.forEach(file => {
        fs.writeFileSync(path.join(testDir, file.name), file.content);
    });

    console.log(`Estrutura de teste para ${testName} criada com sucesso em ${testDir}`);
};

const getTestMainContent = (testName) => 
`const util = require("./${testName}.util");
const data = require("./${testName}.data");

module.exports = async (page) => {
    const newUser = data.users.standardUser;
    await util.login(page, newUser);
    // Adicione ou Remova a função de debug para realizar testes
    // await jestPuppeteer.debug();
};`;

const getTestFileContent = (testName) => 
`const fs = require('fs');
const puppeteer = require('puppeteer');
const runTest = require('./test.main');

describe("${testName.replace(/-/g, ' ')}", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            slowMo: 20,
            headless: false,
            userDataDir: "./tmp",
            defaultViewport: null,
        });

        page = await browser.newPage();
    });

    beforeEach(async () => {
        await page.goto('https://www.saucedemo.com');
    });

    afterAll(async () => {
        const pages = await browser.pages();
        for (const p of pages) {
            if (!p.isClosed()) {
                await p.close();
            }
        }

        await browser.close();

        fs.rmSync('./tmp', { recursive: true, force: true });
    });

    test('should run the login test', async () => {
        await runTest(page);
    }, 50000);

    afterEach(async () => {
        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);

        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCache');

        const pages = await browser.pages();
        for (const p of pages) {
            if (!p.isClosed()) {
                await p.close();
            }
        }
    });
});`;

const getDataFileContent = () => 
`module.exports = {
    users: {
        standardUser: {
            username: "standard_user",
            password: "secret_sauce"
        }
    }  
};`;

const getMockFileContent = () => 
`module.exports = {
    exampleFunction: () => {
        // Dados mockados aqui, se necessário
    }
};`;

const getUtilFileContent = () => 
`async function _login(page, user) {
    console.log("Iniciando a função!");

    const userSelector = "#user-name";
    await page.waitForSelector(userSelector);
    await page.click(userSelector);
    await page.type(userSelector, user.username);

    const passwordSelector = "#password";
    await page.waitForSelector(passwordSelector);
    await page.click(passwordSelector);
    await page.type(passwordSelector, user.password);

    const buttonLoginSelector = "#login-button";
    await page.waitForSelector(buttonLoginSelector);
    await page.click(buttonLoginSelector);

    // Adicionar mais ações se necessário
    console.log("Login realizado com sucesso!");
};

module.exports = {
    login: _login,
};`;

rl.question('Qual é o módulo do sistema (deixe em branco se não houver): ', (module) => {
    rl.question('Qual é o nome do teste: ', (testName) => {
        createTestStructure(module, testName);
        rl.close();
    });
});
