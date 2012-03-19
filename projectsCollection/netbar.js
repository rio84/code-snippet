/*==============================================
	projectsCollection  -- netbar

	@author:wur

	@date:2010.11.22

	@version:1.0

	@discription:商城项目，主要是网台平台ＪＳ功能

	@update&new feature:

================================================*/

/*
	录入密保卡信息
*/
(function(){

function c(tagName){
	return document.createElement(tagName);
}

var inputArr=[],
colCount=0;

//生成矩阵 返回一个dom对象
function matrix(o){
	var table=c("table"),
		thead=c("thead"),
		tbody=c("tbody");
	table.onkeydown=execKeyDown;
	table.onkeyup=execKeyUp;
	
	var throws=o.throws,
		theads=o.theads,
		data=o.data;
	var tabIndex=0;
	colCount=0;inputArr=[];
	for(var r=-1;r<throws.length;r++){
		var tr=c("tr");
		for(var l=0;l<theads.length;l++){
			if(r==-1){
				
				var th=c("th");
				th.appendChild(document.createTextNode(theads[l]));
				tr.appendChild(th);
				
			}else{
				if(l==0){
					var th=c("th");
					th.appendChild(document.createTextNode(throws[r]));
					tr.appendChild(th);
				}else{
					var td=c("td");
					var txt=c("input");
					txt.type="text";
					txt.setAttribute("maxLength",2);
					txt.className="matrix_inputs";
					txt.onblur=execBlur;

					txt.size=2;
					txt.name=theads[l]+throws[r];
					txt.tabIndex=++tabIndex;
					if(data&&data[r]&&data[r][l-1]){
						txt.value=data[r][l-1];
					}

					inputArr.push(txt);
					td.appendChild(txt);
					tr.appendChild(td);
					if(l==1)colCount++;
				}	
			}

		}
		if(r==-1){
			thead.appendChild(tr);
		}else{
			tbody.appendChild(tr);
		}
	}
	table.appendChild(thead);
	table.appendChild(tbody);
	return table;

}
//执行keydown
function execKeyDown(e){
	e=e||event;
	var tar=e.target||e.srcElement;
	if(/\bmatrix_inputs\b/.test(tar.className)){
		var kc=getKeyType(e);
		if(kc!=2&&kc!=0){
			return false;
		}
	}
}
//执行keyup
function execKeyUp(e){
	e=e||event;
	var key=e.keyCode;
	if(key!=9){
		var tar=e.target||e.srcElement;
		if(/\bmatrix_inputs\b/.test(tar.className)){
			var tarIndex=tar.tabIndex;
			
			

			if(key==38&&colCount&&tarIndex-colCount>0){//UP
				inputArr[tarIndex-colCount-1].focus();
				return ;
			}
			if(key==40&&colCount&&tarIndex+colCount<=inputArr.length){//DOWN
				inputArr[tarIndex+colCount-1].focus();
				return ;
			}

			if(key==37&&colCount&&tarIndex-1>0){//LEFT
				if(!tar.value){inputArr[tarIndex-2].focus();}
				return ;
			}
			if(key==39&&colCount&&tarIndex+1<=inputArr.length){//RIGHT
				if(!tar.value){inputArr[tarIndex].focus();}
				return ;
			}


			if(tar.value.length>=tar.maxLength&&tarIndex<inputArr.length){
				inputArr[tarIndex].focus();
			}
		}
	}

};

//验证不能为空和非数字
function execBlur(e){
	e=e||event;
	var tar=e.target||e.srcElement;
	
	if(/\D/.test(tar.value)||!/\S/.test(tar.value)){
		tar.style.backgroundColor="#EEEDD8";
	}else{
		tar.style.backgroundColor="#FFF";
	}
};

window.checkMatrix=function(){
	var ret=true;
	for(var i=0,len=inputArr.length;i<len;i++){
		var val=inputArr[i].value;
		if(/\D/.test(val)||!/\S/.test(val)){
			inputArr[i].style.backgroundColor="#EEEDD8";
			ret=false;
		}
	}
	return ret;
};

window.matrix=matrix;
})();



//--------------------------------------------------------------
// #Subject: 添加目录
// #Description: 自定义商品上架，添加目录
// #Creation Date: 2010-10-25
//-------------------------------------------------------------------------------------------------------------------------------

