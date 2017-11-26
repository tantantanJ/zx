function GetQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) return (r[2]); return null; 
} 

function iniContextObject(objContext, strParentSelector) {
	if (objContext == undefined) {
		return $('body');
	} else {
		if (strParentSelector) {
			if ($(objContext).is(strParentSelector)) {
				return $(objContext);
			}
			var parentObj = $(objContext).closest(strParentSelector);
			if (parentObj.length == 0) {
				return $('body');
			} else {
				return parentObj;
			}
		} else {
			return $(objContext);
		}
	}
}

function fillElementsWithData(theData,objContext){
	if(!theData) return;
	objContext = iniContextObject(objContext);
	var inputElems = [];
	inputElems = $('input,select,textarea,.content-label',objContext).not('[type="checkbox"]').not('.ui-pg-input').not(
	'.not-fillin').not('.ui-datepicker-year').not(
	'.ui-datepicker-month');
	for(var i = 0;i<inputElems.length;i++){
		if(theData.hasOwnProperty(inputElems[i].name)){
			if(inputElems[i].type === 'select-one'){
				if($(inputElems[i]).children('option').length > 0) {
					inputElems[i].value = theData[inputElems[i].name]
				}
			} else {
				inputElems[i].value = theData[inputElems[i].name];
			}
		}
	}
}

/*
 * 根据select的选择带出后面输入框的value,前提： 无 输入： 参数1：Object, select的值与只对应的值;
 * 参数2：domElem,select选中项对应的DOM
 * 参数3：domElem,显示区域对应的DOM
 * 出口： 返回调用本函数的页面 返回： 无 改进： 暂无
 */
function showDefaultVal(selectName,inputName,showName,dataObj){
	   var optionSelected = $("select[name='"+selectName+"']").find("option:selected");
       var valueSelected  = optionSelected.text();
       if(dataObj){
    	   $("input[name="+showName+"]").val(dataObj[valueSelected]);
       }
       $("input[name="+inputName+"]").val(valueSelected);
       
}

/*
 * 实际完成静态信息填充过程中ajax数据处理，并填入相关options的函数 前提： 控件必须是select类型的，能够接受option子元素。
 * ajax返回数据只能使用本系统约定的text数据格式。 输入: 参数1, jquery OBject : ajax调用的返回数据 参数2， String :
 * 需要填充信息的元素的ClassName 出口： 返回调用点，继续执行后续语句 返回： 正常：返回字符数组，为ajax调用的返回数据内容
 * 异常：ajax调用错误或无数据时，返回空值。 其他: 无 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2013-12-28
 * 
 * Ver 1.1 简述: 1) 彻底修改了函数的参数系统： strData:
 * 需填入option的参数，格式为系统约定的ajax返回文本格式，正常填入的数据应以OK~TRUE~开头; strSelector:
 * 用于jquery操作的selector字符串; blnFillInOptGroupDftF:
 * 填入OPTION时是否加入分组信息的控制开关，true,false blnBlankFirstDftU:
 * 是否在options前面预留空选项的控制开关，true,false blnKeepPrevValDftT:
 * 填入options时是否保留原值的控制开关，true,false blnHideWhenEmptyDftF:
 * 如果传入的元素的options内容为空，是否隐藏该元素的控制开关，true,false 2) 取消了原来函数的返回值OPTIONS数组
 * 
 * @author Harry
 * @version 1.1 2014-09-19
 * 
 * Ver 1.2 简述: 1） 增加参数： blnKeepOrgOptDftF: 布尔量，决定是否保留原来select的options，缺省为false;
 * 2） 如果要保留原来的otion，则新增的options插入到原来options之前；
 * 3）目的：完成两组不同数据来源的options拼接到一起，调用者来保证两组数据的不可重复性。
 * 
 * @author Harry
 * @version 1.2 2014-12-21
 * 
 * Ver 1.3 简述： 1）修改原string类型参数 strSelector，为
 * objFillInElems：该参数可以是jQuery()函数能接受的任何合法对象
 * 
 * @author: Harry
 * @version 1.3: 2015-1-23
 * 
 * Ver 1.4 简述 1） 增加了检查填充前的原值与需要填充的值之间的重复关系：
 * 如果两部分的val值相同，则删除原来的option，使用需要新填充的option作为有效option 2） 这样做可能存在的问题：
 * 假设先填入了完整的正确options，再通过fillElementsWithData函数填入数据表的数值，如果不经检查，可能导致
 * 原来正确的option的text被不正确的覆盖，同时可能丢失mytag信息。因此在fillElementsWithData函数中增加了
 * 赋值val之前检查是否有同样val的option存在
 */
function processAndFillData(strData, objFillInElems, blnFillInOptGroupDftF,
		blnBlankFirstDftU, blnKeepPrevValDftT, blnKeepOrgOptDftF,
		blnHideWhenEmptyDftF) {

	if (strData.indexOf('OK~FALSE') == -1 && strData.indexOf('OK~TRUE~') == -1
			&& strData) {
		strData = 'OK~TRUE~' + strData;
	}

	// 确定布尔参数的缺省值
	// 填入options开关：缺省为false，除非传入参数明确赋值为true；
	if (blnFillInOptGroupDftF === undefined)
		blnFillInOptGroupDftF = false;
	// 保留element原赋值开关：缺省为true，除非传入参数明确赋值为false；
	if (blnKeepPrevValDftT === undefined)
		blnKeepPrevValDftT = true;
	if (blnKeepOrgOptDftF === undefined)
		blnKeepOrgOptDftF = false;
	// 如没有填入项，是否隐藏元素的开关：缺省为false，除非传入参数明确赋值为true；
	if (blnHideWhenEmptyDftF === undefined)
		blnHideWhenEmptyDftF = false;

	var options = ajaxTextProcessing(strData); // 需要新填入的option数据
	var selectElems = $(objFillInElems); // 所有满足条件的select元素
	if (options == false || options == null) {
		// 按照是否隐藏元素的开关，隐藏元素。
		if (blnHideWhenEmptyDftF) {
			for (var i = 0; i < selectElems.length; i++) {
				if (selectElems[i].length == 0)
					$(selectElems[i]).hide();
			}
		}
		if (!blnKeepPrevValDftT) {
			selectElems.empty();
		}
		return;
	}
	;

	// 申明记录填充前状况的数组，每个数组的长度应与selectElems的长度严格一致，否则还原时可能张冠李戴
	// 针对每个select元素，均保留其原来的value和text，以数组形式保存
	// 针对每个select元素，均保留其原来的options的完整内容以及对应每个option的value，以数组形式保存
	var originalValue = []; // 记录每个select元素当前value的数组
	var originalText = []; // 记录每个select元素当前text的数组
	var orgOptions = []; // 记录原始optionHTML内容的数组
	var orgOptValues = []; // 记录原始option的value值的数组
	var orgPlaceHolder = ''; // 记录原始placeholder的字符变量
	if (blnKeepPrevValDftT || blnKeepOrgOptDftF) {
		for (i = 0; i < selectElems.length; i++) {
			var orgOpts = $.trim(selectElems[i].innerHTML);
			// 先根据options的内容确定需要记录的value值
			// 如果select元素已经选中（包含选中options的value=""的占位符），则如实记录val和text
			if (selectElems[i].selectedIndex != -1) {
				originalValue.push(selectElems[i].value);
				originalText
						.push(selectElems[i].options[selectElems[i].selectedIndex].text);
				if (!selectElems[i].value)
					orgPlaceHolder = selectElems[i].options[selectElems[i].selectedIndex].text;
			} else {
				// 否则以字符串null做为值便于后面的判断
				originalValue.push('null');
				originalText.push('null');
			}

			// select元素的起始options是否value=""的空值，如果是，则要将该option剔除，避免回填的时候重复填入value=""的option
			if (orgOpts.indexOf('<option value=""') == 0) {
				orgOpts = orgOpts.substring(orgOpts.indexOf('</option>') + 9,
						orgOpts.length);
			}
			if (orgOpts) {
				var arrOrgOptVals = orgOpts.split('</option>');
				// split函数后，数组的最后一个成员多余的空值，并且比实际select的options数量多一个，因此需要删除
				// 数组为空时，pop函数不改变数组，并返回undefined值，这里不关心返回值，仅使用删除数组最后一个成员的功能。
				arrOrgOptVals.pop();
				for (var j = 0; j < arrOrgOptVals.length; j++) {
					var val = arrOrgOptVals[j];
					val = val.substring(val.indexOf('value="') + 7, val.length);
					val = val.substring(0, val.indexOf('"'));
					arrOrgOptVals[j] = val;
				}
				orgOptValues.push(arrOrgOptVals.join(','));
				orgOptions.push(orgOpts);
			} else {
				// 如果select元素原本没有options或者options仅含value=""的option，则以字符null作为options进行记录，避免后续填入无用的空option。
				orgOptValues.push('null');
				orgOptions.push('null');
			}
		}
	}

	// empty()是清除child elements。
	$(objFillInElems).empty();

	var optGroupLabel = '';
	var optionString = '';
	for (i = 0; i < options.length; i++) {
		var ops = options[i].split('^');
		var idxInOrgOpt = 0;
		// 检测新填入的option是否与原来的option有重复，如果有，则删除原来的option
		for (j = 0; j < orgOptions.length; j++) {
			idxInOrgOpt = -1;
			if (orgOptValues[j]) {
				arrOrgOptVals = orgOptValues[j].split(',');
				idxInOrgOpt = $.inArray(ops[0], arrOrgOptVals);
			}
			if (idxInOrgOpt != -1) {
				var tmpOrgOpts = orgOptions[j].split('</option>');
				tmpOrgOpts.splice(idxInOrgOpt, 1);
				orgOptions[j] = tmpOrgOpts.join('</option>');
			}
		}
		if (blnFillInOptGroupDftF) {
			// 填入options分组信息，分组信息需形成在opt数组的第3位，如该位undefined或者该位和第2位内容一样，则不填入
			if (ops[2] != optGroupLabel && ops[2]) {
				if (optGroupLabel == '') {
					optionString = '<optgroup label="' + ops[2] + '">';
				} else {
					optionString += '</optgroup>';
					optionString += '<optgroup label="' + ops[2] + '">';
				}
				optGroupLabel = ops[2];
			}
		}
		if (ops.length == 1) {
			optionString += '<option value="' + ops[0] + '">' + ops[0]
					+ '</option>';
		} else if (ops.length == 3) {
			optionString += '<option mytag="' + ops[2] + '" value="' + ops[0]
					+ '">' + ops[1] + '</option>';
		} else if (ops.length > 3) {
			// 增加对ops数组第4位之后信息的处理，处理方式为，将第4位之后的内容合并为一个字符串
			var strForMyTag1 = '';
			for (var x = 3; x < ops.length; x++) {
				strForMyTag1 += ops[x] + '~';
			}
			strForMyTag1 = strForMyTag1.substring(0, strForMyTag1.length - 1);
			optionString += '<option mytag1="' + strForMyTag1 + '" mytag="'
					+ ops[2] + '" value="' + ops[0] + '">' + ops[1]
					+ '</option>';
		} else {
			// 针对后台数据可能返回提示信息而不是用于选择的选项，进行特殊处理，将该option设置为不可选择工程
			// 提示信息的标志为：value字段为NA
			if (ops[0] == 'NA' || ops[0] == 'na') {
				optionString += '<option disabled class="disabled-temporary" value="'
						+ ops[0] + '">' + ops[1] + '</option>';
			} else {
				optionString += '<option value="' + ops[0] + '">' + ops[1]
						+ '</option>';
			}
		}
	}
	;

	for (i = 0; i < selectElems.length; i++) {
		var fillInOptions = optionString;
		if (blnKeepOrgOptDftF && orgOptions[i] != 'null') {
			fillInOptions = orgOptions[i] + optionString;
		}
		selectElems[i].innerHTML = fillInOptions;
		var emptyValOpt = ''; // 根据元素的class，判定空值option的内容
		if ($(selectElems[i]).hasClass('not-empty')) {
			if (orgPlaceHolder) {
				emptyValOpt = '<option value="" disabled selected style="display:none">'
						+ orgPlaceHolder + '</option>';
			} else {
				emptyValOpt = '<option value="" disabled selected style="display:none">必选项</option>';
			}
		} else {
			if (orgPlaceHolder) {
				emptyValOpt = '<option value="">' + orgPlaceHolder
						+ '</option>';
			} else {
				emptyValOpt = '<option value=""></option>';
			}
		}
		// 根据传入参数，决定是否填入空值参数
		// 填入条件：非空options的数量 >1 AND (强制填入空值option的参数未定义 OR )
		if ((blnBlankFirstDftU == undefined && $(selectElems[i]).find('option').length > 1)
				|| blnBlankFirstDftU) {
			selectElems[i].innerHTML = emptyValOpt + selectElems[i].innerHTML;
		}

		if (blnKeepPrevValDftT && originalValue.length > 0) {
			var oldValue = originalValue.shift();
			var oldText = originalText.shift();
			if (oldValue != 'null') {
				// 原值为空字符，且原始记录了placeHoder字符的内容，则认为原select元素没有进行选择，保留了placeholder状态，
				// 这是，检查placeholder占位的option是否填入，如果没有，则照原样插入占位option
				if (!oldValue
						&& orgPlaceHolder
						&& $(selectElems[i]).find('option[value=""]').length == 0) {
					selectElems[i].innerHTML = emptyValOpt
							+ selectElems[i].innerHTML;
					// 其他情况，则判断原始的选中value和text是否已经作为option插入，如果没有，则插入到options的最后位置
				} else if ($(selectElems[i]).find(
						'option[value="' + oldValue + '"]').length == 0) {
					selectElems[i].innerHTML += "<option value=\"" + oldValue
							+ "\">" + oldText + "</option>";
				}
				// 如果原始选中有值，则仅填入原始值，不触发change事件
				selectElems[i].value = oldValue;
			} else {
				$(selectElems[i]).trigger('change');
			}
		} else {
			$(selectElems[i]).trigger('change');
		}
		$(selectElems[i]).trigger('troggle-placeholder-color');
	}
};


