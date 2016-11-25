window.onload = function(){
	var slideBtns = document.querySelectorAll(".slideBtn");
	for(let i in slideBtns){
		slideBtns[i].onclick=function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;
			if(hasClass(that,"active")){
				removeClass(that,"active")
			}else{
				addClass(that,"active");
			}
		}
	}
}