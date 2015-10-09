#!/usr/bin/env node

/**
 * tsvto tests
 * Copyright (c) 2015, high5. (MIT Licensed)
 * https://github.com/high5/tsvto
 */

 /**
  * Modules
  */

 var fs = require('fs')
   , path = require('path')
   , tsvto = require('../');


/**
 * Test Runner
*/
function runTests() {
  //console.log("runTests start");
  var dir = __dirname + '/tests/';
  var file = dir + 'test-2.tsv';
  var tsv = fs.readFileSync(file, 'utf8');
  //console.log(tsv1);
  var result = tsvto(tsv, 'sql');
  var lines = result.replace(/\r/g, "").split("\n");
  for(var i = 0; i < lines.length; i++){
    console.log(lines[i]);
    if (lines[i] != 'dINSERT INTO table(header1, header2:int, ) VALUES('1', '3', )') {

    } else {
        
    }
  }








  //console.log(result + "------------");

  //var result = tsvto(tsv, 'php');
  //console.log(result);

  //console.log("runTests end");
}

/**
* Main
*/
function main() {
  return runTests();
}

/**
* Execute
*/
if (!module.parent) {
  process.title = 'tsvto';
  process.exit(main(process.argv.slice()) ? 0 : 1);
} else {
  exports = main;
  exports.main = main;
  exports.runTests = runTests;
  module.exports = exports;
}
