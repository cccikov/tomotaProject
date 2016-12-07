$(function(){
    // 待选管理员数据
    var waitingData = [{"id":51,"name":"admin51"}];

    //管理员数据
    var data = [{"id":52,"name":"admin52"},{"id":53,"name":"admin53"},{"id":55,"name":"admin55"},{"id":56,"name":"admin56"},{"id":57,"name":"admin57"}];

    // 生成待选管理员
    function createWaitAdmin(data){
        $(".scroll1 li").remove();
        for(var i in data){
            console.log(data[i]);
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll1 ul");
        }
    }
    createWaitAdmin(waitingData);

    // 生成管理员
    function createAdmin(data){
        $(".cp1-admin span").add(".scroll2 li").remove();
        for(var i in data){
            $('<span data-id="'+data[i].id+'">'+data[i].name+'<i>X</i></span>').insertBefore(".cp1-admin a");
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll2 ul");
        }
    }
    createAdmin(data);



    /*弹窗操作内 begin*/
    //li的点击
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
    // 左右移动
    $(".toright").on("click",function(){//因为不一定是会按确定，所以这些操作不改变管理员数据
        $(".scroll1 li.active").appendTo(".scroll2 ul").removeClass("active");
        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    });
    $(".toleft").on("click",function(){
        $(".scroll2 li.active").appendTo(".scroll1 ul").removeClass("active");
        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    });
    /*弹窗操作内 end*/









    /*弹窗本身操作*/
    function openWin(){
        $('<div class="mask" style="position: fixed;top:0;left:0;z-index:10;width:100%;height:100%;background: rgba(0,0,0,0.3)"></div>').appendTo('.wrap');
        $(".cp1-win").addClass("active");
        createAdmin(data);
        createWaitAdmin(waitingData);

        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    }
    function closeWin(){
        $(".mask").remove();
        $(".cp1-win").removeClass("active");
    }
    $(".win-open").on("click",function(){
        openWin();
    });
    $(".cp1-win-close").add(".cancel").on("click",function(){
        closeWin();
    });






    /*数据操作*/
    // 弹窗 确定按钮 数据操作
    $(".sure").on("click",function(){
         data = [];//清空数据
         waitingData =[];//清空数据
        $(".scroll2 li").each(function(item,key){//操作管理员数据
            var obj = {};
            obj.id = $(key).attr("data-id");
            obj.name = $(key).html();
            data.push(obj);
        });
        $(".scroll1 li").each(function(item,key){//操作待选管理员数据
            var obj = {};
            obj.id = $(key).attr("data-id");
            obj.name = $(key).html();
            waitingData.push(obj);
        });
        // console.log(data);
        // console.log(waitingData);
        createAdmin(data);
        createWaitAdmin(waitingData);
        closeWin();
    });

    //外面数据操作，外面管理员span的X,删除操作
    $(".cp1-admin").on("click","i",function(){
        var that = $(this).parent();
        var id = that.attr("data-id");
        var _index = -1;
        for(var i in data){
            if(data[i].id==id){
                _index = i;
            }
        }
        if(_index>-1){
            var obj = data[_index];
            data.splice(_index,1);
            waitingData.push(obj);
            that.remove();
        }
    });
});