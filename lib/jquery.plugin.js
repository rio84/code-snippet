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
	interface
*/
if(typeof jQuery == "undefined"){
	throw new Error("jQuery未定义");
}

/*==============================================
	plugins
*/
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
	/*===============================
		@author:wur
		@date:2010.2.25

		限制只能输入数字的文本框。

		功能：
			防止拖拽进非数字
			屏蔽了右键复制进非数字

		备注:目前在IE8,IE6,safari和FF测试通过
		更新：2010.11.17，改为用getKeyType来判断键盘输入。
			2010.11.17，改名为inputNumber
		
	*/
	$.fn.inputNumber=function(){
		return this.each(function(){
			var _t=$(this).keydown(function(e){
				var kc=getKeyType(e);
				if(kc!=2&&kc!=0){
					return false;
				}
			}).bind("drop",function(){
				setTimeout(function(){
					clearNaN(_t);
				},1)
			}).bind("paste",function(e){
				setTimeout(function(){//由于FF取得剪切板内容的方法受限制,所以用这种方法来获得粘贴后的内容
					clearNaN(_t);
				},1)
			}).css("ime-mode","disabled");
			clearNaN(_t);
			
		});
	};
	
	function clearNaN(obj){//去掉输入框中的非数字字符
		obj.val(obj.val().replace(/\D/g,""));
	}

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


	//获得select选中文本
	$.fn.selectedText=function(){return this.children("option:selected").text();};
	
	/*
	作者：吴瑞
	日期：2010.1.31
	说明：让页面上元素实现拖动
	用法：$("#div1").draggable();
	version:1.1
	参数：opt - {
		container:(jQuery Object)容纳被拖动元素的容器，拖动时不能超越此容器，默认为父容器
		handler:(jQuery selector)元素内用于拖动的把柄，默认为自身
		keyadjust:(Boolean)是否允许键盘进行位置微调，默认为true
		allowbubble:(Boolean)是否起泡 即对象中子元素可否被点击



	}
	new features:对position为fixed的元素进行了修正
	2010.11.17 改名为draggable
	*/
	$.fn.draggable = function(opt)
    {
        var Objs = $(this),
        currentObj = null,
        containerObj = Objs.parent().eq(0),
		win=$(window),
		isFixed=false,
        _currentPos = {
            left: 0,
            top: 0
        },
        _containerPos = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
         opts = {//默认选项
             container: Objs.parent().eq(0), //拖动块的容器
             handler: "", //拖动的handler selector
             keyadjust: true, //是否用键盘调整
             allowbubble: false//是否起泡 即对象中子元素可否被点击
         },
        _setPos = function(diffX, diffY){
            ///	<summary>
            ///	设置当前移动块位置的方法
            ///	</summary>
            ///	<param name="diffX" type="number">
            /// 横坐标的改变值
            ///	</param>
            ///	<param name="diffY" type="number">
            /// 纵坐标的改变值
            ///	</param>
			var dLeft=0,dTop=0;
			if(isFixed){
				dLeft=win.scrollLeft();
				dTop=win.scrollTop();
			}
            if (containerObj){//现在父容器，计算方法还要进行扩展
                var
                currentW = currentObj.outerWidth(), //当前对象的位置信息
                currentH = currentObj.outerHeight(),
                currentOffset = currentObj.offset(),
                currentLeft = currentOffset.left,
                currentRight = currentObj.outerWidth() + currentLeft,
                currentTop = currentOffset.top,
                currentBottom = currentTop + currentObj.outerHeight();
                var l = _currentPos.left + diffX, //当前对象的当前位置，左边
                t = diffY + _currentPos.top; //当前对象的当前位置，顶部
                if (l > _containerPos.width - currentW)//判断是否超过父容器
                    l = _containerPos.width - currentW;
                if (t > _containerPos.height - currentH)
                    t = _containerPos.height - currentH;
                //设置位置
                currentObj.css({ left: (l < 0 ? 0 : l - dLeft) + 'px', top:( t < 0 ? 0 : t - dTop)+ 'px' });
            }
            else{
                if (currentObj)
                    currentObj.css({ left:( _currentPos.left + diffX-dLeft) + 'px', top: (diffY + _currentPos.top - dTop) + 'px' });
            }

        };
        if (opt == "destroy"){
            if (Objs.length > 0)
                Objs.unbind("mousedown").removeClass("draghandler");
            return Objs;
        }
        else{
            $.extend(opts, opt);
            var isdragStart = false, //标识是否开始拖动
            startX, //开始的鼠标位置
            startY;
            //注册点击事件
			Objs.each(function(){
				var ohand=null;
				var __o=$(this);
				if(opts.handler){
					ohand=__o.find(opts.handler);
				}
				if((!ohand)||ohand.length<1){
					ohand=__o;
				}
				ohand.addClass("draghandler").css('cursor', 'move').unbind("mousedown").mousedown(function(e){
					if (opt == "disable")
						return true;
					initPosdiff();
					containerObj = opts.container;
					currentObj =__o;// Objs.eq(opts.handler.index(this));
					isFixed=currentObj.css("position")=="fixed";
					_currentPos = {
						left: currentObj.position().left,
						top: currentObj.position().top
					}
					_containerPos.width = containerObj.innerWidth();
					_containerPos.height = containerObj.innerHeight();
					_containerPos.left = containerObj.offset().left;
					_containerPos.right = _containerPos.width + _containerPos.left;
					_containerPos.top = containerObj.offset().top;
					_containerPos.bottom = _containerPos.top + _containerPos.height;
					startX = e.clientX;
					startY = e.clientY;
					isdragStart = true;
					return opts.allowbubble;
				});
			});

        };
        var posDiff = { left: 0, top: 0 }, //位置变化值
        initPosdiff = function(){//初始化位置对象
            posDiff.left = 0;
            posDiff.top = 0;
        },
        keyAdjust = function(e){
            ///	<summary>
            ///	方向键调整位置的方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标位置
            ///	</param>
            if (isdragStart){
                switch (e.keyCode){
                    case keyCode.UP:
                        posDiff.top -= 1;
                        _setPos(posDiff.left, posDiff.top);
                        break;
                    case keyCode.DOWN:
                        posDiff.top += 1;
                        _setPos(posDiff.left, posDiff.top);
                        break;
                    case keyCode.LEFT:
                        posDiff.left -= 1;
                        _setPos(posDiff.left, posDiff.top);
                        break;
                    case keyCode.RIGHT:
                        posDiff.left += 1;
                        _setPos(posDiff.left, posDiff.top);
                        break;
                }
                return false;
            }
        },
        fnDrag = function(e){
            ///	<summary>
            ///	拖动的方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标对象
            ///	</param>
            if (isdragStart){
                var moveX = e.clientX, moveY = e.clientY;
                posDiff.left = moveX - startX;
                posDiff.top = moveY - startY;
                _setPos(posDiff.left, posDiff.top);
				return false;
            }

        },
        fnDragStop = function() { isdragStart = false; };
        $(document).bind("mousemove", fnDrag).bind("mouseup", fnDragStop)
        if (opts.keyadjust){
            $(document).bind("keypress", keyAdjust);
        }
        else{
            $(document).unbind("keypress", keyAdjust);
        }
        return Objs;
    };

	/*
		改变DOM的大小
		作者/时间：吴瑞 2009.7
		要求：DOM对象为绝对定位方式
		用法：$("#mydiv").resizable();
		参数： container: 容器--大小改变在此容器内
				minHeight: 最小高度
				 minWidth: 最小宽度
		update:2010.11.17 改名为resizable
		2010.11.23 元素在body下贴边不能拖动的问题

	*/

	$.fn.resizable = function(opt)
    {
        var Objs = $(this),
        currentObj = null,//当前对象
        containerObj = null,//限制区域
        originSize = { width: 0, height: 0 },//初始尺寸
        opts = { container: Objs.parent().eq(0), minHeight: 0, minWidth: 0 },//默认选项
        ///	<summary>
        ///	设置当前移动块的尺寸
        ///	</summary>
        ///	<param name="diffX" type="number">
        ///	x轴的变化值
        ///	</param>
        ///	<param name="diffY" type="number">
        ///	y轴的变化值
        ///	</param>
        _setSize = function(diffX, diffY){
            if (!currentObj) return;
            var tempW = originSize.width + diffX, //暂存拖动后的宽度
            tempH = originSize.height + diffY;    //暂存拖动后的高度
            tempH = tempH < opts.minHeight ? opts.minHeight : tempH; //最小高、宽
            tempW = tempW < opts.minWidth ? opts.minWidth : tempW;

            //容纳当前对象的容器的位置信息
            var limL = opts.container.offset().left,
            limR = limL + opts.container.innerWidth(),
            limT = opts.container.offset().top,
            limB = opts.container.innerHeight() + limT,
            theOffset = currentObj.offset(); //当前对象的offset
            if (theOffset.left + currentObj.outerWidth() >= limR && diffX > 0) {//不能超出容器范围
           
                tempW = limR - theOffset.left;
            }
            if (theOffset.top + currentObj.outerHeight() >= limB && diffY > 0)
                tempH = limB - theOffset.top;
            //if (opts.container.offset().left) updated by wur, 2010.11.23
                currentObj.css({ height: tempH + "px", width: tempW + "px" });
        };

        //begin run
        if (opt == "destroy"){
            $(".myresize-s,.myresize-se,.myresize-e").unbind().remove();
            return Objs;
        }
        //定义拖动的方位  
        var sObj = $("<div class='myresize-s' style='border:none;background:none;position:absolute;height:8px;width:100%'></div>"),
            eObj = $("<div class='myresize-e' style='border:none;background:none;position:absolute;width:8px;height:100%'></div>"),
            seObj = $("<div class='myresize-se' style='border:none;position:absolute;height:14px;width:14px'></div>");
        
        //每个对对象添加拖动的handler
        Objs.each(function(i){
            currentObj = Objs.eq(i);

            var originPos = currentObj.css("position");
            if (originPos != 'absolute')//将对象变为可以拖动的模式
                currentObj.css({ position: 'relative' });

            _currentPos = {//记录当前对象位置的对象
                left: currentObj.position().left,
                top: currentObj.position().top
            }

            var  
            tempW = currentObj.outerWidth(),//获得当前对象的高宽，以用于handler的样式
            tempH = currentObj.outerHeight(),
            tempTop = currentObj.css("border-top-width"),
            tempRight = currentObj.css("border-right-width"),
            tempLeft = currentObj.css("border-left-width"),
            tempBottom = currentObj.css("border-bottom-width");
            sObj.css({ bottom: "-" + tempBottom, left: 0, cursor: 's-resize', 'z-index': 1000 });
            eObj.css({ right: "-" + tempRight, top: 0, cursor: 'e-resize', 'z-index': 1000 });
            seObj.css({ right: "-" + tempRight, bottom: "-" + tempBottom, cursor: 'se-resize', 'z-index': 1001 });
            currentObj.find(".myresize-s,.myresize-se,.myresize-e").remove();
            currentObj.append(sObj.clone()); currentObj.append(eObj.clone()).append(seObj.clone());

        });
        $.extend(opts, opt);//扩展默认选项和用户传入的参数选项
        var startX,//定义变量 鼠标开始的位置
        startY,
        isStart = false,//表征是否开始拖动
        type = "";//拖动的类型（哪个方向的拖动）
        sObj = $(".myresize-s"),//获得加入到当前对象中的拖动方向对象
        seObj = $(".myresize-se"),
        eObj = $(".myresize-e");
        
        ///注册事件
        sObj.unbind("mousedown").mousedown(function(e){
            if (opt == "disable")
                return true;
            currentObj = $(this).parent();//
            originSize.width = currentObj.width();
            originSize.height = currentObj.height();
            startY = e.clientY;
            isStart = true;
            type = "s";
            return false;
        });
        seObj.unbind("mousedown").mousedown(function(e) {
            if (opt == "disable")
                return true;
            currentObj = $(this).parent();
            originSize.width = currentObj.width();
            originSize.height = currentObj.height();
            startX = e.clientX;
            startY = e.clientY;
            isStart = true;
            type = "se";
            return false;
        });
        eObj.unbind("mousedown").mousedown(function(e) {
            if (opt == "disable")
                return true;
            currentObj = $(this).parent();
            originSize.width = currentObj.width();
            originSize.height = currentObj.height();
            startX = e.clientX;
            isStart = true;
            type = "e";
            return false;
        });
        var fnOnDrag = function(e) {
            ///	<summary>
            ///	定义拖动方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标对象
            ///	</param>
            if (isStart){//判断拖动是否开始
            
                switch (type){//判断拖动类型
                
                    case "s":
                        _setSize(0, e.clientY - startY);
                        break;
                    case "se":
                        _setSize(e.clientX - startX, e.clientY - startY);
                        break;
                    case "e":
                        _setSize(e.clientX - startX, 0);
                        break;
                } return false;
            }
        },
        fnOnStop = function() { isStart = false; };//定义拖动完成的方法
        $(document).bind("mousemove", fnOnDrag).bind("mouseup", fnOnStop);
        return Objs;
    };

	/*
		jQuery Plugin
		作者:wu rui
		创建日期:2009.11.17
		版本:1.2
		说明：用于使页面上的行级元素如a,span,nobr内的文字超过固定宽度后，多余文字省略，并以“...”结尾。
		用法：$("selector nobr").ellipsis(300);传入参数为宽度。
		备注：为了最大限度的减少浏览器差异，建议包裹文字的标签为NOBR，防止因自动换行引起的错误。
		update:2010.11.19　改正了计算"..."宽度的方法.
		2010.11.19　能设置text-overflow则直接设置。
		2010.11.22 增加了宽度的判断
	*/
	$.fn.ellipsis=function(limitWidth){
		if(limitWidth&&(!isNaN(limitWidth))&&limitWidth>0){
			return this.each(function(){
				if(this.offsetWidth>limitWidth){//宽度过大才进行调整
					if(typeof this.style.textOverflow =="string"){
					
						this.style.display="inline-block";
						this.style.whiteSpace="nowrap";
						this.style.width=limitWidth+"px";
						this.style.overflow="hidden";
						this.style.textOverflow="ellipsis";
					}else{

						var t=$(this),
							fontsize=t.css("font-size").toString().replace(/(\d+)(\w+)/,"$1");
						var tmp=$('<span style="visibility:hidden;font-size:'+fontsize+'px;">...</span>').appendTo("body");
						var cutWidth=tmp.width();
						tmp.remove();
						if(t.width()>limitWidth&&limitWidth>2*fontsize){
							while(t.width()>(limitWidth-cutWidth)){
								t.text(t.text().slice(0,-1));
							}
							var str=t.text();
							if(str.substr(str.length-3,3)!="...")
								t.text(str+"...");
						}
					}
				}
				
			});
		}
		else
			return this;
	};

})(jQuery);
