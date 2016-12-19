function tab(){
    /*tab切换*/
    $(".tab-btn a").on("click",function(){
        var _index = $(this).index();
        $(".box").eq(_index).addClass("active").siblings().removeClass("active");
    });
}
//不需要理这个函数,这个函数只是获取时间戳
function getTime(val){
    return val=="" ? 0 : (new Date(val.replace("T"," "))).getTime();
}

function isAllTrue(flagArr){
    var flag = true;
    var reason = null;
    for(var i in flagArr ){
        if(!flagArr[i].flag){//只要有个错就返回false
            flag = false;
            reason = flagArr[i].reason;
        }
    }
    return {
        "flag":flag,
        "reason":reason
    };
}

var projectBeginTime;
var projectEndTime;
function projectTime(){
    // Dec 23 2016 09:00:00
    // Dec 30 2016 18:00:00

    /*项目时间限制*/
    var pb = $("#pb");
    var pe = $("#pe");
    var getExamBeginTime = new Date("Dec 23 2016 09:00:00");//后台获取考试时间-范围开始
    var getExamEndTime = new Date("Dec 30 2016 18:00:00");//后台获取考试时间-范围结束

    pb.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目开始时间
        projectEndTime = getTime(pe.val());//实时获取项目结束时间
        var projectStatus = $(".project-time input:radio:checked").val();

        /*判断部分*/
        var arrNew = [
            {
                "flag": projectEndTime==0 || val<projectEndTime,//判断 项目开始时间 是否小于 项目结束时间 (projectEndTime为0时表示没有设置,所以不考虑,返回true)
                "reason":"项目开始时间 比 项目结束时间 晚"
            }
        ];
        var arrEdit = [
            {
                "flag": projectEndTime==0 || val<projectEndTime,//判断 项目开始时间 是否小于 项目结束时间 (projectEndTime为0时表示没有设置,所以不考虑,返回true)
                "reason":"项目开始时间 比 项目结束时间 晚"
            },{
                "flag":getExamBeginTime==0 || val<getExamBeginTime,//判断 项目开始时间 是否小于 后台考试时间-范围开始
                "reason":"项目开始时间 比 部分考试开始时间 晚"
            }
        ];
        var arr = projectStatus == "new" ? arrNew : arrEdit;

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log(reason);
            return false;
        }

        projectBeginTime = val;
        console.log("projectBeginTime : "+projectBeginTime+" \n "+new Date(projectBeginTime));
    });


    pe.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目结束时间
        projectBeginTime = getTime(pb.val());//实时获取项目开始时间
        var projectStatus = $(".project-time input:radio:checked").val();

        /*判断部分*/
        var arrNew = [
            {
                "flag":projectBeginTime==0 || val>projectBeginTime,//判断 项目结束时间 是否大于 项目开始时间
                "reason":"项目结束时间 比 项目结束时间 早"
            }
        ];
        var arrEdit = [
            {
                "flag":projectBeginTime==0 || val>projectBeginTime,//判断 项目结束时间 是否大于 项目开始时间
                "reason":"项目结束时间 比 项目结束时间 早"
            },
            {
                "flag":getExamEndTime==0 || val>getExamEndTime,//判断 项目结束时间 是否大于 后台考试时间-范围结束
                "reason":"项目结束时间 比 部分考试结束时间 早"
            }
        ];
        var arr = projectStatus == "new" ? arrNew : arrEdit;

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log(reason);
            return false;
        }

        projectEndTime = val;
        console.log("projectEndTime : "+projectEndTime+" \n "+new Date(projectEndTime));
    });
}



$(function(){
    tab();
    projectTime();







    /*考试时间限制*/
    var eb = $("#eb");
    var ee = $("#ee");
    var ebTime = 0;
    var eeTime = 0;
});