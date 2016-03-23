#单例模式
```javascript
    var SingleObj = (function(){
            var instantiated;
            // 初始化对象
            function init() {
                return {
                    publickMethod: function(){
                        console.log("hello，我是单例模式");
                    }
                }
            }
            return {
                // 得到单例对象
                getInstance: function(){
                    // 如果没有才创建单例对象
                    if(!instantiated){
                        instantiated = init();
                    }
                    // 如果已经创建了就直接返回这个单例对象
                    return instantiated;
                }
            }
        })();
        SingleObj.getInstance().publickMethod();
```
知道了单例如何实现了，但单例用在什么样的场景比较好呢？其实单例一般是用在系统间各种模式的通信协调上，下面的代码是一个单例的最佳实践。(不是很理解)
```javascript
    var SingleObj = (function(){
            // 参数：传递给单例的一个参数集合
            function Single(args) {
                // 设置args变量为接受的参数或者为空
                var args = args || {};
                // 设置name参数
                this.name = "单例";
                // 设置参数为接受的参数或者为默认值
                this.pointX = args.pointX || 6;
                // 设置参数为接受的参数或者为默认值
                this.pointY = args.pointY || 10;
            }

            // 实例容器
            var instance;

            var _static = {
                name: "单例",
                // 获取实例方法
                getInstance: function(args){
                    if(instance === undefined) {
                        instance = new Single(args);
                    }
                    return instance;
                }
            }
            return _static;
        })();
        var single = SingleObj.getInstance({pointX:5});
        console.log(single.pointX);
```

**工厂模式**
1、对不同类实例化
```javascript
    // 首先吧，要有个总经理
        var productManeger = {};
        // 这个总经理下有三个员工，分别能生产ABC三类产品
        productManeger.createProductA = function() {
            console.log("我能生产A类产品");
        }
        productManeger.createProductB = function() {
            console.log("我能生产B类产品");
        }
        productManeger.createProductC = function() {
            console.log("我能生产C类产品");
        }

        // 有人要生产A类产品的时候就会直接找A，要生产B类产品就直接找B
        // 公司刚刚发展就三条线的时候，这样的确可以，
        // 但是过一段时间，公司蹭的一下就世界五百强了，底下有几百条线，
        // 这下不能一个人来就直接让他去找A，另一个来让他去找B，这样就乱了..
        // 还是要有统一的接口的，只要传入你要找的类型就可以了
        productManeger.factory = function(type) {
            return new productManeger[type];
        }


        // 例如：我要生产C类产品，我就直接告诉这个工厂我要C这个产品类型就可以了
        productManeger.factory("createProductC"); // 结果：我能生产C类产品

```
2、创建相似对象
```javascript
    // 用工厂模式创建相似的对象，我们可以将相似的东西提取出来，不同的东西针对性处理
        /*
            比如一本书，相似的地方：目录，页码等
                        不同的地方：书名，出版时间，书的类型等
            我们可以创建一个工厂类，将不同的元素以参数的形式传入进去
        */
        function CreateBook(name,time,type) {
            var o = new Object();
            // 针对不同的属性进行赋值
            o.name = name;
            o.time = time
            o.type = type;
            // 所有的类都有这个方法
            o.getName= function(){
                console.log(this.name);
            }
            return o;
        }
        var book1 = CreateBook("js","2016","js");
        var book2 = CreateBook("css","2015","css");
        book1.getName();// js
        book2.getName();// css
```
什么时候使用工厂模式：就是一个对象比较复杂，拥有多种功能，且需要根据不同的需求使用不同的功能。
3、抽象类
```javascript
    // 抽象类
    // 抽象类的作用就是规定了一些必要的方法，这些方法是继承类必须进行重写的。
    // 如：一个人肯定要吃饭，但是他们吃饭的速度是不同的，所以人这个类必须有吃饭的方法。
    // 所以在new一个人出来并且调用吃饭这个方法的时候，必须重写这个吃饭的方法。
    var Car = function(){};
    Car.prototype = {
        getPrice: function(){
            // 模拟抛出错误
            return new Error('抽象方法不能调用');
        },
        getSpeed: function(){
            // 模拟抛出错误
            return new Error("抽象方法不能调用");
        }
    }
    var car = new Car();
    console.log(car.getPrice()); // 没有重写方法而去调用，就会得到错误提示
    /*
        我们创建了一个Car的类；但是这个类其实什么都不做，只是监督继承者有没有去实现它给出的这些方法。
        如果继承者没有重写这些方法而去调用父类的方法，则父类就会给出错误提示。  
    */
```
4、抽象工厂模式
```javascript
    // 抽象工厂模式
        var VehicleFactory = function(subType,superType) {
            if(typeof VehicleFactory[superType] === 'function') {
                // 过渡类：过渡类的构造函数是空的，所以在new的时候不用为属性方法开辟内存空间
                // 节省了内存的开销
                function F(){};
                // 这边直接使用new关键字，说明了过渡类不仅仅继承了父类的原型方法也继承了父类的对象属性
                F.prototype  = new VehicleFactory[superType]();
                // 调整指针指
                subType.constructor = subType;
                // 子类原型继承父类
                subType.prototype = new F();
            }
            else {
                throw new Error('未创建该抽象类');
            }
        }

        // 小汽车类
        VehicleFactory.Car = function(){
            this.type = 'car';
        }
        VehicleFactory.Car.prototype = {
            getPrice: function(){
                return new Error('抽象方法不能调用');
            },
            getSpeed: function(){
                return new Error("抽象方法不能调用");
            }
        }
        // 公交车抽象类
        VehicleFactory.Bus = function(){
            this.type = "Bus";
        }
        VehicleFactory.Bus.prototype = {
            getPrice: function(){
                return new Error('抽象方法不能调用');
            },
            // 获得乘客人数
            getPassengerNum: function(){
                return new Error("抽象方法不能调用");
            }
        }
        // 货车抽象类
        VehicleFactory.Truck = function(){
            this.type = "Truck";
        }
        VehicleFactory.Truck.prototype = {
            getPrice: function(){
                return new Error('抽象方法不能调用');
            },
            // 货车载货量
            getTrainload: function(){
                return new Error("抽象方法不能调用");
            }
        }

        // 宝马汽车子类
        var BMW = function(price,speed){
            this.price = price;
            this.speed = speed;
        }
        VehicleFactory(BMW,'Car');
        // 重写抽象方法
        BMW.prototype.getPrice = function(){
            console.log(this.price);
        }
        BMW.prototype.getSpeed = function(){
            console.log(this.speed);
        }

        // 宇通公交车之类
        var YT = function(price,passengerNum){
            this.price = price;
            this.passengerNum = passengerNum;
        }
        VehicleFactory(YT,'Bus');
        // 重写抽象方法
        YT.prototype.getPrice = function(){
            console.log(this.price);
        }
        YT.prototype.getPassengerNum = function(){
            console.log(this.passengerNum);
        }

        // 奔驰货车子类
        var BZTruck = function(price,trainload){
            this.price = price;
            this.trainload = trainload;
        }
        VehicleFactory(BZTruck,'Truck');
        // 重写抽象方法
        BZTruck.prototype.getPrice = function(){
            console.log(this.price);
        }
        BZTruck.prototype.getTrainload = function(){
            console.log(this.trainload);
        }

        // 实例化对象
        var bmw = new BMW("150W","200km/h");
        bmw.getPrice(); // 150W
        bmw.getSpeed(); // 200km/h

        var yt = new YT("100W","70人");
        yt.getPrice(); // 100W
        yt.getPassengerNum(); // 70人 

        var bz = new BZTruck("200W","1000T");
        bz.getPrice(); // 200W
        bz.getTrainload(); // 1000T
        /*
            通过抽象工厂，我们就能知道每个子类是属于哪个类别
            它们也具备了该类所必备的属性和方法。
            总结：抽象工厂模式创建出来的结构不是一个真实的对象实例而是一个类簇，
            它定义了该类的结构。例如定义人类。人类要有手有脚，有头有身体等。
        */ 
```
**建造者模式**