//-----------document ready begin;
jQuery(function(j){


// if
if(j(".root_node").length){
	


	var focusedNode=null,input=null;
	var unwrapNode=function(node){//展开一个节点
		var li=j(node).parent();
		li.addClass("expanded").find(".wrap").removeClass().addClass("unwrap");
	},
	wrapNode=function(node){
		var li=j(node).parent();
		li.removeClass("expanded").find(".unwrap").removeClass().addClass("wrap");
	},
	focusNode=function(node){//聚焦到节点
		node=j(node);
		if(focusedNode)focusedNode.removeClass("focused");
		focusedNode=node.addClass("focused");
	},
	blurNode=function(node){//节点失去焦点
		if(node&&node.className=="focused"){
			node=j(node);
			node.removeClass("focused");
			focusedNode=null;
		}
		
	};
	
	//增加新节点
	var addNewNode=function(){
		
		if(!focusedNode||!focusedNode.is(".parent_node,.root_node")){
			alert("请先指定新增目录的上一层级。");
			return false;
		}
		var isRoot=focusedNode.is(".root_node");//是否是根节点
		if(isRoot){
			var ul=focusedNode.parent().next("ul");
		}else{
			var ul=focusedNode.next("ul");
		}
		if(!ul.length){
			ul=j("<ul>");
			focusedNode.after(ul);
		}
		//console.log(!focusedNode.parent().is(".expanded")&&!isRoot);
		if(!focusedNode.parent().is(".expanded")&&!isRoot){//如果没有展开就展开
			
			unwrapNode(focusedNode);
			//console.log(focusedNode.parent().attr("tagName"));
		}
		if(input){
			input.parent().remove();
			input=null;
		}
		var recover=true;//是否恢复初始状态
		input=j("<input>",{
			type:"text",
			size:"10",
			blur:function(){
				if(input&&recover){
					input.parent().remove();
					input=null;
				}
			},
			keydown:function(e){
				if(e.keyCode==13&&this.value){
					recover=false;
					if(ValidateMethods.charfilter.call(input[0])){
						this.parentNode.innerHTML=isRoot?'<span class="wrap"></span><span class="parent_node">'+input.val()+'</span>':"<span class='child_node'>"+input.val()+"</span>";
						input=null;
					}else{
						alert("目录名称不能含有非法字符");
						setTimeout(function(){input.focus();recover=true;},10);
					}
				}
			}
		});
		var btnOk=j("<input>",{
			type:"button",
			value:"保存",
			className:"tiny_bleen_btn",
			mousedown:function(){
				if(input.val()){
						//alert(ValidateMethods.charfilter.call(this));
						//debugger;
					recover=false;
					if(ValidateMethods.charfilter.call(input[0])){
						this.parentNode.innerHTML=isRoot?'<span class="wrap"></span><span class="parent_node">'+input.val()+'</span>':"<span class='child_node'>"+input.val()+"</span>";
						input=null;
					}else{
						alert("目录名称不能含有非法字符");
						setTimeout(function(){input.focus();recover=true;},10);
					}
					
					
				}
				else{recover=true;}
			}
		});

		ul.append( j("<li>").append(input.after(btnOk)));

		setTimeout(function(){input.focus();},10);

	};
	//删除已有节点
	var delNode=function(){
		if(!focusedNode){
			alert("请选择要删除的目录。");
			return false;
		}
		if(confirm("此操作不可恢复，请确认删除该目录？")){
			focusedNode.parent().remove();
			focusedNode=null;
		}
		
	};
	//编辑已有节点
	var editNode=function(){
		if(!focusedNode){
			alert("请选择要编辑的目录。");
			return false;
		}
		focusedNode.hide();

		var recover=true;
		var setVal=function(){
			if(input.val()){
				focusedNode.text(input.val()).show();						
			}
			input.remove();
			btnOk.remove();
			recover=false;
		};

		var input=j("<input>",{
			value:focusedNode.text(),
			type:"text",
			size:"10",
			blur:function(){
				
				if(recover){
					focusedNode.show();
					input.remove();
					btnOk.remove();
				}
				
				
			},
			keydown:function(e){
				if(e.keyCode==13){
					setVal();
				}
			}
		});

		var btnOk=j("<input>",{
			value:"保存",
			type:"button",
			className:"tiny_bleen_btn",
			mousedown:function(e){
				setVal();
				
			}
		});



		focusedNode.after(input.after(btnOk));
		input.select();
	};

	//点击“添加目录”
	j("#btn_new_node").click(addNewNode);
	//点击“删除目录”
	j("#btn_del_node").click(delNode);
	//点击“编辑目录”
	j("#btn_edit_node").click(editNode);

			
	j("#node_tree_box").click(function(e){
		var tar=e.target||e.srcElement;
		switch(tar.className){
			case "root_node":
				focusNode(tar);
				break;
			case "parent_node":
				unwrapNode(tar);
				focusNode(tar);
				break;
			case "child_node":
				focusNode(tar);
				break;
			case "wrap":
				unwrapNode(tar);
				break;
			case "unwrap":
				wrapNode(tar);
				break;

		}
	});


}
//--------------- end if

});
//-----------document ready end;
