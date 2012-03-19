(function($){
	/*
		关联一个按钮，一个层
		划过按钮，层出现，划出层和按钮层消失
		@author:wur
		@date:2010.4.28
		@version:1.2
		update:2010.6.28 层的计算top值时用outerHeight
			2010.6.30 层的划入和划出分别触发按钮的划入划出效果
	*/
	$.fn.flapDiv=function(layer,isleft){
		var btn=this;
		var toHide=false,to=null,isHide=1,doHide=function(notbtn){
			if(!isHide){
				to=setTimeout(function(){
						if(toHide) layer.hide();
						to=null;
						isHide=1;
						if(notbtn)btn.mouseout();

				},300);
			}
		};
		btn.mouseover(function(){
			toHide=false;
			if(to)
			{
				clearTimeout(to);
				to=null;
				return;
			}
			if(isleft){
				layer.css({
					left:btn.offset().left,
					top:btn.offset().top-0+btn.outerHeight()
				}).show();
			}else{
				layer.css({
					left:btn.offset().left-0+btn.outerWidth()-layer.width(),
					top:btn.offset().top-0+btn.outerHeight()
				}).show();
			}
			isHide=0;

		}).mouseout(function(){
			toHide=true;
			doHide();
		}).click(function(){return false;});
		layer.mouseover(function(){/*
			toHide=false;
			if(to)
			{
				clearTimeout(to);
				to=null;
			}*/btn.mouseover();
		}).mouseout(function(){
			toHide=true;
			doHide(1);

		});
	};
})(jQuery);