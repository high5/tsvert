/**
 * tsvert - a tsv converter
 * Copyright (c) high5@github. (MIT Licensed)
 * https://github.com/high5/tsvert
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
  tsvert.options =
  tsvert.setOptions = function(opt) {
    merge(tsvert.defaults, opt);
    return tsvert;
  };

  tsvert.defaults = {
  };


  /**
   * tsvert
   */
  function tsvert(tsv, type) {

    var lines = tsv.replace(/\r/g, "").split("\n");

    var list = [];

    var output = '';

    var headers = lines[0].split("\t");

    for(var i = 1; i < lines.length; i++){

      var obj = {};
      var currentline = lines[i].split("\t");

      for(var j = 0; j < headers.length; j++){
        obj[headers[j]] = currentline[j];
      }

      list.push(obj);
    }

    switch(type) {
      case 'sql':
        output = toSql(list);
        break;
      case 'php':
        output = toPhp(list);
        break;
      default:
        break;
    }



    /*
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

    }
    */

    //return result; //JavaScript object
    //return JSON.stringify(result); //JSON
    return output;
  }

  /*
  function nanCheck(val){
    if (isNaN(val)){
      console.log("○ " + val);
    }else{
      console.log("× " + val);
    }
  }
  */

  function getQuote(keyType, value) {
    //var quote = '';
    //var value = value;

    var quote = isNaN(value) ? '\'':'';
    if (typeof(value) == 'string' && value.length == 0) {
      quote = '\'';
    }

    var lowerValue = '';
    if (keyType == 'const' || keyType == 'constant') {
      quote = '';
    } else if (keyType == 'str' || keyType == "string") {
      quote = '\'';
    } else if (keyType == 'flex' || keyType == "flexible") {
      quote = isNaN(value)  ? '\'':'';
      if (value.length == 0) {
        quote = '\'';
      }
      if (quote != '') {
        lowerValue = value.toLowerCase();
        if (lowerValue == 'null' || lowerValue == 'true' || lowerValue == 'false') {
          quote = '';
        }
      }
    }
    return quote;
  }

  //bulk insert option 対応
  //table name option 対応
  function toSql(list) {
    var output = ''
      , bl = '\n';

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , columnStr = ''
        , valueStr = ''
        , objSize = 0
        , tableName = 'table';

      output += 'INSERT INTO ' + tableName;

      for (var key in obj) {
        var keyStr = key
          , value = obj[key]
          , keyType = ''
          , quote = ''
          , keySplit = key.split(':');

        if (keySplit.length == 2 && key.split('\\:').length != 2) {
          keyStr = keySplit[0];
          keyType = keySplit[1].toLowerCase();
          if (keyType == 'num' || keyType == 'number') {
            value = isNaN(value)? 0:parseFloat(value);
            if (isNaN(value)) {
              value = 0;
            }
          }
          if ((keyType == 'const' || keyType == 'constant') && value.length == 0) {
            value = 'UNDEFINED';
          }
        }

        quote = getQuote(keyType, value);

        if (key.split('\\:').length == 2) {
          keyStr = keyStr.replace("\\" , '');
        }

        objSize++;
        columnStr += keyStr;
        valueStr += quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          columnStr += ', ';
          valueStr += ', ';
        }
      }

      output += '(' + columnStr + ') VALUES(' + valueStr + ');';

      if (i != (list.length - 1)) {
        output += bl;
      }
    }

    return output;
  }

  function toPhp(list) {
    var output = ''
      , bl = '\n';

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , arrayStr = ''
        //, valueStr = ''
        , objSize = 0;
        //, tableName = 'table';

      output += 'array(';

      for (var key in obj) {
        var keyStr = key
          , value = obj[key]
          , keyType = ''
          , quote = ''
          , keySplit = key.split(':');

        if (keySplit.length == 2 && key.split('\\:').length != 2) {
          keyStr = keySplit[0];
          keyType = keySplit[1].toLowerCase();
          if (keyType == 'num' || keyType == 'number') {
            value = isNaN(value)? 0:parseFloat(value);
            if (isNaN(value)) {
              value = 0;
            }
          }
          if ((keyType == 'const' || keyType == 'constant') && value.length == 0) {
            value = 'UNDEFINED';
          }
        }

        quote = getQuote(keyType, value);

        if (key.split('\\:').length == 2) {
          keyStr = keyStr.replace("\\" , '');
        }

        objSize++;


        arrayStr += '\'' + keyStr + '\'' + ' => ' + quote + value + quote + ', ';


        /*
        columnStr += keyStr;
        valueStr += quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          columnStr += ', ';
          valueStr += ', ';
        }
        */

      }

      output += arrayStr + ')';

      if (i != (list.length - 1)) {
        output += bl;
      }
    }

    return output;
  }


  function toJson(list) {

  }





  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = tsvert;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return tsvert; });
  } else {
    this.tsvert = tsvert;
  }

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
