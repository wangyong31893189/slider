slider
======

原生滚动插件


======
参数：
{scroll:true,//是否滚动
			scrollTime:5000,//滚动间隔时间   单位毫秒

			animateTime:500,//滚动图片间的动画时间   单位毫秒

			scrollType:"ease",//滚动动画的运动走向
			oneByOne:true,//是否需要 一张一张的滚动  true为需要  false为不需要
			direction:"left",//自动滚动是往什么方向，向左还是向右滚动  left为向左，right为向右			
			vScroll:false,//竖向滚动
			hScroll:true,//横向滚动
			debug:false,//是否开启调试模式   默认为false不开启
			onSliderStart:function(){			
				console.log("onSliderStart");
			},//开始滚动要执行的操作
			onSliderMove:function(){
				//console.log("onSliderMove");
			},//滚当中要执行的操作，
			onSliderEnd:function(){console.log("onSliderEnd");}//滚完要执行的操作	
}


方法：
next(),  //下一张
prev(), //上一张
scrollMount(index) //跳转到固定一张
getIndex()  //获取当前滚动索引
