/*==============================================
	javascript library

	@author:wur

	@date:2010.11.5

	@version:1.0

	@discription:

	@remark: Depends on jQuery;

	@update&new feature:

================================================*/


/*==============================================
	form validate
*/

/*//方法返回值: true - 通过验证;false - 未通过验证
	this指向当前验证的DOM
*/
ValidateMethods={
	emptykey:function(){//空值
		return /\S/.test(this.value);
	},
	shortkey:function(){//输入长度不够，配合minlength属性使用
		return (!this.value)||this.value.length>=this.getAttribute("minlength");
	},
	longkey:function(){//输入字符串太长，配合maxlength属性使用
		return (!this.value)||this.value.length<=this.getAttribute("maxlength");
	},
	minkey:function(){//字符太小
		return (!this.value)||this.value-0>=this.getAttribute("min")-0;
	},
	maxkey:function(){//字符太大
		return (!this.value)||this.value-0<=this.getAttribute("max")-0;
	},
	ltkey:function(){//输入数字要小于某个值
		return (!this.value)||this.value-0<this.getAttribute("lt")-0;
	},
	gtkey:function(){//输入数字要大于某个值
		return (!this.value)||this.value-0>this.getAttribute("gt")-0;
	}
	,numberonly:function(){//只允许数字
		return (!this.value)||!(/\D/.test(this.value));
	}
	,wordonly:function(){//只允许字母和数字
		return (!this.value)||/^\w*$/.test(this.value);
	},
	moneyonly:function(){//浮点型数字验证
		return (!this.value)||/^\d+(\.\d+)?$/.test(this.value);
	},
	cnonly:function(){//验证输入为中文字符
		return (!this.value)||/^[\u4e00-\u9fa5]*$/.test(this.value);
	},
	charonly:function(){//允许输入中文、字母和数字
		return (!this.value)||/^[a-zA-Z0-9\u4e00-\u9fa5]*$/.test(this.value);
	},
	email:function(){//验证email
		return (!this.value)||/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.value);
	},
	emails:function(){//验证多个email，以","隔开
		return (!this.value)||/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*(,\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*$/.test(this.value);
	},
	telephone:function(){//验证电话号码
		return (!this.value)||/^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})(\-[0-9]{1,6})?$/.test(this.value);
	},
	telephones:function(){//验证多个电话号码，以","隔开
		return (!this.value)||/^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})(\-[0-9]{1,6})?(,(0[0-9]{2,3}\-)([2-9][0-9]{6,7})(\-?[0-9]{1,6})?)*$/.test(this.value);
	},
	mobile:function(){//手机号验证
		return (!this.value)||/^(1\d{10})$/.test(this.value);
	},
	mobiles:function(){//多个手机号验证，以","隔开
		return (!this.value)||/^(1\d{10})(,1\d{10})*$/.test(this.value);
	},
	qq:function(){//验证QQ号码，支持邮箱地址
		return (!this.value)||/^[1-9]\d{4,9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.value);
	},
	qqs:function(){//验证多个QQ号码，以","隔开
		return (!this.value)||/^([1-9]\d{4,9}|\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)(,([1-9]\d{4,9}|\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*))*$/.test(this.value);
	},
	
	ip:function(){//Ip地址验证
		return (!this.value)||/^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/.test(this.value);
	}
	,idcard:function(){//身份证号码验证
		var idNumber = this.value.toString();   
		if(!this.value){return true;};
		var intStrLen = idNumber.length;
		var factorArr = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1];
		var error;
		var varArray = [];
		var intValue;
		var lngProduct = 0;
		var intCheckDigit;
		
		var checkDate=function(date){
				return /(((1[9])?[0-9]{2})|(20\d{2}))((0[1-9])|(1[0-2]))((0[1-9])|(1[0-9])|(2[0-9])|(3[01]))/.test(date);
			};
		// initialize
		if ((intStrLen != 15) && (intStrLen != 18)) {
			return false;
		}    
		// check and set value
		for(i=0;i<intStrLen;i++) {
			varArray[i] = idNumber.charAt(i);
			if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
				//error = "错误的身份证号码！.";
				//console.log(error);
				return false;
			} else if (i < 17) {
				varArray[i] = varArray[i]*factorArr[i];
			}
		}
		if (intStrLen == 18) {
			//check date
			var date8 = idNumber.substring(6,14);
			if (!checkDate(date8)) {
				//error = "身份证中日期信息不正确！.";
				//console.log(error);
				//alert(error);
				return false;
			}        
			// calculate the sum of the products
			for(i=0;i<17;i++) {
				lngProduct = lngProduct + varArray[i];
			}        
			// calculate the check digit
			intCheckDigit = 12 - lngProduct % 11;
			switch (intCheckDigit) {
				case 10:
					intCheckDigit = 'X';
					break;
				case 11:
					intCheckDigit = 0;
					break;
				case 12:
					intCheckDigit = 1;
					break;
			}        
			// check last digit
			if (varArray[17].toUpperCase() != intCheckDigit) {
				//error = "身份证效验位错误!...正确为： " + intCheckDigit + ".";
				//console.log(error);
				return false;
			}
		} 
		else{        //length is 15
			//check date
			var date6 = idNumber.substring(6,12);
			if (!checkDate(date6)) {
				//error="身份证日期信息有误！";
				//console.log(error);
				return false;
			}
		}
		return true;
	},
	charfilter:function(){//过滤特殊字符 +*\|^?$'%<>  
		return (!this.value)||!/[\+\*\\\|\^\?\$\'\%\<\>]/.test(this.value);
	},
	pswkey:function(){//输入内容为字母和数字的组合（用于密码判断）
		return (!this.value)||/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i.test(this.value);
	},
	domain:function(){//域名
		return (!this.value)||/^([0-9a-z\-]+)(\.[0-9a-z\-]+)?(\.[a-z]{1,8}){1,3}$/i.test(this.value);
	},
	filefilter:function(){//上传文件名
		return (!this.value)||new RegExp("\\.("+this.getAttribute("filefilter")+")$").test(this.value);
	},
	exceptkey:function(){//禁止输入的符号
		return (!this.value)||!new RegExp("["+this.getAttribute("except")+"]").test(this.value);
	}

};

