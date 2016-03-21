#面向对象
#####作者：cwl
#####时间：2016-3-10
**主题：面向对象的三大特点之一封装**

面向对象就是对一些属性、方法的隐藏和暴露
比如私有属性，私有方法，共有属性，共有方法，保护方法等。

***

封装原则：

1. 将不需要对外提供的内容都隐藏起来；

2. 把属性都隐藏，提供公共方法对其访问。

好处：

1. 将变化隔离 
 
2. 便于使用；

3. 提高复用性

4. 提高安全性
```javascript
var Book = function(id,name,price){
// 私有属性
  var num = 1;
  var name = 'js';
  function checkId() {};
  // 特权方法
  this.getName = function(){
    console.log(name);
  };
  this.getPrice = function(){};
  this.setName = function(){};
  this.setPrice = function(){};
  
  // 公有属性
  this.id = id;
  // 公有方法
  this.copy = function(){};
  this.setName(name);
  this.setPrice(price);
}
// 静态公有属性和方法，通过类函数添加的属性和方法实例化对象是不能访问的，只能通过类名访问
Book.isChinese = true;
Book.resetTime = function(){
  console.log("new Time");
}
Book.prototype = {
  isJSBook: true,
  read: function(){
    console.log("读书");
  }
}
var book = new Book(11,"javascript pattern",50);
console.log(book.num); // 私有属性没有通过特权方法没办法访问，结果：undefined
book.getName(); // 虽然不能直接通过对象直接访问私有属性，但是可以通过对象里面的特权方法进行访问，结果：js
console.log(book.id); // 11
console.log(book.isJSBook); // 可以直接调用原型方法， true
Book.resetTime(); // 直接通过类名调用，"new Time"
```



**闭包实现**

有时，我们将类的静态变量通过闭包来实现
```javascript
var Book = (function(){
  // 静态私有变量
  var bookNum = 0;
  // 静态私有方法
  function checkBook(name){}
  
  // 创建类
  function book(newid, newname,newprice) {
    // 私有变量
    var name, price;
    // 私有方法
    function checkID(id) {}
    // 特权方法
    this.getName = function(){};
    this.getPrice = function(){};
    this.setName = function(){};
    this.setPrice = function(){};
    // 公有属性
    this.id = newid;
    // 公有方法
    this.copy = function(){
      console.log("bookNum的值为："+ bookNum);
    };
    bookNum ++;
    if(bookNum > 100) {
      throw new Error("我们仅仅出版一百本书");
    }
    // 构造器
    this.setName(name);
    this.setPrice(price);
  }
  
  // 构建原型
  book.prototype = {
    // 静态公有属性
    isJSBook: true,
    // 静态公有方法
    display: function(){
      console.log("图书展示");
    }
  };
  // 返回类
  return book;
  
})();

var book = new Book(1,"JavaScript设计模式",46);
book.display(); // 结果图书展示
// console.log(book);
book.copy();
```
  注：闭包是有权访问其外层函数作用域中变量的函数，即在一个函数内部创建另外一个函数。
  我们将这个闭包作为创建对象的构造函数，这样它既是闭包，又是可实例化对象的函数，
  这样实例化出来的对象就可通过闭包函数访问类函数作用域中的变量，如 bookNum这个变量。




**创建对象安全模式**

我们在创建对象的时候可能会忘了使用new关键字，如下
```javascript
var Book = function(title){
  this.title = title;
}
var book = Book("javascript");// 没有通过new关键字来实例化
console.log(book); // 这边得到的结果将是 undefined
console.log(window.title); // 结果 JavaScript 
```

说明了我们传入的参数被添加到了window全局对象上面去了

**new关键字做了什么**

  在JavaScript中，使用new关键字后，意味着做了如下四件事情：

  1、创建一个新的对象，这个对象的类型是object；构造函数里面的this将会指向实例化出来的对象，如果没有这个对象，这构造函数里面的this就会指向全局对象window

  2、设置这个新的对象的内部、可访问性和[[prototype]]属性为构造函数（指prototype.construtor所指向的构造函数）中设置的；

  3、执行构造函数，当this关键字被提及的时候，将函数的方法和属性复制一份添加到实例化对象上面。

  4、返回新创建的对象（除非构造方法中返回的是‘无原型’）。

**注：则每次实例化一个对象，就会对应的给这个属性或者方法创造一个内存空间，所以使用 new关键字会有比较大的成本，如果将一些公用的方法和属性放在this上面，则会造成不必要的浪费，也缺乏效率。因此我们会将一些公用的方法和属性添加到函数对象的prototype属性上面去，这样每个实例化对象都可以公用，不用再为每个对象开辟一个内存空间**

为了防止因漏掉new关键字而造成程序问题，可使用如下安全模式：
```javascript
var Book = function(title){
  // 首先判断一下this是不是Book的实例化对象，如果有通过new实例化的，this就会指向实例化对象，该条件就会成立，并向下执行
  if(this instanceof Book) {
    this.title = title;
  }
  // 如果this不是Book的实例化对象，则先实例化。
  else {
    return new Book(title);
  }
}
var book = Book("javascript");// 没有通过new关键字来实例化
console.log(book.title); // 结果 JavaScript
```

通过以上的方法，就可以避免没有写new关键字所造成的问题了。