/**
 * tsvto - a tsv converter
 * Copyright (c) high5@github. (MIT Licensed)
 * https://github.com/high5/tsvto
 */

;(function() {

//改行コードを指定できるようにする
function phpRow(obj) {
  var output = 'array(';
  for (var key in obj) {
    output += '\'' + key + '\'' + ' => ' + '\'' + obj[key] + '\'' + ', ';
  }
  output += '), '
  return output;
}

//bulk insert option 対応
//table name option 対応
function sqlRow(obj) {
  var output = 'INSERT INTO table';
  var columnStr = '';
  var valueStr = '';

  //console.log(obj.length);
  var bl = "\n";

  for (var key in obj) {
    columnStr += key + ', ';
    valueStr += '\'' + obj[key] + '\', ';
    //output += '\'' + key + '\'' + ' => ' + '\'' + obj[key] + '\'' + ', ';
  }
  output += '(' + columnStr + ') VALUES(' + valueStr + ');' + bl;

  return output;
}

function jsonRow(obj) {
  return JSON.stringify(obj); //JSON
}

/**
 * Options
 */
tsvto.options =
tsvto.setOptions = function(opt) {
  merge(tsvto.defaults, opt);
  return tsvto;
};

tsvto.defaults = {
};


/**
 * tsvto
 */
function tsvto(tsv, type) {

  var lines = tsv.replace(/\r/g, "").split("\n");

  var result = [];

  var output = '';

  var headers = lines[0].split("\t");

  for(var i = 1; i < lines.length; i++){

	  var obj = {};
	  var currentline=lines[i].split("\t");

	  for(var j = 0; j < headers.length; j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);
  }

  for(var i = 0; i < result.length; i++) {
    var obj = result[i];

    switch(type) {
      case 'json':
        output += phpRow(obj);
        break;
      case 'php':
        output += phpRow(obj);
        break;
      case 'sql':
        output += sqlRow(obj);
        break;
      default:
        break;
    }








    /*
    for (var key in hash) {
      output += '\'' + key + '\'' + ' => ' + '\'' + hash[key] + '\'' + ', ';
    }
    */
  }






  //return result; //JavaScript object
  //return JSON.stringify(result); //JSON
  return output; //JSON
}


if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = tsvto;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return tsvto; });
} else {
  this.tsvto = tsvto;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
