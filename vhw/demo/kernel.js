input = []
output = []
and = []
or = []
not = []
table = []

run = 0;

function btn_run() {
	if (run == 1) {
		$(".kernel_input-btn").remove();
		$(".kernel_output-btn").remove();
		run = 0;
		return;
	}
	$(".btn-save").click();
	var json = JSON.parse($("#jsonOutput").val())
	console.log('ori:', json)

	input = []
	output = []
	and = []
	or = []
	not = []

	var a = [];

	json.nodes.forEach(node => {
		a[node.nodeId] = {
			'name': node.name,
			'nodeId': node.nodeId,
			'positionX': node.positionX,
			'positionY': node.positionY,
			'source': [],
			'target': []
		}
		table[node.nodeId] = {
			'name': node.name,
		}
	})

	json.nodes = a;
	console.log(a)

	// connection

	for (var i = 0; i < json.connections.length; i++) {
		json.nodes[json.connections[i].pageSourceId].source.push(json.connections[i].pageTargetId);
		json.nodes[json.connections[i].pageTargetId].target.push(json.connections[i].pageSourceId);
	}

	// nodes

	for (x in json.nodes) {
		x = json.nodes[x]
		if (x.name == "Input") {
			input.push({
				'id': x.nodeId,
				'source': x.source,
				'target': x.target
			});
			var px = x.positionX;
			var py = x.positionY;
			var ele = document.createElement("div");
			ele.classList = "kernel_input-btn";
			ele.id="kernel_"+x.nodeId;
			$(".middle").append(ele);

			ele.style.backgroundColor = "#222";
			ele.style.left = String(px) + "px";
			ele.style.top = String(py) + "px";
			$(ele).data("color", false);
			ele.onclick = function() {
				this.style.backgroundColor = $(this).data().color ? '#222' : '#FFF';
				$(this).data("color", !$(this).data().color);
				reRun();
			}
		}
		if (x.name == "Output") {
			output.push({
				'id': x.nodeId,
				'source': x.source,
				'target': x.target
			});
			var px = x.positionX;
			var py = x.positionY;
			var ele = document.createElement("div");
			ele.classList = "kernel_output-btn";
			ele.id="kernel_"+x.nodeId;
			$(".middle").append(ele);

			ele.style.backgroundColor = "#222";
			ele.style.left = String(px) + "px";
			ele.style.top = String(py) + "px";
		}
		if (x.name == "and")
			and.push({
				'id': x.nodeId,
				'source': x.source,
				'target': x.target
			});
		if (x.name == "or")
			or.push({
				'id': x.nodeId,
				'source': x.source,
				'target': x.target
			});
		if (x.name == "not")
			not.push({
				'id': x.nodeId,
				'source': x.source,
				'target': x.target
			});
	}

	reRun();

	run = 1;
}






function logic(opr,li){
	if(opr=='or'){
		for(x in li){
			if(li[x]) return true;
		}
		return false;
	}
	if(opr=='and'){
		for(x in li){
			if(!li[x]) return false;
		}
		return true;
	}
	if(opr=='not'){
		return !logic('or',li);
	}
}



function reRun() {
	var runtime = [];
	
	input.forEach(node => {
		var ID="#kernel_"+node.id
		runtime[node.id] = {
			'in': [],
			'out': $(ID).data().color
		}
		// console.log(node.id, runtime[node.id].out)
	})
	and.forEach(node => {
		runtime[node.id] = {
			'in': Array.from(node.target),
			'out': undefined
		}
	})
	or.forEach(node => {
		runtime[node.id] = {
			'in': Array.from(node.target),
			'out': undefined
		}
	})
	not.forEach(node => {
		runtime[node.id] = {
			'in': Array.from(node.target),
			'out': undefined
		}
	})
	
	function runNode(id){
		for(var i=0;i<runtime[id].in.length;i++){
			var x=runtime[id].in[i];
			if(runtime[x].out!=undefined){
				runtime[id].in[i]=runtime[x].out;
			}else{
				runNode(x);
				runtime[id].in[i]=runtime[x].out;
			}
		}
		if(table[id].name=='or')
			runtime[id].out=logic('or',runtime[id].in);
		if(table[id].name=='and')
			runtime[id].out=logic('and',runtime[id].in);
		if(table[id].name=='not')
			runtime[id].out=logic('not',runtime[id].in);
	}
	output.forEach(node => {
		// console.log(node.target)
		runtime[node.id] = {
			'in': Array.from(node.target),
			'out': undefined
		}
		for(var i=0;i<runtime[node.id].in.length;i++){
			var x=runtime[node.id].in[i];
			console.log(x, runtime[x].out)
			if(runtime[x].out!=undefined){
				runtime[node.id].in[i]=runtime[x].out
			}else{
				runNode(x);
				runtime[node.id].in[i]=runtime[x].out;
			}
		}
		var ID="#kernel_"+node.id;
		var temp_color=(logic('or',runtime[node.id].in) ? '#FFF' : '#222')
		// console.log(ID, $(ID))
		$(ID).css('backgroundColor', temp_color)
	})
}