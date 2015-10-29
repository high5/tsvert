# tsvert

> tsv converter

## Install

```
npm install marked --save
```


## header type

header type correspondence table

num(number), const(constant), str(string), flex(flexible)

||num|const|str|flex|
|:-|:-:|:-:|:-:|:-:|



## options

Option correspondence table


||html|indent|header|useRowNumberKey|sqlBulkInsert|sqlTableName|rubySymbolKey|
|:-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|SQL|〇|〇|〇|×|〇|〇|×|
|JSON|〇|〇|〇|〇|×|×|×|
|PHP|〇|〇|〇|〇|×|×|×|
|Python|〇|〇|〇|〇|×|×|×|
|Ruby|〇|〇|〇|〇|×|×|〇|

## Usage

```js
var tsvert = require('tsvert');
marked.setOptions({
  indent: true
});

console.log(tsvert(tsv, 'sql'));
```

### Browser
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>tsvert in the browser</title>
  <script src="lib/tsvert.js"></script>
</head>
<body>
  <div id="content"></div>
  <script>
    document.getElementById('content').innerHTML =
      tsvert(tsv, 'sql');
  </script>
</body>
</html>
```

## Running Test

```
node test
```


## draft

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell


| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |



| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |


| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |





