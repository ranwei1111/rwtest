(function(win,doc,$){
// 	function f1(){
// 　　　 var　n=0;
// 　　　　function f2(){
// 		++n;
// 　　　　　　return n;
// 　　　　}
// 　　　　return f2;
// 　　}
// 	var s=f1();
// 　　console.log(s());	
// 　　console.log(s());
	// 刷新当前页面
	$("#refresh").on("click",function(){
		win.location.reload();
	});
	requestdatasoure();
	// 滚动条实现
	function CusScrollBar(options){
		this._init(options);
	}
	$.extend(CusScrollBar.prototype, {
		_init:function(options){
			var self = this;
			self.options = {
				scroll:"y",  //滚动方向
				contSelector:"",//滚动内容区选择器
				barSelector:"",//滚动条选择器
				sliderSelector:"",//滚动滑块选择器
				btnTopSelector:"",//向上箭头选择器
				btnDownSelector:"",//向下箭头选择器
				wheelStep:69.1,//每次滚动滚轮的步长
				btnStep:34.55//每点一次的步长
			};
			$.extend(true, self.options, options||{});
			self._initDomEvent();
		},
		// 初始化DOM引用
		_initDomEvent:function(){
			var self = this;
			var opts = this.options;
			//滚动区内容对象
			this.$cont=$(opts.contSelector);
			//滚动滑块区对象
			this.$slider=$(opts.sliderSelector);
			// console.log(opts);
			//滚动条对象
			this.$bar = opts.barSelector ? $(opts.barSelector):self.$slider.parent();
			//document对象
			this.$doc = $(doc);
			//向上滚动箭头对象
			this.$btntop = $(opts.btnTopSelector);
			this.$btndown = $(opts.btnDownSelector);
			this._initSliderDragEvent()._bindContScroll()._bindMouseWheel()._bindbtnTop()._bindbtnDown();
			
		},
		//初始化滑块拖动功能
		_initSliderDragEvent:function(){
			var self = this;
			var slider = this.$slider,//把滑块选择器存为一个变量
			  	sliderEl = slider[0];
		  	if(sliderEl){
		  		var doc = this.$doc,
		  			dragStartPagePosition,//存储鼠标按下时指针位于文档边缘的垂直位置
		  			dragStartScrollPosition,
		  			dragContBarRate;//内容滚动距离/滑块的移动距离
	  			function mousemoveHandler(e){
	  				e.preventDefault();
	  				// console.log("mousemove");
	  				if(dragStartPagePosition == null){
	  					return;
	  				}
	  				self.scrollTo(dragStartScrollPosition+(e.pageY-dragStartPagePosition)*dragContBarRate);
	  			}
		  		slider.on("mousedown",function(e){
		  			e.preventDefault();
		  			// console.log("mousedown");
		  			dragStartPagePosition = e.pageY;
		  			dragStartScrollPosition = self.$cont[0].scrollTop;
		  			dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();
		  			doc.on("mousemove.scrol",mousemoveHandler).on('mouseup.scrol',function(e){
		  				e.preventDefault();
		  				// console.log("mouseup");
		  				doc.off(".scrol");
		  			});
		  		});
		  	} 
		  	return self;
		},
		//添加向上滚动箭头事件
		_bindbtnTop:function(){
			var i=0;
			var self = this;
			self.$btntop.on("click",function(){
				self.scrollTo(self.$cont[0].scrollTop-self.options.btnStep);
			});
			return self;
		},
		//添加向下滚动箭头事件
		_bindbtnDown:function(){
			var self = this;
			self.$btndown.on("click",function(){
				self.scrollTo(self.$cont[0].scrollTop+self.options.btnStep);
			});
			return self;
		},
		//添加滚轮事件
		_bindMouseWheel:function(){
			var self = this;
			function mouseHanlder(e){
				e.preventDefault();
				var wheelRange;
				var oEv = e.originalEvent;//取得原生事件e
				wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;//兼容火狐浏览器和其它浏览器，前者每次滚动弧度取得的是3的倍数，后者取到的是120的倍数
				self.scrollTo(self.$cont[0].scrollTop+wheelRange*self.options.wheelStep);
			}
			self.$cont.on("mousewheel DOMMouseScroll",mouseHanlder);
			self.$bar.on("mousewheel DOMMouseScroll",mouseHanlder);
			return self;
		},
		//监听内容的滚动，同步滑块的位置
		_bindContScroll:function(){
			var self = this;
			self.$cont.on("scroll",function(){
				var sliderEl = self.$slider && self.$slider[0];
				if(sliderEl){
					sliderEl.style.top = self.getSliderPosition()+16+"px";
				}
			});
			return self;
		},
		//计算滑块当前的位置
		getSliderPosition:function(){
			var self = this,
			maxSliderPosition = self.getMaxSliderPosition();//滑块可移动的距离
			return Math.min(maxSliderPosition,maxSliderPosition*self.$cont[0].scrollTop/self.getMaxScrollPosition());
		},
		//内容可滚动高度
		getMaxScrollPosition:function(){
			var self = this;
			return Math.max(self.$cont.height(),self.$cont[0].scrollHeight)-self.$cont.height();
		},
		//滑块可移动距离
		getMaxSliderPosition:function(){
			var self = this;
			return self.$bar.height()-self.$slider.height();//滑块所在容器减去滑块自身的高度得到可移动距离
		},
		//移动滑块内容滑动
		scrollTo:function(positionVal){
			var self = this;
			self.$cont.scrollTop(positionVal);//重新设置内容可视区的高度，使得内容滑动
		}
	});
	win.CusScrollBar = CusScrollBar;
})(window,document,jQuery);
	

