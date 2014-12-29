define(function(require, exports, module) {
	var Slider=require("./slider");
	var options={"id":"slider","scroll":true,"debug":true,"scrollSensitivity":0.1,"direction":"left","scrollTime":5000,"oneByOne":true,vScroll:false,hScroll:true,scrollType:"ease-in-out",animateTime:1000,};
	var slider=new Slider(options);
	slider.init();
	
	var prev=document.getElementById("prev");
	if(prev){
		prev.onclick=function(){
			slider.prev();
		};
	}
	var next=document.getElementById("next");
	if(next){
		next.onclick=function(){
			slider.next();
		};
	}
	var jump=document.getElementById("jump");
	var count=document.getElementById("count");
	if(jump){
		jump.onclick=function(){
			slider.scrollMount(count.value);
		};
	}
	
	
});