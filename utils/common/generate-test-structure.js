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

    if(!fs.existsSync(moduleDir)){
        fs.mkdirSync(moduleDir, { recursive: true });
    }

    if(!fs.existsSync(testDir)){
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
`const mock = require("./${testName}.mock");
const util = require("./${testName}.util");

module.exports = (_mockData) => {
    test("Test ${testName}", async() => {
        // Adicione seus passos de teste aqui
        await util.exampleFunction();

        // Remova a função de debug quando o teste estiver pronto
        await jestPuppeteer.debug();
    });
};`;

const getTestFileContent = (testName) => 
`const { users, data } = require("./${testName}.data");

describe("${testName.replace(/-/g, ' ')}", () => {
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
});`;

const getDataFileContent = () => 
`module.exports.users = () => ({
    // Defina seus usuarios aqui    
});

module.exports.data = (_users) => ([
    // Defina seus dados aqui
]);`;

const getMockFileContent = () => 
`module.exports.exampleFunction = (_mockData) => {
    return {
        // Dados mockados aqui
    };
};`;

const getUtilFileContent = () => 
`async function _exampleFunction(){
    console.log("A função funcionou!");
};

module.exports = {
    exampleFunction: _exampleFunction,
}`;

rl.question('Qual é o módulo do sistema (deixe em branco se não houver): ', (module) => {
    rl.question('Qual é o nome do teste: ', (testName) => {
        createTestStructure(module, testName);
        rl.close();
    });
});