/*==============================================
	javascript library

	@author:wur

	@date:2010.11.5

	@version:1.0

	@discription:

	@update&new feature:

================================================*/

function getJsPath(){
	for(var i=0,scripts=document.getElementsByTagName("script"),len=scripts.length;i<len;i++){

		if(/(^|\/)all\.js(\?.+)?$/i.test(scripts[i].src)){
			return scripts[i].src.replace(/all.js(\?.+)?$/i,"")
		}
	}
	throw new Error("找不到'all.js'");
}
var jsPath=getJsPath();
function include(name){
	if(!/\.js$/.test(name)){name+=".js";}
	var js=document.createElement("script");
	js.type="text/javascript";
	if(name.indexOf("/")>-1){
		js.src=name;
	}else{
		js.src=jsPath+name;
	}
	document.getElementsByTagName("head")[0].appendChild(js);
}
include("tool");
include("devtool");
include("common.plugin");
include("jquery.plugin");
include("validate");
