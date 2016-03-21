#面向对象三大特性之一--继承
作者：cwl

时间：2016-3-16

**在说继承之前，先了解一下原型链、数据属性、call和apply**
JavaScript 每个对象都有一个它的prototype属性，这个属性是一个对象，这个对

象里面有一个原型，这个原型指向其父级对象的prototype属性，直到其父级达到

Object，Object的原型指向null，这就是原型链的末端。
```javascript
    function Foo(){
        this.x = 1;
        this.y = 2;
    };
    Foo.prototype = {
        z: 3,
        get: function(){
            console.log(this.y);
        }
    }
    var foo = new Foo();
    console.log(foo.x);
```
如上：foo的原型就指向Foo.prototype，Foo的原型就指向Object.prototype，Object的原型就指向null。
```javascript
function Foo(){}
Foo.prototype.z = 3;
Object.prototype.a = 4;


var foo = new Foo();
foo.x = 1;
foo.y = 2;

console.log(foo);

console.log(foo.hasOwnProperty('z')); // 返回 false，说明z这个属性不是foo这个对象上的属性

console.log("z" in foo); // true  使用in关键字会将对象原型链上面的属性都遍历出来，
//这边z虽然不是foo对象上面的，但是是foo构造函数的原型上面的所以这边可以找得到z属性
console.log(foo instanceof Object); // true  说明foo是Object的实例
console.log(foo.a); // 所以这里可以调用属性a，虽然a不在foo这个对象上面
// 遍历原型链上的所有属性，结果x,y,z,a
for(g in foo) {
  console.log(g)
}

// 为对象添加z属性，看看啥子情况
foo.z = "给foo的z属性";
console.log(foo.z); // 输出："给foo的z属性"，在看看z是不是foo对象的属性
console.log(foo.hasOwnProperty('z')); // 输出：true, z是对象foo本身的属性，而不是拿其函数对象Foo原型上的
console.log(Foo.prototype.z); // 输出：3， 函数对象上面的z属性还是原封不动的存在，
// 以上说明：如果查找一个对象上面的属性，如果这个对象上面有这个属性，则会直接返回，
// 而不会往下继续查找，如果在改对象上面找不到，这会沿着原型链向下查找

// 接下来，我们试着修改一下属性
foo.z = undefined;
console.log(foo.z); // 输出：undefined，直接给属性赋值的话，即使是undefined，
// 这个内存空间还是存在的，不管里面的值是什么，都不会往下继续查找
delete foo.z; // 使用delete关键字删除foo对象上面的属性，在输出看一下
console.log(foo.z) // 输出：3， 说明这个是找到了函数对象上面的z属性了，
//foo对象上面的属性已经被删除了。故可以用delete关键字来删除对象上面不必要的属性


```



  Objet.create();这个要IE8及上的版本才支持，这个是一种新的对象创建方式
  第一个参数是作为创建出来对象的原型,可以是null
  第二个参数是对象的属性描述符，这个参数可选

  数据有以下几个属性：默认都是false
  writable：是否可写
  configurable：是否能够被删除，是否能够被修改
  enumerable：是否能够被for in枚举
  value：值
```javascript
var obj = {
  a: function(){
    console.log(1)
  },
  b: function(){
    console.log(2)
  },
  c: function(){
    console.log(3)
  }
}

var newObj = {};
newObj = Object.create(obj,{
  x: {
    value: '第一个参数x',
    writable: true,
    configurable: true
  },
  y: {
    value: '第二个参数y',
    enumerable: true,
  }
})
// 结果y,a,b,c  由于x没有设置enumerable，所以默认为false，故for in 结果中没有x属性
for(i in newObj) {
  console.log(i);
}
console.log(newObj.y);

// 这些特性不能直接被访问，要修改属性的特性只能通过Object.defineProperty( )方法，
// 该方法包含三个参数：属性所在的对象，属性的名字（需要加引号），描述符对象
Object.defineProperty(newObj,'x',{
  value: 'x的属性被修改了',
  enumerable: true
})
for(i in newObj) {
  console.log(i); // 输出：x,y,a,b,c
}
console.log(newObj.x);// 输出："x的属性被修改了"
```
调用Object.defineProperty( )方法时，如果不显示指定configurable，enumerable，writable的值，就默认为false。另外需要注意的是当configurable设置为false后无法再将其改为true，且除了writable之外，无法修改其它特性。

