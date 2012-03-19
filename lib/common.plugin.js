/*==============================================
	javascript library -- common plugin

	@author:wur

	@date:2010.11.9

	@version:1.0

	@discription:通用组件

	@remark: ;

	@update&new feature:

================================================*/


 var keyCode = {
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };


/*==================================================================
	Tiny library
*/
//Class Dom's constructor
function Dom(tag){
	return this.init(tag);
}
Dom.prototype={
	show:function(){this.style.display="";return this;},
	hide:function(){this.style.display="none";return this;},
	remove:function(){this.parentNode.removeChild(this);return this;},

	addClass:function(cname){
		this.className=this.className?(this.className+" "+cname):cname;
		return this;
	},
	removeClass:function(cname){
		if(cname===undefined){
			this.className="";
			
		}else{
			this.className=this.className.replace(new RegExp("\\s?"+cname+"\\b"),"");
		}
		return this;
	},
	isShow:function(){
		return this.style.display!="none";
	},
	
	bind:function(type,handler){//bind event to element
		if(this.addEventListener){
			this.addEventListerner(type,handler,false)
		}else if(this.attachEvent){
			this.attachEvent("on"+type,handler);
		}
		return this;
	},
	unbind:function(type,handler){
		if(this.removeEventListener){
			this.removeEventListener(type,handler,false);

		}else if(this.detachEvent){
			this.detachEvent("on"+type,handler);
		}
		return this;
	},
	getAttrs:function(){//获得当前元素所有属性
		if(this.outerHTML){
			var reg=new RegExp("<"+this.tagName+"\\s?");
			var s=this.outerHTML.split(">")[0].replace(reg,"").toLowerCase().split(" ");

			var ret=[];
			for(var i=0;i<s.length;i++){

				ret[i]={};
				ret[i].name=s[i].split("=")[0];
				ret[i].value=s[i].split("=")[1];
			}
			return ret;

		}else if(this.attributes){
			return this.attributes;
		}
	},

	init:function(tag){
		var dom=(typeof tag=="object")?tag:document.createElement(tag);
		for(var k in this){
			if(k!="init"){
				dom[k]=this[k];
			}
		}
		return dom;
	}
};

//class SortTable
/*==================================================================
	tbody -- Tbody Element
	fieldIndex -- which field. It's td's index
	isString -- if it's true, compare by string, otherwise sort by Number;

	update:2010.12.8:  appendChild to frament first, them append to tbody

*/
function SortTable(tbody,fieldIndex,isString){
	if(!tbody.tagName||tbody.tagName!="TBODY"){throw new Error("SortTable实例化时第一个参数不是tbody");}
	if(!fieldIndex)var fieldIndex=0;
	var isString=!!isString;

	var trs=[];
	
	for(var j=0,items=tbody.rows,len=items.length;j<len;j++){
		trs[trs.length]=items[j];
	}
	
	
	var fields=[];

	for(var i=0;i<trs.length;i++){
		var td=trs[i].cells[fieldIndex];
		var field=td.textContent||td.innerText;
		
		fields[fields.length]=isString?field:(parseFloat(field));
		
	}
	
	this.onSort=function(){};
	

	this.sort=function(reverse){
		if(!reverse){
			reverse=false;
		}else{
			reverse=true;
		}
		
		//sort fields
		for(var m=0;m<fields.length;m++){

			for(var n=m+1;n<fields.length;n++){
				if((fields[m]>fields[n])==reverse){
					var tmp=fields[m];
					fields[m]=fields[n];
					fields[n]=tmp;

					var tmp=trs[m];
					trs[m]=trs[n];
					trs[n]=tmp;
				}
			}
		}
		var fragment=document.createDocumentFragment();
		for(var k=0;k<trs.length;k++){
			fragment.appendChild(trs[k]);
		}
		tbody.appendChild(fragment);
		if(typeof(this.onSort)=="function"){
			this.onSort();
		}
	};


}

