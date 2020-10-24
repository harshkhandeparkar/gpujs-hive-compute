// Check whether local output and hive output are same.
const { hiveRun, hiveHelp } = require('../dist/index');
const test = require('tape');
const { GPU } = require('gpu.js');
