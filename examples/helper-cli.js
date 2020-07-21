const { GPU } = require('gpu.js');
const { question } = require('readline-sync');
const { help } = require('../dist/index').default;

help(
  new GPU(),
  question('URL?: ')
)