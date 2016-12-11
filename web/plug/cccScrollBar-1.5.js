/*
 *   本来是打算这样的
 *   function ScrollBar(option){
 *      this.init(option);
 *      .......
 *   }
 *   function AutoScroll(ele){
 *      ScrollBar.call(this,option)//这个执行的时候，由于init是在ScrollBar prototype里面，所以这个执行的时候，this还没有init方法
 *   }
 *   AutoScroll.prototype = new ScrollBar(option);//这里也存在参数传递麻烦的问题
 *   所以就改成下面那样需要判断option
 */

/*
 * option = {
 *      "scrollWrap":包裹着滚动内容的jq对象（必须）,
 *      "scrollCtx":滚动内容的jq对象（必须）,
 *      "slideBarY":Y轴滚动条的jq对象（必须）,
 *      "sliderY":Y轴滚动滑块的jq对象（必须）,
 *      "slideBarX":X轴滚动条的jq对象（可选）,
 *      "sliderX":X轴滚动滑块的jq对象（可选）,
 *      "slideBarYHeight":Y轴滚动条实际可以滚动的区域的高度（可选，默认是Y轴滚动条的高度；是因为有些时候滑块不是整条滚动条的区域都是可以去的，比如与横向滚动条交界处就不能；甚至有些时候就想它只有80%的位置可以滚动）,
 *      "slideBarXWidth": X轴滚动条实际可以滚动的区域的高度（可选，默认是X轴滚动条的宽度；理由同上），
 * }
 */

function ScrollBar(option){
    this.name = "一个ScrollBar的实例";
    if(option){
        this.init(option);
    }
}
ScrollBar.prototype = {
    constructor:ScrollBar,
    init:function(option){
        var docu = $(document);
        //将option里面的属性转到this
        /*将这些变量存入对象的属性里面,以便其他实例方法使用*/
        var scrollWrap = this.scrollWrap = option.scrollWrap;
        var scrollCtx = this.scrollCtx = option.scrollCtx;
        var slideBarY = this.slideBarY = option.slideBarY;
        var sliderY = this.sliderY = option.sliderY;
        var slideBarYHeight = this.slideBarYHeight = option.slideBarYHeight ? option.slideBarYHeight : slideBarY.height();

        // 判断有无x轴
        var hasX = !!(option.slideBarX && option.slideBarX);

        /*获取比例*/
        var rateY = scrollWrap[0].scrollHeight / scrollWrap.innerHeight();//或者 var rateY = (scrollCtx.innerHeight()+(scrollWrap.innerHeight()-scrollWrap.height())/2) / scrollWrap.innerHeight();

        this.hasX = hasX;
        this.rateY = rateY;

        /*以下开始进行事件操作*/
        if (rateY > 1) {
            slideBarY.addClass("active");
        }
        sliderY.height(slideBarYHeight / rateY);//无论rateY多少，sliderY都要有高度，不然当没有滚动条出现的时候后面posimove里面判断上下限的时候，sliderY的高度为0而不是和slideBarYHeight，就会造成就算没有滚动条也可以滚动
        if(hasX){
            var rateX = this.rateX = scrollWrap[0].scrollWidth / scrollWrap.innerWidth();
            var slideBarX = this.slideBarX = option.slideBarX ? option.slideBarX :null;
            var sliderX = this.sliderX = option.sliderX ? option.sliderX :null;
            var slideBarXWidth = this.slideBarXWidth = option.slideBarXWidth ? option.slideBarXWidth : slideBarX.width();
            if (rateX > 1) {
                slideBarX.addClass("active");
            }
            sliderX.width(slideBarXWidth / rateX);
        }

        /*
         * 点击
         */
        var self = this;//将实例对象用self存储起来,为了防止与事件里面的this冲突
        slideBarY.off("mousedown").on("mousedown", function(e) {
            var e = e || window.event;
            var that = $(this);

            //滑块偏移
            var sliderTop = e.clientY - that.offset().top - sliderY.height() / 2;
            var sliderLeft = !hasX ? 0 : sliderX.position().left;
            self.posiMove(sliderLeft,sliderTop, true);
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
                var sliderLeft = !hasX ? 0 : sliderX.position().left;
                self.posiMove(sliderLeft,sliderTop, false);
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
            var sliderLeft = !hasX ? 0 : sliderX.position().left;
            if (direction == "down") {
                sliderTop += 10;
            } else {
                sliderTop -= 10;
            }
            self.posiMove(sliderLeft,sliderTop, false);
        });


        //x轴的事件绑定
        if(hasX){
            slideBarX.off("mousedown").on("mousedown", function(e) {
                var e = e || window.event;
                var that = $(this);

                //滑块偏移
                var sliderLeft = e.clientX - that.offset().left - sliderX.width() / 2;
                var sliderTop = sliderY.position().top;
                self.posiMove(sliderLeft,sliderTop, true);
            });
            sliderX.off("mousedown").on("mousedown", function(e) {
                var e = e || window.event;
                e.stopPropagation();
                e.preventDefault();
                var originWid = e.clientX - $(this).offset().left;

                docu.on("mousemove", function(e) {
                    var e = e || window.event;

                    //滑块偏移
                    var sliderLeft = e.clientX - slideBarX.offset().left - originWid;
                    var sliderTop = sliderY.position().top;
                    self.posiMove(sliderLeft,sliderTop, false);
                });

                docu.off("mouseup").on("mouseup", function() {
                    docu.off("mousemove");
                });
            });
        }
    },
    goFn:function(ele,top,left){//移动方法
        ele.css("transform", "translate("+left+"px," + top + "px");//不用3d是为了兼容ie9;
    },
    posiMove:function(changeLeft,changeTop, animateFlag){//获取移动多少的方法，changeTop为滚动条滑块移动的距离，animateFlag是否要动画，并调用移动方法实现最终的滚动

        var hasX = this.hasX;
        var scrollWrap = this.scrollWrap;
        var scrollCtx = this.scrollCtx;
        var slideBarY = this.slideBarY;
        var sliderY = this.sliderY;
        var rateY = this.rateY;
        var sliderX = this.sliderX;
        var rateX = this.rateX;
        var slideBarYHeight = this.slideBarYHeight;
        var slideBarXWidth = this.slideBarXWidth;

        //上下限
        changeTop = changeTop >= 0 ? changeTop : 0;
        changeTop = changeTop <= slideBarYHeight - sliderY.height() ? changeTop : slideBarYHeight - sliderY.height();

        //内容偏移
        var contentTop = -changeTop * rateY * scrollWrap.innerHeight() / slideBarYHeight;//解释在下面，这其实是一个bug，只是一个巧合导致没有发现
        /*
         *  我们假设 块之间高度的比值为lenRate（这里为rateY），内容显示区域高度为ctxh，实际高度为ctxH
         *                                      滚动滑块高度为barh，滚动条高度为barH
         *                                      内容移动距离为ctxmove，滑块移动距离为barmove
         *  则：
         *      lenRate = ctxH/ctxh = barH/barh , 所以 barh = barH/lenRate （实际代码 sliderY.height(slideBarYHeight / rateY);） ctxH = ctxh*lenRate
         *      假设移动比率（就是移动的距离占总长度的比值）moveRate
         *      moveRate = barmove/barH = ctxmove/ctxH;  ctxmove = ctxH*barmove/barH  = ctxh*lenRate/barH*barmove = barmove * lenRate * ctxh/barH (实际代码  -changeTop * rateY * scrollWrap.innerHeight() / slideBarYHeight;)
         *  之前没有考虑到ctxh/barH是因为以前ctxh = barH的，而且现在由于有横向滚动条，所以ctxh ≠ barH，所以出现bug
         */
        if(hasX){
            //上下限
            changeLeft = changeLeft >= 0 ? changeLeft : 0;
            changeLeft = changeLeft <= slideBarXWidth - sliderX.width() ? changeLeft : slideBarXWidth - sliderX.width();

            //内容偏移
            var contentLeft = -changeLeft * rateX * scrollWrap.innerWidth() / slideBarXWidth;
        }else{
            var contentLeft = 0;
        }

        if (animateFlag) {
            scrollCtx.add(sliderY).addClass("animate");
            if(hasX){
                sliderX.addClass("animate");
            }
        } else {
            scrollCtx.add(sliderY).removeClass("animate");
            if(hasX){
                sliderX.removeClass("animate");
            }
        }

        this.goFn(sliderY,changeTop,0);
        if(hasX){
            this.goFn(sliderX,0,changeLeft);
        }
        this.goFn(scrollCtx,contentTop,contentLeft);
    }
}