```javascript
    // 建造者模式
    /*
        场景：有这么个白富美要一套别墅，她不会建造别墅但是她有钱啊，于是请了个包工头。
        告诉包工头房子的设计需求：要是客厅、房间、厨房等。于是给了100W走人了。

        包工头拿着钱肯定不是一个人去建房子啊，而是去请工人，给钱让工人去做，自己负责监督。

        工人上场了，工人要有建造房子的方法，将房子造出来，然后就可以拿钱回家了

        以上三个因素，白富美的需求，包工头的监工，工人实现需求
    */ 

    function BaoGongTou() {
        // 包工头就一个方法，监督工人造房子，这边需要依赖工人，故有一个工人参数
        this.jianDuGongRen = function(gongren) {
            gongren.jianKeTing();
            gongren.jianFangJian();
            gongren.jianChuFang();
        }
    }
    
    // 工人有建造客厅、房间、厨房的方法以及交房的方法
    function GongRen() {
        this.jianKeTing = function(){
            console.log("客厅建好了");
            return true;
        }
        this.jianFangJian = function(){
            console.log("房间建好了");
            return true;
        }
        this.jianChuFang = function(){
            console.log("厨房建好了");
            return true;
        }
        this.jiaoFang = function() {
            var fangZi = new FangZi();
            fangZi.keTing = "客厅很宽大";
            fangZi.fangJian = "房间更大";
            fangZi.chuFang = "厨房敞亮";
            console.log("房子建好了，给你");
            return fangZi; // 将房子返回出来
        }
    }

    function FangZi() {
        this.keTing = "";
        this.fangJian = "";
        this.chuFang = "";
    }
    var baoGongTou = new BaoGongTou();
    var gongRen = new GongRen();

    // 包工头开始监督工人造房子咯
    baoGongTou.jianDuGongRen(gongRen);
    // 时间过了三秒，房子建好了
    var bieShu = gongRen.jiaoFang();
    console.log(bieShu);
    /*
        1、就是我不必知道房子是怎么建成的，我只要提供需求其他都可以不管，只要将最终的房子给我就可以了
        2、建造房子的模块是互相独立的，也就是这里分为三波人，一波建造客厅，一波建造厨房，一波建造房间，互不影响，对系统扩展比较有利，假如，要在建一个卫生间，只要在添加一个建造卫生间的方法就可以了
        3、各个建造过程也是互相独立的，也就是说，突然有个需求要在房间里添加一个书房，只要修改建房子这个方法就可以了。不会影响到其他的模块，
    */
```
