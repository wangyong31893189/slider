define(function(require, exports, module) {
function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

var doc=document;
var m = Math,dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),// Style properties
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			hasTouch = 'ontouchstart' in window && !isTouchPad,
			hasTransform = vendor !== false,
			hasTransitionEnd = prefixStyle('transition') in dummyStyle,

			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = hasTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
			END_EV = hasTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = hasTouch ? 'touchcancel' : 'touchcancel';
			TRNEND_EV = (function () {
				if ( vendor === false ){
					return false;
				}

				var transitionEnd = {
						''			: 'transitionend',
						'webkit'	: 'webkitTransitionEnd',
						'Moz'		: 'transitionend',
						'O'			: 'otransitionend',
						'ms'		: 'MSTransitionEnd'
					};

				return transitionEnd[vendor];
			})();

	var Slider=function(options){
		this.options={
			scroll:true,//是否滚动
			scrollTime:5000,//滚动间隔时间   单位毫秒
			animateTime:500,//滚动图片间的动画时间   单位毫秒
			scrollType:"ease",//滚动动画的运动走向
			oneByOne:true,//是否需要 一张一张的滚动  true为需要  false为不需要
			direction:"left",//自动滚动是往什么方向，向左还是向右滚动  left为向左，right为向右			
			vScroll:false,//竖向 需要扩展
			hScroll:true,//横向  需要扩展
			useTransform:false,
			useTransition:true,
			debug:false,//是否开启调试模式   默认为false不开启
			onSliderStart:function(){			
				console.log("onSliderStart");
			},//开始滚动要执行的操作
			onSliderMove:function(){
				//console.log("onSliderMove");
			},//滚当中要执行的操作，
			onSliderEnd:function(){console.log("onSliderEnd");}//滚完要执行的操作			
			//isMouseDown:false//鼠标是否按下
		};
		for(var i in options){
			this.options[i]=options[i];
		}
		var that=this;
		//that.index=0;//当前滚动索引
		that.scrollDirect="";//当前动画的滚动方向
		that.slider=document.getElementById(that.options.id);
		that.options.useTransform = hasTransform && that.options.useTransform;
		//that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		//that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		//that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;
		that.sliderType={"ease":"cubic-bezier(0.25, 0.1, 0.25, 1.0)","linear":"cubic-bezier(0.0, 0.0, 1.0, 1.0)","ease-in":"cubic-bezier(0.42, 0, 1.0, 1.0)","ease-out":"cubic-bezier(0, 0, 0.58, 1.0)",  "ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1.0)"};
		that.sliderFunc=that.sliderType[that.options.scrollType];
		that.slider.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'margin-left left';
		that.slider.style[transitionDuration] =that.options.animateTime/1000+"s";
		that.slider.style[transformOrigin] = '0 0';
		if (that.options.useTransition){
			that.slider.style[transitionTimingFunction] =that.sliderFunc;		
		}
		
		that.slider.style.cssText += ';margin-left:0px';		
		//that.slider.parentNode.style.cssText="overflow:hidden;";
	}
	var Pos=function (){
		this.x=0;
		this.y=0;
	};
	var startPos=new Pos();
	var movePos=new Pos();
	var endPos=new Pos();
	
	Slider.prototype={
		init:function(){
			var slider=this.slider;			
			slider.innerHTML+=slider.innerHTML;
			//var sliderList=this.sliderList=slider.getElementsByTagName("div");
			//var length=sliderList.length;
			//var browserWidth=this.browserWidth=document.body.offsetWidth;
			//slider.width=""
			//for(var i=0;i<length;i++){
			//	sliderList[i].style.width=browserWidth+"px";
			//}
			//slider.style.width=browserWidth*length+"px";
			this.refresh();
			//alert(document.body.offsetWidth);			
			this.loadRun();
			
			var that=this;
			that._bind(START_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标按下或触摸开始事件
			that._bind(MOVE_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标移动或触摸移动事件
			that._bind(END_EV,null,function(e){that.handlerEvent(e,that)});//绑定鼠标弹上或触摸停止事件
			that._bind(CANCEL_EV,null,function(e){
				clearInterval(that.intervalId);
			});//绑定鼠标弹上或触摸取消事件
			that._bind(RESIZE_EV,window,function(e){//绑定窗口放大缩小或设备横竖事件
				clearInterval(that.intervalId);
				that.refresh();
				that.loadRun();
			});
			
			//that._bind("mouseout",null,function(e){				
			//	that.loadRun();
			//});
			//that._bind("mouseover",null,function(e){				
			//	clearInterval(that.intervalId);
			//});
			/*var Pos=function (){
				this.x=0;
				this.y=0;
			};
			var startPos=new Pos();
			var movePos=new Pos();
			var endPos=new Pos();
			slider.addEventListener(START_EV,function(e){
				clearInterval(that.intervalId);
				startPos=e.clientX;
			});
			slider.addEventListener(MOVE_EV,function(e){
				startPos=e.clientX;
			
			});
			slider.addEventListener(END_EV,function(){
				that.loadRun();
			});*/
		},
		loadRun:function(){
			var that=this;
			clearInterval(that.intervalId);//重新启动定时器之前，清理定时器
			var slider=that.slider;
			var sliderList=that.sliderList;
			var browserWidth=that.browserWidth;
			var speed=browserWidth;
			var totalWidth=parseFloat(slider.style.width);
			var left=0;
			var direction=that.options.direction;
			var scrollDirect="right";
			var timeSpan=500;
			var intervalId=0;
			if(direction=="right"){
				left=parseFloat(slider.style.marginLeft);
				if(isNaN(left)){
					left=0;
				}
				if(left==0){
					that.slider.style[transitionDuration] = '0';
					left=-totalWidth/2;
					slider.style.marginLeft=left+"px";
				}
			}		
			intervalId=that.intervalId=setInterval(function(){
				if(direction=="right"){
					left=parseFloat(slider.style.marginLeft);
					if(isNaN(left)){
						left=0;
					}					
					if(that.options.debug){
						console.log("当前滚动方向为"+that.options.direction);
					}
					left+=browserWidth;						
					//if(that.scrollDirect=="left"){
					//	left=Math.ceil(left/browserWidth)*browserWidth;
					//}else{
					//	left=Math.floor(left/browserWidth)*browserWidth;
					//}
					if(that.options.debug){
						console.log("当前滚动方向为"+that.scrollDirect+",当前所滑动位置为:"+left);
					}
					that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
					//if(left>=0){
						//that.slider.style[transitionDuration] = '0';
						//left=-totalWidth/2;
					//}else{
					that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
					//}					
					//if(that.index>=that.length-1){
					//	that.index=0;
					//}
					//记录当前滚动位置的索引
					if(that.options.debug){
						console.log("当前滚动索引位置为"+that.getIndex()+",当前移动位置为："+left);
					}
					slider.style.marginLeft=left+"px";
					//that.index=Math.abs(left/browserWidth)-1;
					if(left>=0){		
						setTimeout(function(){
							that.slider.style[transitionDuration] = '0';
							left=-totalWidth/2;
							//that.index=0;
							slider.style.marginLeft=left+"px"
						},that.options.animateTime);					
					}				
				}else if(direction=="left"){
					left=parseFloat(slider.style.marginLeft);
					//var left=parseFloat(that.index*browserWidth);
					if(isNaN(left)){
						left=0;
					}
					if(that.options.debug){
						console.log("当前滚动方向为"+that.options.direction);
					}
				
					left-=browserWidth;
					
					//if(that.scrollDirect=="left"){
					//	left=Math.ceil(left/browserWidth)*browserWidth;
					//}else{
					//	left=Math.floor(left/browserWidth)*browserWidth;
					//}
					
					if(that.options.debug){
						console.log("当前滚动方向为"+that.scrollDirect+",当前所滑动位置为:"+left);
					}
					
					that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
					//if(left<=-totalWidth/2){						
						//that.slider.style[transitionDuration] = '0';						
						//left=0;					
					//}else{
						that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
					//}					
					//if(that.index>=that.length-1){
					//	that.index=0;
					//}
					//记录当前滚动位置的索引
					slider.style.marginLeft=left+"px";
					//that.index=Math.abs(left/browserWidth);
					if(that.options.debug){
						console.log("当前滚动索引位置为"+that.getIndex()+",当前移动位置为："+left);
					}
					if(left<=-totalWidth/2){				
						setTimeout(function(){
							that.slider.style[transitionDuration] = '0';
							left=0;
							//that.index=that.length/2-1;
							slider.style.marginLeft=left+"px"
						},that.options.animateTime);					
					}				
				
				}
				
				
			},that.options.scrollTime);
			if(!that.options.scroll){//不滚动的时候自动清除定时器
				if(that.options.debug){
					console.log("已经有自动清除定时器!");
				}
				clearInterval(that.intervalId);
			}
		},
		handlerEvent:function(e,that){
		    // var that=this;
			switch(e.type) {
				case START_EV:
					if (!hasTouch && e.button !== 0) return;
					that._start(e);
					break;
				case MOVE_EV: that._move(e); break;
				case END_EV:
				case CANCEL_EV: that._end(e); break;
			 //  case RESIZE_EV: that._resize(); break;
			   // case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			   // case TRNEND_EV: that._transitionEnd(e); break;
			}
		},
		_start:function(e){  //开始事件
			var that=this;
			clearInterval(that.intervalId);
			e.preventDefault();
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var eX=startPos.x=e.clientX || e.pageX;
			var eY=startPos.y=e.clientY || e.pageY;			
			that.isMouseDown=true;
			if (that.options.onSliderStart){that.options.onSliderStart.call(that,e)};
		},
		_move:function(e){//
			var that=this;
			e.preventDefault();			
			if(that.isMouseDown){
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var slider=that.slider;
				var totalWidth=parseFloat(slider.style.width);
				var left=parseFloat(slider.style.marginLeft);
				if(isNaN(left)){
					left=0;
				}
				/*if(left<=-totalWidth/2){
					left=0;
				}*/
				//console.log("1---left="+left+",ex="+eX+",startPos.x="+startPos.x);
				left=left+(eX-startPos.x);
				if(eX>startPos.x){//通过鼠标手指触摸位置判断滑动或拖动方向
					that.scrollDirect="right";					
				}else{
					that.scrollDirect="left";
				}
				startPos.x=eX;
					that.slider.style[transitionDuration] = "0";
				if(left>=0){
					left=-totalWidth/2;
				}else if(left<=-totalWidth/2){
					//that.slider.style[transitionDuration] = "0";
					left=0;
				}else{
					//that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
				}
				/*
				var browserWidth=that.browserWidth;
				console.log("2---left="+left);
				if((left%browserWidth/parseFloat(browserWidth))>0.4){
					left=(left/browserWidth)*browserWidth;
				}else{
					left=((left/browserWidth)-1)*browserWidth;
				}
				console.log("3---left="+left);*/
				//that.slider.style[transform] = 'translateX(' + left + 'px)';
				slider.style.marginLeft=left+"px";				
				
				if (that.options.onSliderMove){that.options.onSliderMove.call(that,e)};
			}
		},
		refresh:function(){
			var that=this;
			var slider=that.slider;
			//slider.innerHTML+=slider.innerHTML;
			var sliderList=that.sliderList=slider.getElementsByTagName("div");
			var length=that.length=sliderList.length;
			var browserWidth=that.browserWidth=document.body.offsetWidth;
			slider.parentNode.style.width=browserWidth+"px";
			//slider.width=""
			for(var i=0;i<length;i++){
				sliderList[i].style.width=browserWidth+"px";
			}
			slider.style.width=browserWidth*length+"px";
		},
		_end: function (e) {
			var that=this;
			e.preventDefault();
			that.isMouseDown=false;
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var eX=movePos.x=e.clientX || e.pageX;
			var eY=movePos.y=e.clientY || e.pageY;
			var slider=that.slider;
			var totalWidth=parseFloat(slider.style.width);
			var left=parseFloat(slider.style.marginLeft);
			if(isNaN(left)){
				left=0;
			}
			var left=left+(eX-startPos.x);
			that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			if(left>=0){
				left=-totalWidth/2;
				that.slider.style[transitionDuration] = "0";
			}else if(left<=-totalWidth/2){
				left=0;
				that.slider.style[transitionDuration] = "0";
			}else{
				that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			}
			var browserWidth=that.browserWidth;
			//console.log("end---left="+left);
			//console.log("end---(left%browserWidth/parseFloat(browserWidth)="+(left%browserWidth/parseFloat(browserWidth)));
			if(that.options.oneByOne){
				if(Math.abs(left%browserWidth/parseFloat(browserWidth))>=0.5){
					left=Math.floor(left/browserWidth)*browserWidth;
					if(that.options.debug){
						console.log("大于");
					}
				}else{
					left=Math.ceil(left/browserWidth)*browserWidth;
					if(that.options.debug){
						console.log("小于");
					}
				}
			}
			//that.index=Math.abs(Math.ceil(left/browserWidth)); //记录当前滚动位置的索引
			//that.slider.style[transform] = 'translateX(' + left + 'px)';			
			slider.style.marginLeft=left+"px";
			that.loadRun();
		},_bind: function (type,el,fn,bubble) {
			(el || this.slider).addEventListener(type, fn, !!bubble);
		},_unbind: function (type, el, bubble) {
			(el || this.slider).removeEventListener(type, fn, !!bubble);
		},next:function(){
			var that=this;
			clearInterval(that.intervalId);
			var slider=that.slider;
			that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			var index=that.getIndex();
			var length=that.length/2;
			var totalWidth=parseFloat(slider.style.width);
			var browserWidth=that.browserWidth;
			index++;
			if(index>length-1){
				that.slider.style[transitionDuration] = '0';
				index=0;
			}
			if(that.options.debug){
				console.log("next 当前滚动index="+index);
			}
			var left=-index*browserWidth;
			slider.style.marginLeft=left+"px";
			/*if(left<=-totalWidth/2){				
				setTimeout(function(){
					that.slider.style[transitionDuration] = '0';
					left=0;					
					slider.style.marginLeft=left+"px"
				},that.options.animateTime);					
			}	*/
			that.loadRun();
		},prev:function(){
			var that=this;
			that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			clearInterval(that.intervalId);
			var slider=that.slider;
			var index=that.getIndex();
			var length=that.length/2;
			var totalWidth=parseFloat(slider.style.width);
			var browserWidth=that.browserWidth;
			index--;
			if(index<0){
				index=length-1;
				that.slider.style[transitionDuration] = '0';
			}
			if(that.options.debug){
				console.log("prev 当前滚动index="+index);
			}
			var left=-index*browserWidth;
			slider.style.marginLeft=left+"px";
			/*if(left>=0){		
				setTimeout(function(){
					that.slider.style[transitionDuration] = '0';
					left=-totalWidth/2;
					//that.index=0;
					slider.style.marginLeft=left+"px"
				},that.options.animateTime);					
			}*/	
			that.loadRun();
		},scrollMount:function(index){
			var that=this;
			var slider=that.slider;
			var totalWidth=parseFloat(slider.style.width);
			that.slider.style[transitionDuration] = that.options.animateTime/1000+"s";
			clearInterval(that.intervalId);
			var length=that.length/2;
			var browserWidth=that.browserWidth;
			if(index>length-1){
				index=length-1;
			}else if(index<0){
				index=0;
			}
			var left=-index*browserWidth;
			slider.style.marginLeft=left+"px";
			that.loadRun();
		},getIndex:function(){
			var that=this;
			var slider=that.slider;
			var browserWidth=that.browserWidth;
			var left=parseFloat(slider.style.marginLeft);
			if(isNaN(left)){
				left=0;
			}
			return Math.abs(Math.round(left/browserWidth));
		}
	};
	module.exports  = Slider;
});