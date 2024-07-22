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

module.exports = (page) => {
    test("Test ${testName}", async () => {
        const newUser = data.users();

        await util.exampleFunction(page, newUser);
        
        // Remova a função de debug quando o teste estiver pronto
        await jestPuppeteer.debug();
    });
};`;

const getTestFileContent = (testName) => 
`const puppeteer = require('puppeteer');

describe("${testName.replace(/-/g, ' ')}", () => {
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
});`;

const getDataFileContent = () => 
`module.exports.users = () => ({
    standardUser: {
        username: "standard_user",
        password: "secret_sauce"
    }  
});

module.exports.data = (_users) => ([
    // Outros dados necessários para o teste
]);`;

const getMockFileContent = () => 
`module.exports.exampleFunction = () => {
    return {
        // Dados mockados aqui, se necessário
    };
};`;

const getUtilFileContent = () => 
`async function _exampleFunction(page, newUser) {
    console.log("Iniciando a função exampleFunction");

    const userSelector = "#user-name";
    await page.waitForSelector(userSelector);
    await page.click(userSelector);
    await page.type(userSelector, newUser.standardUser.username);

    const passwordSelector = "#password";
    await page.waitForSelector(passwordSelector);
    await page.click(passwordSelector);
    await page.type(passwordSelector, newUser.standardUser.password);

    const buttonLoginSelector = "#login-button";
    await page.waitForSelector(buttonLoginSelector);
    await page.click(buttonLoginSelector);

    // Adicionar mais ações se necessário
    console.log("Login realizado com sucesso!");
};

module.exports = {
    exampleFunction: _exampleFunction,
};`;

rl.question('Qual é o módulo do sistema (deixe em branco se não houver): ', (module) => {
    rl.question('Qual é o nome do teste: ', (testName) => {
        createTestStructure(module, testName);
        rl.close();
    });
});