/*==================================================================
//Class Select's constructor
	version:1.2.1
	update:2010.11.23 键盘方向阻止默认行为
		2010.11.23 设置前后值一样、初始化设置值时皆不触发onchange事件

Depends on style:
<style>
ul,li{margin:0;padding:0;list-style:none;}
.sel{ background:url(sel.png) no-repeat right center;  border:solid 1px #7F9DB9; cursor:default; font-family:宋体; font-size:13px; }
.hover{ background:url(sel-hover.png) no-repeat right center; }
.opt{ background-color:#FFFFFF; border:solid 1px #7F9DB9; cursor:default; font-family:宋体; font-size:13px; }
.opt li{ display:block; width:100%; }
.opt li.now{ background-color:#316AC5; color:#FFF; }
</style>

Depends on Class Dom;
*/
function iSelect(src){
	
	this._init(src);
}
//depends on Class Dom;
iSelect.prototype={
	_selectingValue:null,//正选择的值，用于click,blur
	_selectedOption:null,//当前选项
	_index:0,
	_now:null,

	onChange:function(){},

	_init:function(src){
		if(src&&src.tagName&&src.tagName=="SELECT"){
			
			var options=src.options;

			var div=new Dom("span");
			div.style.display="inline-block";

			if(src.name){//如果有name属性，用一个hidden代替之
				var hideField=new Dom("input");
				hideField.type="hidden";
				hideField.name=src.name;
				hideField.value=src.value;
				this.hideField=hideField;

				div.appendChild(hideField);
			};


			var sel=this._createSelect(src);
			
			div.appendChild(sel);


			var ul=new Dom("ul");
	
			for(var i=0;i<options.length;i++){
				ul.appendChild(this._createOption(options[i].innerHTML,options[i].value,options[i].selected));
			}

			ul.style.width=(src.offsetWidth-2)+"px";
			ul.style.position="absolute";
			ul.hide();
			ul.className="opt"
			div.appendChild(ul);

			this.src=src;
			this.sel=sel;
			this.opt=ul;

			this._setValue(this._selectedOption.innerHTML,1);//设置初始值

			src.parentNode.replaceChild(div,src);
			

		}
	},
	_createSelect:function(src){

		var sel=new Dom("div");
		sel.tabIndex=0;
		sel.style.height=sel.style.lineHeight=(src.offsetHeight-2)+"px";
		sel.style.width=(src.offsetWidth-5)+"px";
		sel.style.paddingLeft=3+"px";
		sel.className="sel";
		
		if(src.getAttribute("onchange")!=null){
			this.onChange=new Function(src.getAttribute("onchange"));
			//alert(this.onChange+"   on");
		}

		var that=this;

		sel.onmouseover=function(){
			sel.addClass("hover");
		};
		sel.onmouseout=function(){
			sel.removeClass("hover");
		};

		sel.onclick=function(e){

			if(that.opt.isShow()){
				
				that._hideOption();
			}else{
				that._popupOption();
			}

		};


		sel.onblur=function(e){
			that._hideOption();
			that._setValue();
			
		};

		//键盘操作 方向键 IE下只有keydown keyup好用
		sel.onkeydown=function(e){
			e=e||window.event;
			switch(e.keyCode){
				case keyCode.UP:
				that._setStep(-1);
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue=false;
				}
				break;
				
				case keyCode.DOWN:
				that._setStep(1);
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue=false;
				}
				break;

				case keyCode.ENTER:
				if(that.opt.isShow()){
					that._hideOption();
					that._setStep(0);
				}
				break;

				case keyCode.ESCAPE:
				that._hideOption();
				break;
			}
			
		};
		return sel;
	},
	_createOption:function(txt,val,isNow){
		var that=this;
		var li=new Dom("li");

		li.setAttribute("index",this._index++);
		
		li.innerHTML=txt;

		if(val===undefined){
			val=txt;//
		}

		li.setAttribute("value",val)

		li.onmousedown=function(e){
			that._selectingValue=this.innerHTML;
			that._selectedOption=this;

		};
		li.onmouseover=function(){
			if(that._now){
				that._now.removeClass("now");	
			}
			that._now=li.addClass("now");;
		};
		if(isNow){
			this._selectedOption=li;

		}
		return li;
	},
	_setValue:function(val,_notrigger){
		if(this._selectingValue){
			var that=this;
			if(this.sel.innerHTML!=this._selectingValue){
				this.sel.innerHTML=this._selectingValue;
				if(!_notrigger)this.onChange();
			}
			setTimeout(function(){that.sel.focus();},1);
			this._selectingValue=null;	
		}else if(val){
			if(this.sel.innerHTML!=val){
				this.sel.innerHTML=val;
				if(!_notrigger)this.onChange();
			}
			
		}else{
			
		}
		if(this.hideField){
			this.hideField.value=this.val();
		}
		
	},
	//设置当前选项 step:-1或1,-1向上移动,1向下移动
	_setStep:function(step){
		if(step<0){
			if(this._now&&this._now.previousSibling){
				this._now.removeClass("now");
				this._now=this._now.previousSibling.addClass("now");
			}else if(!this._now){
				this._now=this.opt.lastChild.addClass("now");
			}
		}else if(step>0){

			if(this._now&&this._now.nextSibling){
				this._now.removeClass("now");
				this._now=this._now.nextSibling.addClass("now");
				
			}else if(!this._now){
				this._now=this.opt.firstChild.addClass("now");
			}
		}else if(step==0){
			
		}
		this._selectedOption=this._now;
		this._setValue(this._now.innerHTML);
		
		
	},
		//参数opt--object
	_setNow:function(opt){//将option对象设置为当前选中
		this._selectedOption=opt;
		this.sel.innerHTML=opt.innerHTML;
		if(this.hideField){
			this.hideField.value=opt.getAttribute("value");
		}
		this.onChange();
		return this;

	},
	_popupOption:function(){//弹出选项
		if(this._now){
			this._now.removeClass("now");
		}
		this._now=this._selectedOption.addClass("now");
		this.opt.show();
	},
	_hideOption:function(){//隐藏选项
		this.opt.hide();
	},
	val:function(){
		if(arguments[0]){//set
			var val=arguments[0];
			var obj=this._selectedOption;
			if(obj.getAttribute("value")!=val){

				var prev=obj,next=obj;
				while(next=next.nextSibling){
					if(next.getAttribute("value")==val){

						return this._setNow(next);
						 
					}
				}

				while(prev=prev.previousSibling){
					if(prev.getAttribute("value")==val){
						
						return this._setNow(prev);
					}
				}
				
			}
			
			return this;
		}else{//get
			return this._selectedOption.getAttribute("value");
		}
	},
	selectedIndex:function(){
		if(arguments[0]===undefined){//get
			return this._selectedOption.getAttribute("index");
		}else if(!isNaN(arguments[0])){//set

			var index=arguments[0];
			var obj=this._selectedOption;
			if(obj.getAttribute("index")!=index){

				var prev=obj,next=obj;

				while(next=next.nextSibling){
					if(next.getAttribute("index")==index){

						return this._setNow(next);
						 
					}
				}

				while(prev=prev.previousSibling){
					if(prev.getAttribute("index")==index){
						
						return this._setNow(prev);
					}
				}
				
			}
			
			return this;
		}
	}

};

