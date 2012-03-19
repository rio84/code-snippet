/*=================================================
	自定义multiple select组件
	@author:wur
	@date:2011-11-8
	要求html:<div><ul></ul></div>
-------------------------------------------*/

var ISIE=!-[1,],
CONST_UP_DOWN_BUTTON_TOTAL_HEIGHT=38,
CONST_OPTION_HEIGHT=19,
bind=ISIE?function(type,fn){var elem=this;elem.attachEvent("on" + type, function() {fn.call(elem, window.event);});return elem;}:function(type,fn){this.addEventListener(type, fn, false);return this;};

function multipleSelect(div){

	var _options=[],ul=div.getElementsByTagName("ul")[0],
	_this=this,scrollbar=new scrollBar(ul);
	for(var lis=div.getElementsByTagName("li"),len=lis.length,i=0;i<len;i++){
		_options[i]=lis[i];
	}
	div.bind=bind;
	div.bind("click",function(e){
		var tar=e.srcElement||e.target;
		if(tar.tagName=="LI"){
			tar.select();
			if(_this.selectedIndex>-1){
				_options[_this.selectedIndex].unselect();
			}
			_this.selectedIndex=tar["tabIndex"];
			
		}
	});

	this.bind=function(type,fn){
		div.bind(type,fn);
	};

	this.remove=function(idx){
		if(idx===undefined){
			_options.length=0;
			ul.innerHTML="";
		}else{
			var opt=_options[idx],nextopt=opt;
			_options.splice(idx,1);
			while(nextopt=nextopt.nextSibling){
				if(nextopt.tagName&&nextopt.tagName=="LI")
				nextopt.setAttribute("tabIndex",nextopt.getAttribute("tabIndex")-1);
			}
			opt.parentNode.removeChild(opt);
		}
		scrollbar.location();
	};
	this.append=function(htm,val){
		var li=document.createElement("li");
		li.innerHTML=htm;
		if(val!=undefined){
			li.setAttribute("value",val);
		}
		li.select=multipleSelect.selectOption;
		li.unselect=multipleSelect.unselectOption;
		li.setAttribute("tabIndex",_options.length);
		ul.appendChild(li);
		_options[_options.length]=li;
		scrollbar.location();
	};
	this.selectedIndex=-1;
	this.value="";
}
multipleSelect.selectOption=function(){
	this.className="selected"
};
multipleSelect.unselectOption=function(){
	this.className=""
};

function scrollBar(container){
	
	
	var 
	bar=document.createElement("div"),
	blocker=document.createElement("div"),
	upbtn=document.createElement("div"),
	downbtn=document.createElement("div"),
	rod=document.createElement("div");
	container.bind=document.bind=bar.bind=blocker.bind=upbtn.bind=downbtn.bind=rod.bind=bind;
	upbtn.className="upbtn";
	downbtn.className="downbtn";
	blocker.className="blocker";
	rod.className="rod";
	bar.className="bar";

	this.location=function(){
		
		var h=container.clientHeight;
		_rodHeight=h-CONST_UP_DOWN_BUTTON_TOTAL_HEIGHT;
		bar.style.height=h+"px";
		rod.style.height=_rodHeight+"px";
		_scollHeight=container.scrollHeight;

		_scale=_rodHeight/_scollHeight;

		_ylimit=(_scollHeight-h)*_scale;

		_blockerHeight=_rodHeight-_ylimit;
		blocker.style.height=(_blockerHeight<1?1:_blockerHeight)+"px";

		blocker.style.marginTop=(container.scrollTop*_scale)+"px";

		if(h>=_scollHeight){
			bar.style.display="none";
		}else{
			bar.style.display="block";
		}
		
	};
	

	upbtn.bind("click",function(e){scrollY("stepup");}).bind("mousedown",function(){this.className+=" btn-active";}).bind("mouseup",function(){this.className=this.className.replace(" btn-active","");});//上下按钮
	downbtn.bind("click",function(e){scrollY("stepdown");}).bind("mousedown",function(){this.className+=" btn-active";}).bind("mouseup",function(){this.className=this.className.replace(" btn-active","");});

	var _ylimit,_scale, _scollHeight,_rodHeight=0,_blockerHeight,_rollstart=false,startY=0, 
	scrollY=function(d){
		if(typeof d=="string"){
			var step=CONST_OPTION_HEIGHT*_scale;
			switch(d){
				case "stepup"://向上一行
					d=0-step;
					break;
				case "stepdown"://向下一行
					d=step;
					break;
				case "wheelup"://滚轴向上  换算为三行
					d=-3*step;
					break;
				case "wheeldown"://滚轴向下  换算为三行
					d=3*step;
					break;
			}
		}
		var nY=(parseFloat(blocker.style.marginTop||0))+d;
		if(nY<0)nY=0;
		if(nY>_ylimit)nY=_ylimit;
		blocker.style.marginTop=nY+"px";
		container.scrollTop+=d/_scale;
		
	};
	blocker.bind("mousedown",function(e){//拖动滚动条
		startY=e.clientY;
		_rollstart=true;
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		this.className+=" blocker-active";
	});
	document.bind("mousemove",function(e){
		if(_rollstart){
			scrollY(e.clientY-startY);
			startY=e.clientY;
		}
	});
	document.bind("mouseup",function(e){
		if(_rollstart){
			_rollstart=false;
			blocker.className=blocker.className.replace(" blocker-active","");
		}
	});

	container.bind(ISIE?"mousewheel":"DOMMouseScroll",function(e){//鼠标滚轮

		var tar=e.srcElement||e.target,nY;
		if(ISIE){
			nY=e.wheelDelta<0?"wheeldown":"wheelup";
		}else{
			nY=e.detail>0?"wheeldown":"wheelup";
		}
		scrollY(nY);
	}).bind("keydown",function(e){//上下方向键
		switch(e.keyCode){
			case 38:
			scrollY("stepup");
			break;
			case 40:
			scrollY("stepdown");
			break;
		};
	});
	
	rod.appendChild(blocker);
	bar.appendChild(upbtn);
	bar.appendChild(downbtn);
	bar.appendChild(rod);
	container.parentNode.insertBefore(bar,container);
	
	this.location();

}


/*-------------------------------------------
	自定义multiple select组件 END
=================================================*/