async function _exampleFunction(page, newUser) {
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
};