/*==================================================================
	@author:WangHaiyang
	@date:2010.11
	@update:
	2010.11.22 重命名为Marquee
	2011.2.12 修改
	2011.3.8



轮播/翻滚/跑马灯

页面HTML结构要求：
<table>
	<tr>
		<td>
			<!---　此处为滚动的内容　-->
		</td>
	</tr>
</table>
				

Marquee()
    构造方法

init(roll_speed,roll_distance,roll_width,roll_element,auto_time)
    初始化
    参数：roll_speed - 动画执行一次滚动的时间间隔(ms)，越小越快
    roll_distance - 动画执行一次滚动的距离(px)，越大越快
    roll_width - 滚动可见区域宽度(px)
    roll_element - 滚动的对象(HtmlTableElement)
    auto_time - 滚动一屏的时间间隔(ms)
    返回：undefined

roll_left()
    向左滚动一屏
    返回：undefined

roll_right()
    向右滚动一屏
    返回：undefined

auto_play(dirc)
    开始自动滚动
    参数：dirc - "left"|"right" => 向左|向右 
    返回：undefined

loop
    (Boolean) 是否循环滚动

direction
    (String) 滚动方向。"x"|"y" => 横向|纵向;

end_right_func
    (Function) 非循环滚动，向右滚动到最右边时触发的方法

end_left_func
    (Function) 非循环滚动，向左滚动到最左边时触发的方法 
*/
function Marquee(){
		this.check_rollable = function(){
		
		this.width = this.direction=="y"?parseInt(this.roll_element.clientHeight):parseInt(this.roll_element.clientWidth);
		
		var td = this.roll_element.tBodies[0].rows[0].cells[0];
		var contentWidth = this.direction=="y"?parseInt(td.clientHeight):parseInt(td.clientWidth);
		if(contentWidth>this.roll_width) {
			this.rollable = true;
		} else {
            this.rollable = false
        }
		
		
		if(!this.rollable) {
			this.rollable_left = false;
			this.rollable_right = false;
			return;
		}
		
		
		if(this.loop) {
			this.rollable_left = true;
			this.rollable_right = true;
			
			if(this.width + this.left + this.moved_left < this.roll_width)
				this.add_element_to_right();
			else if( - this.left - this.moved_left < 0)
				this.add_element_to_left();
 
		}
		else {
			this.rollable_left = false;
			this.rollable_right = false;
			
			if(this.width + this.left + this.moved_left > this.roll_width){
				this.rollable_right = true;
			}
			if( - this.left - this.moved_left > 0){
				this.rollable_left = true;
			}
		}
		this.enable_btn();
	};	
	
	this.inited = false;
	this.init = function(roll_speed,roll_distance,roll_width,roll_element,auto_time){
		this.roll_speed = roll_speed;
		this.roll_distance = roll_distance;
		this.roll_width = roll_width;
		this.roll_element = roll_element;
		this.auto_time = auto_time;
		
		this.inited = true;
		
		if(this.loop) {
			var content = this.roll_element.tBodies[0].rows[0].cells[0].innerHTML;
			var newRow,newCell;
			newRow = this.roll_element.tBodies[0].insertRow(-1);
			if(this.direction =="y")// 纵向
				newCell = newRow.insertCell(-1);
			else// 横向
				newCell = this.roll_element.tBodies[0].rows[0].insertCell(-1);
			newCell.innerHTML = content;

			this.add_element_to_left();
		}
		
		
		this.roll_element.style.marginTop = "0px";
		this.roll_element.style.marginLeft = "0px";

		
		this.check_rollable();
	};
	
	this.add_element_to_right = function(){ 
		if(!this.inited) {
			return false;
		}
		else{
			var oFragment = document.createDocumentFragment();
			if(this.direction=="y"){
				oFragment.appendChild(this.roll_element.tBodies[0].rows[1]);
				this.left += this.width/2;
				this.roll_element.style.marginTop = this.left +"px";
				this.roll_element.tBodies[0].appendChild(oFragment);
			}
			else{
				oFragment.appendChild(this.roll_element.tBodies[0].rows[0].cells[0]);
				this.left += this.width/2;
				this.roll_element.style.marginLeft = this.left +"px";
				this.roll_element.tBodies[0].rows[0].appendChild(oFragment);
			}
			return true;
		}
	};
	this.add_element_to_left = function(){ 
		if(!this.inited) {
			return false;
		}
		else{
			var oFragment = document.createDocumentFragment();
			if(this.direction=="y"){
				oFragment.appendChild(this.roll_element.tBodies[0].rows[0]);
				this.left -= this.width/2;
				this.roll_element.style.marginTop = this.left +"px";
				this.roll_element.tBodies[0].appendChild(oFragment);
			}
			else {
				oFragment.appendChild(this.roll_element.tBodies[0].rows[0].cells[1]);
				this.left -= this.width/2;
				this.roll_element.style.marginLeft = this.left +"px";
				this.roll_element.tBodies[0].rows[0].appendChild(oFragment);
			}
			return true;
		}
	};
	// 自动翻页
	this.auto_play = function(auto){
		if(!this.rollable_right) return;
		this.auto = auto;
		if(!auto) return false;
		
		(function(thisElement){
			if(thisElement.auto_timer>0) window.clearTimeout(thisElement.auto_timer);
			thisElement.auto_timer = window.setTimeout(function(){if(thisElement.auto=="left")thisElement.roll_left();else thisElement.roll_right();},thisElement.auto_time);
		})(this);
	};
 
	// 向前翻页
	this.roll_left = function(){
		this.roll_direction = "to_left";
 		this.check_rollable();
 		if(!this.rollable_left) return;
 		
		if(this.rolling) {
			(function(thisElement){
				if(thisElement.wait_timer>0) window.clearTimeout(thisElement.wait_timer);
				thisElement.wait_timer = window.setTimeout(function(){thisElement.roll_left();},50);
			})(this);
		}
		else this.roll_pos();
		
	};
	this.roll_right = function(){
		this.roll_direction = "to_right";
		this.check_rollable();
		if(!this.rollable_right) return;
		
		if(this.rolling) {
			(function(thisElement){
				if(thisElement.wait_timer>0) window.clearTimeout(thisElement.wait_timer);
				thisElement.wait_timer = window.setTimeout(function(){thisElement.roll_right();},50);
			})(this);
		}
		else this.roll_pos();
		
	};
 
 
	// 属性
	this.roll_speed = 30;// 滚动单位时间间隔(越小越快)
	this.roll_distance = 101;// 滚动单位距离(越大越快)
	this.roll_width = 800;// 有效可视范围(横向)
	this.width = 1800;// 滚动内容实际宽度
	this.auto_time = 3000;// 自动滚动时间间隔(单位:毫秒)
	
	this.roll_element = null;
	this.btn_left = {};
	this.btn_right = {};
	
	this.roll_timer = null;
	this.wait_timer = null;
	this.auto_timer = null;
	
	this.width = this.roll_element == null ? 0 : (this.direction=="y"?parseInt(this.roll_element.clientHeight):parseInt(this.roll_element.clientWidth));
	
	// 状态
	this.rollable = false;
	this.rollable_left = false;
	this.rollable_right = false;	
	this.rolling = false;
	this.loop = true;
	this.auto =  false;
	
	// 回调函数
	this.end_left_func = null;
	this.end_right_func = null;
	
	this.direction = "x";
	this.roll_direction = "to_left";
	this.left = 0;
	this.moved_left = 0;
	
	
	// 滚动到指定位置
	this.roll_pos = function(){	
		this.check_rollable();
		if(!this.rollable_left&&!this.rollable_right) 
			return false;
		var mleft = 0;this.rolling = true;
		
		if(this.roll_direction == "to_right"){
			// 再移一格就超过一屏
			if(-this.moved_left>this.roll_width-this.roll_distance) {
				mleft = this.left - this.roll_width;
				this.roll_timer=-1;
				this.moved_left = 0;
				if(this.auto) this.auto_play(this.auto);
				this.rolling = false;
				this.left = mleft;
			}
			// 未超过一屏
			else {
				// 能再移一格
				if(this.width + this.left - this.roll_width + this.moved_left > this.roll_distance) {
					this.moved_left -= this.roll_distance;
					mleft = this.left + this.moved_left;
					
					(function(thisElement){
						if(thisElement.roll_timer>0) window.clearTimeout(thisElement.roll_timer);
						thisElement.roll_timer = window.setTimeout(function(){thisElement.roll_pos();},thisElement.roll_speed);
					})(this);
	 			 	
				}
			    else {
			    	// 是否是循环
			    	if(!this.loop) {
			    		mleft = this.roll_width - this.width;
						this.roll_timer=-1;
						this.moved_left = 0;
						if(this.auto) this.auto_play(this.auto);
						this.rolling = false;
						this.left = mleft;
						
						this.left_end();
			    	}
			    	else {
			    		this.add_element_to_right();
			    		
			    		this.moved_left -= this.roll_distance;
						mleft = this.left + this.moved_left;
						// 准备本屏下一次移动
						(function(thisElement){
							if(thisElement.roll_timer>0) window.clearTimeout(thisElement.roll_timer);
							thisElement.roll_timer = window.setTimeout(function(){thisElement.roll_pos();},thisElement.roll_speed);
						})(this);
			    	}
				}  	         
 
			}
		};
		if(this.roll_direction == "to_left"){
			// 再移一格就超过一屏
			if(this.moved_left > this.roll_width-this.roll_distance) {
				mleft = this.left + this.roll_width;
				this.roll_timer=-1;
				this.moved_left = 0;
				if(this.auto) this.auto_play(this.auto);
				this.rolling = false;
				this.left = mleft;
				
			}
			// 未超过一屏
			else {
				// 能再移一格
				if((-this.left) - this.moved_left > this.roll_distance) {
					this.moved_left += this.roll_distance;
					mleft = this.left + this.moved_left;
					
					(function(thisElement){
						if(thisElement.roll_timer>0) window.clearTimeout(thisElement.roll_timer);
						thisElement.roll_timer = window.setTimeout(function(){thisElement.roll_pos();},thisElement.roll_speed);
					})(this);
 					
				}
			    else {
			    	// 是否是循环
			    		if(!this.loop) {
			    		mleft = 0;
						this.roll_timer=-1;
						this.moved_left = 0;
						if(this.auto) this.auto_play(this.auto);
						this.rolling = false;
						this.left = mleft;
						
						this.right_end();
			    	}
			    	else {
			    		this.add_element_to_left();
			    		
			    		this.moved_left += this.roll_distance;
						mleft = this.left + this.moved_left;
						// 准备本屏下一次移动
						(function(thisElement){
							if(thisElement.roll_timer>0) window.clearTimeout(thisElement.roll_timer);
							thisElement.roll_timer = window.setTimeout(function(){thisElement.roll_pos();},thisElement.roll_speed);
						})(this);
			    	}
				}  	         
 
			}
		}
		if(this.direction=="y")
			this.roll_element.style.marginTop = mleft + "px";
		else
			this.roll_element.style.marginLeft = mleft + "px";
		this.check_rollable();
 
	};
	
	this.right_end = function(){
		if(typeof(this.end_right_func)=="function") this.end_right_func();
	};
	this.left_end = function(){
		if(typeof(this.end_left_func)=="function") this.end_left_func();
	};
	
	this.enable_btn = function(){
	};
}

