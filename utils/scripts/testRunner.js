const { exec } = require('child_process');

const fs = require('fs');
const path = require('path');

const testFolder = process.argv[2];

if(!testFolder){
    console.error('Erro: Por favor, forneça a pasta do teste como argumento.');
    process.exit(1);
}

const testFolderPath = path.resolve(__dirname, `../../tests/${testFolder}`);

if(!fs.existsSync(testFolderPath)){
    console.error(`Erro: A pasta especificada não existe: ${testFolderPath}`);
    process.exit(1);
}

console.log(`Executando testes na pasta: ${testFolderPath}`);

exec(`cross-env JEST_PUPPETEER_HEADLESS=true jest --runInBand --detectOpenHandles ./tests/${testFolder}`, (err, stdout, stderr) => {
    if(err){
        console.error(`Erro ao executar o teste: ${err.message}`);
        return;
    }

    console.log(stdout);
    
    if(stderr){
        console.error(`Erros durante a execução do teste: ${stderr}`);
    }
});