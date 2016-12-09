function ScrollBar(ele){
	this.name = "一个ScrollBar的实例";
	this.init(ele);
}
ScrollBar.prototype = {
	constructor:ScrollBar,
	init:function(ele){

		/*获取对象*/
		var that = ele.css({"position":"relative","overflow":"hidden"});
		var scrollWrap = that;//包含着滚动条的块
		var scrollCtx = that.find(".scrollctx").eq(0);//滚动主体
		if(scrollWrap.find(".slideBarY").size()>0){
			var slideBarY = scrollWrap.find(".slideBarY");//为了重新建滚动，比如内容改变的时候
		}else{
			var slideBarY = $('<div class="slideBarY"><div class="sliderY"></div></div>');
			slideBarY.appendTo(scrollWrap);
		}
		var sliderY = slideBarY.find(".sliderY");
		var docu = $(document);
		/*获取比例*/
		var rateY = scrollWrap[0].scrollHeight / scrollWrap.innerHeight();//或者 var rateY = (scrollCtx.innerHeight()+(scrollWrap.innerHeight()-scrollWrap.height())/2) / scrollWrap.innerHeight();

		/*将这些变量存入对象的属性里面,以便其他实例方法使用*/
		this.option = {
			"scrollWrap":scrollWrap,
			"scrollCtx":scrollCtx,
			"slideBarY":slideBarY,
			"sliderY":sliderY,
		}
		this.rateY = rateY;

		/*以下开始进行事件操作*/
		if (rateY > 1) {
            slideBarY.addClass("active");
        }
        sliderY.height(slideBarY.height() / rateY);


        /*
         * 点击
         */
        var self = this;//将实例对象用self存储起来,为了防止与事件里面的this冲突
        slideBarY.off("mousedown").on("mousedown", function(e) {
            var e = e || window.event;
            var that = $(this);

            //滑块偏移
            var sliderTop = e.clientY - that.offset().top - slideBarY.height() / 2;
            self.posiMove(sliderTop, true);
        });


        /*
         * 滑动
         */
        sliderY.off("mousedown").on("mousedown", function(e) {
            var e = e || window.event;
            e.stopPropagation();
            e.preventDefault();
            var originHei = e.clientY - $(this).offset().top;

            docu.on("mousemove", function(e) {
                var e = e || window.event;

                //滑块偏移
                var sliderTop = e.clientY - slideBarY.offset().top - originHei;
                self.posiMove(sliderTop, false);
            });

            docu.off("mouseup").on("mouseup", function() {
                docu.off("mousemove");
            });

        });

        /*
         * 滚动 mousewheel--chrome ie; DOMMouseScroll--firefox
         */
        scrollWrap.off("mousewheel").off("DOMMouseScroll").on("mousewheel DOMMouseScroll", function(e) {
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
            var sliderTop = sliderY.position().top;
            if (direction == "down") {
                sliderTop += 10;
            } else {
                sliderTop -= 10;
            }
            self.posiMove(sliderTop, false);
        });

	},
	goTopFn:function(ele,top){//移动方法
		ele.css("transform", "translate(0," + top + "px");//不用3d是为了兼容ie9;
	},
	posiMove:function(changeTop, animateFlag){//获取移动多少的方法，changeTop为滚动条滑块移动的距离，animateFlag是否要动画，并调用移动方法实现最终的滚动
		var scrollCtx = this.option.scrollCtx;
		var slideBarY = this.option.slideBarY;
		var sliderY = this.option.sliderY;
		var rateY = this.rateY;
		//上下限
		changeTop = changeTop >= 0 ? changeTop : 0;
		changeTop = changeTop <= slideBarY.height() - sliderY.height() ? changeTop : slideBarY.height() - sliderY.height();

		//内容偏移
		var contentTop = -changeTop * this.rateY;

		if (animateFlag) {
		    scrollCtx.add(sliderY).addClass("animate");
		} else {
		    scrollCtx.add(sliderY).removeClass("animate");
		}

		this.goTopFn(sliderY,changeTop);
		this.goTopFn(scrollCtx,contentTop);
	}
}