function Calendar(){

}


//广告轮播
/*
	@author:wurui
	@date:2010.12.22

	构造方法：AdSlider(tabbox,contentbox,currentIndex)　——参数：tabbox - 用于切换的菜单容器(HTMLElement),contentbox - 内容容器(HTMLElement),currentIndex-当前选择的索引，默认为0
	公共属性：goNext() - 向后翻滚
			goPrev() - 向前翻滚
			goIndex(index) - 翻滚到指定的索引,参数:index - 指定的索引(Number)
			pause() - 暂停
			autoGo(delay) - 开始自动播放，参数：delay - 自动切换的时间间隔，默认为 3*1000(ms)

*/
function AdSlider(tabbox,contentbox,currentIndex){
	//private properties
	var
	_currentIndex=currentIndex||0,
	_tabArr=[],
	_contentArr=[],

	_isautoscrolling=false,
	_count=0,
	_timer=null,
	_delay=3*1000,
	_showIndex=function(idx){
		idx=(idx<0?0:idx)>=_count?_count-1:idx;
		if(_tabArr[idx]){
			_tabArr[_currentIndex].className=_tabArr[_currentIndex].className.replace(/s?selected\b/,"");
			_tabArr[idx].className+=" selected";
		}
		if(_contentArr[idx]){
			_contentArr[_currentIndex].style.display="none";
			_contentArr[idx].style.display="block";
			_currentIndex=idx;
		}
	},
	_goNext=function(){var nextIndex=_currentIndex-0+1>=_count?0:_currentIndex-0+1; _showIndex(nextIndex);},
	_goPrev=function(){var prevIndex=_currentIndex-1<0?_count-1:_currentIndex-1;_showIndex(prevIndex);},
	_goIndex=function(index){
		if(_isautoscrolling){ _pause(); }
		if(_currentIndex!=index)_showIndex(index);
	},
	_pause=function(){
		if(_timer){
			clearTimeout(_timer);
			_timer=null;
			_isautoscrolling=false;
		}
	},
	_playNextSlider=function(){
		if(_timer){
			_goNext();
		}
		_timer=setTimeout(_playNextSlider,_delay);
		
	};
	if(tabbox){
		for(var i=0,nodes=tabbox.childNodes,len=nodes.length;i<len;i++){
			var node=nodes[i];
			if(node.nodeType==1){
				_tabArr[_tabArr.length]=node;
			}
		}
	}
	if(contentbox){
		for(var i=0,nodes=contentbox.childNodes,len=nodes.length;i<len;i++){
			var node=nodes[i];
			if(node.nodeType==1){
				_contentArr[_contentArr.length]=node;
				_count++;
			}
		} 
	}
	//public properties
	this.goNext=_goNext;
	this.goPrev=_goPrev;
	this.goIndex=_goIndex;
	this.pause=_pause;
	this.autoGo=function(delay){
		if(!_isautoscrolling){
			_delay=delay||_delay;
			_playNextSlider();
			_isautoscrolling=true;
		}
	};
}


