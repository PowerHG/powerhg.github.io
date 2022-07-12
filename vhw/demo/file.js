function fake_click(obj) {
	try{
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(
			"click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
		);
		obj.dispatchEvent(ev);
	}catch(e){
		console.log("["+e+"] has been caught.");
	}
}

function download(name, data) {
	var urlObject = window.URL || window.webkitURL || window;

	var downloadData = new Blob([data]);

	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	save_link.href = urlObject.createObjectURL(downloadData);
	save_link.download = name;
	alert("Will be downloaded to: `download\\" + name + "`");
	fake_click(save_link);
}


function imp() {
	var file = document.getElementById("file");
	console.log(file)
	var selectedFile = file.files[0]; //获取读取的File对象
	var name = selectedFile.name; //读取选中文件的文件名
	var size = selectedFile.size; //读取选中文件的大小
	console.log("文件名:" + name + "大小：" + size);

	var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
	reader.readAsText(selectedFile); //读取文件的内容

	reader.onload = function() {
		// console.log(this.result);
		$("#jsonOutput").val(this.result);
		$('.btn-load').click();
	};
}

function btn_save(){
	$('.btn-save-show').html("Save ( Save as <input id='save-file-name'>.vhw ) ")
	document.getElementsByClassName("btn-save-show")[0].onclick="";
	document.getElementById("save-file-name").focus();
	$("#save-file-name").change(function(){
		$(".btn-save").click();
		$('.btn-save-show').html("Save")
		document.getElementsByClassName("btn-save-show")[0].onclick=btn_save;
		download(this.value+".vhw", $("#jsonOutput").val())
	})
}

