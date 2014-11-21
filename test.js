define(function(require, exports, module) {
	var Slider=require("./slider");
	var options={"id":"slider","slider":true,"debug":false,"direction":"left","scrollTime":5000,"oneByOne":true};
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