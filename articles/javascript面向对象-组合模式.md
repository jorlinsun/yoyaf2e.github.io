#组合模式
#####作者：cwl
#####时间：2016-4-8
***
1、组合模式：又称“部分整体模式”将对象组合成树形结构以表示“部分整体”的层次结构。

如：一个新闻结构，有时面对如下需求：添加一个新闻模块，新闻的内容有可能是文字新闻、有可能是图片新闻、也有可能是一个直播链接啊。
分析一下需求，新闻大致可以分为相互独立的几种类型，而对某类新闻大致可以分为相互独立的几种类型，而对某一类新闻做修改时又不会影响到其他的新闻类，所以完全可以将每一类新闻抽象成面向对象编程中的一个类。这样就不必担心日后修改某一类而影响其他的类别。

组合模式：就像餐厅的套餐，当我们去吃饭的时候对于吃的喝的一个菜一个菜的点，这样是比较费时间的，如果餐厅能提供一个套餐服务那就简单多了，进去只要报菜名就可以了，这个结构跟我们一个一个的点是同样的结果，但是流程就简化很多，效率也高了不少，而餐厅仍然专注于组成套餐的每一个菜肴，而每一道菜之间都是相互独立的。通过不同的菜肴就可以组成不同的套餐。

有部分组成整体，这样就简化了复杂的整体，通过不同的部分组合又丰富了整体。
这样对于部分有什么约束要求呢？
**要求就一个：接口统一**
在JavaScript中我们可以通过继承同一个虚拟类来实现，如可以让所有的新闻都继承一个新闻虚拟父类News。如下：
```javascript
	var News = function(){
		// 特权变量
		// 子组件容器
		this.children = [];
		// 当前组件元素
		this.element = null;
	}
	News.portotype = {
		init: function(){
			throw new Error("请重写init方法");
		},
		add: function(){
			throw new Error("请重写add方法");
		},
		getElement: function(){
			throw new Error("请重写getElement方法");
		}
	}
	function ineritObject(o) {
		function F(){}
		F.prototype = o;
		return new F();
	}
	function inheritPrototype(subClass,superClass) {
		var p = ineritObject(superClass.prototype);
		p.constructor = subClass;
		subClass.prototype = p;
	}
```
虚拟类通常的定义而不实现的，为什么要在News这个类的构造函数中声明一些特权变量呢？
因为后面的所以继承子类都要声明这两个变量，为了简化子类，我们可以将这些公有的变量提前声明在父类中。


在实现子类的时候，要注意一下层级关系，组合模式不仅仅是单层组合也可以是一个多层次的。比如图片和文字先组合然后在作为一个部分继续组合其他的部分。



```javascript
	// 模块类
	var Container = function(id, parent) {
		// 构造函数继承父类
		News.call(this);
		// 模块id
		this.id = id;
		// 模块的父容器
		this.parent = parent;
		// 构建方法
		this.init();
	}
	// 寄生式继承父类原型方法
	inHeritPrototype(Container,News);
	// 构建方法
	Container.prototype.init = function(){
		this.element = document.createElement('ul');
		this.element.id = this.id
		this.element.className = 'new-container';
	};
	// 添加子元素方法
	Container.prototype.add = function(child){
		// 在子容器中插入子元素
		this.children.push(child);
		// 插入当前组件元素树中
		this.element.appendChild(child.getElement());
		return this;
	}
	// 获取当前元素方法
	Container.prototype.getElement = function(){
		return this.element;
	}
	// 显示方法
	Container.prototype.show = function(){
		this.parent.appendChild(this.element);
	}
	
	// 行成员集合类和新闻组合体类的实现方式与上面相似
	// 行成员集合类
	var Item = function(){
		News.call(this);
		this.className = className || '';
		this.init();
	}
	inheritPrototype(Item,News);
	Item.prototype.init = function(){
		this.element = document.createElement('li');
		this.element.className = this.className;
	}
	Item.prototype.add =function(child){
		// 在子元素容器中插入子元素
		this.children.push(child);
		// 插入当前组件元素树中
		this.element.appendChild(child.getElement());
		return this;
	}
	Item.prototype.getElement = function(){
		return this.element;
	}
	// 组合类
	var NewsGroup = function(){
		News.call(this);
		this.className = className || '';
		this.init();
	}
	inheritPrototype(NewsGroup,News);
	NewsGroup.prototype.init = function(){
		this.element = document.createElement('div');
		this.element.className = this.className;
	}
	NewsGroup.prototype.add = function(child){
		// 在子元素容器中插入子元素
		this.children.push(child);
		// 插入当前组件元素树中
		this.element.appendChild(child.getElement());
		return this;
	}
	NewsGroup.prototype.getElement = function(){
		return this.element;
	}
```
好了，上面已经将所有的子成员类创建出来了，不过光是有这些新闻容器类是不行滴，还需要更底层的新闻类，但是要注意一下，这些新闻成员类是不能拥有子成员的，但是他们继承了父类，所有对应add方法最好声明一下。比如创建图片新闻类

