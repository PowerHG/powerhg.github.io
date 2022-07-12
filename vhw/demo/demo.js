let _showNodeInfo = (data) => {
	if (!data) {
		return;
	}

	let infoPanel = $('.right');
	infoPanel.find('.proc-name').text(data.name || '');
	infoPanel.find('.proc-desc').text(data.desc || '');
};

let _hideNodeInfo = () => {
	_showNodeInfo({
		name: '',
		desc: ''
	});
};
	
let _createChart = function() {
	return new Chart($('#demo-chart'), {
		onNodeClick (data) { // 点击节点时触发
			_showNodeInfo(data);
			_current = data.nodeId;
		},
		onNodeDel (data) {
			console.log(data);
			_hideNodeInfo();
		}
	})
};

let chart = _createChart();



Chart.ready(() => {
    const basicX = 150;
    const startY = 100;
    const endY = 350;
    const newX = 50;
    const newY = 50;

    let _current = null; // 当前选择节点id

    const addNewTask = (name, params) => {
        params = params || {};
        params.data = params.data || {};
        params.class = 'node-process';
        params.data.nodeType = 1; // 流程节点类型
        let node = chart.addNode(name, newX, newY, params);
        node.addPort({
            isSource: true
        });
        node.addPort({
            isTarget: true,
            position: 'Top'
        });
    };

    const bindEvent = () => {
         $(".flowchart-panel").on('click', '.btn-add', function(event) {
            let target = $(event.target);
            let node = target.data('node');
			console.log(node)
            addNewTask(node.name, {
                data: node
            });
        });

        $(".btn-save").click(() => {
            $('#jsonOutput').val(JSON.stringify(chart.toJson()));
        });

        $(".btn-load").click(() => {
            if ($('#demo-chart').length === 0) {
                $('<div id="demo-chart"></div>').appendTo($('.middle'));
                chart = _createChart();
            }
            chart.fromJson($('#jsonOutput').val());
        });

        $(".btn-clear").click(() => {
            $('#demo-chart').remove();
            chart.clear();
        });

        // $(".btn-del").click(() => {
        //     if (!_current) {
        //         return;
        //     }

        //     chart.removeNode(_current);
        // });
    };

    bindEvent();

    // 使用测试数据
    let listHtml = '';
	
	listHtml += `<a data-id='node.procId' href='javascript:AddStart()' style='color: #000; text-decoration: none;'><li><span class='node-name'>Input</span></li></a>`;
	listHtml += `<a data-id='node.procId' href='javascript:AddEnd()' style='color: #000; text-decoration: none;'><li><span class='node-name'>Output</span></li></a>`;
	
    TEST_NODES.forEach(node => {
        listHtml += `<li><span data-id='node.procId' class='btn-add' style="width: 100%;">${node.note||node.name}</span><span style="display: none" class="node-name">${node.name}</span></li>`;
    });
    $('.nodes').html(listHtml);
    $('.nodes').find('.btn-add').each(function(index) {
        $(this).data('node', $.extend({}, TEST_NODES[index]));
    });
	
	
	$(".btn-save").click();
	$(".btn-clear").click();
	$(".btn-load").click();
});





function AddStart(){
	chart.addNode('Input', 50, 50, {
		class: 'node-start',
		data: {
			name: 'Input',
			nodeType: 1
		}
	}).addPort({
		isSource: true
	});
}

function AddEnd(){
	//添加结束节点
	chart.addNode('Output', 50, 50, {
		class: 'node-end',
		data: {
			name: 'Output',
			nodeType: 1
		}
	}).addPort({
		isTarget: true,
		position: 'Top'
	});
}


	