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
    
    if(!testName){
        console.error('Nome do teste não pode ser vazio.');
        process.exit(1);
    }

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
`const util = require("./${testName}.util");
const data = require("./${testName}.data");

module.exports = async (page) => {
    const newUser = data.users.standardUser;
    await util.login(page, newUser);
    // Adicione ou remova a função de debug para realizar testes
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
        const headless = process.env.JEST_PUPPETEER_HEADLESS === 'true';
        
        browser = await puppeteer.launch({
            slowMo: headless ? 0 : 20,
            headless: headless,
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
            await browser.close();
        } catch (err) {
            console.error('Erro ao fechar o navegador:', err);
        }

        try {
            fs.rmSync('./tmp', { recursive: true, force: true });
        } catch (err) {
            console.error('Erro ao remover o diretório tmp:', err);
        }
    });

    test('should run the login test', async () => {
        await runTest(page);
    }, 50000);

    afterEach(async () => {
        await page.deleteCookie(...(await page.cookies()));

        try {
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCache');
        } catch (err) {
            console.error('Erro ao limpar o cache do navegador:', err);
        }

        try {
            const pages = await browser.pages();
            
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
}`;

const listExistingModules = () => {
    if (fs.existsSync(testsDir)) {
        const modules = fs.readdirSync(testsDir).filter(file => fs.statSync(path.join(testsDir, file)).isDirectory());
        if (modules.length) {
            console.log('Módulos existentes:');
            modules.forEach(module => console.log(`- ${module}`));
        } else {
            console.log('Nenhum módulo existente.');
        }
    } else {
        console.log('Diretório de testes não encontrado.');
    }
};

listExistingModules();

rl.question('Qual é o módulo do sistema (deixe em branco se não houver): ', (module) => {
    rl.question('Qual é o nome do teste: ', (testName) => {
        if(!testName || /[^a-zA-Z0-9_-]/.test(testName)){
            console.error('Nome do teste inválido. Use apenas letras, números, hífens e underscores.');
            rl.close();
            return;
        }

        createTestStructure(module, testName);
        
        rl.close();
    });
});
