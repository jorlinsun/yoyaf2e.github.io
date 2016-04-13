#享元模式
```javascript
	
	// 享元模式：就是将一些公用的方法抽离出来咯
	// 例子：新闻翻页功能
	var dom = null;
	var paper = 0;
	var num =5;
	var i=0;
	len = article.length;
	for(;i<len;i++){
		dom = document.createElement('div');
		dom.innerHTML = article[i];
		if(i>=num){
			dom.style.display = "none";
		}
		document.getElementById('container').appendChild(dom);
	}
	document.getElementById('next').onclick = function(){
		var div = document.getElementById("container").getElementsByTagName('div');
		// j、k位循环变量。n为当业显示的第一个新闻序号
		j = k = n = 0;
		// 获取当前页显示的第一个新闻序号
		n = ++paper % Math.ceil(len/num)*num;
		for(;j<len;j++) {
			// 隐藏所有的新闻
			div[j].style.display = 'none';
		}
		for(;k<len;k++) {
			if(div[n+k]){
				div[k].style.display = 'block';
			}
		}
	}

	/*
		上面的写法是创建所有的新闻并插入页面中，这样操作会造成许多冗余。
		下面用享元模式进行改进，享元模式主要是对数据、方法共享分离。
		它将数据和方法分成内部数据、内部方法、外部数据、外部方法。
		内部数据与内部方法值得是相似或者公有的数据和方法，所以要将这一部分提取出来减少开销以提高性能。
		上面写的功能里，新闻个体都有共同的结构，所以他们应该作为内部的数据。
		而下一页点击事件已经不能再抽象提取了，所以是外部方法。
	*/



	// 使用提取出来的数据，我们需要提供一个操作方法
	var flyWeight  = function(){
		// 已经创建的额元素
		var created = [];
		function create(){
			var dom = document.createElement('div');
			ocument.getElementById('container').appendChild(dom);
			created.push(dom);
			return dom;
		}
		// 返回一个对象
		return {
			// 获得创建新闻元素的方法
			getDIv: function(){
				if(created.length<5){
					return create();
				}
				else {
					var div = created.shift();
					created.push(div);
					return div;
				}
			}
		}
	}
	/*
		首先，创建一个享元类，因为我们每页只显示5条数据，所以我们就创建5个元素，
		保存在享元类的内部，我们可以通过享元类为我们提供的方法getDiv来获取创建的元素。
		内部的数据和内部的方法提出来之后我们就要实现外部的数据和方法，
		外部的数据就是我们姚先生的所有新闻内容，每个内容都不一样，所有他们不能被共享
		当然，为下一页绑定的事件是独立的，他只绑定一次
		接下来我们要做两件事，第一，根据新闻的内容实例化页面
		第二对下一页绑定一个点击事件，显示下一页
	*/
	var paper = 0;
	var num =5;
	// 添加五条新闻
	for(var i=0; i<5; i++) {
		if(article[i]) {
			// 通过享元类获取创建的元素并写入新闻内容
			flyWeight.getDIv().innerHTML = article[i];
		}
	}
	document.getElementById('next').onclick = function(){
		// 如果新闻内容不足5条则返回
		if(article.length<5){
			return;
		}
		var n = ++paper * num % len;
		var j = 0;
		// 插入5条新闻
		for(;j<5;j++) {
			// 如果存在第n+j条则插入
			if(article[n+j]) {
				flyWeight.getDIv().innerHTML = article[n+j];
			}
			// 否则擦如起始位置n+j-len条
			else if(article[n+j-len]){
				flyWeight.getDIv().innerHTML = article[n+j-len];
			}
			// 如果都不存在，则插入空字符串
			else {
				flyWeight.getDIv().innerHTML = '';
			}
		}
	}
	/*这样，每次操作只需要操作5个元素即可，不用操作所有的元素，这样性能就相对的提高了许多*/

	/* 
		享元模式的应用目的是为了提高程序的执行效率与系统的性能，它可以避免程序中的数据重复，有时系统内存存在大量对象，会造成大量内存占用
		所有应用享元模式来减少内存消耗
	 */

```