#模板方法模式
#####作者：cwl
#####时间：2016-4-13
***
	简介:
	模板方法模式就是多个模型抽象化归一，说白一点就是创建一个对象的基类，在通过传入的参数进行配置从而生成出所需的效果咯
	比如：提示框这一类咯
```javascript
	// 看了才知道这就叫模板方法模式-。-
	/*
		以提示框为例：提示框有提示内容、一个关闭按钮、一个确定按钮
	*/
	;(function(){

		var Alert = function (data) {
			// 如果没有传入数据则直接返回，没有带好吃的就过来了，直接踢出门
			if(!data) {
				return;
			}
			// 设置内容
			this.content = data.content;
			// 创建提示面板
			this.panel = document.createElement('div');
			// 创建提示内容
			this.contentNode = document.createElement('p');
			// 创建确认按钮
			this.confirmBtn = document.createElement('span');
			// 创建关闭按钮
			this.closeBtn = document.createElement('b');
			// 为面板命名
			this.panel.className = 'alert';
			// 为关闭按钮命名
			this.closeBtn.className = 'a-close';
			// 为确认按钮命名
			this.confirmBtn.className = 'a-confirm';
			// 设置确认按钮名称
			this.confirmBtn.innerHTML = data.confirm || '确认';
			// 添加提示内容
			this.contentNode.innerHTML = data.content || '没有内容呢';
			// 设置回调方法
			// 点击确定按钮执行的回调函数
			this.success = data.success || function(){alert("成功回调函数");}
			// 点击关闭按钮执行的回调函数
			this.fail = data.fail || function(){alert("失败回调函数");}
		}
		/*
			好了，提示框的基本属性有了，接下来就是一些基本的方法了
		*/
		Alert.prototype = {
			// 初始化方法
			init: function(){
				// 组成提示框
				this.panel.appendChild(this.closeBtn);
				this.panel.appendChild(this.contentNode);
				this.panel.appendChild(this.confirmBtn);
				// 讲组成的提示框添加到页面中
				document.body.appendChild(this.panel);
				// 绑定事件
				this.bindEvent();
				// 显示提示框
				this.show();
			},
			bindEvent: function(){
				var me = this;
				// 关闭按钮事件
				this.closeBtn.onclick = (function(){
					// 执行关闭回调函数
					me.fail();
					// 隐藏提示框‘
					me.hide();
				})
				// 确认按钮事件
				this.confirmBtn.onclick = (function(){
					// 执行确认回调函数
					me.success();
					// 隐藏提示框
					me.hide();
				})
			},
			// 隐藏
			hide: function(){
				this.panel.style.display = 'none';
			},
			// 显示
			show: function(){
				this.panel.style.display = 'bolck';
			}
		}
		/*
			好了，鸡肋已经有了，开始创造一只鸡.
			在鸡肋中进行扩展，一不小心，鸡t头就出来了

		*/
		// 右侧按钮提示框
		var RightAlert = function(data){
			// 继承基本提示构造函数
			ALert.call(this,data);
			this.confirmBtn.className = this.confirmBtn.className + 'right';
		}
		RightAlert.prototype = new Alert();

		// 需要标题的提示框
		var TitleAlert = function(data){
			Alert.call(this, data);
			this.title = data.title;
			// 创建标题标签
			this.titleNode = document.createElement('h3');
			// 标题内容
			this.titleNode.innerHTML = this.title;
		}
		// 继承基本提示框
		TitleAlert.prototype = new Alert();
		// 提示框创建方法扩展
		TitleAlert.prototype.init = function(){
			// 插入标题
			this.panel.insertBefore(this.titleNode,this.panel.firstChild);
			// 继承基本提示框的init方法
			Alert.prototype.init.call(this);
		}

		/*
			到这里鸡头就出来了，接下来一不小心，机身就出来了
			我要创建一个有标题而且有取消按钮的提示框，
			哦，那就在带有标题的提示框基础上再添加一个取消按钮就可以了
		*/
		// 带有取消按钮的标题提示框
		var CancelAlert = function(data){
			// 直接继承标题提示框
			TitleAlert.call(this,data);
			// 取消按钮
			this.cancel = data.cancel;
			// 创建取消按钮标签
			this.cancelBtn = document.createElement('span');
			// 添加类名
			this.cancelBtn.className = 'cancel';
			// 设置文本
			this.cancelBtn.innerHTML = this.cancel || '';
		}
		CancelAlert.prototype = new Alert();
		CancelAlert.prototype.init = function(){
			// 基础标题提示框的初始化方法
			TitleAlert.prototype.init.call(this);
			// 添加取消按钮
			this.panel.appendChild(this.cancelBtn);
		}
		// 改写绑定方法
		CancelAlert.prototype.bindEvent = function(){
			var me = this;
			TitleAlert.prototype.bindEvent.call(me);
			this.cancelBtn.onclick = (function(){
				me.fail();
				me.hide();
			})
		}

		/*现在就组成了一只鸡咯，虽然长得丑，但是它想的美啊*/
		new CancelAlert({
			title: '标题',
			content: 'neirong',
			cancel: '取消',
			success: function(){
				console.log("success function");
			},
			fail: function(){
				console.log('fail function');
			}
		}).init();
	})();
```