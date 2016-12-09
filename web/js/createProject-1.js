$(function(){
    // 待选管理员数据
    var waitingData = [{"id":0,"name":"admin0"},{"id":1,"name":"admin1"},{"id":2,"name":"admin2"},{"id":3,"name":"admin3"},{"id":4,"name":"admin4"},{"id":5,"name":"admin5"},{"id":6,"name":"admin6"},{"id":7,"name":"admin7"},{"id":8,"name":"admin8"},{"id":9,"name":"admin9"},{"id":10,"name":"admin10"},{"id":11,"name":"admin11"},{"id":12,"name":"admin12"},{"id":13,"name":"admin13"},{"id":14,"name":"admin14"},{"id":15,"name":"admin15"},{"id":16,"name":"admin16"},{"id":17,"name":"admin17"},{"id":18,"name":"admin18"},{"id":19,"name":"admin19"},{"id":20,"name":"admin20"},{"id":21,"name":"admin21"},{"id":22,"name":"admin22"},{"id":23,"name":"admin23"},{"id":24,"name":"admin24"},{"id":25,"name":"admin25"},{"id":26,"name":"admin26"},{"id":27,"name":"admin27"},{"id":28,"name":"admin28"},{"id":29,"name":"admin29"},{"id":30,"name":"admin30"},{"id":31,"name":"admin31"},{"id":32,"name":"admin32"},{"id":33,"name":"admin33"},{"id":34,"name":"admin34"},{"id":35,"name":"admin35"},{"id":36,"name":"admin36"},{"id":37,"name":"admin37"},{"id":38,"name":"admin38"},{"id":39,"name":"admin39"},{"id":40,"name":"admin40"},{"id":41,"name":"admin41"},{"id":42,"name":"admin42"},{"id":43,"name":"admin43"},{"id":44,"name":"admin44"},{"id":45,"name":"admin45"},{"id":46,"name":"admin46"},{"id":47,"name":"admin47"},{"id":48,"name":"admin48"},{"id":49,"name":"admin49"}];

    //管理员数据
    var chosenData = [{"id":52,"name":"admin52"},{"id":53,"name":"admin53"},{"id":55,"name":"admin55"},{"id":56,"name":"admin56"},{"id":57,"name":"admin57"}];

    // 生成弹窗-待选管理员
    function createWaitAdmin(data){
        $(".scroll1 li").remove();
        for(var i in data){
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll1 ul");
        }
    }

    // 生成弹窗-管理员
    function createChosenAdmin(data){
        $(".scroll2 li").remove();
        for(var i in data){
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll2 ul");
        }
    }

    // 生成外部管理员
    function createAdmin(data){
        $(".cp1-admin span").remove();
        for(var i in data){
            $('<span data-id="'+data[i].id+'">'+data[i].name+'<i>X</i></span>').insertBefore(".cp1-admin a");
        }
    }


    //进入页面时,生成外部管理员
    createAdmin(chosenData);

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
        new ScrollBar($(".scroll1"));
        new ScrollBar($(".scroll2"));
    });
    $(".toleft").on("click",function(){
        $(".scroll2 li.active").appendTo(".scroll1 ul").removeClass("active");
        new ScrollBar($(".scroll1"));
        new ScrollBar($(".scroll2"));
    });
    /*弹窗操作内 end*/









    /*弹窗本身操作*/
    function openWin(){
        $('<div class="mask" style="position: fixed;top:0;left:0;z-index:10;width:100%;height:100%;background: rgba(0,0,0,0.3)"></div>').appendTo('.wrap');
        $(".cp1-win").addClass("active");
        createChosenAdmin(chosenData);
        createWaitAdmin(waitingData);

        new ScrollBar($(".scroll1"));
        new ScrollBar($(".scroll2"));
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
         chosenData = [];//清空数据
         waitingData =[];//清空数据
        $(".scroll2 li").each(function(item,key){//操作管理员数据
            var obj = {};
            obj.id = $(key).attr("data-id");
            obj.name = $(key).html();
            chosenData.push(obj);
        });
        $(".scroll1 li").each(function(item,key){//操作待选管理员数据
            var obj = {};
            obj.id = $(key).attr("data-id");
            obj.name = $(key).html();
            waitingData.push(obj);
        });
        // console.log(chosenData);
        // console.log(waitingData);
        createAdmin(chosenData);
        closeWin();
    });

    //外面数据操作，外面管理员span的X,删除操作
    $(".cp1-admin").on("click","i",function(){
        var that = $(this).parent();
        var id = that.attr("data-id");
        var _index = -1;
        for(var i in chosenData){
            if(chosenData[i].id==id){
                _index = i;
            }
        }
        if(_index>-1){
            var obj = chosenData[_index];
            chosenData.splice(_index,1);
            waitingData.push(obj);
            that.remove();
        }
    });
});