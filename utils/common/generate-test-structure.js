const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

const projectRoot = path.resolve(__dirname, '../../');

const testsDir = path.join(projectRoot, 'tests');

const DEF_AVAILABLE_MODULES = [
    ["login", "Login"],
    ["settings", "Settings"],
    ["locations", "Locations"],
    ["resources", "Resources"],
];

const createTestStructure = (module, testName) => {
    if (!testName) {
        console.error('Nome do teste não pode ser vazio.');
        process.exit(1);
    }

    const testFileName = `${module}-${testName}`;
    const testDir = path.join(testsDir, testFileName);

    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    const files = [
        { name: 'test-main.js', content: getTestMainContent(testFileName) },
        { name: `${testFileName}.spec.js`, content: getTestFileContent(testFileName) },
        { name: `${testFileName}.data.js`, content: getDataFileContent() },
        { name: `${testFileName}.mock.js`, content: getMockFileContent() },
        { name: `${testFileName}.util.js`, content: getUtilFileContent() }
    ];

    files.forEach(file => {
        fs.writeFileSync(path.join(testDir, file.name), file.content);
    });

    console.log(`Estrutura de teste para ${testFileName} criada com sucesso em ${testDir}`);
};

const getTestMainContent = (testName) => 
`const util = require("./${testName}.util");
const data = require("./${testName}.data");

// Deve conter apenas a lógica principal do teste.
module.exports = async (_mockData) => {
    test('should run the login test', async () => {
        const newUser = data.users.standardUser;
        await util.login(_mockData.page, newUser);
        // Adicione ou remova a função de debug para realizar testes
        // await jestPuppeteer.debug();
    });
};`;

const getTestFileContent = (testName) => 
`const fs = require('fs');
const puppeteer = require('puppeteer');

// Contém a definição do teste usando jest.
describe("${testName.replace(/-/g, ' ')}", () => {
    
    const _mockData = {
        browser: {},
        page: {},
    };

    beforeAll(async () => {
        const headless = process.env.JEST_PUPPETEER_HEADLESS === 'true';
        
        _mockData.browser = await puppeteer.launch({
            slowMo: headless ? 0 : 20,
            headless: headless,
            userDataDir: "./tmp",
            defaultViewport: null,
        });
        
        _mockData.page = await _mockData.browser.newPage();
    });

    beforeEach(async () => {
        await _mockData.page.goto('https://www.saucedemo.com');
    });

    afterAll(async () => {
        const pages = await _mockData.browser.pages();
        
        for(const p of pages){
            if(!p.isClosed()){
                try {
                    await p.close();
                } catch (err) {
                    console.error('Erro ao fechar a página:', err);
                }
            }
        }

        try {
            await _mockData.browser.close();
        } catch (err) {
            console.error('Erro ao fechar o navegador:', err);
        }

        try {
            fs.rmSync('./tmp', { recursive: true, force: true });
        } catch (err) {
            console.error('Erro ao remover o diretório tmp:', err);
        }
    });

    afterEach(async () => {
        await _mockData.page.deleteCookie(...(await _mockData.page.cookies()));

        try {
            const client = await _mockData.page.target().createCDPSession();
            await client.send('Network.clearBrowserCache');
        } catch (err) {
            console.error('Erro ao limpar o cache do navegador:', err);
        }

        try {
            const pages = await _mockData.browser.pages();
            
            for(const p of pages){
                if(!p.isClosed()){
                    try {
                        await p.close();
                    } catch (err) {
                        console.error('Erro ao fechar a página:', err);
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao listar as páginas do navegador:', err);
        }
    });

    // Chama o test-main.js dentro do bloco de teste onde o page já está definido
    require('./test-main.js')(_mockData);
});`;

const getDataFileContent = () => 
`// Centraliza os dados de teste.
module.exports = {
    users: {
        standardUser: {
            username: "standard_user",
            password: "secret_sauce"
        }
    }  
};`;

const getMockFileContent = () => 
`// Centraliza as funções e dados de mock.
module.exports = {
    exampleFunction: () => {
        // Dados mockados aqui, se necessário
    }
};`;

const getUtilFileContent = () => 
`// Deverá incluir funções utilitárias relacionadas à lógica de interação com a página.
async function _login(page, user) {
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
}`;

const listAvailableModules = async () => {
    const { selectedModule } = await prompt([
        {
            type: 'list',
            name: 'selectedModule',
            message: 'Which module do you want to test?',
            choices: DEF_AVAILABLE_MODULES.map(([key, name]) => ({ name, value: key })),
        }
    ]);

    return selectedModule;
};

(async () => {
    const selectedModule = await listAvailableModules();

    const { testName } = await prompt({
        type: 'input',
        name: 'testName',
        message: 'Qual é o nome do teste:',
        validate: (input) => input && !/[^a-zA-Z0-9_-]/.test(input) ? true : 'Nome do teste inválido. Use apenas letras, números, hífens e underscores.'
    });

    createTestStructure(selectedModule, testName);
})();