/*
 * 将页面element的name和value转换为name:value格式的js Object
 * jQuery的ajax函数支持以上形式的object作为post参数， 也支持
 * {name=name1,value=value1;name=name2,value=value2;....}形式的post参数 还支持
 * {name:value}[]数组形式的post参数。
 * 但是，在jqgrid控件中，如果要实现分页显示，则只能使用第一种形式的参数格式。本函数就是因为这个目的而存在的。
 * 
 * 前提： 无 输入: String或jQuery对象, 需要转换的元素所在的父容器或父容器选择器字符，用于限定转换的元素选择范围; 出口： 维持在原页面
 * 返回： js Object= {name1:value1,name2:value2,.....} 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2013-12-24
 * 
 * 1.1 版本简述 增加了对输入单元是否有value的判断，允许函数返回空对象
 * 
 * @author Harry
 * @version 1.1 2014-12-17
 * 
 * 1.2 版本简述 增加了采集含数据信息的LABEL元素的值的功能。 规则：字段名应作为LABEL的id，且LABEL元素应属于with-data类
 * 
 * @author Harry
 * @version 1.2 2015-10-09
 */
function serializeObject(objContext) {
	objContext = iniContextObject(objContext);
	var inputElems = $('input,select,textarea', objContext).not('.ui-pg-input')
			.not('.not-serialize');
	var returnObj = {};
	// 对空字符，js在chrome和ie环境下的处理方式不同。
	// chrome下，obj的某个属性值为空，则这个属性在控制台不被打印，
	// 而ie下，空值的属性仍然会在控制台打印出来，
	// 但传递到后面程序时，仿佛两个平台是一样的，都没有空字符的属性。
	for (var i = 0; i < inputElems.length; i++) {
		if (inputElems[i].type == 'checkbox') {
			returnObj[inputElems[i].name] = inputElems[i].checked;
		} else {
			if (inputElems[i].value) {
				if ($(inputElems[i]).hasClass('percent')) {
					returnObj[inputElems[i].name] = inputElems[i].value / 100;
				} else {
					returnObj[inputElems[i].name] = inputElems[i].value;
				}
			} else {
				returnObj[inputElems[i].name] = null;
			}
		}
	}
	var notEditableElemsWithValue = $('.with-data', objContext);
	for (var i = 0; i < notEditableElemsWithValue.length; i++) {
		if (notEditableElemsWithValue[i].innerHTML) {
			returnObj[notEditableElemsWithValue[i].id] = notEditableElemsWithValue[i].innerHTML;
		} else {
			returnObj[notEditableElemsWithValue[i].id] = null;
		}
	}
	return returnObj;
};

