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
      "resultTextFile":"1-sql.txt",
      "option":null
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"1-sql-tablename.txt",
      "option":{"sqlTableName":"table_name"}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"1-sql-bulkinsert.txt",
      "option":{"sqlBulkInsert":true}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"1-sql.txt",
      "option":{"html":true}
    },
    {
      "dataType":"sql",
      "tsv":"1.tsv",
      "resultTextFile":"1-sql.txt",
      "option":{"header":"header1\theader2:num\theader3:const\theader4:str\theader5:flex\theader6\\:str"}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"1-json.txt",
      "option":null
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"1-json-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"1-json-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"1-json.txt",
      "option":{"html":true}
    },
    {
      "dataType":"json",
      "tsv":"1.tsv",
      "resultTextFile":"1-json.txt",
      "option":{"header":"header1\theader2:num\theader3:const\theader4:str\theader5:flex\theader6\\:str"}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"1-php.txt",
      "option":null
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"1-php-indent.txt",
      "option":{"indent":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"1-php-keynumber.txt",
      "option":{"useRowNumberKey":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"1-php.txt",
      "option":{"html":true}
    },
    {
      "dataType":"php",
      "tsv":"1.tsv",
      "resultTextFile":"1-php.txt",
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


    if (result.trim() == text.trim()) {
      console.log( '#' + testNumber + '. data type '+ dataType + optionMsg + ' completed.');
    } else {
      console.log('#' + testNumber + '. data type '+ dataType + optionMsg + ' fail.');
      console.log('\nGot:\n%s\n', result);
      console.log("--------------------");
      console.log('\nExpected:\n%s\n', text);
      console.log("--------------------");
    }
  }































  /*
  var tsvFile = dir + '1.tsv';
  var tsv = fs.readFileSync(tsvFile, 'utf8');


  var dataType = 'sql';

  tsvert.setOptions(tsvert.defaults);
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


  tsvert.setOptions(tsvert.defaults);
  tsvert.setOptions({
    sqlTableName: 'table_name'
  });
  var result = tsvert(tsv, dataType);
  var textFile = dir + '1-' + dataType + '-option-tablename.text';
  var text = fs.readFileSync(textFile, 'utf8');

  if (result == text) {
    console.log('#2. data type '+ dataType + ' option table name completed.');
  } else {
    console.log('#2. data type '+ dataType + ' option table name fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }

  tsvert.initializeOptions();
  tsvert.setOptions({
    sqlBulkInsert: true
  });

  var result = tsvert(tsv, dataType);

  var textFile = dir + '1-' + dataType + '-option-bulkinsert.text';
  var text = fs.readFileSync(textFile, 'utf8');

  if (result == text) {
    console.log('#3. data type '+ dataType + ' option bulk insert completed.');
  } else {
    console.log('#3. data type '+ dataType + ' option bulk insert fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }

  tsvert.initializeOptions();
  tsvert.setOptions({
    html: true
  });

  var result = tsvert(tsv, dataType);

  var textFile = dir + '1-' + dataType + '.text';
  var text = fs.readFileSync(textFile, 'utf8');
  text = text.split('\n').join('<br>');

  if (result == text) {
    console.log('#4. data type '+ dataType + ' option html completed.');
  } else {
    console.log('#4. data type '+ dataType + 'option html fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }


  tsvert.initializeOptions();
  tsvert.setOptions({
    header: 'header1	header2:num	header3:const	header4:str	header5:flex	header6\\:str'
  });
  var noHeaderTsvArr = tsv.split('\n');
  noHeaderTsvArr.shift();
  var noHeaderTsv = noHeaderTsvArr.join('\n');
  var result = tsvert(noHeaderTsv, dataType);
  var textFile = dir + '1-' + dataType + '.text';
  var text = fs.readFileSync(textFile, 'utf8');

  if (result == text) {
    console.log('#5. data type '+ dataType + ' option header completed.');
  } else {
    console.log('#5. data type '+ dataType + ' option header fail.');
    console.log('\nGot:\n%s\n', result);
    console.log('\nExpected:\n%s\n', text);
  }
  */


  /*
  dataType = 'php';

  tsvert.initializeOptions();
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
  */





















  // setOptions html true



  // setOption headerTsv


















  /*
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
  */


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
