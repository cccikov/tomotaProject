var bigData;
$(function(){
    // 生成弹窗-待选考官
    function createWaitAdmin(data){
        $(".scroll1 li").remove();
        for(var i in data){
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll1 ul");
        }
    }
    // 生成弹窗-考官
    function createChosenAdmin(data){
        $(".scroll2 li").remove();
        for(var i in data){
            $('<li data-id="'+data[i].id+'">'+data[i].name+'</li>').appendTo(".scroll2 ul");
        }
    }

    //生成外部-考官
    function createAdmin(masterWrapEle,data){
        masterWrapEle.find("span").remove();
        for(var i in data){
            $('<span data-id="'+data[i].id+'">'+data[i].name+'<i>X</i></span>').insertBefore(masterWrapEle.find("a"));
        }
    }

    /*弹窗本身操作*/
    function openWin(dataWait,dataChosen){
        $('<div class="mask" style="position: fixed;top:0;left:0;z-index:10;width:100%;height:100%;background: rgba(0,0,0,0.3)"></div>').appendTo('.wrap');
        $(".cp1-win").addClass("active");
        createWaitAdmin(dataWait);
        createChosenAdmin(dataChosen);

        $(".scroll1").cccScrollBar();
        $(".scroll2").cccScrollBar();
    }
    function closeWin(){
        $(".mask").remove();
        $(".cp1-win").removeClass("active");
    }


    // 数据
    bigData = {
        "exam01":{
            "wait":[{"id":0,"name":"admin0"},{"id":1,"name":"admin1"}],
            "chosen":[{"id":52,"name":"admin52"},{"id":53,"name":"admin53"}]
        },
        "exam02":{
            "wait":[{"id":10,"name":"admin10"},{"id":21,"name":"admin21"}],
            "chosen":[{"id":252,"name":"admin252"},{"id":253,"name":"admin253"}]
        }
    }
    // ,{"id":2,"name":"admin2"},{"id":3,"name":"admin3"},{"id":4,"name":"admin4"},{"id":5,"name":"admin5"},{"id":6,"name":"admin6"},{"id":7,"name":"admin7"},{"id":8,"name":"admin8"},{"id":9,"name":"admin9"},{"id":10,"name":"admin10"},{"id":11,"name":"admin11"},{"id":12,"name":"admin12"},{"id":13,"name":"admin13"},{"id":14,"name":"admin14"},{"id":15,"name":"admin15"},{"id":16,"name":"admin16"},{"id":17,"name":"admin17"},{"id":18,"name":"admin18"},{"id":19,"name":"admin19"},{"id":20,"name":"admin20"},{"id":21,"name":"admin21"},{"id":22,"name":"admin22"},{"id":23,"name":"admin23"},{"id":24,"name":"admin24"},{"id":25,"name":"admin25"},{"id":26,"name":"admin26"},{"id":27,"name":"admin27"},{"id":28,"name":"admin28"},{"id":29,"name":"admin29"},{"id":30,"name":"admin30"},{"id":31,"name":"admin31"},{"id":32,"name":"admin32"},{"id":33,"name":"admin33"},{"id":34,"name":"admin34"},{"id":35,"name":"admin35"},{"id":36,"name":"admin36"},{"id":37,"name":"admin37"},{"id":38,"name":"admin38"},{"id":39,"name":"admin39"},{"id":40,"name":"admin40"},{"id":41,"name":"admin41"},{"id":42,"name":"admin42"},{"id":43,"name":"admin43"},{"id":44,"name":"admin44"},{"id":45,"name":"admin45"},{"id":46,"name":"admin46"},{"id":47,"name":"admin47"},{"id":48,"name":"admin48"},{"id":49,"name":"admin49"},{"id":55,"name":"admin55"},{"id":56,"name":"admin56"},{"id":57,"name":"admin57"}


    // 将选择考官封装成函数
    function examSelect(oriBigData,examId,openWinBtnEle,masterWrapEle,num){
        //进入页面的时候生成外部-考官
        createAdmin(masterWrapEle,oriBigData[examId].chosen);

        /*弹窗操作内 begin*/
        //li的点击
        $(".win-scroll").off("click").on("click","li",function(e){
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
        $(".toright").off("click").on("click",function(){//因为不一定是会按确定，所以这些操作不改变考官数据
            $(".scroll1 li.active").appendTo(".scroll2 ul").removeClass("active");
            $(".scroll1").cccScrollBar();
            $(".scroll2").cccScrollBar();
        });
        $(".toleft").off("click").on("click",function(){
            $(".scroll2 li.active").appendTo(".scroll1 ul").removeClass("active");
            $(".scroll1").cccScrollBar();
            $(".scroll2").cccScrollBar();
        });
        /*弹窗操作内 end*/




        /*弹窗本身操作*/
        openWinBtnEle.on("click",function(){
            openWin(oriBigData[examId].wait,oriBigData[examId].chosen);

            // 由于是共用同一个弹窗,所以不能一固定让 $(".sure")按钮固定绑定一个事件,因为有个createAdmin()里面需要不同的ele,和数据;如果是固定死一个事件,就会只执行最后一个事件,而删除前面的事件,就会造成无论操作那一组数据,改变的都是最后一组。所以就要在openwin按钮点击的时候再绑定事件。
            /*数据操作*/
            // 弹窗 确定按钮 数据操作
            $(".sure").off("click").on("click",function(){//这个事件绑定存在于一个函数里面, $(".sure")是共用,而它的事件函数中的表达,有使用到外部函数的两个参数masterWrapEle,oriBigData[examId].chosen;而这两个参数是会变的,会根据不同的函数执行传入的值不同而改变,但是对象却是同一个,所以就会造成,这个事件触发的时候永远都是执行最后一个绑定的事件函数。所以就要在openwin按钮点击在绑定事件，这样会根据不同的openwin绑定不同的事件函数。
                 oriBigData[examId].chosen = [];//清空数据
                 oriBigData[examId].wait =[];//清空数据
                $(".scroll2 li").each(function(item,key){//操作考官数据
                    var obj = {};
                    obj.id = $(key).attr("data-id");
                    obj.name = $(key).html();
                    oriBigData[examId].chosen.push(obj);
                });
                $(".scroll1 li").each(function(item,key){//操作待选考官数据
                    var obj = {};
                    obj.id = $(key).attr("data-id");
                    obj.name = $(key).html();
                    oriBigData[examId].wait.push(obj);
                });
                createAdmin(masterWrapEle,oriBigData[examId].chosen);
                closeWin();
            });
        });
        $(".cp1-win-close").add(".cancel").on("click",function(){
            closeWin();
        });






        /*数据操作*/


        //外面数据操作，外面考官span的X,删除操作
        masterWrapEle.off("click").on("click","i",function(){
            var that = $(this).parent();
            var id = that.attr("data-id");
            var _index = -1;//表示删除数据的位置
            for(var i in oriBigData[examId].chosen){
                if(oriBigData[examId].chosen[i].id==id){
                    _index = i;
                }
            }
            if(_index>-1){
                var obj = oriBigData[examId].chosen[_index];
                oriBigData[examId].chosen.splice(_index,1);
                oriBigData[examId].wait.push(obj);
                that.remove();
            }
        });
    }

    var index = 0;
    for (var i in bigData){
        examSelect(bigData,i,$(".win-open").eq(index),$(".master").eq(index),index);
        index++;
    }
});