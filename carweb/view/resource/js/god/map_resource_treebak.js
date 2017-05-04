~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $treeModal = $("#tree_modal");
	var $createContainer = $('#for_create_container');
	var pageSourceTreeNode = null;
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}
	;

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			param_sourceName : "",
			param_sourceInfo : "",
			param_sourceType : "",
			param_description : ""
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.param_sourceName = $("#name_ipt").val().trim();
			_queryParam.param_sourceInfo = $("#info_ipt").val().trim();
			_queryParam.param_sourceType = $("#type_ipt").val().trim();
			_queryParam.param_description = $("#description_ipt").val().trim();
			if (arguments.length != 0) {
				var args = arguments[0];
				for ( var x in args) {
					if (_queryParam[x]) {
						_queryParam[x] = args[x];
					}
				}
			}
			toString(_queryParam);
			return _queryParam;
		};
	})();

	// 增加字典字段
	function addDict() {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/add.html",
			data : {
				param_sourceName : $("#add_name_ipt").val().trim(),
				param_sourceInfo : $("#add_info_ipt").val().trim(),
				param_sourceType : $("#add_typeSelect").val().trim(),
				param_description : $("#add_description_ipt").val().trim(),
			},
			dataType: "json",
			success : function(data) {
				if (data.success) {
					$createContainer.hide();
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});
	}

	/** 导出记录 */
	window.exportData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type' : 'info',
				'text' : '没有可导出的记录',
				'title' : '提示'
			});
			return;
		}
		Util.ajax({
			url : requestContextPath + "/resource/export.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = data;
			}
		}, "正在导出，请稍等...");
	}

	function search() {
		$jTable.refreshTableData(getParam());
	}

	$(".searchbox input").keydown(function(event) {
		if (event.keyCode == 13) {
			search();
		}
	});

	$("#search_btn").click(search);
	$("#create_btn").click(function() {
		$createContainer.show();
	});
	$("#create_confirm_btn").click(addDict);
	$("#create_cancel_btn").click(function() {
		$createContainer.hide();
	});

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/resource/getList.html",
		paramsJson : getParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage"
		},
		tbodyMaker : function(data) {
			tableData = {};
			var dataSet = {
				total : data.total,
				list : ""
			};
			var dataList = [];
			var items = data.data;
			if (items) {
				for (var i = 0, len = items.length; i < len; i++) {
					var list = [];
					var curRow = items[i];
					tableData[curRow.id] = curRow;
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.sourceName);
					list.push(curRow.sourceInfo);
					list.push(curRow.sourceType);
					list.push(curRow.description);
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	$("#tree_modal_btnSave").click(function() {
		var $this = $(this);
		var targetObjectName = $("#targetObject").val();
		var treeObj = $.fn.zTree.getZTreeObj("privilege_tree");
		if (treeObj) {
			var nodes = treeObj.getCheckedNodes(true);
			var name = "", ids = [ 'main' ];
			// 默认有mian主页
			var idxCount = 1;
			if (nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					if (!nodes[i].isParent) {
						ids[idxCount] = nodes[i].id;
						idxCount = idxCount + 1;
					}
				}
			}
			var idsToStr = ids.join();
			$(targetObjectName).val(idsToStr);
		}
		// 显示数据到文本框中
		$treeModal.modal('hide');
	});

	$("#tree_modal_btnCancel").click(function() {
		$treeModal.modal('hide');
	});

	// 页面树编辑时选择父对象
	$("#pageSource_btn").click(function() {
		var selectedNodes = $("#pageSource_btn").val();
		var targetObjectName = "#pageSource_btn";
		showPrivilegeTree(selectedNodes, targetObjectName);
	});

	// 展示选择权限树
	function showPrivilegeTree(checkNodes, targetObjectName) {
		var zNodes = [];
		$("#targetObject").val(targetObjectName);
		var setting = {
			check : {
				enable : false
			},
			edit : {
				enable : true,
				editNameSelectAll : true,
				removeTitle : '删除',
				renameTitle : '重命名'
			},
			data : {
				key : {
					name : "name",
					url : ""
				}
			},
			view : {
				showIcon : false,
				dblClickExpand : false,
				addHoverDom : addHoverDom,
				removeHoverDom : removeHoverDom,
				selectedMulti : false
			},
			callback : {
				beforeClick : function(treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj("privilege_tree");
					zTree.checkNode(treeNode, !treeNode.checked, null, true);
					return false;
				}
			}
		};
		var menuJson = $.ajax({
			url : "resouce.json?math=?" + Math.random(),
			dataType : "json",
			async : false
		});
		zNodes = eval(menuJson.responseText);

		if (zNodes.length > 0) {
			$.fn.zTree.destroy("privilege_tree");
			$.fn.zTree.init($("#privilege_tree"), setting, zNodes);
			var treeObj = $.fn.zTree.getZTreeObj("privilege_tree");
			treeObj.expandAll(true);
			// isMenu是预留字段
			// 以下代码是用于禁止给叶子节点再添加子节点
			/**
			 * var leafNodes = treeObj.getNodesByParam("isMenu", "1",null);
			 * for(var i = 0,len = leafNodes.length;i<len;i++){
			 * treeObj.setChkDisabled(leafNodes[i], true); }
			 */

			// checkNodes = "user,message";
			var checkarr = checkNodes.split(",");
			for (var i = 0; i < checkarr.length; i++) {
				var toBeCheckedLeaf = treeObj.getNodeByParam("id", checkarr[i],
						null);
				if (toBeCheckedLeaf) {
					treeObj.checkNode(toBeCheckedLeaf, true, null, true);
				}
			}
		} else {
			$("#privilege_tree").html("暂时没有菜单数据");
		}
		$treeModal.modal({
			'backdrop' : 'static',
			'show' : true
		});
	}

	function addHoverDom(treeId, treeNode) {

		var sObj = $("#" + treeNode.tId + "_span");
		if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0)
			return;
		var addStr = "<button type='button' class='glyphicon glyphicon-plus' id='addBtn_"
				+ treeNode.id
				+ "' title='add node' onfocus='this.blur();'></button>";
		sObj.append(addStr);
		var btn = $("#addBtn_" + treeNode.id);
		pageSourceTreeNode = treeNode;
		if (btn)
			btn.bind("click", function() {
				debugger;
				$("#source_modal").modal({
					'show' : true
				});
				return true;
			});
	}

	// 新增窗口弹出
	$("#source_modal_btnSave").click(function() {
		debugger;
		var treeNode = pageSourceTreeNode;
		var newCount = 1;
		var zTree = $.fn.zTree.getZTreeObj("privilege_tree");
		var id = 100 + newCount;
		// 添加子节点信息
		zTree.addNodes(treeNode, {
			id : (100 + newCount),
			pId : treeNode.id,
			name : "new node" + (newCount++)
		});

		var nodes = zTree.getNodes();
		var curNode = [];
		var myNodes = buildTreeData(curNode, nodes);

		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/getTreeData.html",
			data : {
				param_treeData : myNodes
			},
			success : function(data) {
				if (data.success) {

				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});

		$("#source_modal").modal('hide');
	});

	
	// 本来需要构造资源树， 不好弄，改用文字方式
	function buildTreeData(curNode, nodes) {
		if ($.isArray(nodes)) {
			var dataItem = {
				name : '',
				id : '',
				children : {}
			};
			curNode = [];
			for (var i = 0; i < nodes.length; i++) {
				dataItem.name = nodes[i].name;
				dataItem.id = nodes[i].id;
				dataItem.children = [];
				curNode.push(dataItem);
				var childrens = nodes[i].children;
				if (childrens != null && childrens.length > 0) {
					curNode[i].children = new Array(childrens.length);
					for (var j = 0; j < childrens.length; j++) {
						curNode[i].children[j] = {
							name : '',
							id : '',
							children : {}
						};
						buildTreeData(curNode[i].children[j], childrens[j]);
					}
				}
			}
		} else {
			curNode = {
				name : '',
				id : '',
				children : {}
			};
			curNode.name = nodes.name;
			curNode.id = nodes.id;
			curNode.children = [];
			var childrens = nodes.children;
			if (childrens != null && childrens.length > 0) {
				curNode.children = new Array(childrens.length);
				for (var j = 0; j < childrens.length; j++) {
					curNode.children[j] = {
						name : '',
						id : '',
						children : {}
					};
					buildTreeData(curNode.children[j], childrens[j]);
				}
			}
		}
	}

	function removeHoverDom(treeId, treeNode) {
		$("#addBtn_" + treeNode.id).unbind().remove();
	}

	/** 行展开 */
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();

		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id).replace(
					"{name}", curData.sourceName || "").replace("{info}",
					curData.sourceInfo || "").replace("{description}",
					curData.description || "");
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
			$("#edit_type_ipt")
					.find('option[value=' + curData.sourceType + ']').attr(
							"selected", "selected");

			// 设置样式
			beautifulSelect2();
		} else {
			return false;
		}
	});

	/** 行编辑-确定 */
	$table.on("click", '#dict_detail_confirm', function(e) {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/edit.html",
			data : {
				id : $("#edit_id").val().trim(),
				param_sourceName : $("#edit_name_ipt").val().trim(),
				param_sourceInfo : $("#edit_info_ipt").val().trim(),
				param_sourceType : $("#edit_type_ipt").val().trim(),
				param_description : $("#edit_description_ipt").val().trim(),
			},
			dataType: "json",
			success : function(data) {
				if (data.success) {
					$(".row-edit-container").remove();
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});
	});

	/** 行收缩-取消 */
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
}(jQuery, window)