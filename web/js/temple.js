window.onload = function(){
	var slideBtns = document.querySelectorAll(".tpl-item .slideBtn");
	for(let i=0;i<slideBtns.length;i++){
		slideBtns[i].onclick=function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;
			if(hasClass(that,"active")){
				// 关闭操作
				removeClass(that,"active")
			}else{
				// 打开操作
				addClass(that,"active");
			}
		}
	}
}