const { GPU } = require('gpu.js');
const { question } = require('readline-sync');
const { hiveHelp } = require('../dist/index');

hiveHelp(
  new GPU(),
  question('URL?: ')
)