/*==============================================
	interface
*/
if(typeof jQuery !== "undefined"){
	//implement interface
}
/*==============================================
plugins
*/


/*==============================================
	more..
*/

//通过keyCode判断当前输入的字符类型
function getKeyType(e){
	if(!e)e=this;//this refer to event
	if(e.ctrlKey){return 0;}
	var keyCode=e.keyCode;
	if (keyCode>=65&&keyCode<=90){return 1;};//返回值为1，输入为字母
	if (keyCode>=96&&keyCode<=105){return 2;};//返回值为2，输入为数字
	if (keyCode>=48&&keyCode<=57&&!e.shiftKey){return 2;};//返回值为2，输入为数字
	if (keyCode>=48&&keyCode<=57&&e.shiftKey){return 3;};//返回值为3，输入为其它符号
	var otherCodes=[192,189,187,219,221,220,186,222,191,190,188,111,106,109,107,110];
	for(var k in otherCodes){
		if(keyCode==otherCodes[k]){return 3;}//返回值为3，输入为其它符号
	}
	return 0;//不是符号
}

//selection position
function getPos(elem){
	if(elem.selectionStart){
		return elem.selectionStart;
	}
	if(document.selection){
		var range=document.selection.createRange();
		range.moveStart("character",-elem.value.length);
		return range.text.length;
	}
	return 0;
};
	
(function($){//对jQuery扩展的一些公用的方法

	//只允许输入数字，扩展到jquery。（此方法只屏蔽输入，不能屏蔽复制，拖动到输入框的内容）
	$.fn.inputNumber=function(){
		return this.each(function(){
			$(this).keydown(function(e){
				var kc=getKeyType(e);
				if(kc!=2&&kc!=0){
					return false;
				}
			}).css("ime-mode","disabled");
			
		});
	};

	//允许输入带小数点的值
	$.fn.inputMoney=function(){
		
		return this.each(function(){
			$(this).keydown(function(e){
	
				var kc=getKeyType(e);
				if(kc!=0){
					if((e.keyCode==190&&!e.shiftKey)||(e.keyCode==110)){
						return true;
					}
					if(kc!=2){
						return false;
					}
				}
				
			}).css("ime-mode","disabled");
			
		});
	};

	
	//允许输入小数点后几位
	$.fn.allowpoint=function(){
		
		return this.each(function(){
			$(this).keydown(function(e){
				var num=this.getAttribute("allowpoint");
				if(num!==null&&isNaN(num))num=3;
				var kc=getKeyType(e);
				if(kc!=0){
					var index=this.value.indexOf(".");
					if(index>-1){
						if(getPos(this)>index&&this.value.length-index>num){//有小数点，已经有三位小数
							return false;
						}
					}
					//小数点
					else if((e.keyCode==190&&!e.shiftKey)||(e.keyCode==110)){
						return true;
					}
					if(kc!=2){
						return false;
					}
				}
				
			}).css("ime-mode","disabled");
			
		});
	};

	/*
		表单元素显示验证提示
		参数：
			str -- 提示内容，内容为空则表示输入正确
	*/
	$.fn.showTip=function(str){return this.siblings("._tip").text(str).removeClass("tip_error").addClass(str?"tip_error":"");};


})(jQuery);


//验证表单，参数oform--类型：element,说明：要验证的表单
function validateForm(oform){

	if(oform){
		var returnVal=true;
		oform=$(oform);
		var objs=oform.find("input:text,input:password,textarea").each(function(){
			var invalid_msg="",
			need_validate=false;//表示此表单是否需要验证
			for(var k in ValidateMethods){

				if(this.getAttribute(k)){
					need_validate=true;
					if(!ValidateMethods[k].call(this)){
						returnVal=false;
						if(k=="filefilter"){
							invalid_msg="不支持的文件类型";
						}else{
							invalid_msg=this.getAttribute(k);
						}
						break;
					}
				}

			}
			if(need_validate)$(this).showTip(invalid_msg);
		});

		var sameobj=objs.filter("input:text[samekey],input:password[samekey]");
		sameobj.each(function(i){
			
			if(i%2==0){
				var obj0=$(this),obj1=sameobj.eq(i-0+1);
				var val0=obj0.val(),val1=obj1.val();
				if(val0&&val1){
					if(val0!==val1){
						obj1.showTip(obj1.attr("samekey"));
						returnVal=false;
					}else if(!obj0.siblings(".tip_error").length){
						obj1.showTip("");
					}
				}
			}

		});

		return returnVal;
	}
	return false;

}
$(function(){
	
	//表单元素验证
	$("input:text,input:password,textarea").live("blur",function(e){
		
		var invalid_msg="",need_validate=false;
		for(var k in ValidateMethods){
			if(this.getAttribute(k)){
				need_validate=true;
				if(!ValidateMethods[k].call(this)){
					invalid_msg=this.getAttribute(k);break;
				}
			}

		}
		if(need_validate)$(this).showTip(invalid_msg);
	});

	$("form").bind("reset",function(){$(this).find("span._tip").html("").attr("class","_tip");});//form reset
});