**使用Object.create()实现继承**
```javascript
    // 使用Object.create()实现继承
        var parentObj = {
            name: "parentName",
            age: "18",
            getName: function() {
                return this.name;
            }
        }
        //  将parentObj作为childObj的原型
        var childObj = Object.create(parentObj,{
            // 定义属于childObj的属性与方法
            name: {
                value: "yby"
            },
            age: {
                value: "17"
            }
        });
        console.log(childObj.name); // 结果：yby
        console.log(childObj.age); // 结果：17
        console.log(childObj.getName()); // 结果：yby
```

**call 和apply用法**
call用法：a.call(b,argq,arg2)，这个意思是将a对象的方法应用到b对象上面去，例如：
```javascript
    function a(x,y) {
        console.log(x + y);
    }
    function b(x,y) {
        console.log(x)
    }
    a.call(b,1,2); // 结果：3
```
call可以改变this指向：
```javascript
    function Animal() {
            this.name = "animal";
            this.showName = function(){
                console.log(this.name);
            }
        }
        function Cat() {
            this.name = "cat";
        }
        var animal = new Animal();
        var cat = new Cat();

        // 动物有个显示姓名的方法，可以直接调用
        animal.showName(); // 结果：animal
        // Cat这个对象没有显示姓名的方法，但是cat也想显示一下自己的名字，
        // 好让别人认识认识啊，咋办呢，用以下的方法即可
        animal.showName.call(cat); // 将animal的showName给cat对象使用，
        // 不过这边的showName中的this已经变成了cat了，而不是之前的animal，所以
        // 这边的this.name就是cat。结果：cat
```
**使用call实现继承**
```javascript
    function Animal(name) {
        this.name = name;
        this.showName = function(){
            console.log(this.name);
        }
    }
    function Cat(name) {
        // 将Animal对象上面的所有方法和属性都应用到Cat对象上面去
        // 也就是Cat继承了Animal所有的属性和方法
        Animal.call(this,name);
    }
    
    var cat = new Cat("这里有只猫");
    cat.showName(); // 这里的showName是从Animal继承过来的。结果：这里有只猫
    console.log(cat); // 输出cat对象可以看到它有name属性和showName方法
```
apply和call的用法只有一个地方不一样，除此之外，其他地方基本一模一样
**call的调用方式：a.call(b,arg1,arg2…)**
**apply的调用方式： a.apply(b,[arg1,arg2])**
apply(b,[arg1,arg2]) //apply只有2个参数，它将call的参数（arg1,arg2…）放在一个数组中作为apply的第二参数

**1、类式继承**

```javascript
    // 定义父类
        function SuperClass() {
            this.superName = "superClass";
        }
        // 给父类添加共用方法
        SuperClass.prototype.getSuperName = function(){
            return this.superName;
        }

        // 子类出场
        function SubClass() {
            this.subName = "我是子类";
        }
        // 子类继承父类
        SubClass.prototype = new SuperClass();
        // 子类也有自己的共用方法
        SubClass.prototype.getSubName = function(){
            return this.subName;
        }

        /*
            类的原型对象的作用就是为类的原型添加共用属性和方法，但是类不能直接访问这些属性和方法，必须通过prototype来访问。
            当使用new关键字创建一个对象的时候，新创建的对象复制了父类构造函数的属性和方法，这边就是将name属性复制过去。
            同时也会为这个新对象添加一个prototype属性，这个属性里面的_proto_原型会指向SuperClass.prototype这样就有一个原型链
            所以新创建出来的这个对象能够访问SuperClass.prototype上的属性和方法。
            将new出来的这个对象赋值给SubClass，那么SubClass.ptototype里面的_proto_指针也会指向SuperClass.prototype。
            因此SubClass实例化出来的对象的原型_proto_会指向SuperClass.prototype
        */ 
        // 如上所说的：instance的原型->SubClass.ptototype->SuperClass.prototype->Object.prototype->null
        var instance = new SubClass();
        // 通过instanceof 来检测某个对象是否是某个类的实例
        console.log(instance instanceof SubClass); // true
        console.log(instance instanceof SuperClass); // true
        console.log(instance instanceof Object); // true

        // 但是SubClass不是SuperClass的实例
        console.log(SubClass instanceof SuperClass); // false
        // SubClass.prototype才是SuperClass的实例，因为是这样的SubClass.prototype = new SuperClass();
        console.log(SubClass.prototype instanceof SuperClass); // true

        console.log(instance.getSubName()); // 我是子类
        console.log(instance.getSuperName()); // superClass

        // 类式继承有两个问题
        /* 
            1、如果是有多个实例化对象,如果一个子类更改了从父类构造函数中继承而来的共有属性，
            则会影响到其他的子类
        */
        var instance2 = new SubClass();
        console.log(instance2.infos); // ["2年", "1班"]
        // 这边修改了instence会影响下面的instence2
        instance.infos.push("霞南中学");
        console.log(instance2.infos); // ["2年", "1班", "霞南中学"]
        // 2、无妨想父类传递参数，因此在实例化父类的时候也无妨对父类沟站函数内的属性进行初始化
```

