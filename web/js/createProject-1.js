$(function(){
    $(".scroll1").cccScrollBar();
    $(".scroll2").cccScrollBar();

    $(".win-scroll").on("click","li",function(e){
        e.stopPropagation();
        e.preventDefault();
        var that = $(this);
        if(!that.is(".active")){//非激活
            that.addClass("active");
        }else{
            that.removeClass("active");
        }
    });

    $(".toright").on("click",function(){
        $(".scroll1 li.active").appendTo(".scroll2 ul").removeClass("active");
        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    });
    $(".toleft").on("click",function(){
        $(".scroll2 li.active").appendTo(".scroll1 ul").removeClass("active");
        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    });
});