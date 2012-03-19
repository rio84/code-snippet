/*==============================================
	javascript library  -- SOLUTION

	@author:wur

	@date:2010.11.8

	@version:1.0

	@discription:ＪＳ解决方案集锦

	@remark:依赖tools.js

	@update&new feature:

================================================*/
if(typeof jQuery == "undefined"){
	throw new Error("jQuery 未定义");
}
var j=jQuery;
/*
	弹出层内数据绑定
*/

	/*获得表单控件显示的文字，规则如下：
		radio/checkbox - 显示此控件后面的文字
		select - 显示控件选中的文本
		其它 - 返回value值
		参数：sel--(HTMLSelectElement)
		返回值：(String)*/
	function getControlText(obj){
		if(!obj.length||obj.length==1){
			obj=obj[0];
			if(obj.tagName=="INPUT"){
				switch(obj.type){
					case "radio":
					case "checkbox":
					return obj.nextSibling.nodeValue||"";
					default:
					return obj.value;
					
				};
			}else if(obj.tagName=="SELECT"){
				return getSelectedText(obj);//depends on tools.js
			}else{
				return obj.value;
			}
			
		}else{
			var txtArr=[];
			for(var i=0;i<obj.length;i++){
				if(obj[i].checked){
					txtArr.push(obj[i].nextSibling.nodeValue);
				}
			}
			return txtArr.join(",");
		}
	}
function popupDataTransfer(parentTable){
	parentTable.find("[fieldname]").each(function(){
		var name=this.getAttribute("fieldname");
		if(j("[name='"+name+"']").parents("tr:first").is(":visible")){
			j(this).parents("tr:first").show();
			this.innerHTML=getControlText(document.getElementsByName(name));
		}else{
			j(this).parents("tr:first").hide();
		}
		
	});
}


/*
	表单验证
*/
	/*
		表单元素显示验证提示
		参数：
			str -- 提示内容，内容为空则表示输入正确
	*/
	$.fn.showTip=function(str){return this.siblings("._tip").text(str).removeClass("tip_error").addClass(str?"tip_error":"");};

	
	/*
		重写jquery val方法，使其触发 onValueChange 事件

	*/
	if(typeof(__tmpVal)=="undefined"){
		var __tmpVal=$.fn.val;
		$.fn.val=function(){var ret= __tmpVal.apply(this,arguments);if(arguments[0]){this.trigger("onValueChange");}return ret;};
	};
	

/*
	popup
*/