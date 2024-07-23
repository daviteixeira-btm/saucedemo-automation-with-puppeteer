# saucedemo-automation-with-puppeteer
Using the Puppeteer library to perform automated testing on Swag Labs' soucedemo.com website. Puppeteer is a Node library that provides a high-level API for controlling Chrome or Chromium via the DevTools protocol. Puppeteer runs headless by default, but can be configured to run full (headless) Chrome or Chromium.

## Links

https://github.com/puppeteer/puppeteer/tree/main/examples

https://github.com/argos-ci/jest-puppeteer

https://pptr.dev/guides/getting-started

https://pptr.dev/api/puppeteer.filechooser

https://www.saucedemo.com/

## Comandos

### Rodar um teste
jest --detectOpenHandles tests/[nome-da-pasta]/[nome-do-teste].test.js

### Criar um teste
npm run generate-test

### Rodar um teste com interface
npm run test-seq [caminho-do-teste]

### Rodar um teste sem interface
npm run test-seq [caminho-do-teste]