//懒人版滚动条，只需要传入包裹滚动条的jq对象，和是否要x轴（ture，false）就可以了；滚动块的class名必须含有scrollCtx，以及要引用相应的css文件
function AutoScroll(ele,x){
    var hasX = (typeof x== "boolean" && x==true)||x=="true";//是否需要x轴
    /*获取对象*/
    var that = ele.css({"position":"relative","overflow":"hidden"});
    var scrollWrap = that;//包含着滚动条的块
    var scrollCtx = that.find(".scrollCtx").eq(0);//滚动主体
    // y轴的
    if(scrollWrap.find(".slideBarY").size()>0){
        var slideBarY = scrollWrap.find(".slideBarY");//为了重新建滚动，比如内容改变的时候
    }else{
        var slideBarY = $('<div class="slideBarY"><div class="sliderY"></div></div>');
        slideBarY.appendTo(scrollWrap);
    }
    var sliderY = slideBarY.find(".sliderY");

    if(hasX){
        // x轴的
        if(scrollWrap.find(".slideBarX").size()>0){
            var slideBarX = scrollWrap.find(".slideBarX");//为了重新建滚动，比如内容改变的时候
        }else{
            var slideBarX = $('<div class="slideBarX"><div class="sliderX"></div></div>');
            slideBarX.appendTo(scrollWrap);
        }
        var sliderX = slideBarX.find(".sliderX");
        var slideBarXWidth = slideBarX.width() - slideBarY.width();
    }
    /*获取实际可滚动长度*/
    var slideBarYHeight = hasX ? slideBarY.height() - slideBarX.height() : slideBarY.height();

    var option = {
        "scrollWrap":scrollWrap,
        "scrollCtx":scrollCtx,
        "slideBarY":slideBarY,
        "sliderY":sliderY,
        "slideBarX":hasX ? slideBarX : null,
        "sliderX":hasX ? sliderX : null,
        "slideBarYHeight":slideBarYHeight,
        "slideBarXWidth": hasX ? slideBarXWidth : null,
    }
    /*
     *  调用方式1 直接实例化，但是这样AutoScroll的实例就会没有任何属性方法，所以AutoScroll的调用用new AutoScroll() 和直接 AutoScroll()是没有区别的
     */
    // new ScrollBar(option)//调用方式1 代码


    /*
     *  调用方式二，用AutoScroll继承于ScrollBar
     */
    this.init(option);//调用方式二 代码
}
AutoScroll.prototype = new ScrollBar();//调用方式二 代码；AutoScroll继承于ScrollBar
AutoScroll.prototype.constructor = AutoScroll;//调用方式二 代码；将AutoScroll的constructor指向为AutoScroll，因为上面重写了