/*
//tab切换效果
	@author:wurui
	@date:2010.12.30

	构造方法：Tab(tabbox,contentbox,eventname,currentIndex)　
				——参数：tabbox - 用于切换的菜单容器(HTMLElement),
						contentbox - 内容容器(HTMLElement),
						eventname - 触发切换动作的事件名，默认为"click"
						currentIndex-当前选择的索引，默认为0
	样式要求：tab样式名符合 XXXtab_item,选中样式为：XXXtab_item_selected
	@update:
			2011.1.24 初始时候重置tab的样式
			2011.1.30 添加事件onTabChange
			2011.6.29 onTabChange多传了两个参数

*/
function Tab(tabbox,contentbox,eventname,currentIndex){
	var 
	_self=this,
	_arrtab=[],
	_arrcontent=[],
	_currentindex=currentIndex||0,
	_evtname=eventname||"click",

	_removeSelectedClass=function(elem){
		elem.className=elem.className.replace(/(tab_item)_selected\b/,"$1");
	},
	_addSelectedClass=function(elem){
		elem.className=elem.className.replace(/tab_item\b/,"tab_item_selected");
	},
	_showIndex=function(idx){
		if(idx!=_currentindex){
			
			_removeSelectedClass(_arrtab[_currentindex]);
			if(_arrcontent[_currentindex])_arrcontent[_currentindex].style.display="none";

			_currentindex=idx;

			_addSelectedClass(_arrtab[_currentindex]);
			if(_arrcontent[_currentindex])_arrcontent[_currentindex].style.display="";
			if(typeof _self.onTabChange=="function")_self.onTabChange.call(_self,_currentindex,_arrtab[_currentindex],_arrcontent[_currentindex]||undefined);
		}
	},
	_evthanlder=function(e){
		var tar=e.srcElement||e.target;
		
		if(tar.getAttribute("customtabindex")!=null){
			_showIndex(tar.getAttribute("customtabindex"));
		}else{//可能是tab子节点触发，向上找三层
			var i=3;
			tar=tar.parentNode;
			while(tar&&tar.nodeType==1&&i>0){

				if(tar.getAttribute("customtabindex")!=null){
					_showIndex(tar.getAttribute("customtabindex"));
					break;
				}
					
				tar=tar.parentNode;
				i--;
			}
		}
	};
	
	if(tabbox){
		for(var i=0,nodes=tabbox.childNodes,node=nodes[i],len=nodes.length;i<len;i++,node=nodes[i]){
			if(node.nodeType==1){
				node.setAttribute("customtabindex",_arrtab.length);
				_removeSelectedClass(node);
				if(_arrtab.length==_currentindex){
					_addSelectedClass(node);
				}
				_arrtab[_arrtab.length]=node;
			}
		}
	}
	if(contentbox){
		for(var i=0,nodes=contentbox.childNodes,node=nodes[i],len=nodes.length;i<len;i++,node=nodes[i]){
			if(node.nodeType==1){
				if(_arrcontent.length!=_currentindex){
					node.style.display="none";
				}else{
					node.style.display="";
				}
				_arrcontent.push(node);
			}
		}
	}
	
	if(tabbox.attachEvent){
		tabbox.attachEvent("on"+_evtname,_evthanlder);
	}else if(tabbox.addEventListener){
		tabbox.addEventListener(_evtname,_evthanlder,false);
	}else{
		tabbox["on"+_evtname]=_evthanlder;
	}
	
}