/*
 * 在dom元素上显示错误提示信息的通用程序。
 * 
 * 前提： 无
 * 
 * 输入: 1）参数1：domElement，要显示错误提示内容的页面元素， 2）参数2：string，要显示的错误信息，
 * 3）参数3：boolean，是否需要自动加上元素对应的label信息的开关，可省略，缺省为true 出口： 1）调用本函数的页面 返回： 无 其他: 无
 * 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-12-20
 * 
 * 1.1版本简述 显示新的错误提示信息前，增加了调用清除原错误信息显示的步骤
 * 
 * @author Harry
 * @version 1.1 2015-09-23
 * 
 * 1.2版本简述 更改了tooltip的呈现方式，解决原来就有tooltip的单元不能及时显示帮助信息的问题；
 * 更改了帮助信息的传递方式，原版本通过更改元素的title属性值，现直接传递为tooltip的content内容。
 * 
 * @author Harry
 * @version 1.2 2015-10-08
 */
function showupHelpMessage(domElem, strMsg, blnAutoNamingDftT) {
	if (blnAutoNamingDftT == undefined)
		blnAutoNamingDftT = true;
	clearupHelpMessage();
	if (blnAutoNamingDftT) {
		var strNaming = '这里';
		if ($(domElem.parentNode).find('[for="' + domElem.name + '"]').length > 0) {
			strNaming = $(domElem.parentNode).find(
					'[for="' + domElem.name + '"]').text();
			strNaming = $.trim(strNaming);
			if (strNaming.substring(strNaming.length - 1) == '：'
					|| strNaming.substring(strNaming.length - 1) == ':') {
				strNaming = strNaming.substring(0, strNaming.length - 1);
			}
		}
		strMsg = strNaming + strMsg;
	}

	// domElem.title=strMsg;
	if ($(domElem).tooltip('instance')) {
		$(domElem).tooltip('destroy');
	}

	$(domElem).tooltip({
		items : domElem.tagName,
		tooltipClass : 'ui-state-error',
		position : {
			my : 'left+5 center',
			at : 'right center',
			collision : 'none'
		},
		content : strMsg
	}).tooltip('open');
	$(domElem).addClass('need-help-msg').focus();
};

/*
 * 清除dom元素上显示的错误提示信息的通用程序。 一次清除所有的错误提示信息。
 * 
 * 前提： 无 输入: 无 出口： 1）调用本函数的页面 返回： 无 其他: 无 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-12-20
 * 
 */
function clearupHelpMessage() {
	var needBulletin = $(".need-help-msg");
	for (var i = 0; i < needBulletin.length; i++) {
		needBulletin[i].title = '';
		$(needBulletin[i]).tooltip('destroy');
		$(needBulletin[i]).removeClass('need-help-msg');
	}
	;
};


