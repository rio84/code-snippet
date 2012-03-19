/*==============================================
	javascript library  -- DEVTOOL

	@author:wur

	@date:2010.11.8

	@version:1.0

	@discription:用于ＪＳ开发和调试的一些方法

	@update&new feature:

================================================*/
(function (w){
	/*
		在页面上打印一个字符串
		参数：s--(String)
	*/
	var toString=Object.prototype.toString;

	w.printOut=function(s){
		if(typeof s == "object"){
			if(toString.call(s)==="[object Array]"){
				s=" [ "+s.toString()+" ] ";
			}else{
				var a=[];
				for(var k in s){
					a[a.length]=k+" : "+s[k];
				}
				s = " { "+a.join(" , ")+" }";
			}
			
		}else if(typeof s=="string"){
			s= "\""+s+"\"";
		}else{
			s=s.toString();
		}
		document.body.appendChild(document.createTextNode(s));
		return s;
	};
	
	/*
		将对象转换成键值对形式的字符串
		参数：obj--对象(Object)
		返回值：(String)
	*/
	w.printObject=function(obj){
		if(typeof obj=="object"){
			var a=[];
			for(var k in obj){
				a[a.length]=k+" : "+obj[k];
			}
			return " { "+a.join(" , ")+" }";

		}else{
			return obj.toString();
		}
	};

	/*
		以双引号包含当前字符串输出
		参数：s--(String)
		返回值：(String)
	*/
	w.printString=function(s){
		return "\""+s+"\"";
	};
	

	/*
		查看一个函数的运行时间
		参数：fn--(Function)
			args--(Array)给函数传递的参数
	*/
	w.printTimespan=function(fn,args){
		if(typeof fn == "function"){
			if(!(args&&args.length)){
				args=[];
			}
			var start=new Date().getTime();
			fn.apply(window,args);
			var timeSpan=new Date().getTime()-start;
			this.print(timeSpan+"ms");
		}else{
			throw new Error("第一个参数的类型不是函数");
		}
	};




})(window);
