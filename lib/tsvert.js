/**
 * tsvert - a tsv converter
 * Copyright (c) high5. (MIT Licensed)
 * https://github.com/high5/tsvert
 */

;(function() {

  /**
   * Options
   */
  tsvert.options =
  tsvert.setOptions = function(opt) {
    if (Object.keys(tsvert.initials) == 0) {
      merge(tsvert.initials, tsvert.defaults);
    }
    merge(tsvert.defaults, opt);
    return tsvert;
  };

  tsvert.initializeOptions = function() {
    merge(tsvert.defaults, tsvert.initials);
    return tsvert;
  };

  tsvert.initials = {};

  tsvert.defaults = {
    html: false,
    indent: false,
    sqlBulkInsert: false,
    sqlTableName: '',
    rubySymbolKey: true,
    useRowNumberKey: false,
    header: ''
  };

  function merge(obj) {
    var i = 1
      , target
      , key;

    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }


  function sanitize(str)
  {
     var character = {
        '&' : '&amp;',
        '<' : '&lt;' ,
        '>' : '&gt;' ,
        '"': '&quot;'
     };

     return str.replace(/[&<>"]/g, function(chr) {
        return character[chr];
     });
  };


  /**
   * tsvert
   */
  function tsvert(tsv, type) {
    var opt = merge({}, tsvert.defaults, opt || {});

    if (opt.header != '') {
      tsv = opt.header + '\n' + tsv;
    }

    var lines = tsv.replace(/\r/g, "").split("\n")
      , list = []
      , output = ''
      , headers = lines[0].split("\t");


    for(var i = 1; i < lines.length; i++){

      var obj = {};
      var currentline = lines[i].split("\t");

      if (currentline == '') {
        continue;
      }

      for(var j = 0; j < headers.length; j++){
        if (opt.html == false) {
          obj[headers[j]] = currentline[j];
        } else {
          obj[sanitize(headers[j])] = sanitize(currentline[j]);
        }
      }

      list.push(obj);
    }

    switch(type) {
      case 'sql':
        output = toSql(list, opt);
        break;
      case 'json':
        output = toJson(list, opt);
        break;
      case 'php':
        output = toPhp(list, opt);
        break;
      case 'python':
        output = toPython(list, opt);
        break;
      case 'ruby':
        output = toRuby(list, opt);
        break;
      default:
        break;
    }

    return output;
  }

  function getQuote(keyType, value) {
    var quote = isNaN(value) ? '\'':''
      , lowerValue = '';

    if (typeof(value) == 'string' && value.length == 0) {
      quote = '\'';
    } else if (keyType == 'const' || keyType == 'constant') {
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

  function toSql(list, opt) {
    var output = ''
      , bl = (opt.html === true)? '<br>':'\n'
      , tableName = (opt.sqlTableName === '')? 'table':opt.sqlTableName;


    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , columnStr = ''
        , valueStr = ''
        , objSize = 0;


      output += (opt.sqlBulkInsert === true && i !== 0)? ',':'INSERT INTO ' + tableName;

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

      if (opt.sqlBulkInsert === true) {

        if (i > 0) {
            output += '(' + valueStr + ')';
        } else {
            output += '(' + columnStr + ') VALUES(' + valueStr + ')';
        }

        if (i == (list.length - 1)) {
          output += ';';
        }
      } else {
        output += '(' + columnStr + ') VALUES(' + valueStr + ')';
        output += ';';
      }

      if (i != (list.length - 1)) {
        output += bl;
      }

    }

    return output;
  }

  function toJson(list, opt) {
    var output = ''
      , bl = (opt.html === true)? '<br>':'\n';

    output += '[' + bl;

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , arrayStr = ''
        , objSize = 0;

      if (opt.useRowNumberKey === true) {
        output += '  "' + (i + 1) + '": {';
      } else {
        output += '  {';
      }

      if (opt.indent === true) {
        arrayStr += bl;
      }

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

        if (quote != '') {
          quote = '"';
        }

        if (key.split('\\:').length == 2) {
          keyStr = keyStr.replace("\\" , '');
        }

        objSize++;


        if (opt.indent === true) {
          arrayStr += '    ';
        }

        arrayStr += '"' + keyStr + '"' + ': ' + quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          if (opt.indent != true) {
            arrayStr += ', ';
          } else {
            arrayStr += ',';
          }
        }

        if (opt.indent === true) {
          arrayStr += bl;
        }

      }

      if (opt.indent === true) {
        output += arrayStr + '  }';
      } else {
        output += arrayStr + '}';
      }

      if (i != (list.length - 1)) {
        output += ',';
      }

      output += bl;
    }

    output += '];';

    return output;

  }


  function toPhp(list, opt) {
    var output = ''
      , bl = (opt.html === true)? '<br>':'\n';

    output += 'array(' + bl;

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , arrayStr = ''
        , objSize = 0;


      if (opt.useRowNumberKey === true) {
        output += '  ' + (i + 1) + ' => array(';
      } else {
        output += '  array(';
      }


      if (opt.indent === true) {
        arrayStr += bl;
      }

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


        if (opt.indent === true) {
          arrayStr += '    ';
        }

        arrayStr += '\'' + keyStr + '\'' + ' => ' + quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          if (opt.indent != true) {
            arrayStr += ', ';
          } else {
            arrayStr += ',';
          }
        }

        if (opt.indent === true) {
          arrayStr += bl;
        }

      }

      if (opt.indent === true) {
        output += arrayStr + '  )';
      } else {
        output += arrayStr + ')';
      }

      if (i != (list.length - 1)) {
        output += ',';
      }

      output += bl;
    }

    output += ');';

    return output;
  }


  function toPython(list, opt) {
    var output = ''
      , bl = (opt.html === true)? '<br>':'\n';

    //output += '[' + bl;


    if (opt.useRowNumberKey === true) {
      output += '{' + bl;
    } else {
      output += '[' + bl;
    }

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , arrayStr = ''
        , objSize = 0;


      //output += '  {';
      if (opt.useRowNumberKey === true) {
        output += '  ' + (i + 1) + ': {';
      } else {
        output += '  {';
      }

      if (opt.indent === true) {
        arrayStr += bl;
      }

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

        if (quote != '') {
          quote = '"';
        }

        if (key.split('\\:').length == 2) {
          keyStr = keyStr.replace("\\" , '');
        }

        objSize++;


        if (opt.indent === true) {
          arrayStr += '    ';
        }


        var hashKey = '"' + keyStr + '"';

        arrayStr += hashKey + ': ' + quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          if (opt.indent != true) {
            arrayStr += ', ';
          } else {
            arrayStr += ',';
          }
        }

        if (opt.indent === true) {
          arrayStr += bl;
        }

      }

      if (opt.indent === true) {
        output += arrayStr + '  }';
      } else {
        output += arrayStr + '}';
      }

      if (i != (list.length - 1)) {
        output += ',';
      }

      output += bl;
    }

    if (opt.useRowNumberKey === true) {
      output += '}';
    } else {
      output += ']';
    }

    return output;

  }


  function toRuby(list, opt) {
    var output = ''
      , bl = (opt.html === true)? '<br>':'\n';

    //output += '[' + bl;


    if (opt.useRowNumberKey === true) {
      output += '{' + bl;
    } else {
      output += '[' + bl;
    }

    for(var i = 0; i < list.length; i++) {
      var obj = list[i]
        , arrayStr = ''
        , objSize = 0;


      //output += '  {';
      if (opt.useRowNumberKey === true) {
        output += '  ' + (i + 1) + ' => {';
      } else {
        output += '  {';
      }

      if (opt.indent === true) {
        arrayStr += bl;
      }

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

        if (quote != '') {
          quote = '"';
        }

        if (key.split('\\:').length == 2) {
          keyStr = keyStr.replace("\\" , '');
        }

        objSize++;


        if (opt.indent === true) {
          arrayStr += '    ';
        }


        var hashKey = (opt.rubySymbolKey)? ':' + keyStr:'"' + keyStr + '"';

        arrayStr += hashKey + ' => ' + quote + value + quote;

        if (objSize != Object.keys(obj).length) {
          if (opt.indent != true) {
            arrayStr += ', ';
          } else {
            arrayStr += ',';
          }
        }

        if (opt.indent === true) {
          arrayStr += bl;
        }

      }

      if (opt.indent === true) {
        output += arrayStr + '  }';
      } else {
        output += arrayStr + '}';
      }

      if (i != (list.length - 1)) {
        output += ',';
      }

      output += bl;
    }

    if (opt.useRowNumberKey === true) {
      output += '}';
    } else {
      output += ']';
    }

    return output;

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
