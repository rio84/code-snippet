/*==========================================================*
	Menu 
	通过json生成一个多级菜单

	@author:wurui
	@date:2010.12.2

-*----------------------------------------------------------*/

/* tiny library */
var createDiv=function(A){
	var div=document.createElement("div");
	for(var k in A){
		if(typeof div[k] == "undefined"){
			div.setAttribute(k,A[k]);
		}else{
			div[k]=A[k];
		}	
	}
	return div;
};
var addClass=function(elem,cname){ elem.className=elem.className?(elem.className+" "+cname):cname; return elem; },
	removeClass=function(elem,cname){ if(cname===undefined){ elem.className="";}else{ elem.className=elem.className.replace(new RegExp("\\s?"+cname+"\\b"),""); }; return elem; },
	contains=function(a, b){ return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16); };
var addEvent=function(elem,type,fn){
		if(elem.addEventListener){
			elem.addEventListener(type,fn,false);
		}else {
			elem.attachEvent("on"+type,fn);
		}
	};


/*==========================================================*
	@author:wurui
	@date:2010.12.2

	Dependent Functions: 
		contains(a,b)
		addClass(elem,cname)
		removeClass(elem,cname)
		createDiv(A)
		addEvent(elem,type,fn)

-*----------------------------------------------------------*/
function Menu(box){
	
	/*/====================

		私有方法和属性

	//-------------------*/
	if(!box||!box.appendChild){
		throw new Error("构造方法的参数错误");
	}
	var 
	self=this,
	box=box,
	menuContainer=null,
	active=false,//菜单是否激活？
	tohide=null,//自动隐藏的timeout
	buildMenu=function(json){//生成菜单
		menuContainer=createDiv({
			className:"menu_container"
		});
		box.appendChild(menuContainer);
		for(var i=0,len=json.length;i<len;i++){
			var menuItem=json[i];

			var baseItem=createDiv({
				className:"base_item",
				innerHTML:menuItem.name+"<br/>",
				level:0
			});

			var menuDiv=createDiv({
				className:"menu_div"
			});

			menuContainer.appendChild(baseItem);
			baseItem.appendChild(menuDiv);

			createChild(menuItem.child,menuDiv);
		}
		regEvent();
	},createChild=function(children,container,level){//生成子菜单

		if(children&&children.length){
			
			if(typeof level == "undefined"){
				var level=1;//记录当前层级，从1开始
			}else{
				level++;
			}
			var childContainer=createDiv({
					className:"child_container"
				});
				childContainer.style.display="none";
			var fragment=document.createDocumentFragment();
			container.appendChild(childContainer);
			container.className+=" has_child";
			for(var i=0,len=children.length;i<len;i++){
				
				var childItem=createDiv({
					className:"child_item",
					innerHTML:children[i].name+'<br/>',
					level:level
				});
				
				fragment.appendChild(childItem);
				createChild(children[i].child,childItem,level);
			}
			childContainer.appendChild(fragment);
			
		}	
	},
	currentSelect=[],//当前选择的项，主要操作当前选中样式，从base_item开始
	addCurrentSelect=function(item){//

		var fromIndex=item.getAttribute("level");
		clearCurrentSelect(fromIndex);
		currentSelect.push(item);
		addClass(item,"mouse_over");
	},clearCurrentSelect=function(fromIndex){
		var fromIndex=fromIndex?fromIndex:0;
		for(var i=currentSelect.length-1;i>=fromIndex;i--){
			removeClass(currentSelect[i],"mouse_over");
			currentSelect.length--;
		}
	},showing=[],//当前显示的子菜单
	hideShowing=function(fromIndex){//从第几级开始隐藏

		var fromIndex=fromIndex?fromIndex:0;
		for(var i=showing.length-1;i>=fromIndex;i--){
			showing[i].style.display="none";
			showing.length--;
		}

	},showChildMenu=function(item){//显示子菜单
		
		var children=item.getElementsByTagName("div");
		var child=null;
		for(var i=0;i<children.length;i++){
			if(/\bchild_container\b/.test(children[i].className)){
				child=children[i];
				break;
			}
		}
		addCurrentSelect(item);//记录当前选项
		hideShowing(item.getAttribute("level"));//子菜单隐藏到当前级（不含当前级）
		if(child){
			child.style.display="block";
			showing.push(child);
		}
		active=true;//显示就是激活
		
		if(tohide){
			clearTimeout(tohide);
			tohide=null;
		}
	},
	chooseChildMenu=function(item){//选择菜单
		if(!item.getElementsByTagName("div").length){//终结点
			inactive();
			if(typeof self.onSelect == "function"){
				self.onSelect.call(window,item.textContent||item.innerText);
			}
		}
	},
	regEvent=function(){//注册事件
		menuContainer.onmouseover=function(e){

			var e=e||window.event;
			var tar=e.target||e.srcElement;
			var from=e.fromElement||e.relatedTarget;
			if(tar&&from){
				if(!contains(tar, from)||/\bchild_container\b/.test(from.className)){//从非div.child_container子容器到父容器不触发
					if(/\bchild_item\b/.test(tar.className)){
						showChildMenu(tar);
					}else if(/\bchild_item\b/.test(tar.parentNode.className)){
						showChildMenu(tar.parentNode);
					}else if(active&&/\bbase_item\b/.test(tar.className)){
						showChildMenu(tar);
					}
				}
				
			}

		};
		menuContainer.onclick=function(e){
			var e=e||window.event;
			var tar=e.target||e.srcElement;
			if(/\bbase_item\b/.test(tar.className)){
				showChildMenu(tar);
			}else if(/\bchild_item\b/.test(tar.className)){
				chooseChildMenu(tar);
			}else if(/\bchild_item\b/.test(tar.parentNode.className)){
				chooseChildMenu(tar.parentNode);
			}
		};
		
		menuContainer.onmouseout=function(e){
			var e=e||window.event;
			var toElem=e.toElement||e.relatedTarget;
			
			if(showing.length){
				
				if(currentSelect.length-1==showing.length){//将最后一个节点的选中样式去掉
					clearCurrentSelect(currentSelect.length-1);
				}
				if(Config.autoHide){
					var baseItem=showing[0].parentNode.parentNode;
					if(!contains(baseItem,toElem)&&toElem!=baseItem){
						tohide=setTimeout(function(){
							inactive();
						},Config.autoHide);
					}
				}
			}

		};
		
		//click hide
		addEvent(document,"click",function(e){
			var e=e||window.event;
			var tar=e.target||e.srcElement;
			if(!contains(menuContainer,tar)){//不是内容触发，则隐藏
				inactive();
			}
		});
		
	},inactive=function(){//恢复到非激活状态
		hideShowing();
		clearCurrentSelect();
		active=false;
	},
	initialized=false,//是否初始化
	Config={//配置
		autoHide:1000//自动隐藏的时间
	};
	
	/*/====================

		公共方法和属性

	//-------------------*/
	this.config=function(obj){//配置
		if(initialized){
			throw new Error("Menu中的config方法必须在init方法之前执行");
		}
		for(var k in Config){
			if(typeof obj[k] !="undefined"){
				Config[k]=obj[k];
			}
		}
	};
	this.init=function(json){//初始化
		if(!initialized){

			try{
				buildMenu(json);
				initialized=true;
			}catch(e){
				throw new Error("初始化方法的参数错误");
			}
			
		}
	};
	this.remove=function(){
		if(initialized){
			menuContainer.parentNode.removeChild(menuContainer);
			initialized=false;
		}
	};
	//Event trigger
	this.onSelect=function(value){};

};