```javascript
	var ImageNews = function(url,href,className){
		News.call(this);
		this.url = url || '';
		this.href = href || '#';
		this.className = className || 'normal';
		this.init();
	}
	inheritPrototype(ImageNews,News);
	ImageNews.prototype.init = function(){
		this.element = document.createElement('a');
		var img = new Image();
		img.src = this.url;
		this.element.appendChild(img);
		this.element.className = 'image-news' + this.className;
		this.element.href = this.href;
	}
	ImageNews.prototype.add = function();
	ImageNews.prototype.getElement = function(){
		return this.element;
	}
```
icon新闻类
```javascript
	var IconNews = function(text,href,type){
		News.call(this);
		this.text = text || '';
		this.href = href || '#';
		this.type = type || 'video';
		this.init();
	}
	inheritPrototype(IconNews,News);
	IconNews.prototype.init = function(){
		this.element = document.createElement('a');
		this.element.innerHTML = this.text;
		this.element.href = this.href;
		this.element.className = 'icon' + this.type;
	}
	IconNews.prototype.add = function();
	IconNews.prototype.getElement = function(){
		return this.element;
	}
```
只有文字的新闻类
```javascript
	var EasyNews = function(text,href){
		News.call(this);
		this.text = text || '';
		this.href = href || '#';
		this.init();
	}
	inheritPrototype(EasyNews,News);
	EasyNews.prototype.init = function(){
		this.element = document.createElement('a');
		this.element.innerHTML = this.text;
		this.element.href = this.href;
		this.element.className = 'text';
	}
	EasyNews.prototype.add = function();
	EasyNews.prototype.getElement = function(){
		return this.element;
	}
```

位置设置
```javascript
	var TypeNews = function(text,href,type,pos){
	News.call(this);
	this.text = text || '';
	this.href = href || '#';
	this.type = type || 'video';
	this.pos = pos || '';
	this.init();
}
inheritPrototype(TypeNews,News);
TypeNews.prototype.init = function(){
	this.element = document.createElement('a');
	this.element.innerHTML = this.text;
	this.element.href = this.href;
	if(this.pos==="left") {
		this.element.innerHTML = '[' + this.type + ']' + this.text;
	}else {
		this.element.innerHTML = this.text + '[' + this.type + ']';
	}

}
TypeNews.prototype.add = function();
TypeNews.prototype.getElement = function(){
	return this.element;
}
```

好了通过以上的努力，新闻类都创建了，现在终于可以动手组装了，只要通过add方法来组装就可以了。

```javascript
	var news1 = new Container('news', document.body);
	news1.add(
		new Item('normal').add(
			new IconNews('梅西拿到金球了','#','video')
		)
	).add(
		new Item('normal').add(
			new IconNews('乔丹很牛','#','live')
		)
	).add(
		new Item('normal').add(
			new NewsGroup('has-img').add(
				new ImageNews('img/1.jpg','#','small')	
			).add(
				new EasyNews('科比来中国了','#')
			).add(
				new EasyNews('这是一条新闻,快看','#')	
			)
		)
	).add(
		new Item('normal').add(
			new TypeNews('AK47不愿为费城打球','#','NBA','left')
		)
	).add(
		new Item('normal').add(
			new TypeNews('这是在右边','#','NBA','right')
		)
	).show();
```



