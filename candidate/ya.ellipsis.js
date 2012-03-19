/*
	jQuery Plugin
	作者:wu rui
	创建日期:2009.11.17
	版本:1.0
	说明：用于使页面上的行级元素如a,span,nobr内的文字超过固定宽度后，多余文字省略，并以“...”结尾。
	用法：$("selector nobr").ellipsis(300);传入参数为宽度。
	备注：为了最大限度的减少浏览器差异，建议包裹文字的标签为NOBR，防止因自动换行引起的错误。
*/
(function($){
	$.fn.ellipsis=function(limitWidth){
		if(limitWidth&&(!isNaN(limitWidth))&&limitWidth>0)
		{
			return this.each(function(){
				var t=$(this),
					fontsize=t.css("font-size").toString().replace(/(\d+)(\w+)/,"$1");
				if(t.width()>limitWidth&&limitWidth>2*fontsize)
				{
					while(t.width()>(limitWidth-fontsize))
					{
						t.text(t.text().slice(0,-1));
					}
					var str=t.text();
					if(str.substr(str.length-3,3)!="...")
						t.text(str+"...");
				}
			});
		}
		else
			return this;
	}
})(jQuery)