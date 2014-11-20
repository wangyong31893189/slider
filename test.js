define(function(require, exports, module) {
	var Slider=require("./slider");
	var options={"id":"slider","slider":true,"debug":true,"direction":"right","scrollTime":2000,"oneByOne":false};
	new Slider(options).init();
});