完整代码如下:
```javascript
	<script type="text/javascript">
		function ineritObject(o) {
			function F(){}
			F.prototype = o;
			return new F();
		}
		function inheritPrototype(subClass,superClass) {
			var p = ineritObject(superClass.prototype);
			p.constructor = subClass;
			subClass.prototype = p;
		}

		var News = function(){
	        // 特权变量
	        // 子组件容器
	        this.children = [];
	        // 当前组件元素
	        this.element = null;
		    this.portotype = {
		    	init: function(){
		    		throw new Error("请重写init方法");
		    	},
		    	add: function(){
		    		throw new Error("请重写add方法");
		    	},
		    	getElement: function(){
		    		throw new Error("请重写getElement方法");
		    	}
		    }
	    }
	    var news = new News();
	    var Container = function(id, parent) {
		    // 构造函数继承父类
		    News.call(this);
		    // 模块id
		    this.id = id;
		    // 模块的父容器
		    this.parent = parent;
		    // 构建方法
		    this.init();
    	}
	    // 寄生式继承父类原型方法
	    inheritPrototype(Container,News);
	    // 构建方法
	    Container.prototype.init = function(){
	    	this.element = document.createElement('ul');
	    	this.element.id = this.id
	    	this.element.className = 'new-container';
	    };
	    // 添加子元素方法
	    Container.prototype.add = function(child){
	        // 在子容器中插入子元素
	        this.children.push(child);
	        // 插入当前组件元素树中
	        this.element.appendChild(child.getElement());
	        return this;
	    }
	    // 获取当前元素方法
	    Container.prototype.getElement = function(){
	    	return this.element;
	    }
	    // 显示方法
	    Container.prototype.show = function(){
	    	this.parent.appendChild(this.element);
	    }

	    // 行成员集合类和新闻组合体类的实现方式与上面相似
	    var Item = function(className){
	    	News.call(this);
	    	this.className = className || '';
	    	this.init();
	    }
	    inheritPrototype(Item,News);
	    Item.prototype.init = function(){
	    	this.element = document.createElement('li');
	    	this.element.className = this.className;
	    }
	    Item.prototype.add =function(child){
	        // 在子元素容器中插入子元素
	        this.children.push(child);
	        // 插入当前组件元素树中
	        this.element.appendChild(child.getElement());
	        return this;
	    }
	    Item.prototype.getElement = function(){
	    	return this.element;
	    }

	    var NewsGroup = function(className){
	    	News.call(this);
	    	this.className = className || '';
	    	this.init();
	    }
	    inheritPrototype(NewsGroup,News);
	    NewsGroup.prototype.init = function(){
	    	this.element = document.createElement('div');
	    	this.element.className = this.className;
	    }
	    NewsGroup.prototype.add = function(child){
	        // 在子元素容器中插入子元素
	        this.children.push(child);
	        // 插入当前组件元素树中
	        this.element.appendChild(child.getElement());
	        return this;
	    }
	    NewsGroup.prototype.getElement = function(){
	    	return this.element;
	    }
	    var ImageNews = function(url,href,className){
	    	News.call(this);
	    	this.url = url || '';
	    	this.href = href || '#';
	    	this.className = className || 'normal';
	    	this.init();
	    }
	    inheritPrototype(ImageNews,News);
	    ImageNews.prototype.init = function(){
	    	this.element = document.createElement('a');
	    	var img = new Image();
	    	img.src = this.url;
	    	this.element.appendChild(img);
	    	this.element.className = 'image-news' + this.className;
	    	this.element.href = this.href;
	    }
	    ImageNews.prototype.add = function(){};
	    ImageNews.prototype.getElement = function(){
	    	return this.element;
	    }
	    var IconNews = function(text,href,type){
	    	News.call(this);
	    	this.text = text || '';
	    	this.href = href || '#';
	    	this.type = type || 'video';
	    	this.init();
	    }
	    inheritPrototype(IconNews,News);
	    IconNews.prototype.init = function(){
	    	this.element = document.createElement('a');
	    	this.element.innerHTML = this.text;
	    	this.element.href = this.href;
	    	this.element.className = 'icon' + this.type;
	    }
	    IconNews.prototype.add = function(){};
	    IconNews.prototype.getElement = function(){
	    	return this.element;
	    }
	    var EasyNews = function(text,href){
	    	News.call(this);
	    	this.text = text || '';
	    	this.href = href || '#';
	    	this.init();
	    }
	    inheritPrototype(EasyNews,News);
	    EasyNews.prototype.init = function(){
	    	this.element = document.createElement('a');
	    	this.element.innerHTML = this.text;
	    	this.element.href = this.href;
	    	this.element.className = 'text';
	    }
	    EasyNews.prototype.add = function(){};
	    EasyNews.prototype.getElement = function(){
	    	return this.element;
	    }



	    var TypeNews = function(text,href,type,pos){
	    	News.call(this);
	    	this.text = text || '';
	    	this.href = href || '#';
	    	this.type = type || 'video';
	    	this.pos = pos || '';
	    	this.init();
	    }
	    inheritPrototype(TypeNews,News);
	    TypeNews.prototype.init = function(){
	    	this.element = document.createElement('a');
	    	this.element.innerHTML = this.text;
	    	this.element.href = this.href;
	    	if(this.pos==="left") {
	    		this.element.innerHTML = '[' + this.type + ']' + this.text;
	    	}else {
	    		this.element.innerHTML = this.text + '[' + this.type + ']';
	    	}

	    }
	    TypeNews.prototype.add = function(){};
	    TypeNews.prototype.getElement = function(){
	    	return this.element;
	    }


	    var news1 = new Container('news', document.body);
	    news1.add(
	    	new Item('normal').add(
	    		new IconNews('梅西拿到金球了','#','video')
	    		)
	    	).add(
	    	new Item('normal').add(
	    		new IconNews('乔丹很牛','#','live')
	    		)
	    	).add(
	    	new Item('normal').add(
	    		new NewsGroup('has-img').add(
	    			new ImageNews('img/1.jpg','#','small')  
	    			).add(
	    			new EasyNews('科比来中国了','#')
	    			).add(
	    			new EasyNews('这是一条新闻，快看','#')   
	    			)
	    			)
	    	).add(
	    	new Item('normal').add(
	    		new TypeNews('AK47不愿为费城打球','#','NBA','left')
	    		)
	    	).add(
	    	new Item('normal').add(
	    		new TypeNews('这是在右边','#','NBA','right')
	    		)
	    	).show();
    </script>
```