$.fn.extend({
	cccScrollBar: function() {
		var outobj = $(this);
		var inobj = outobj.find(".cccScrollContent").eq(0);
		if(outobj.find(".sideBar").size()>0){
			barobj = outobj.find(".sideBar");//为了重新建滚动，比如内容改变的时候
		}else{
			var barobj = $('<div class="sideBar"><div class="slider"></div></div>');
			barobj.appendTo(outobj);
		}
		var sliderobj = barobj.find(".slider");

		var docu = $(document);
		//移动方法
		function goTopFn(top) {
			$(this).css("transform", "translate(0," + top + "px");//不用3d是为了兼容ie9;
		}

		//获取移动多少的方法，changeTop为滚动条滑块移动的距离，animateFlag是否要动画，并调用移动方法实现最终的滚动
		function posiMove(changeTop, animateFlag) {
			//上下限
			changeTop = changeTop >= 0 ? changeTop : 0;
			changeTop = changeTop <= barobj.height() - sliderobj.height() ? changeTop : barobj.height() - sliderobj.height();

			//内容偏移
			var contentTop = -changeTop * rate;

			if (animateFlag) {
				inobj.add(sliderobj).addClass("animate");
			} else {
				inobj.add(sliderobj).removeClass("animate");
			}

			goTopFn.apply(sliderobj, [changeTop]);
			goTopFn.apply(inobj, [contentTop]);
		}

		/*
		 * 比例
		 */
		var rate = outobj[0].scrollHeight / outobj.innerHeight();
		//或者	var rate = (inobj.innerHeight()+(outobj.innerHeight()-outobj.height())/2) / outobj.innerHeight();
		if (rate > 1) {
			barobj.addClass("active");
		}
		sliderobj.height(barobj.height() / rate);

		/*
		 * 点击
		 */
		barobj.off("mousedown").on("mousedown", function(e) {
			var e = e || window.event;
			var that = $(this);

			//滑块偏移
			var sliderTop = e.clientY - that.offset().top - sliderobj.height() / 2;
			posiMove(sliderTop, true);
		});

		/*
		 * 滑动
		 */
		sliderobj.off("mousedown").on("mousedown", function(e) {
			var e = e || window.event;
			e.stopPropagation();
			e.preventDefault();
			var originHei = e.clientY - $(this).offset().top;

			docu.on("mousemove", function(e) {
				var e = e || window.event;

				//滑块偏移
				var sliderTop = e.clientY - barobj.offset().top - originHei;
				posiMove(sliderTop, false);
			});

			docu.off("mouseup").on("mouseup", function() {
				docu.off("mousemove");
			});

		});

		/*
		 * 滚动 mousewheel--chrome ie; DOMMouseScroll--firefox
		 */
		outobj.off("mousewheel").off("DOMMouseScroll").on("mousewheel DOMMouseScroll", function(e) {
			var e = e || window.event;
			e.stopPropagation();
			e.preventDefault();
			var direction = "down";
			if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
				direction = "down";
			} else {
				direction = "up";
			}

			//滑块偏移
			var sliderTop = sliderobj.position().top;
			if (direction == "down") {
				sliderTop += 10;
			} else {
				sliderTop -= 10;
			}
			posiMove(sliderTop, false);
		});

		return outobj;
	}
});
