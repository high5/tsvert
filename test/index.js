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
   , tsvert = require('../');


/**
 * Test Runner
*/
function runTests() {
  //console.log("runTests start");
  var dir = __dirname + '/tests/';

  /*
  for (var i = 1; i <= 1; i++) {
    var file = dir + i + '.tsv';
    var tsv = fs.readFileSync(file, 'utf8');
    runSqlTest(tsv);
  }
  */


  var tsvFile = dir + '1.tsv';
  var tsv = fs.readFileSync(tsvFile, 'utf8');


  var dataType = 'sql';

  var result = tsvert(tsv, dataType);
  var textFile = dir + '1-' + dataType + '.text';
  var text = fs.readFileSync(textFile, 'utf8');

  if (result == text) {
    console.log('#1. data type '+ dataType + ' completed.');
  } else {
    console.log('#1. data type '+ dataType + ' fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }


  var dataType = 'php';

  var result = tsvert(tsv, dataType);
  var textFile = dir + '1-' + dataType + '.text';
  var text = fs.readFileSync(textFile, 'utf8');

  if (result == text) {
    console.log('#2. data type '+ dataType + ' completed.');
  } else {
    console.log('#2. data type '+ dataType + ' fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }


  //console.log(result);
  //console.log(text);


  //console.log("text start");
  //console.log("text end");

















  //runSqlTest(tsv);








}


function runSqlTest(tsv) {
  var result = tsvert(tsv, 'sql');


  console.log(result)
  //console.log("hoge")



  var lines = result.replace(/\r/g, "").split("\n");

  // header minus
  var length = lines.length - 1;

  for(var i = 0; i < length; i++){
    //console.log(i);
    if (lines[i] != "INSERT INTO table(header1, header2:int, ) VALUES('1', '3', );") {
      console.log('\nGot:\n%s\n', lines[i]);
      console.log('\nExpected:\n%s\n', "INSERT INTO table(header1, header2:int, ) VALUES('1', '3', );");
    } else {

    }
  }
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
  process.title = 'tsvert';
  process.exit(main(process.argv.slice()) ? 0 : 1);
} else {
  exports = main;
  exports.main = main;
  exports.runTests = runTests;
  module.exports = exports;
}
