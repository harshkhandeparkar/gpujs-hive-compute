const { GPU } = require('gpu.js');
const { question } = require('readline-sync');
const { hiveHelp } = require('../dist/index');

hiveHelp({
  gpu: new GPU(),
  url: question('URL?: ')
})