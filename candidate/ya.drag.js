/*
作者：吴瑞
日期：2010.1.31
说明：让页面上元素实现拖动
用法：$("#div1").ydrag();
version:1.1
new features:对position为fixed的元素进行了修正
*/
(function($)
{
    //NOTICE:判断是否在容器内的方法需要重新定义
    //键盘对象 键-值对
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
    }
    $.fn.ydrag = function(opt)
    {
        ///	<summary>
        ///	拖动的方法
        ///	</summary>
        ///	<param name="opt" type="object">
        /// 传入的一些选项
        ///	</param>
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
        _setPos = function(diffX, diffY)
        {
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
			if(isFixed)
			{
				dLeft=win.scrollLeft();
				dTop=win.scrollTop();
			}
            if (containerObj)
            {//现在父容器，计算方法还要进行扩展
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
            else
            {
                if (currentObj)
                    currentObj.css({ left:( _currentPos.left + diffX-dLeft) + 'px', top: (diffY + _currentPos.top - dTop) + 'px' });
            }

        };
        if (opt == "destroy")
        {
            if (Objs.length > 0)
                Objs.unbind("mousedown").removeClass("draghandler");
            return Objs;
        }
        else
        {
            $.extend(opts, opt);
            var isdragStart = false, //标识是否开始拖动
            startX, //开始的鼠标位置
            startY;
            //注册点击事件
			Objs.each(function(){
				var ohand=null;
				var __o=$(this);
				if(opts.handler)
				{
					ohand=__o.find(opts.handler);
				}
				if((!ohand)||ohand.length<1)
				{
					ohand=__o;
				}
				ohand.addClass("draghandler").css('cursor', 'move').unbind("mousedown").mousedown(function(e)
				{
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
        var
        posDiff = { left: 0, top: 0 }, //位置变化值
        initPosdiff = function()//初始化位置对象
        {
            posDiff.left = 0;
            posDiff.top = 0;
        },
        keyAdjust = function(e)//
        {
            ///	<summary>
            ///	方向键调整位置的方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标位置
            ///	</param>
            if (isdragStart)
            {
                switch (e.keyCode)
                {
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
        fnDrag = function(e)
        {
            ///	<summary>
            ///	拖动的方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标对象
            ///	</param>
            if (isdragStart)
            {
                var moveX = e.clientX, moveY = e.clientY;
                posDiff.left = moveX - startX;
                posDiff.top = moveY - startY;
                _setPos(posDiff.left, posDiff.top);
				return false;
            }

        },
        fnDragStop = function() { isdragStart = false; };
        $(document).bind("mousemove", fnDrag).bind("mouseup", fnDragStop)
        if (opts.keyadjust)
        {
            $(document).bind("keypress", keyAdjust);
        }
        else
        {
            $(document).unbind("keypress", keyAdjust);
        }
        return Objs;
    }

})(jQuery)