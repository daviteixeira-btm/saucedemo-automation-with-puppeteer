const mock = require("./login.mock");
const util = require("./login.util");

module.exports = (_mockData) => {
    test("Test login", async() => {
        // Adicione seus passos de teste aqui
        await util.exampleFunction();

        // Remova a função de debug quando o teste estiver pronto
        await jestPuppeteer.debug();
    });
};