new CusScrollBar({
	contSelector:".table-foot",//滚动内容区选择器
	barSelector:".scroll-slider",//滚动条选择器
	sliderSelector:".scroll-bar",//滚动滑块选择器
	btnTopSelector:".scroll-top",//向上箭头选择器
	btnDownSelector:".scroll-bottom"//向下箭头选择器
});	

function requestdatasoure(){
  $.get("/Carposition/JSON/data.json",function(data,status){
    var datalength = data.datasoure.length;
    var page =Math.ceil(datalength/10); 
	for(var i = 0;i<page;i++){
		var span = $("<span></span>");
		$(".page>.list").append(span);
	}
  	$("#folding").on("click",function(){

		// 控制列表的隐藏与显示
		$("#folding").toggleClass("rotate");
		if ($("#table-body").is(":hidden")) {
			$("#table-body").show();
			if(datalength<=4){
				var tableheadbottom=data.datasoure.length*34.55+'px';
				$(".DIV-tablehead").css("bottom",tableheadbottom);
			}
			else if(datalength>4)
			{
				if(datalength<=10){
					$(".DIV-tablehead").css("bottom","138.2px");
					$(".scroll").css({"height":"138.2px"});
					$(".scroll-slider").css({"height":"102.2px"});
				}
				else if(datalength>10){
					$(".DIV-tablehead").css("bottom","168.2px");
					$(".page").css("display","block");
					$(".table-foot").css("bottom","30px");
					$(".scroll").css({"height":"168.2px"});
					$(".scroll-slider").css({"height":"132.2px"});
				}
				$(".table-foot").css("height","138.2px");
				$(".table-foot").css("overflow","hidden");
				$(".scroll").css("display","block");
				
			}
			else{
				$(".scroll").css("display","none");
			}
			
		}
		else{
			$("#table-body").hide();
			$(".scroll").css("display","none");
			$(".page").css("display","none");
			$(".DIV-tablehead").css("bottom","0");
			$(".scroll-bar").css("top","16px");
		}
	});
	//渲染数据
	var html = template("test",data);
	$("#maintable>tbody").append(html);
	$("#table-body").css("display","none");
  });
}