**2、构造函数继承**

```javascript
    function SuperClass(name) {
            this.name = name;
            this.infos = ["2年","1班"]
        }
        // 给父类添加共用方法
        SuperClass.prototype.getSuperName = function(){
            console.log(this.name);
        }

        // 子类出场
        function SubClass(name) {
            // 通过call继承父类
            SuperClass.call(this,name)
        }
        // 创建一个实例
        var instance1 = new SubClass("实例一");
        var instance2 = new SubClass("实例二");
        instance1.infos.push("霞南中学");
        console.log(instance1.infos); // ["2年", "1班", "霞南中学"]
        console.log(instance1.name); // 实例一
        console.log(instance2.infos); // ["2年", "1班"]
        console.log(instance2.name); // 实例二
        instance1.getSuperName(); // TypeError

        /*
            构造函数继承没有涉及到原型prototype，所以父类的原型方法不会被子类继承。
            如果想要被继承，需要用this.的方式放在构造函数中，但是这样创建出来的每个实例，
            都会单独拥有一份属性，而不能公用，这就违背了代码复用的原则。
        */ 
```

**3、组合模式：将以上两个组合在一起咯**
```javascript
     function SuperClass(name) {
            this.name = name;
            this.infos = ["2年","1班"]
        }
        // 给父类添加共用方法
        SuperClass.prototype.getName = function(){
            console.log(this.name);
        }
        // 子类出场
        function SubClass(name) {
            // 通过call继承父类
            SuperClass.call(this,name);
        }
        SubClass.prototype = new SuperClass();

        var instance1 = new SubClass("实例一");
        instance1.infos.push("霞南中学");
        console.log(instance1.name); // 实例一
        console.log(instance1.infos); // ["2年", "1班", "霞南中学"]
        instance1.getName(); // 实例一


        var instance2 = new SubClass("实例二");
        console.log(instance2.name); // 实例二
        console.log(instance2.infos); // ["2年", "1班"]
        instance2.getName();//实例二
```

这个写法还是不够完美哦，因为我们在使用构造函数继承的时候也就是通过call关键字继承会执行一遍父类的构造函数。在使用类式继承也就是var instance1 = new SubClass("实例一");这一句的时候也会去执行一遍父类的构造函数。这就执行了两次父类的构造函数了

**4、原型式继承**

```javascript
    // 对类式进行封装
    function inheritObj(o) {
            function F(){};
            // 将F对象的原型指向传入的参数对象o
            F.prototype = o;
            // 返回F对象的实例
            return new F();
        }
        /*
            好吧，这种创建方式就跟类式继承差不多了，故而类式继承中的问题这里也会出现
        */
        // 被继承对象
        var Book = {
            name: "js",
            alikeBook: ["css","html"],
        }
        // newBook->F.prototype(Book)
        var newBook = inheritObj(Book);
        newBook.name = "java";
        newBook.alikeBook.push("java");
        console.log(newBook.alikeBook); // ["css", "html", "java"]

        var otherBook = inheritObj(Book);
        otherBook.name = "asp.net";
        otherBook.alikeBook.push("asp.net");
        console.log(newBook.alikeBook); // ["css", "html", "java", "asp.net"]

        // 以上两个结果说明父类的属性被修改会影响到其他的实例对象
```

    使用过度类F的好处就是：这个过度类的构造函数是空的，所以开销比较小。

