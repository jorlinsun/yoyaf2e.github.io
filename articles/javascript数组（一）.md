##javascript数组一##
> www.w3cplus.com--javascript学习笔记：数组（一）

**数组简介**

数组(Array)简单的理解就是按次序排列的一组值。每个值的位置都有自己的编号，而且这个编号是从0开始。例如：
```javascript
var arr = [1,"字符串",[2,4]] // 这就是一个简单的数组
```
JavaScript的数组的每一项可以保存任何类型的数据。也就是说，在数组的第一个位置可以保存字符串，第二个位置可以保存数值，第三个位置保存对象，依此类推。比如：
```javascript
var arr = [35, "大漠", new Date(), function(){}, , null];
```
上面这个数组中依次存放了数值、字符串、对象、函数、undefined(空值)和null。
**创建数组**

有两种方式：

1、使用Array构造函数来创建，创建代码如下：
```javascript
var arr = new Array(); // 创建空数组
console.log(arr1.length); // 0
var arr2 = new Array(5); // 创建长度为5的数组
console.log(arr2.length); // 5
var arr = new Array('a', 'b', 'c'); // 直接传入数组内容
```
从上面几个简单的示例，我们可以得知，通过Array构造函数创建数组，我们可以：
创建一个空数组： new Array()
创建一定数量的数组： new Array(5)
创建指定数组项目的数组： new Array('a','b','c')

需要注意的是，当只给new Array()传递一个值创建数组时，问题会变得比较复杂。如果传递的是一个数值，则会按该数值创建包含给定项数的数组；如果传递的是其它类型的参数时，则会创建包含那个值的只有一项的数组。来看个简单的示例：
```javascript
var arr1 = new Array(3); // 创建一个包含3项的数组
var arr2 = new Array('3'); // 创建一个包含1项的数组，该项的值为字符串"3"

console.log(arr1); //[undefined × 3]
console.log(arr2); // ["3"]
console.log(arr1.length); // 3
console.log(arr2.length); // 1
```

在实际生产中，使用Array构造函数创建数组时，还可以省略new操作符。如：
```javascript
var arr1 = Array('china');  // "china" arr1.length=1
var arr2 = new Array('china'); // "china" arr2.length=1
```
2、使用[]创建数组
    除了使用Array构造函数创建数组之外，还可以直接使用[]（数组字面量表示法）创建数组。
    采用这种方式创建数组时，数组的每个数组项之间以逗号(,)分隔开，如下所示：
```javascript
var arr1 = ['a','b']; //创建一个包含两个字符串的数组
var arr2 = []; //创建一个空数组
```
通过索引访问数组，索引从0开始：

```javascript
var colors = ['blue','red','green']; //创建了一个字符串数组
console.log(colors[0]); // output: "blue"
console.log(colors[1]); // output: "red"
console.log(colors[2]); // output: "green"
```
通过索引修改数组：
```javascript
var arr = ['a','b']; //创建了一个字符串数组
arr[0] = 'a'; //访问组数中的第一个数组项
arr[2] = 'c'; //给数组添加一个新的数组项
arr[1] = 'abc'; //将数组的第二个数组项`b`修改为`abc`
```
数组的length属性,数组的length属性主要用来保存数组的项目数（也就是数组的成员数量）。这个属性始终会返回0或更大的值，如下面的示列：

```javascript
[].length; //0
["red","blue","green"].length; //3
```
length属性是可写的，如果人为设置一个小于当前成员个数的值，该数值的成员会自动减少到length设置的值。
```javascript
var arr = ['a','b','c'];
arr.length; // 3
arr.length = 2;
arr[2]; // undefined
arr // ['a','b']
```
上面的代码表示，当数组的length值为2时（即最大的整数键只能是1（也就是length-1））。那么arr[2]的值c就已经不在该数组中了，也就是说被自动删除了。我们再访问arr[2]时就会显示为undefined。
反之，如查将数组length属性值设置为大于数组项数的值，则新增的每一项都会取得undefined的值。如下面这样的示例：

```javascript
var arr = ['a','b','c']; //定义了一个包含三个项目的数组
arr.length; // 3
arr.length = 4; //设置数组arr的length值为4
arr[3]; //undefined 
```