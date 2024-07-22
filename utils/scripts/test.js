const { exec } = require('child_process');

const testName = process.argv[2];

if(!testName){
    console.error('Please provide the test name as an argument.');
    process.exit(1);
}

console.log(`Executing test: ${testName}`);

exec(`jest --detectOpenHandles --testNamePattern=${testName}`, (err, stdout, stderr) => {
    if(err){
        console.error(`Error executing test: ${err}`);
        return;
    }
    console.log(stdout);
    console.error(stderr);
});