**5、寄生式继承**
```javascript
    function inheritObj(o) {
            function F(){};
            // 将F对象的原型指向传入的参数对象o
            F.prototype = o;
            // 返回F对象的实例
            return new F();
        }
        var Book = {
            name: "js",
            alikeBook: ["css","html"],
        }
        // 这个是对inheritObj返回的对象进行二次封装，也就是返回扩展后的对象
        function createBook(obj) {
            // 这里进行一次封装返回一个对象
            var o = inheritObj(obj);
            // 对返回的一个对象进行扩展
            o.getName = function(){
                console.log(this.name);
            }
            return o;
        }

        var book = createBook(Book);
        console.log(book); 
        book.getName(); // js
        /*
            寄生式就是对原型继承的二次封装，也就是对第一次封装返回的对象进行扩展而得到一个新的对象，
            它即继承了父类中的属性和方法，而且还可以添加属于自己的方法和属性
        */
```
**6、寄生组合式继承**

```javascript
        // 发现这一个函数的目的就一个：减少开销
        function inheritObj(o) {
            function F(){};
            // 将F对象的原型指向传入的参数对象o。这里是将F作为一个过渡对象出现，
            F.prototype = o;
            // 返回F对象的实例
            return new F();
        }
        
        // 这个函数的目的也就一个：更改构造器指向
        function inheritPrototype(subClass, superClass) {
            var p = inheritObj(superClass.prototype);
            console.log(p);
            // p.constructor = subClass;
            subClass.prototype = p;
        }

        // 定义父类
        function SuperClass(name) {
            this.name = name;
            this.colors = ["red", "blue"];
        }
        SuperClass.prototype.getName = function(){
            console.log(this.name);
        }

        // 定义子类
        function SubClass(name, time){
            // 构造函数式继承
            SuperClass.call(this,name);
            // 子类新增属性
            this.time = time;
        }

        // 寄生式继承父类原型
        inheritPrototype(SubClass, SuperClass);

        // 子类新增原型方法
        SubClass.prototype.getTime = function(){
            console.log(this.time);
        }

        // 创建两个实例
        var instance1 = new SubClass("js", 2016);
        var instance2 = new SubClass("css", 2015);

        instance1.colors.push("green");
        console.log(instance1.colors);
        console.log(instance1.name);
        console.log(instance2.colors);
        console.log(instance2.name);
```

**8、多态**
```javascript
    function Count(){
            function zero() {
                // 默认为0
                return 0;
            }
            function one(num){
                return num;
            }
            function two(num1,num2) {
                return num1 + num2;
            }
            this.add = function(){
                var args = arguments;
                len = args.length;
                switch(len) {
                    case 0: 
                        return zero();
                    case 1:
                        return one(args[0]);
                    case 2:
                        return two(args[0],args[1])
                }
            }
        }
        var count = new Count();
        console.log(count.add()); // 0
        console.log(count.add(2)); // 2
        console.log(count.add(4,5)); // 9
```
多态就是同一种方法不同的调用方式。根据传入的参数做相应的操作。

扩展：constructor的作用
```javascript
        var a, b;
        (function(){
            function Obj(arg1,arg2) {
                this.x = 1;
                this.y = 2;
            }
            Obj.prototype.getX = function(){
                console.log(this.x);
            }
            a = new Obj();
            b = new Obj();
        })();
        a.getX(); // 1
        b.getX(); // 1
        // 因为Obj在闭包里面，所以我们不能直接访问Obj
        // 假设需要给Obj添加一个新的方法来获得y的值，怎么办
        // 这时constructor就出场了
        a.constructor.prototype.getY = function(){
            console.log(this.y);
        }
        a.getY(); // 2
        b.getY(); // 2
        // 好吧 这个只是做一个扩展而已，其实constructor的指向一般没啥用
        // 但是为了规范，还是让它指向正确的构造函数吧
```

    参考网站
        原型链有点拗口，特供原型链一网址：
        原型链：http://www.cnblogs.com/longbaobao/articles/2000685.html