function checkValidation(objContext) {
	if (!notEmptyCheck(objContext))
		return false;
	if (!notGroupFillins(objContext))
		return false;
	if (!noSpecialCharacterCheck(objContext))
		return false;
	if (!mobilNoCheck(objContext))
		return false;
	if (!teleNoCheck(objContext))
		return false;
	if (!QQCheck(objContext))
		return false;
	if (!emailCheck(objContext))
		return false;
	if (!idNoCheck(objContext))
		return false;
	if (!dateCheck(objContext))
		return false;
	if (!moneyCheck(objContext))
		return false;
	if (!noNegativeNumberCheck(objContext))
		return false;
	if (!integerCheck(objContext))
		return false;
	if (!isNumCheck(objContext))
		return false;
	if (!noWhiteSpaceCheck(objContext))
		return false;
	if (!notZeroCheck(objContext))
		return false;
	if (!percentNumberCheck(objContext))
		return false;
	if (!autoCompleteCheck(objContext))
		return false;
	return true;
};

/*
 * 检查autoComplete控件输入合法性的通用程序，支持： 1）一个名称元素对应一个id元素的情况。 2）一组名称元素对应一个id元素的情况。
 * 
 * 前提： 总体限制条件：名称元素必须有一个对应的label，通过for和name进行关联;
 * 第一种情况时：两类控件应是相邻的兄弟，中间不能间隔其他的autoComplete名称或id元素；
 * 第二种情况时：父容器中，不能有其他的autoComplete控件；
 * 
 * 输入: 1）参数1：string，父容器的选择字符， 出口： 1）调用本函数的页面 返回： true：如果autoComplete的输入均合法；
 * false：如果输入不合法 其他: 对于不加入合法性检查的autoComplete控件对：
 * 1）名称元素需加入class名autocomplete-no-validation； 2）id元素需去掉class名autocomplete-id 改进：
 * 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-12-17
 * 
 */
function autoCompleteCheck(objContext) {
	objContext = iniContextObject(objContext);
	var autoCompleteTextElems = $('.autocomplete', objContext).not(
			'.autocomplete-no-validation');
	var autoCompleteIdElems = $('.autocomplete-id', objContext).not(
			'.autocomplete-no-validation');
	if (autoCompleteIdElems.length == 0) {
		if (autoCompleteTextElems.length == 0) {
			return true;
		} else {
			showupMessageInDialog('autoComplete检查：没有找到id元素，请检查程序！', '函数调用错误',
					'wrong');
			return false;
		}
	}
	if (autoCompleteTextElems.length != autoCompleteIdElems.length
			&& autoCompleteIdElems.length != 1) {
		showupMessageInDialog('autoComplete检查：id元素和text元素数量不匹配，请检查程序！',
				'函数调用错误', 'wrong');
		return false;
	}
	if (autoCompleteIdElems.length == 1) {
		if (!autoCompleteIdElems[0].value) {
			for (var i = 0; i < autoCompleteTextElems.length; i++) {
				if ($(autoCompleteTextElems[i]).is(':visible')
						&& autoCompleteTextElems[i].value) {
					showupHelpMessage(autoCompleteTextElems[i],
							'只能从查询出的下拉选项中选择，不能自行输入！');
					return false;
				}
			}
		}
	} else {
		for (var i = 0; i < autoCompleteTextElems.length; i++) {
			if (!autoCompleteIdElems[i].value && autoCompleteTextElems[i].value
					&& $(autoCompleteTextElems[i]).is(':visible')) {
				showupHelpMessage(autoCompleteTextElems[i],
						'只能从查询出的下拉选项中选择，不能自行输入！');
				return false;
			}
		}
	}
	return true;
};

function notEmptyCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var notEmptyElems = $(".not-empty:enabled", objContext);
	for (var i = 0; i < notEmptyElems.length; i++) {
		if (notEmptyElems[i].value == '' && $(notEmptyElems[i]).is(':visible')) {
			showupHelpMessage(notEmptyElems[i], '的内容必须录入，请补充！');
			return false;
		}
	}
	return true;
};

function notGroupFillins(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var groupFillinElems = $(".group-fillins:enabled", objContext);
	var alreadyFillinCount = 0, notFillinCount = 0;
	var fillinsCaption = '';
	for (var i = 0; i < groupFillinElems.length; i++) {
		if ($(groupFillinElems[i]).is(':visible')) {
			if (!groupFillinElems[i].value) {
				notFillinCount++;
			} else {
				alreadyFillinCount++;
			}
			var captionElem = $(groupFillinElems[i]).prev('label');
			fillinsCaption += captionElem.html().replace(/:/g, '') + '、';
			fillinsCaption = fillinsCaption.replace(/：/g, '');
		}

	}
	fillinsCaption = fillinsCaption.substring(0, fillinsCaption.length - 1);
	if (notFillinCount && alreadyFillinCount) {
		showupHelpMessage(groupFillinElems[0], fillinsCaption
				+ '的内容要么全部填入，要么全部都不填，请改正！', false);
		return false;
	} else {
		return true;
	}
};

function noSpecialCharacterCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var noSpecials = $("input:enabled,textarea:enabled", objContext);
	for (var i = 0; i < noSpecials.length; i++) {
		noSpecials[i].value = noSpecials[i].value.replace(/%/g, '％');
		noSpecials[i].value = $.trim(noSpecials[i].value);
		if ($(noSpecials[i]).hasClass('autocomplete')
				&& !$(noSpecials[i]).hasClass('autocomplete-no-validation'))
			continue;
		if (noSpecials[i].value != '' && $(noSpecials[i]).is(':visible')) {
			// 正则表达式使用不熟练，暂时放弃，只检查单引号,%,&,\
			// if(!/^((?![\\/\^']).)*$/.test(noSpecials[i].value)){
			// if(!/[^\s\^']/.test(noSpecials[i].value)){
			if (noSpecials[i].value.indexOf("'") != -1
					|| noSpecials[i].value.indexOf("\\") != -1
					|| noSpecials[i].value.indexOf("&") != -1
					|| noSpecials[i].value.indexOf("^") != -1
					|| noSpecials[i].value.indexOf("【") != -1
					|| noSpecials[i].value.indexOf("】") != -1
					|| noSpecials[i].value.indexOf("~") != -1
					|| noSpecials[i].value.indexOf("%") != -1) {
				showupHelpMessage(noSpecials[i],
						'内容不能包含 "单引号\'"、"与符号&"、"幂符号^"、"连字符~"、'
								+ '"反斜杠\\\"、"书名号【】"，请检查并改正！');
				return false;
			}
		}
	}
	return true;
};

function noSpecialCharValidationInGrid(value, colname) {
	if (value.indexOf("'") != -1 || value.indexOf("%") != -1
			|| value.indexOf("&") != -1 || value.indexOf("^") != -1
			|| value.indexOf("【") != -1 || value.indexOf("】") != -1
			|| value.indexOf("~") != -1 || value.indexOf("\\") != -1) {
		return [
				false,
				"\"" + colname + '的录入内容不能包含 "单引号\'"、"与符号&"、"幂符号^"、"连字符~"、'
						+ '"反斜杠\\\"、"书名号【】"、"半角百分号%"，请检查并改正！' ];
	}
	return [ true, '' ];
};

function teleNoCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var teleNos = $(".tele-number:enabled", objContext);
	for (var i = 0; i < teleNos.length; i++) {
		if (teleNos[i].value != '' && $(teleNos[i]).is(':visible')) {
			// 检查电话号码的正则表达式，兼容11位手机号码，
			if (!/^\(?0\d{2}[) -]?\d{6,8}$|^\(?0\d{3}[) -]?\d{6,8}$|^[6 8]\d{7}$|^1\d{10}$/
					.test(teleNos[i].value)) {
				showupHelpMessage(teleNos[i], "的录入内容不是正确的座机或手机号码格式，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

function mobilNoCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var mobilNos = $(".mobil-number:enabled", objContext);
	for (var i = 0; i < mobilNos.length; i++) {
		if (mobilNos[i].value != '' && $(mobilNos[i]).is(':visible')) {
			// 检查11位手机号码，
			if (!/^1\d{10}$/.test(mobilNos[i].value)) {
				showupHelpMessage(mobilNos[i], "的录入内容不是正确的手机号码格式，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

function emailCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var emails = $(".email:enabled", objContext);
	for (var i = 0; i < emails.length; i++) {
		if (emails[i].value != '' && $(emails[i]).is(':visible')) {
			emails[i].value = emails[i].value.replace(/，/g, ',');
			var emailList = (emails[i].value).split(',');
			// 检查email地址格式，
			for (var j = 0; j < emailList.length; j++) {
				if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
						.test(emailList[j])) {
					showupHelpMessage(emails[i], "的录入内容不是正确的email地址格式，请检查改正！");
					return false;
				}
			}
		}
	}
	return true;
};

function QQCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var QQs = $(".QQ:enabled", objContext);
	for (var i = 0; i < QQs.length; i++) {
		if (QQs[i].value != '' && $(QQs[i]).is(':visible')) {
			// 检查email地址格式，
			if (!/^\d{5,12}$/.test(QQs[i].value)) {
				showupHelpMessage(QQs[i], "的录入内容不是正确的QQ号码格式，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

function idNoCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var idNos = $(".id-number:enabled", objContext);
	for (var i = 0; i < idNos.length; i++) {
		if (idNos[i].value != '' && $(idNos[i]).is(':visible')) {
			// 检查身份证格式，
			if (!/^\d{17}([0-9]|X)$/.test(idNos[i].value)) {
				showupHelpMessage(idNos[i], "的录入内容不是正确的身份证格式，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

function dateCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var dates = $(".date:enabled, date-picker-elem:enabled", objContext);
	for (var i = 0; i < dates.length; i++) {
		if (dates[i].value != '' && $(dates[i]).is(':visible')) {
			// 日期格式检查，
			if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dates[i].value)) {
				showupHelpMessage(dates[i], "的录入内容不是正确的日期格式，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的金额输入单元的格式正确性。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 无
 * 
 * @author Harry
 * 
 * @version 1.0 2013-12-28
 * 
 * 1.1版本简述： 排除了对单元值为0的检查，因为现数据编辑时，后台返回数据如果金额为空，页面上填的是0。 需排除这个情况。
 * 
 * @author Harry
 * @version 1.1 2014-1-8
 * 
 * 1.2版本简述： 修改了正则表打式，包含了0.1以及1.1这样的输入金额。 允许负金额输入。
 * 
 * @author Harry #version 1.2 2014-3-13
 * 
 * 调用者： 1）页面：几乎所有页面保存时都调用。
 */
function moneyCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var moneys = $(".money:enabled", objContext);
	for (var i = 0; i < moneys.length; i++) {
		// content-label会用money这个class来触发加入货币符号，因此，判断时需判处这种情况 -- Harry
		// 2014-12-26
		if (moneys[i].tagName != 'LABEL' && moneys[i].value
				&& $(moneys[i]).is(':visible')) {
			moneys[i].value = currencyUnformat(moneys[i].value);
			moneys[i].value = moneys[i].value.replace(/\s/g, '');
			// 金额输入格式检查。
			if (!/^-?[1-9]\d*$|^-?[1-9]\d*\.\d{1,2}$|^-?0.\d{1,2}$|^-?0$/
					.test(moneys[i].value)) {
				showupHelpMessage(moneys[i], "的金额输入格式不正确，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的输入单元的正负正确性。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-3-2
 * 
 * 1.1版本简述 增加了对非数字的检测。
 * 
 * @author Harry
 * @version 1.1 2014-6-10
 * 
 * 调用者： 1）order.js包中订单保存函数。
 */
function noNegativeNumberCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var noNegatives = $(".not-negative:enabled", objContext);
	for (var i = 0; i < noNegatives.length; i++) {
		if (noNegatives[i].value == '' || !$(noNegatives[i]).is(':visible'))
			continue;
		noNegatives[i].value = noNegatives[i].value.replace(/\s/g, '');
		if (isNaN(parseFloat(noNegatives[i].value))) {
			showupHelpMessage(noNegatives[i], "的录入内容必须为数字，请检查改正！");
			return false;
		}
		if (parseFloat(noNegatives[i].value) < 0) {
			showupHelpMessage(noNegatives[i], "的录入内容不允许为负数，请检查改正！");
			return false;
		}
	}
	return true;
};

/*
 * 检查指定范围内的无小数点数量输入单元的格式正确性。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-1-18
 * 
 * 
 * 调用者： 1）页面： marketing_event.html的新增、修改按键。 order.html页面的新增、保存按键。
 */
function integerCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var integer = $(".integer:enabled", objContext);
	for (var i = 0; i < integer.length; i++) {
		if (integer[i].value != '' && integer[i].value != '0'
				&& $(integer[i]).is(':visible')) {
			integer[i].value = integer[i].value.replace(/\s/g, '');
			// 金额输入格式检查。
			if (!/^-?[1-9]\d*$/.test(integer[i].value)) {
				showupHelpMessage(integer[i], "只能输入整数，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的无小数点数量输入单元的格式正确性。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-1-18
 * 
 * 
 * 调用者： 1）页面： marketing_event.html的新增、修改按键。 order.html页面的新增、保存按键。
 */
function noWhiteSpaceCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var noWS = $(".no-whitespace:enabled", objContext);
	for (var i = 0; i < noWS.length; i++) {
		if (noWS[i].value && $(noWS[i]).is(':visible')) {
			// 金额输入格式检查。
			if (/\s/.test(noWS[i].value)) {
				showupHelpMessage(noWS[i], '不允许输入非显示字符，例如"空格"等，请检查改正！');
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的输入单元的是否数字型。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 一些特殊数字表达法未考虑过滤，0xab，000.00，-11
 * 考虑用正则表达式 @author
 * 
 * @version 1.0
 * 
 * 
 * 调用者： 1）页面：系列设置、货物设置 页面的新增、保存按键。
 * 
 */
function isNumCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var inputs = $(".number:enabled", objContext);
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value != '' && $(inputs[i]).is(':visible')) {
			// 数字输入格式检查。
			if (isNaN(inputs[i].value)) {
				showupHelpMessage(inputs[i], "必须为数字，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的输入单元的必须为数字型，且不能为0。 前提： 无； 输入: 1）参数1：String,
 * 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回： true:检查通过。
 * false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 一些特殊数字表达法未考虑过滤，0xab，-11 考虑用正则表达式
 * 
 * @author
 * 
 * @version 1.0
 * 
 * 
 * 调用者： 1）页面：系列设置、货物设置 页面的新增、保存按键。
 * 
 */
function notZeroCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var inputs = $(".not-zero:enabled", objContext);
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value != '' && $(inputs[i]).is(':visible')) {
			// 非零数字输入格式检查。
			if (isNaN(inputs[i].value) || parseFloat(inputs[i].value, 10) == 0) {
				showupHelpMessage(inputs[i], "必须为数字，且不允许为零，请检查改正！");
				return false;
			}
		}
	}
	return true;
};

/*
 * 检查指定范围内的输入单元的必须为0-100之间的浮点数。 页面元素如果有percent类，则均代表去除'%'后的百分数，取值在0-100之间 前提： 无；
 * 输入: 1）参数1：String, 指定的检查范围的父元素标记，可以是任何合法的selector字符。 出口： 1）调用本函数的页面 返回：
 * true:检查通过。 false:检查有误，同时改变有错误单元的颜色，并给出提示 其他: 无 改进： 检查方法繁琐，考虑用正则表达式
 * 
 * @author
 * 
 * @version 1.0
 * 
 * 
 * 调用者： 1）页面：系列设置、货物设置 页面的新增、保存按键。
 * 
 */
function percentNumberCheck(objContext) {
	objContext = iniContextObject(objContext);
	clearupHelpMessage();
	var percentNumber = objContext.find(".percent");
	for (var i = 0; i < percentNumber.length; i++) {
		var testVal = parseFloat(percentNumber[i].value);
		if (testVal) {
			if (!isNaN(testVal)) {
				percentNumber[i].value = Math.round(testVal * 100) / 100;
				if (testVal < -100 || testVal > 100) {
					showupHelpMessage(percentNumber[i],
							"百分比数值应该是0-100之间，请检查改正！");
					return false;
				}
			} else {
				showupHelpMessage(percentNumber[i], "百分比的输入应为数字，请检查改正！");
				return false;
			}
		}
	}
	return true;
};
/*
 * 将数字格式化成标准货币格式。 前提： 无 输入: 参数1： float，要转换的数字。 参数2：
 * boolean，指定如果参数1为非数字变量，是否处理成0.00 出口： 返回调用点。 返回： 格式化完成的字符串 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-6-1
 * 
 * 1.1版本简述： 1） 增加参数3：string 货币符号，缺省使用rmb符号
 * 
 * @author Harry
 * @version 1.1 2016-07-23
 */
function currencyFormatted(theAmount, blnProcessNaN, strCurrencySymbol) {
	if (blnProcessNaN == undefined)
		blnProcessNaN = true;
	if (strCurrencySymbol === undefined)
		strCurrencySymbol = '￥';
	var i = parseFloat(theAmount);
	if (isNaN(i)) {
		if (blnProcessNaN) {
			i = 0.00;
		} else {
			return theAmount;
		}
	}

	var minus = '';
	if (i < 0) {
		minus = '-';
	}
	i = Math.round((Math.abs(i) * 100)) / 100;
	if (i == 0)
		minus = '';
	var partBeforePeriod = Math.floor(i);
	var partAfterPeriod = Math.round((i - partBeforePeriod) * 100);
	if (partBeforePeriod == 0) {
		partBeforePeriod = '0';
	} else {
		partBeforePeriod = new String(partBeforePeriod);
	}
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(partBeforePeriod)) {
		partBeforePeriod = partBeforePeriod.replace(rgx, '$1' + ',' + '$2');
	}
	if (partAfterPeriod == 0) {
		partAfterPeriod = '00';
	} else {
		partAfterPeriod = new String(partAfterPeriod);
	}
	if (partAfterPeriod.length == 1)
		partAfterPeriod = '0' + partAfterPeriod;
	var formattedAmount = minus + strCurrencySymbol + partBeforePeriod + '.'
			+ partAfterPeriod;
	return formattedAmount;
}

/*
 * 将标准货币格式去格式化为数字。 前提： 无 输入: 参数1： string，要去格式化的货币标准字符床。 参数2：
 * boolean，指定如果参数1为非数字变量，是否处理成0 出口： 返回调用点。 返回： 去格式化后的数字 改进： 暂无
 * 
 * @author Harry
 * 
 * @version 1.0 2014-6-1
 * 
 * 1.1版本简述： 1） 增加参数3：string 货币符号，缺省使用rmb符号
 * 
 * @author Harry
 * @version 1.1 2016-07-23
 */
function currencyUnformat(strAmount, blnProcessNaN, strCurrencySymbol) {
	if (strAmount == undefined)
		strAmount = '';
	if (typeof strAmount !== 'string') {
		return parseFloat(strAmount);
	}
	if (strCurrencySymbol === undefined)
		strCurrencySymbol = '￥';
	if (blnProcessNaN == undefined)
		blnProcessNaN = true;
	var reg = new RegExp(strCurrencySymbol, "g");
	strAmount = strAmount.replace(RegExp(strCurrencySymbol, 'g'), '');
	strAmount = strAmount.replace(/,/g, '');
	var i = parseFloat(strAmount);

	if (isNaN(i) && blnProcessNaN) {
		i = 0.00;
	}

	return i;
}

