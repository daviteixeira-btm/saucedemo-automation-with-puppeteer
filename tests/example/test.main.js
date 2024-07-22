const util = require("./example.util");
const data = require("./example.data");

module.exports = (page) => {
    test("Test example", async () => {
        const newUser = data.users();

        await util.exampleFunction(page, newUser);
        
        // Remova a função de debug quando o teste estiver pronto
        await jestPuppeteer.debug();
    });
};