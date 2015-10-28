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
  var dir = __dirname + '/tests/';

  var testCase = [
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"sql.txt",
      "option":null
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"sql-tablename.txt",
      "option":{"sqlTableName":"table_name"}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"sql-bulkinsert.txt",
      "option":{"sqlBulkInsert":true}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"sql.txt",
      "option":{"html":true}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"sql.txt",
      "option":{"header":"header1\theader2:num\theader3:const\theader4:str\theader5:flex\theader6\\:str"}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"json.txt",
      "option":null
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"json-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"json-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"json.txt",
      "option":{"html":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"json.txt",
      "option":{"header":"header1\theader2:num\theader3:const\theader4:str\theader5:flex\theader6\\:str"}
    },
    {
      "dataType":"python",
      "tsv":"1.tsv",
      "resultTextFile":"python.txt",
      "option":null
    },
    {
      "dataType":"python",
      "tsv":"1.tsv",
      "resultTextFile":"python-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"python",
      "tsv":"1.tsv",
      "resultTextFile":"python-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"python",
      "tsv":"1.tsv",
      "resultTextFile":"python.txt",
      "option":{"html":true}
    },
    {
      "dataType":"ruby",
      "tsv":"1.tsv",
      "resultTextFile":"ruby.txt",
      "option":{"html":true}
    },
    {
      "dataType":"ruby",
      "tsv":"1.tsv",
      "resultTextFile":"ruby-symbolkey-false.txt",
      "option":{"rubySymbolKey":false}
    },
    {
      "dataType":"ruby",
      "tsv":"1.tsv",
      "resultTextFile":"ruby-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"ruby",
      "tsv":"1.tsv",
      "resultTextFile":"ruby-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"ruby",
      "tsv":"1.tsv",
      "resultTextFile":"ruby.txt",
      "option":{"html":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"php.txt",
      "option":null
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"php-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"php-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"php.txt",
      "option":{"html":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"php.txt",
      "option":{"header":"header1\theader2:num\theader3:const\theader4:str\theader5:flex\theader6\\:str"}
    }
  ];

  for (var i = 0; i < testCase.length; i++) {
    var testNumber = i + 1;
    var tsvFile = dir + testCase[i]["tsv"];
    var tsv = fs.readFileSync(tsvFile, 'utf8');
    var dataType = testCase[i]["dataType"];
    var optionMsg = '';
    var options = [];
    tsvert.initializeOptions();

    if (testCase[i]["option"] != null) {
      tsvert.setOptions(testCase[i]["option"]);

      options = Object.keys(testCase[i]["option"]);
      optionMsg = ' option ' + options.join(',');
    }


    if (options.indexOf('header') != -1) {
      var noHeaderTsvArr = tsv.split('\n');
      noHeaderTsvArr.shift();
      var noHeaderTsv = noHeaderTsvArr.join('\n');
      var result = tsvert(noHeaderTsv, dataType);
    } else {
      var result = tsvert(tsv, dataType);
    }

    var textFile = dir + testCase[i]["resultTextFile"];
    var text = fs.readFileSync(textFile, 'utf8');

    if (options.indexOf('html') != -1) {
      text = text.split('\n').join('<br>');
    }

    if (result == text) {
      console.log( '#' + testNumber + '. data type '+ dataType + optionMsg + ' completed.');
    } else {
      console.log('#' + testNumber + '. data type '+ dataType + optionMsg + ' fail.');
      console.log('\nGot:\n%s\n', result);
      console.log("--------------------");
      console.log('\nExpected:\n%s\n', text);
      console.log("--------------------");
    }
  }
}

function writeFile(file, text) {
  fs.writeFileSync(file, text);
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
