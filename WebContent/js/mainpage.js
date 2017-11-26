var gridId = "rowed";
var id = '';
var wuliaoguanxiObj = {
		1170927:'一类物料',
		2170927:'二类物料',
		3170927:'三类物料',
		4170927:'四类物料',
		5170927:'五类物料',
		6170927:'六类物料',
		7170927:'七类物料'
}
var kehuguanxiObj = {
		1190921:'华为',
		1190922:'阿里巴巴',
		1190923:'十七所',
		1190924:'成都电视台',
		1190925:'富森美家居北门',
		1190926:'来福士',
}
$(function(){
	//页面加载完成之后执行
	
	$.ajax({
		type: 'GET',
		url: 'servlet/GetWuliao',
		dataType: 'json',
		success: function(data){
			console.log(data.rows);
			for(var i=0;i<data.rows.length;i++){
			}
		}
	})
	
	id = GetQueryString("id");
	console.log(id);
	showWhichSidebar(id);
	if(id === 'yonghu'){
		$('#content-header h1').html('发电量录入单据');
		$('.current').text('发电量录入单据');
		$('#fixedTable').hide();
		$('#main_content').show();
		FaDianLiangLuRu();
	}else{
		$('#content-header h1').html('集团月度总汇');
		$('.current').text('集团月度总汇表');
		$('#main_content').hide();
		$('#fixedTable').show();
		jituanyuedubaobiao();
	}
	flexingGrid(gridId);
});
function FaDianLiangLuRu(){
	//创建jqGrid组件
	var lastsel3;
	$('#main_content').empty().html('<table id="rowed"></table>'+'<div id="pager" ></div>');
	jQuery("#rowed").jqGrid(
			{
				url : 'servlet/GetTable',//组件创建完成之后请求数据的url
				styleUI : 'Bootstrap',
				datatype : "json",//请求数据返回的类型。可选json,xml,txt
				colModel : [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
				             {label:'单据编号', name : 'danjubianhao',width : 90,align : "center"}, 
				             {label:'生产部门', name : 'departmentname',width : 100,align:'center'}, 
				             {label:'日期', name : 'create_time',width : 100,sorttype : "date",align : "center"}, 
				             {label:'录入人', name : 'personname',width : 80,align:'center'}, 
				             {label:'物料编码', name : 'wuliaobianma',width : 80,align : "center",}, 
				             {label:'物料名称', name : 'wuliaomingcheng',width : 150,align : "center"},
				             {label:'发电量（万度）', name : 'fadianliang',width : 80,align : "right",formatter:'integer', formatoptions:{thousandsSeparator: ','}} ,
				             {label:'单价', name : 'danjia',width : 80,align : "right",formatter:'currency'} ,
				             {label:'金额', name : 'jine',width : 80,align : "right",formatter:'currency'},
				             {label:'公司标识', name : 'gongsibiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'部门标识', name : 'bumenbiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'录入人标识', name : 'lururenbiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'物料标识', name : 'wuliaobiaoshi',width : 80,align : "right",hidden: "true"} ,
				           ],
				onSelectRow : function(id) {
		          if (id && id !== lastsel3) {
		            jQuery('#rowed').jqGrid('restoreRow', lastsel3);
		            lastsel3 = id;
		          }
		        },
				rowNum : 1000,//一页显示多少条
				pgbuttons : false,//是否显示翻页按钮
				pgtext	: null,
				hidegrid : false,
				pager : '#pager',//表格页脚的占位符(一般是div)的id
				sortname : 'id',//初始化的时候排序的字段
				sortorder : "desc",//排序方式,可选desc,asc
				mtype : "post",//向后台请求数据的ajax的类型。可选post,get
				viewrecords : true,
				width: 'auto',
				height: '100%',
				autowidth: true,
				forceFit: false,
			});
	jQuery("#rowed").jqGrid("navGrid", "#pager",
			{edit: false, add: false, del: false, refresh: false, search:false});
	
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'新增',title:'新增项。', 
		id: gridId + '_newFaDianLiangDanJu', buttonicon :'fa fa-plus',
		onClickButton:function(){
			manipulateGongCheng('新增','FaDianLiangLuRu');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'修改',title:'修改选中项。', 
		id: gridId + '_editFaDianLiangDanJu', buttonicon :'fa fa-pencil-square-o',
		onClickButton:function(){
			manipulateGongCheng('编辑','FaDianLiangLuRu');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'删除',title:'删除选中项。', 
		id: gridId + '_delFaDianLiangDanJu', buttonicon :'fa fa-trash',
		onClickButton:function(){
			manipulateGongCheng('删除','FaDianLiangLuRu');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'分组查询',title:'分组查询。', 
		id: gridId + '_serFaDianLiangDanJu', buttonicon :'fa fa-search',
		onClickButton:function(){
			manipulateGongCheng('查询','FaDianLiangLuRu');
		} 
	});
	$('#gbox_rowed').addClass('paddingoverflow');
	flexingGrid(gridId);
}
function JieSuanDianLiangLuRu(){
	//创建jqGrid组件
	var lastsel3;
	$('#main_content').html('<table id="rowed"></table>'+'<div id="pager" ></div>');
	jQuery("#rowed").jqGrid(
			{   
				url : 'data/jiesuandianliang.json',//组件创建完成之后请求数据的url
				styleUI : 'Bootstrap',
				datatype : "json",//请求数据返回的类型。可选json,xml,txt
				colModel : [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
				             {label:'单据编号', name : 'danjubianhao',width : 90,align : "center"}, 
				             {label:'部门', name : 'shengchanbumen',width : 100,align:'center'}, 
				             {label:'日期', name : 'riqi',width : 100,sorttype : "date",align : "center"}, 
				             {label:'客户编码', name : 'kehubianma',width : 80,align:'center'}, 
				             {label:'客户名称', name : 'kehumingcheng',width : 80,align:'center'}, 
				             {label:'物料编码', name : 'wuliaobianma',width : 80,align : "center",}, 
				             {label:'物料名称', name : 'wuliaomingcheng',width : 100,align : "center",},
				             {label:'结算电量', name : 'jiesuandianliang',width : 80,align : "right"} ,
				             {label:'标杆单价', name : 'biaogandanjia',width : 80,align : "right",formatter:'currency'} ,
				             {label:'标杆金额', name : 'biaoganjine',width : 80,align : "right",formatter:'currency'} ,
				             {label:'补贴单价', name : 'butiedanjia',width : 80,align : "right",formatter:'currency'} ,
				             {label:'补贴金额', name : 'butiejine',width : 80,formatter:'currency'} ,
				             {label:'公司标识', name : 'gongsibiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'部门标识', name : 'bumenbiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'物料标识', name : 'wuliaobiaoshi',width : 80,align : "right",hidden: "true"} ,
				             {label:'客户标识', name : 'kehubiaoshi',width : 80,align : "right",hidden: "true"} ,
			             ],
				onSelectRow : function(id) {
		          if (id && id !== lastsel3) {
		            jQuery('#rowed').jqGrid('restoreRow', lastsel3);
		            lastsel3 = id;
		          }
		        },
				rowNum : 1000,//一页显示多少条
				pgbuttons : false,//是否显示翻页按钮
				pgtext	: null,
				hidegrid : false,
				pager : '#pager',//表格页脚的占位符(一般是div)的id
				sortname : 'id',//初始化的时候排序的字段
				sortorder : "desc",//排序方式,可选desc,asc
				mtype : "post",//向后台请求数据的ajax的类型。可选post,get
				viewrecords : true,
				width: 'auto',
				height: '100%',
				autowidth: true,
				forceFit: false,
			});
	jQuery("#rowed").jqGrid("navGrid", "#pager",
			{edit: false, add: false, del: false, refresh: false, search:false});
	
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'新增',title:'新增项。', 
		id: gridId + '_newFaDianLiangDanJu', buttonicon :'fa fa-plus',
		onClickButton:function(){
			manipulateGongCheng('新增','JieSuanDianLiangLuRu');
			
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'修改',title:'修改选中项。', 
		id: gridId + '_editFaDianLiangDanJu', buttonicon :'fa fa-pencil-square-o',
		onClickButton:function(){
			manipulateGongCheng('编辑','JieSuanDianLiangLuRu');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'删除',title:'删除选中项。', 
		id: gridId + '_delFaDianLiangDanJu', buttonicon :'fa fa-trash',
		onClickButton:function(){
			manipulateGongCheng('删除','JieSuanDianLiangLuRu');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'分组查询',title:'分组查询。', 
		id: gridId + '_serlFaDianLiangDanJu', buttonicon :'fa fa-search',
		onClickButton:function(){
			manipulateGongCheng('查询','JieSuanDianLiangLuRu');
		} 
	});
	$('#gbox_rowed').addClass('paddingoverflow');
	flexingGrid(gridId);
}

function DianLiangChanXiaoCunLuRu(){
	//创建jqGrid组件
	var lastsel3;
	$('#main_content').empty().html('<table id="rowed"></table>'+'<div id="pager" ></div>');
	jQuery("#rowed").jqGrid(
			{
				url : 'data/JSONData.json',//组件创建完成之后请求数据的url
				styleUI : 'Bootstrap',
				datatype : "json",//请求数据返回的类型。可选json,xml,txt
				colModel : [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
				             {label:'业务单元（公司）', name : 'yewudanyuan',width : 160,align:'center',}, 
				             {label:'会计期间', name : 'danjubianhao',width : 90,editable: true,align : "center"}, 
				             {label:'编码', name : 'lururen',width : 80,align:'center'}, 
				             {label:'名称', name : 'lururen',width : 80,align:'center'}, 
				             {label:'生产总量', name : 'wuliaobianma',width : 80,align : "center",editable : true,editoptions : {size : 25}}, 
				             {label:'结算总量', name : 'wuliaomingcheng',width : 150,editoptions : {readonly : true,size : 10}},
				             {label:'结存电量', name : 'fadianliang',width : 80,editable : true,editoptions : {size : 25},align : "right"} ,
				             {label:'结存金额', name : 'fadianliang',width : 80,editable : true,editoptions : {size : 25},align : "right",formatter:'currency'} ,
				             {label:'公司标识', name : 'gongshibiaoshi',width : 80,align : "right"} ,
				           ],
				onSelectRow : function(id) {
		          if (id && id !== lastsel3) {
			            jQuery('#rowed').jqGrid('restoreRow', lastsel3);
			            lastsel3 = id;
		          }
		        },
				rowNum : 1000,//一页显示多少条
				pgbuttons : false,//是否显示翻页按钮
				pgtext	: null,
				hidegrid : false,
				pager : '#pager',//表格页脚的占位符(一般是div)的id
				sortname : 'id',//初始化的时候排序的字段
				sortorder : "desc",//排序方式,可选desc,asc
				mtype : "post",//向后台请求数据的ajax的类型。可选post,get
				viewrecords : true,
				width: 'auto',
				height: '100%',
				autowidth: true,
				forceFit: false,
			});
	jQuery("#rowed").jqGrid("navGrid", "#pager",
			{edit: false, add: false, del: false, refresh: false, search:false});
	
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'新增',title:'新增项。', 
		id: gridId + '_newFaDianLiangDanJu', buttonicon :'fa fa-plus',
		onClickButton:function(){
			manipulateGongCheng('新增');
			
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'修改',title:'修改选中项。', 
		id: gridId + '_editFaDianLiangDanJu', buttonicon :'fa fa-pencil-square-o',
		onClickButton:function(){
			manipulateGongCheng('编辑');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'删除',title:'删除选中项。', 
		id: gridId + '_delFaDianLiangDanJu', buttonicon :'fa fa-trash',
		onClickButton:function(){
			manipulateGongCheng('删除');
		} 
	});
	jQuery("#rowed").jqGrid('navButtonAdd', "#pager", {caption:'分组查询',title:'分组查询。', 
		id: gridId + '_delFaDianLiangDanJu', buttonicon :'fa fa-search',
		onClickButton:function(){
			manipulateGongCheng('查询');
		} 
	});
	$('#gbox_rowed').addClass('paddingoverflow');
	flexingGrid(gridId);
}

function flexingGrid(gridId) {
	$('#gbox_' + gridId).addClass('flexExpanding flexInnerContainer_Col flexMainContainer_Col');
	$('#gview_' + gridId).addClass('flexExpanding flexInnerContainer_Col');
}

function manipulateGongCheng(strAction,strTableType){
	var templatePage = '';
	if(strTableType == "FaDianLiangLuRu"){
		if(strAction === '新增'||strAction === '编辑'){
			templatePage = 'templates/fadianliangluru.html';
		} else if(strAction === '查询'){
			templatePage = 'templates/fadianliangchaxun.html';
		}
	}else if(strTableType == "JieSuanDianLiangLuRu"){
		if(strAction === '新增'||strAction === '编辑'){
			templatePage = 'templates/jiesuandianliangluru.html';
		} else if(strAction == '查询'){
			templatePage = 'templates/jiesuandianliangchaxun.html';
		}
	}
	if (strAction === '新增') {
		newProject(strTableType,templatePage);
	} else if (strAction === '编辑') {
		editProject(strTableType,templatePage);
	} else if (strAction === '删除') {
		deleteProject(strTableType);
	} else if (strAction === '查询') {
		searchProject(strTableType,templatePage);
	} 
	function newProject(strTableType,templatePage){
		var newProjectDialog = document.createElement('div');
		$.get(templatePage, function(data){
			newProjectDialog.innerHTML = data;
			$(newProjectDialog).dialog({
				title: '新增单据',
				width: 710,
				modal : true,
				position: { my: "center", at: "center", of: window },
				buttons: {
			 		"确定" :	function() {
			 			if (!checkValidation(newProjectDialog)) return;
			 			addRowData(newProjectDialog);
//						同时拿到最新的页面数据写入后台
			 			closeDialog(this);
			 		},
					"退出" : function() {
						closeDialog(this);
					}
				}
			}); 
			$(".date-picker-elem").datepicker();
			
			$(newProjectDialog).dialog({
				position: { my: "center", at: "center", of: window },
			});
			if(strTableType == "FaDianLiangLuRu"){
				console.log('321');
				$("#DanJia").bind('keyup',jineCountFadianlianglurudan);
				$("#FaDianLiang").bind('keyup',jineCountFadianlianglurudan);
			}else if(strTableType == "JieSuanDianLiangLuRu"){
				$("#JieSuanDianLiang").bind('keyup',jineCountJiesuandianlianglurudan);
				$("#BiaoGanDanJia").bind('keyup',jineCountJiesuandianlianglurudan);
				$("#BuTieDanJia").bind('keyup',jineCountJiesuandianlianglurudan);
			}
		},'text');
		newProjectDialog.className='dialog-body';
	}
	function editProject(strTableType,templatePage){
		var gridId = "#rowed";
		var selectedId = $(gridId).jqGrid('getGridParam', 'selrow');
		if (!selectedId) {
			alert('请先选中您要需要修改的明细行！', '没有选中要修改的记录', 'wrong');
			return;
		}
		var theData = $(gridId).jqGrid('getRowData', selectedId);
		var editDialog = document.createElement('div');
		$.get(templatePage, function(data){
			editDialog.innerHTML = data;
			fillElementsWithData(theData,editDialog);
			$(editDialog).dialog({
				title: '修改单据',
				modal : true,
				width: 710,
				position: { my: "center", at: "center", of: window },
				buttons: {
					"确定" :	function() {
						editRowData(editDialog,selectedId);
//！！！！						同时拿到最新的页面数据写入后台
						closeDialog(this);
					},
					"退出" : function() {
						closeDialog(this);
					}
				}
			}); 
			$(".date-picker-elem").datepicker();
			
			$(editDialog).dialog({
				position: { my: "center", at: "center", of: window },
			});
		},'text');
		editDialog.className='dialog-body';
	}
	function deleteProject(){
		var gridId = "#rowed";
		var selectedId = $(gridId).jqGrid('getGridParam', 'selrow');
		if (!selectedId) {
			alert('请先选中您要需要修改的明细行！', '没有选中要修改的记录', 'wrong');
			return;
		}
		var deleteDialog = document.createElement('div');
		deleteDialog.append("你在执行删除操作，如果是误操作点击”取消“按钮，点击”确认“完成删除");
		$(deleteDialog).dialog({
			title: '删除单据',
			width: 710,
			modal : true,
			position: { my: "center", at: "center", of: window },
			buttons: {
				"确定" :	function() {
					deleteRowData(deleteDialog,selectedId);
//！！！！					同时拿到最新的页面数据写入后台
					closeDialog(this);
				},
				"取消" : function() {
					closeDialog(this);
				}
			}
		}); 
		$(deleteDialog).dialog({
			position: { my: "center", at: "center", of: window },
		});
		deleteDialog.className='deleteStyle dialog-body';
	}
	function searchProject(strTableType,templatePage){
		var newProjectDialog = document.createElement('div');
		console.log(templatePage);
		$.get(templatePage, function(data){
			newProjectDialog.innerHTML = data;
			console.log(newProjectDialog);
			$(newProjectDialog).dialog({
				title: '查询',
				width: 710,
				modal : true,
				position: { my: "center", at: "center", of: window },
				buttons: {
			 		"查询" :	function() {
//！！！！			 		将查询的选项传入后台，更新数据	
			 		},
					"退出" : function() {
						closeDialog(this);
					}
				}
			}); 
			$(".date-picker-elem").datepicker();
			
			$(newProjectDialog).dialog({
				position: { my: "center", at: "center", of: window },
			});
		},'text');
		newProjectDialog.className='dialog-body';
	}
}
function closeDialog(theDialogElem) {
	$(theDialogElem).dialog({
		dialogClass : 'willClose',
		autoOpen : false
	});
	$(theDialogElem).dialog('destroy');
	for (var i = 0; i < $(theDialogElem).length; i++) {
		document.body.removeChild($(theDialogElem)[i]);
	}
};

//用于控制sidebar的显示内容
function showWhichSidebar(id){
	var htmlStr = "";
	if(id=="yonghu"){
		htmlStr +="<li id='fadianliang_col' class='sidebar-col'><a href='javascript: void sidebarChecked(\"发电\");'><i class='img-icon fa fa-book'></i>发电量录入单据</a></li>"
		htmlStr +="<li id='jiesuandianliang_col' class='sidebar-col'><a href='javascript: void sidebarChecked(\"结算\");'><i class='img-icon fa fa-book'></i><span>结算电量单据</span></a></li>"
		htmlStr +="<li id='jiecundianliang_col' class='sidebar-col'><a href='javascript: void sidebarChecked(\"结存\");'><i class='img-icon fa fa-book'></i><span>结存电量处理</span></a></li>" 
		htmlStr +="<li id='dianzhanzonghui_col' class='sidebar-col'><a href='javascript: void sidebarChecked(\"电站总汇\");'><i class='img-icon fa fa-book'></i><span>电站月度经营汇总</span></a></li>"
		$("#baobiao_sidebar").html(htmlStr);
		$('#fadianliang_col').addClass('active');
	}else{
		htmlStr +="<li id='jituanzonghui_col' class='sidebar-col'><a href='javascript: void sidebarChecked(\"集团总汇\");'><i class='img-icon fa fa-book'></i><span>集团月度经营汇总</span></a></li>"
		$("#baobiao_sidebar").html(htmlStr);
		$('#jituanzonghui_col').addClass('active');
	}
}

function sidebarChecked(strAction){
	if(strAction == '发电'){
		$('.sidebar-col').removeClass('active');
		$('#fadianliang_col').addClass('active');
		$('#content-header h1').html('发电量录入单据');
		$('.current').text('发电量录入单据');
		$('#fixedTable').hide();
		$('#main_content').show();
		FaDianLiangLuRu();
	}else if(strAction == '结算'){
		$('.sidebar-col').removeClass('active');
		$('#jiesuandianliang_col').addClass('active');
		$('#content-header h1').html('结算电量录入单据');
		$('.current').text('结算电量录入单据');
		$('#fixedTable').hide();
		$('#main_content').show();
		JieSuanDianLiangLuRu();
	}else if(strAction == '结存'){
		$('.sidebar-col').removeClass('active');
		$('#jiecundianliang_col').addClass('active');
		$('#content-header h1').html('结存电量录入单据');
		$('.current').text('结存电量录入单据');
		$('#fixedTable').hide();
		$('#main_content').show();
		DianLiangChanXiaoCunLuRu();
	}else if(strAction == '电站总汇'){
		$('.sidebar-col').removeClass('active');
		$('#dianzhanzonghui_col').addClass('active');
		$('#content-header h1').html('电站月度总汇');
		$('.current').text('电站月度总汇表');
		$('#main_content').hide();
		$('#fixedTable').show();
		$('#fixedTable').empty();
		dianzhanyuedujingying();
	}else if(strAction == '集团总汇'){
		$('.sidebar-col').removeClass('active');
		$('#jituanzonghui_col').addClass('active');
		$('#content-header h1').html('集团月度总汇');
		$('.current').text('集团月度总汇表');
		$('#fixedTable').empty();
		jituanyuedubaobiao();
	}
}

/*新增行*/
function addRowData(newProjectDialog){
    var willGoingData = serializeObject(newProjectDialog);
    willGoingData.danjia = currencyUnformat(willGoingData.danjia);
    willGoingData.jine = currencyUnformat(willGoingData.jine);
 //***此处为伪造单据编号
    willGoingData.danjubianhao = "12113";
    jQuery("#rowed").jqGrid("addRowData",11,willGoingData,"last");
}

/*编辑行*/
function editRowData(editDialog,selectedId) {
	var willGoingData = serializeObject(editDialog);
	jQuery("#rowed").jqGrid("setRowData",selectedId,willGoingData,"false");
}

/*删除行*/
function deleteRowData(deleteDialog,selectedId){
	jQuery("#rowed").jqGrid("delRowData",selectedId);
}
/*计算行*/
function jineCountFadianlianglurudan(){
	console.log('123');
	var fadianliangNum = $('#FaDianLiang').val();
	var danjiaNum = currencyUnformat($('#DanJia').val());
	if(!fadianliangNum) fadianliangNum = [];
	if(!danjiaNum) danjiaNum = [];
	var jineNum = fadianliangNum*danjiaNum;
	$('.isLabelShow').show();
	$('#JinE').val(currencyFormatted(jineNum,true,''));
}
function jineCountJiesuandianlianglurudan(){
	var jiesuandianliangNum = $('#JieSuanDianLiang').val();
	var biaogandanjiaNum = currencyUnformat($('#BiaoGanDanJia').val());
	var butiedanjiaNum = currencyUnformat($('#BuTieDanJia').val());
	if(!jiesuandianliangNum) jiesuandianliangNum = [];
	if(!biaogandanjiaNum) biaogandanjiaNum = [];
	if(!butiedanjiaNum) butiedanjiaNum = [];
	var biaoganjineNum = jiesuandianliangNum*biaogandanjiaNum;
	var butiejineNum = jiesuandianliangNum*butiedanjiaNum;
	$('#BiaoGanJinE').val(currencyFormatted(biaoganjineNum,true,''));
	$('#BuTieJinE').val(currencyFormatted(butiejineNum,true,''));
}

//集团月度报表
function jituanyuedubaobiao(){
	$.get('data/jituanyuedubaobiao.json',function(data){
		 var baobiaoRows = data.rows;
		 console.log(baobiaoRows);
		 var gongshimingJsonStr = [];
		 var zhanweiObjFirst = {};
		 var zhanweiObjLast = {};
		 zhanweiObjFirst.width = "300px";
		 zhanweiObjFirst.fixed = true;
		 zhanweiObjFirst.field = "项目<img src='images/arrow-doubledown.png'/>";
		 zhanweiObjLast.width = "100px";
		 zhanweiObjLast.fixed = true;
		 zhanweiObjLast.field = '合计';
		 zhanweiObjLast.fixedDirection = "right";
		 for(var i=0;i<baobiaoRows.length;i++){
			     var gongshimingObj = {};
                 /*此处应考虑取到公司数为零的情况*/
			     if(baobiaoRows.length===1){
			    	 gongshimingObj.width = "600px";
			    	 $('.w-150').css('width','600px');
			     } else if(baobiaoRows.length===2){
			    	 gongshimingObj.width = "300px";
			    	 $('.w-150').css('width','300px');
			     } else if(baobiaoRows.length===3){
			    	 gongshimingObj.width = "200px";
			    	 $('.w-150').css('width','200px');
			     } else {
			      	 gongshimingObj.width = "150px";
			    	 $('.w-150').css('width','150px');
			     }
			     gongshimingObj.field = baobiaoRows[i].gongsimingcheng;
				 gongshimingJsonStr.push(gongshimingObj);
		 }
		 gongshimingJsonStr.unshift(zhanweiObjFirst);
		 gongshimingJsonStr.push(zhanweiObjLast);
		 console.log(gongshimingJsonStr);
		 $(function (){
	         var fixedTable = new FixedTable({
	             wrap: document.getElementById("fixedTable"),//生成的表格需要放到哪里
	             type: "row-col-fixed",//表格类型，有：head-fixed、col-fixed、row-col-fixed
	             extraClass: "",//需要添加到表格中的额外class
	             maxHeight: true,
	             fields:gongshimingJsonStr,
	             tableDefaultContent: "<div>我是一个默认的div</div>"
	         });
	
	
	
	         fixedTable.addRow(function (){
	             var html = '';
	                 html += "<tr><td class='w-300'><div class='table-cell'>备案装机量（MWP）</div></td>";
	                 for(var i=0;i<baobiaoRows.length;i++){
	                	 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].beianzhuangjiliang+"</div></td>";
	                 }
	                 html += " <td class='w-100'><div class='table-cell'>"+data.beianzhuangjiliangSum+"</div></td></tr>";
	             console.log(html)
	             return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr><td class='w-300'><div class='table-cell'>实际装机量（MWP）</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shijizhuangjiliang+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shijizhuangjiliangSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>发电量<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>2017年7月(KWH)</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].fadianliang.yuedu+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.fadianliangyueduSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>2017年累计(KWH)</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].fadianliang.niandu+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.fadianliangnianduSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr><td class='w-300'><div class='table-cell'>限电率（%）</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiandianlv+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>-</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>收入</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>2017年7月收入<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>脱硫标杆</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.benyue.tuoliubiaogan+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shourubenyuetuoliuSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>补贴</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.benyue.butie+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.shourubenyuebutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>2017年累计收入<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>脱硫标杆</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.bennian.tuoliubiaogan+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shourubenniantuoliuSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>补贴</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.bennian.butie+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.shourubennianbutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>2017年8月收入预计<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>脱硫标杆</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.xiayueyuji.tuoliubiaogan+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shouruxiayueyujituoliuSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>补贴</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.xiayueyuji.butie+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.shouruxiayueyujibutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>2016年8月同期收入<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>脱硫标杆</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.quniantongqi.tuoliubiaogan+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shouruquniantongqituoliuSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>补贴</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].shouru.quniantongqi.butie+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.shouruquniantongqibutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>电费到账情况</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>8月预计收到脱硫标杆电费<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>承兑</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiayueyujjdaozhangTuoliu.chengdui+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.shouruquniantongqituoliuSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>现金</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiayueyujjdaozhangTuoliu.xianjin+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.shouruquniantongqibutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>到账预计日期</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiayueyujjdaozhangTuoliu.yujiriqi+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>-</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>补贴到账预计</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>8月预计收到的补贴电费<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>承兑</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiayueyujidaozhangButie.chengdui+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.xiayueyujidaozhangButieChengduiSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>现金</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].xiayueyujidaozhangButie.xianjin+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.xiayueyujidaozhangButieXianjinSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-head'><td class='w-300'><div class='table-cell'>1-7月累计收到的补贴电费<img src='images/arrow-down.png'/></div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'></div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html = '';
	        	 html += "<tr class='tb-suojin'><td class='w-300'><div class='table-cell tb-suojin'>承兑</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].bennianButie.chengdui+"</div></td>";
	        	 }
	        	 html += " <td class='w-100'><div class='table-cell'>"+data.bennianButieChengduiSum+"</div></td></tr>";
	        	 console.log(html)
	        	 return html;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell tb-suojin'>现金</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].bennianButie.xianjin+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.bennianButieXianjinSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell'>已清算的补贴电费期间</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'></div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>-</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
	         fixedTable.addRow(function (){
	        	 var html1 = '';
	        	 html1 += "<tr><td class='w-300'><div class='table-cell'>截止17年7月尚未收到的补贴电费</div></td>";
	        	 for(var i=0;i<baobiaoRows.length;i++){
	        		 html1 += "<td class='w-150'><div class='table-cell'>"+baobiaoRows[i].bennianweishoudaobutie+"</div></td>";
	        	 }
	        	 html1 += " <td class='w-100'><div class='table-cell'>"+data.bennianweishoudaobutieSum+"</div></td></tr>";
	        	 console.log(html1)
	        	 return html1;
	         });
		 });

     });
}

function dianzhanyuedujingying(){
	$.get('templates/dianzhanyuedujingying.html',function(data){
		console.log(data);
		$('#fixedTable').html(data);
	})
}