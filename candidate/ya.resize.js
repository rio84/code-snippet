
/*
	改变DOM的大小
	作者/时间：吴瑞 2009.7
	要求：DOM对象为绝对定位方式
	用法：$("#mydiv").yresize();
	参数： container: 容器--大小改变在此容器内
			minHeight: 最小高度
			 minWidth: 最小宽度


*/
(function($)
{
    $.fn.yresize = function(opt)
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
        _setSize = function(diffX, diffY)
        {
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
            if (theOffset.left + currentObj.outerWidth() >= limR && diffX > 0)//不能超出容器范围
            {
                tempW = limR - theOffset.left;
            }
            if (theOffset.top + currentObj.outerHeight() >= limB && diffY > 0)
                tempH = limB - theOffset.top;
            if (opts.container.offset().left)
                currentObj.css({ height: tempH + "px", width: tempW + "px" });
        };

        //begin run
        if (opt == "destroy")
        {
            $(".myresize-s,.myresize-se,.myresize-e").unbind().remove();
            return Objs;
        }
        //定义拖动的方位  
        var sObj = $("<div class='myresize-s' style='border:none;background:none;position:absolute;height:8px;width:100%'></div>"),
            eObj = $("<div class='myresize-e' style='border:none;background:none;position:absolute;width:8px;height:100%'></div>"),
            seObj = $("<div class='myresize-se' style='border:none;position:absolute;height:14px;width:14px'></div>");
        
        //每个对对象添加拖动的handler
        Objs.each(function(i)
        {
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
        sObj.unbind("mousedown").mousedown(function(e)
        {
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
        seObj.unbind("mousedown").mousedown(function(e)
        {
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
        eObj.unbind("mousedown").mousedown(function(e)
        {
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
        var fnOnDrag = function(e)
        {
            ///	<summary>
            ///	定义拖动方法
            ///	</summary>
            ///	<param name="e" type="object">
            /// 鼠标对象
            ///	</param>
            if (isStart)//判断拖动是否开始
            {
                switch (type)//判断拖动类型
                {
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
    }

})(jQuery)