//菜单数据,全局变量
var ProductAreaData=[
	[
		["AVA",1],//数据第一个元素为id，第二个元素为文本
		["AVA",1],
		["AVA",1],
		["AVA",1],
		["AVA",1],
		["AVA",1]
	],//热门
	[
		["AVA2",1],//数据第一个元素为id，第二个元素为文本
		["AVA2",1],
		["A22VA",1],
		["AVA",1],
		["AVA",1],
		["AVA",1]
	],//ABC
	[
		["AsdfasVA",1],//数据第一个元素为id，第二个元素为文本
		["AVA",1],
		["AVssA",1],
		["AVA",1],
		["AVA",1],
		["AVA",1]
	]//DEF...
];

//菜单数据,全局变量
var ProductGameData=[
	[
		["aaa",1],//数据第一个元素为id，第二个元素为文本
		["bbb",1],
		["ddd",1],
		["dddde",1],
		["fff",1],
		["cccc",1]
	],//热门
	[
		["kkk",1],//数据第一个元素为id，第二个元素为文本
		["llll",1],
		["A2mmmm2VA",1],
		["nn",1],
		["5556",1],
		["124",1]
	],//ABC
	[
		["AsdfasVA",1],//数据第一个元素为id，第二个元素为文本
		["AVA",1],
		["/**/*/",1],
		["/**/*/",1],
		["/**/*/",1],
		["/**/*/",1]
	]//DEF...
];


	
//游戏商品选择
(function(){
	


	var c=function(tag){return document.createElement(tag);};

	var currentInput=null;
	var showingObj=null;

	var hidePformList=function(){
		if(showingObj){
			showingObj.hide();
			showingObj=null;
		}
	};

	//tab切换
	setProductTab=function(i,elem){
		if(showingObj){
			showingObj.children("div.list").children("ul").hide().eq(i).show();
			showingObj.children("div.menu").children("ul").children("li").find("a").removeClass("now").eq(i).addClass("now");
		}
	};

	//选择
	selectProduct=function(e){
		var e=e||event;
		var tar=e.target||e.srcElement;
		
		if(tar.tagName=="A"&&currentInput){
			currentInput.value=tar.innerHTML;
			hidePformList();
		}
		if(typeof onSelectProduct=="function"){
			onSelectProduct(tar.getAttribute("data"),tar.innerHTML);
		}
		return false;
	};

	
	
	
	var buildDataList=function(data){
		
		//菜单div
		var listDiv=c("div");
		listDiv.className="list";

		listDiv.onclick=selectProduct;

		if(!data){return listDiv;};

		for(var i=0;i<data.length;i++){

			var ul=c("ul");

			for(var j=0,list=data[i],len=list.length;j<len;j++){
				var li=c("li");
				var a=c("a");
				a.innerHTML=list[j][0];
				a.setAttribute("data",list[j][1]);
				a.href="##";
				li.appendChild(a);
				ul.appendChild(li);
				
			}
			if(i==0){
				ul.style.display="block";
			}else{
				ul.style.display="none";
			}
			listDiv.appendChild(ul);
			
		}
		return listDiv;
	};

	

	
	var autoCreatePform=function(){

		j("div.Pform").each(function(){
			var that=j(this);
			
			var listbox=that.find("div.cform_box");
			listbox.children("div.list").remove();
			listbox.append(buildDataList(window[that.attr("datagroup")]));

			var txt=that.children("input:text");
			txt.click(function(){
				hidePformList();
				showingObj=listbox.show();
				currentInput=this;
			}).next("a").click(function(){
				hidePformList();
				showingObj=listbox.show();
				currentInput=this;
			});
			that.find("a#Close").click(function(){
				hidePformList();
				return false;
			});
			
		});
	};
	

	autoCreatePform();

	window.refreshData=function(){
		setProductTab(0);
		j("div.Pform").each(function(){
			var that=j(this);
			
			var listbox=that.find("div.cform_box");
			listbox.children("div.list").remove();
			listbox.append(buildDataList(window[that.attr("datagroup")]));
		});
	};

})();