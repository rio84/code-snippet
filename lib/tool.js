/*==============================================
	javascript library  -- TOOL

	@author:wur

	@date:2010.11.8

	@version:1.0

	@discription:JS常用方法

	@update&new feature:

================================================*/

(function (w){
	
	/*
		判断两个一个元素是否包含另一元素。
		参数：a--包含元素
			 b--被包含元素
		返回值：true/false
	*/
	w.contains=function(a, b){
		return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
	};

	/*
		判断两个元素的位置关系
		返回值：0 - 二者相同
				2 - b在a之前
				4 - a在b之前
				10 - b包含a
				20 - a包含b
	*/
	w.comparePosition=function(a, b){
		return a.compareDocumentPosition ?
		a.compareDocumentPosition(b) :
		a.contains ?
		( a != b && a.contains(b) && 16 ) +
		( a != b && b.contains(a) && 8 ) +
		( a.sourceIndex >= 0 && b.sourceIndex >= 0 ?
		(a.sourceIndex < b.sourceIndex && 4 ) +
		(a.sourceIndex > b.sourceIndex && 2 ) :
		1 )  : 0;
	}

	//事件停止起泡
	w.cancelBubble=function(e){
			if(e===undefined){
				var callor=this.cancelBubble.caller;
				var e=window.event||callor.arguments[0];
			}
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble=true;
			}
	};

	//阻止浏览器默认行为
	w.preventDefault=function(e){
		if(!e)e=this;
		if ( e && e.preventDefault )
			e.preventDefault();
		else
			e.returnValue = false;
		   
		return false; 
	};
	
	/*
		获得渲染的样式
		elem - (HTMLElement)
		css - (String)样式名
	*/
	w.renderCss=function(elem,css){
		if(elem.currentStyle){
			return elem.currentStyle[css];
		}else if(document.defaultView){
			return document.defaultView.getComputedStyle(elem,false)[css]||"";
		}else{
			return "";
		}
	};

	/*
		通过keyCode判断当前输入的字符类型
		参数：e--事件对象
		返回值：0--不是符号
				1--字母
				2--数字
				3--其它符号
	*/
	w.getKeyType=function(e){
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
	};
	
	/*
		获得文本框中光标的位置
		参数：elem--文本框对象
		返回值：(Number)
	*/
	w.getPos=function(elem){
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

	/*
		获得元素已定义的属性
		参数：elem--对象
		返回值：(Array)JSON,形式如[{name:***,value:***},{name:***,value:***},...]
	*/
	w.getAttributes=function(elem){
		if(elem.attributes.length>60){//60只是个大概的数字,全部属性有70-80个，到100多个不等
			if(elem.outerHTML){
				var s=elem.outerHTML.replace(elem.innerHTML,""),
					a=s.match(/\w+\=([^\"\s]+|\"[^\"]+\")/g),
					ret=[];
				for(var i=0;i<a.length;i++){
					var ar=a[i].split("=");
					ret[ret.length]={
						name:ar[0],
						value:ar[1]
					};

				}
				return ret;
			}
		}else{
			return elem.attributes;
		}
	};
	
	/*
		获得select当前选择项的文本
		参数：sel--(HTMLSelectElement)
		返回值：(String)
	*/
	w.getSelectedText=function(sel){
		if(sel&&sel.tagName&&sel.tagName=="SELECT"){
			var opt=sel.options[sel.selectedIndex];
			return opt.textContent||opt.innerText;
		}else{
			throw new Error("方法getSelectedText参数错误");
		}
	}
	
	/*
		去掉字符串中开始和结束的空格
	*/
	w.trim=function(s){
		return s.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
	};

	/*
		计算字符串的字节大小，一个中文算两个字节
		参数：s--字符串(String)
		返回值：(Number)
	*/
	w.byteLength=function(s){
		var ret=0;
		for(var i=0,s=s.split(""),len=s.length;i<len;i++){
			if(/[\u4e00-\u9fa5]/.test(s[i])){
				ret+=2;
			}else{
				ret++;
			}
		}
		return ret;
	};

	/*
		取得ＵＲＬ的参数
		参数：name--参数名(String)
		返回值：(String)/null
	*/
	w.queryString=function(name){
		var arr=location.search.match(new RegExp("([\\?\\&]"+name+"=)([^\\&]*)($|[\\&])"));
		if(arr&&arr[2]){return arr[2];}
		else{return null;}
	};

	/*
		cookie的读、写、删
	*/
	w.Cookie={
		get:function(name){
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null) return unescape(arr[2]); return null;
		},
		set:function(name,value,days){
			var days=parseFloat(days||30); //默认情况，此 cookie 将被保存 30 天
			var exp  = new Date();    //new Date("December 31, 9998");
			exp.setTime(exp.getTime() + days*24*60*60*1000);
			document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
		},
		del:function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=this.get(name);
			if(cval!=null) document.cookie=name +"="+cval+";expires="+exp.toGMTString();
		}
	};	

	/*
		cookie操作
		参数：name--(String)cookie名
			value--(String)值，不传此参数，则此方法为get cookie
			options--(Object)可选项，设置cookie的expires,path,domain,secure等。
	*/
	w.cookie = function(name, value, options) {
		if (typeof value != 'undefined') { 
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); 
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { 
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = this.trim(cookies[i]);
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
};

	/*
		复制到剪贴板
		参数：txt--所复制的内容
	*/
	w.copyToClipboard=function(txt){
		if (window.clipboardData) {
			window.clipboardData.clearData();
			window.clipboardData.setData("Text", txt);
		} else if (navigator.userAgent.indexOf("Opera") != -1) {
			window.location = txt;
		} else if (window.netscape) {
			try {netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");} catch(e) {
				alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
			}
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip)return;
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans)return;
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			var copytext = txt;
			str.data = copytext;
			trans.setTransferData("text/unicode", str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			if (!clip)return false;
			clip.setData(trans, null, clipid.kGlobalClipboard);
			alert("复制成功！")
		}
	};
	
	/*
		添加收藏
	*/
	w.addFavorite=function(){
		//收藏本站
		if (document.all){
			window.external.addFavorite(location.href,document.title);
		}else if (window.sidebar){
			window.sidebar.addPanel(document.title, location.href, "");
		}
	};
	
	/*
		设为首页
	*/
	w.setHome=function(url){
		var url=url||location.href;
        try{
            document.body.style.behavior='url(#default#homepage)';document.body.setHomePage(url);
        }
        catch(e){
			if(window.netscape){
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}
				catch (e) {
					alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
				}
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
				prefs.setCharPref('browser.startup.homepage',url);
			 }
        }
	};
	
	/*
		序列化表单
		参数：F - (HTMLFormElement)
			separator - (String)多选项checkbox;多个值间的分隔字符
		返回：(Object){name:value,name:value}
	*/
	w.serializeForm=function(F,separator){
		if(!separator)separator=",";
		if(F.tagName!="FORM"){throw new Error("第一个参数不是FORM");};
		var R=new Param;
		for(var i=0,items=F.elements,len=items.length;i<len;i++){
			var item=items[i];
			switch(item.tagName){
				case "INPUT":
					switch(item.type){
						case "checkbox":
						case "radio":
							if(item.checked){
								if(item.name in R){
									R[item.name]+=(separator+item.value);
								}else{ R[item.name]=item.value; }
							}
						break;

						case "file":
						case "hidden":
						case "password":
						case "text":
							R[item.name]=item.value;
						break;
					}
				break;

				case "SELECT":
				case "TEXTAREA":
					R[item.name]=item.value;
				break;
			}
			
		}
		return R;
	};
	/*
		添加样式
	*/
	w.addClass=function(elem,cname){ 
		elem.className=elem.className?(elem.className+" "+cname):cname; return elem;
	};
	/*
		移除样式
	*/
	w.removeClass=function(elem,cname){ 
		if(cname===undefined){ 
			elem.className="";
		}else{ 
			elem.className=elem.className.replace(new RegExp("\\s?"+cname+"\\b"),"");
		};
		return elem;
	};
	
	/*
		添加事件
	*/
	w.addEvent=function(elem,type,fn){
		if(elem.addEventListener){
			elem.addEventListener(type,fn,false);
		}else {
			elem.attachEvent("on"+type,fn);
		}
		return elem;
	};

	/*
		移除事件
	*/
	w.removeEvent=function(elem,type,fn){
		if(elem.addEventListener){
			elem.removeEventListener(type,fn,false);
		}else if(elem.attachEvent){
			elem.detachEvent("on"+type,fn);
		}
		return elem;
	};

	/*
		获得在相同标签中的索引
	*/
	w.getIndex=function(elem){
		var k=0,node=elem,tagName=elem.tagName;
		while( node=node.previousSibling){
			if(node.tagName===tagName){k++;}
		}
		return k;
	};

})(window);


