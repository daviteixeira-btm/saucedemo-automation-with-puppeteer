const { exec } = require('child_process');

const testFolder = process.argv[2];

if (!testFolder) {
    console.error('Please provide the test folder as an argument.');
    process.exit(1);
}

console.log(`Executing tests in folder: ${testFolder}`);

exec(`cross-env JEST_PUPPETEER_HEADLESS=false jest --runInBand --detectOpenHandles ./tests/${testFolder}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error executing test: ${err}`);
        return;
    }
    console.log(stdout);
    console.error(stderr);
});
