# tsvert
「tsvert 」はタブ区切りテキストを様々なデータ形式に変換するために書かれた小さなライブラリです。
JavaScriptで書かれていて サーバー(node.js)、クライアント(ブラウザ)の両方で使用することが可能です。
変換できるにデータにはsqlのインサート文やjsonやphp, ruby, pythonなどの連想配列に対応しています。

## 一例（Just one example）
例えば次のような、エクセルからコピーしたタブ区切りのテキストデータがあったとしましょう。

data.tsv
```
id	name	type	price
1001	egg	food	200
1002	hook	dvd	999
1003	hammer	tool	300
1004	すし	食べ物	900
```
※1行目のヘッダーは各行データのキーを指定したものです。　

tsvertを使い,jsonを指定すれば、tsvデータをjsonに変換することが可能です。

```JavaScript
var fs = require('fs')
  , tsvert = require('tsvert');
var tsv = fs.readFileSync('data.tsv', 'utf8');

tsvert.setOptions({
  "indent":true  
});

var json = tsvert(tsv, 'json');
console.log(json);
```
上記のスクリプトでえられる結果は以下のとおりです。
```JavaScript
[
  {
		"id": 1001,
    "name": "egg",
    "type": "food",
    "price": 200
  },
  {
		"id": 1002,
    "name": "hook",
    "type": "dvd",
    "price": 999
  },
  {
		"id": 1003,
		"name": "hammer",
		"type": "tool",
		"price": 300
  },
  {
		"id": 1004,
		"name": "すし",
		"type": "食べ物",
		"price": 999
  }
];
```

## インストール
インストールにはnpmを使います。
```
npm install --save　tsvert
```

## オプションの指定
「tsvert」 はいくつかのオプションを指定することができます。
「tsvert」のオプションのデフォルト設定は以下のようになってます。

```JavaScript
tsvert.defaults = {
  html: false,
  indent: false,
  sqlBulkInsert: false,
  sqlTableName: '',
  rubySymbolKey: true,
  useRowNumberKey: false,
  header: ''
};
```

それぞれのオプションについて解説します。

### html
html オプションはブラウザでの出力時に改行して表示されるようにするためのオプションで改行コードに"\n"を用いずに"<br>"を用います。
デフォルトで falseになっています。

### indent
indent オプションは対象のデータをより深い層までインデントして出力します。

indent オプションはデフォルトの状態でfalseとなっており、通常は次のように表示されます。
```JavaScript
[
  {"id": 1001, "name": "egg", "type": "food", "price": 200},
  {"id": 1002, "name": "hook", "type": "dvd", "price": 999}
];
```
indent オプションをtrueにすると、次のように出力されます。
```JavaScript
[
  {
		"id": 1001,
    "name": "egg",
    "type": "food",
    "price": 200
  },
  {
		"id": 1002,
    "name": "hook",
    "type": "dvd",
    "price": 999
  }
];
```

### sqlBulkInsert
sqlBulkInsert オプションはsql insert文を bulk insert形式にして一つのsql文にまとめて出力するためのオプションです。
sqlでしか使うことができません。
デフォルトでfalseになっています。

デフォルトの状態では次のようなsql文が出力されます。
```sql
INSERT INTO table(id, name, type, price) VALUES(1001, 'egg', 'food', 200);
INSERT INTO table(id, name, type, price) VALUES(1002, 'hook', 'dvd', 999);
```
sqlBulkInsert オプションをtrueにすると次のようなsql文が出力されます。

```sql
INSERT INTO table(id, name, type, price) VALUES(1001, 'egg', 'food', 200)
,(header1, header2, header3, header4, header5, header6:str) VALUES(8882, 8882, 8882, '8882', 8882, 8882);
```






























## 使い方


sample (data.tsv)
```
header1	header2:num	header3:const	header4:str	header5:flex	header6\:str
0	0	0	0	0	0
8882	8882	8882	8882	8882	8882
```


簡単な使い方

```JavaScript
var fs = require('fs')
  , tsvert = require('tsvert');

var tsv = fs.readFileSync('data.tsv', 'utf8');
console.log(tsvert(tsv, 'sql'));
// Outputs:
// INSERT INTO table(header1, header2, header3, header4, header5, header6:str) VALUES(0, 0, 0, '0', 0, 0);
// INSERT INTO table(header1, header2, header3, header4, header5, header6:str) VALUES(8882, 8882, 8882, '8882', 8882, 8882);
```

オプション設定を使った例
```JavaScript
var fs = require('fs')
  , tsvert = require('tsvert');

var tsv = fs.readFileSync('data.tsv', 'utf8');
tsvert.setOptions({
  "sqlBulkInsert":true  
});
console.log(tsvert(tsv, 'sql'))

// Outputs:
// INSERT INTO table(header1, header2, header3, header4, header5, header6:str) VALUES(0, 0, 0, '0', 0, 0)
// ,(header1, header2, header3, header4, header5, header6:str) VALUES(8882, 8882, 8882, '8882', 8882, 8882)

```

## ブラウザ










## タイプの指定


## オプションの指定





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
