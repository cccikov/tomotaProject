//不需要理这个函数,这个函数只是获取时间戳
function getTime(val){
    return val=="" ? 0 : (new Date(val.replace("T"," "))).getTime();
}

function getMin(val){
    val = val <= 0 ? 0 : val;
    return val*60*1000;
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

var projectBeginTime,projectEndTime;
function projectTime(){
    /*项目时间限制*/
    var pb = $("#pb");
    var pe = $("#pe");
    var getExamBeginTime = new Date("Dec 23 2016 09:00:00");//后台获取考试时间-范围开始
    var getExamEndTime = new Date("Dec 30 2016 18:00:00");//后台获取考试时间-范围结束
    projectBeginTime = getTime(pb.val());
    projectEndTime = getTime(pe.val());

    pb.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目开始时间
        var projectStatus = $(".project-time input:radio:checked").val();

        /*判断部分*/
        var arrNew = [
            {
                "flag": projectEndTime==0 || val<projectEndTime,//判断 项目开始时间 是否小于 项目结束时间 (projectEndTime为0时表示没有设置,所以不考虑,返回true)
                "reason":"项目开始时间 在 项目结束时间 后面"
            }
        ];
        var arrEdit = [
            {
                "flag": projectEndTime==0 || val<projectEndTime,//判断 项目开始时间 是否小于 项目结束时间 (projectEndTime为0时表示没有设置,所以不考虑,返回true)
                "reason":"项目开始时间 在 项目结束时间 后面"
            },{
                "flag":getExamBeginTime==0 || val<getExamBeginTime,//判断 项目开始时间 是否小于 后台考试时间-范围开始
                "reason":"项目开始时间 在 部分考试开始时间 后面"
            }
        ];
        var arr = projectStatus == "new" ? arrNew : arrEdit;

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        projectBeginTime = val;
        console.log("projectBeginTime : "+projectBeginTime+" \n "+new Date(projectBeginTime)+" \n ");
    });

    pe.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目结束时间
        var projectStatus = $(".project-time input:radio:checked").val();

        /*判断部分*/
        var arrNew = [
            {
                "flag":projectBeginTime==0 || val>projectBeginTime,//判断 项目结束时间 是否大于 项目开始时间
                "reason":"项目结束时间 在 项目开始时间 前面"
            }
        ];
        var arrEdit = [
            {
                "flag":projectBeginTime==0 || val>projectBeginTime,//判断 项目结束时间 是否大于 项目开始时间
                "reason":"项目结束时间 在 项目开始时间 前面"
            },
            {
                "flag":getExamEndTime==0 || val>getExamEndTime,//判断 项目结束时间 是否大于 后台考试时间-范围结束
                "reason":"项目结束时间 在 部分考试结束时间 前面"
            }
        ];
        var arr = projectStatus == "new" ? arrNew : arrEdit;

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        projectEndTime = val;
        console.log("projectEndTime : "+projectEndTime+" \n "+new Date(projectEndTime)+" \n ");
    });
}

function examTime(){
    /*项目时间限制*/
    var eb = $("#eb");
    var ee = $("#ee");
    var delay = $("#delay");
    var duration = $("#duration");
    var getNowTime = (new Date()).getTime()//后台获取当前时间
    var examBeginTime = getTime(eb.val());
    var examEndTime = getTime(ee.val());
    var examDelayTime = getMin(delay.val());
    var examDurationTime = getMin(duration.val());
    // console.log(examDelayTime,examDurationTime)

    $(".exam-time input:radio").on("change",function(){
        var examStatus = $(".exam-time input:radio:checked").val();
        console.log(examStatus,examBeginTime < getNowTime);
        if(examStatus == "edit" && examBeginTime < getNowTime){
            eb.add(ee).attr("readonly",true);
        }
    });

    /*tab切换*/
    $(".tab-btn a").on("click",function(){
        var _index = $(this).index();
        $(".box").eq(_index).addClass("active").siblings().removeClass("active");
    });

    eb.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目开始时间

        /*判断部分*/
        var arr = [
            {
                "flag":projectBeginTime==0 || val>projectBeginTime,//判断 考试开始时间 是否大于 项目开始时间
                "reason":"考试开始时间 在 项目开始时间 前面"
            },
            {
                "flag":examEndTime==0 || val<examEndTime,//判断 考试开始时间 是否小于 考试结束时间
                "reason":"考试开始时间 在 考试结束时间 后面"
            },
        ];

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        examBeginTime = val;
        console.log("examBeginTime : "+examBeginTime+" \n "+new Date(examBeginTime)+" \n ");
    });

    ee.on("input",function(){
        var that = $(this);
        var val = getTime(that.val());//实时获取项目开始时间
        var examType = $(".box.active").attr("data-val");
        // console.log(examType);

        /*判断部分*/
        var arrDelay = [//统一时间考卷时判断
            {
                "flag":projectEndTime==0 || val<projectEndTime,//判断 考试结束时间 是否小于于 项目结束时间
                "reason":"考试结束时间 在 项目结束时间 后面"
            },
            {
                "flag":examBeginTime==0 || val>examBeginTime + examDelayTime,//判断 考试结束时间 是否大于 考试开始时间+开考后允许进入
                "reason":"考试结束时间 在 考试开始时间+开考后允许进入时间 前面"
            },
        ];
        var arrDuration = [//按考试时长交卷判断
            {
                "flag":projectEndTime==0 || val<projectEndTime,//判断 考试结束时间 是否小于于 项目结束时间
                "reason":"考试结束时间 在 项目结束时间 后面"
            },
            {
                "flag":examBeginTime==0 || val>examBeginTime,//判断 考试结束时间 是否大于 考试开始时间
                "reason":"考试结束时间 在 考试开始时间 前面"
            },
            {
                "flag":examBeginTime==0 || val<projectEndTime-examDurationTime,//判断 考试结束时间 是否小于 项目结束时间-考试时长
                "reason":"考试结束时间+考试时长 超出 项目结束时间"
            },
        ]
        var arr = examType == "delay" ? arrDelay : arrDuration ;

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        examEndTime = val;
        console.log("examEndTime : "+examEndTime+" \n "+new Date(examEndTime)+" \n ");
    });

    delay.on("input",function(){
        var that = $(this);
        var val = getMin(that.val());
        var arr = [
            {
                "flag":examEndTime==0 || examBeginTime==0 || val<(examEndTime-examBeginTime),//判断 开考后可允许进入时间 是否小于 考试持续时间
                "reason":"开考后可允许进入时间 超过 考试持续时间"
            },
        ];

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        examDelayTime = val;
        console.log("examDelayTime : "+examDelayTime+" \n "+new Date(examDelayTime)+" \n ");
    });
    duration.on("input",function(){
        var that = $(this);
        var val = getMin(that.val());
        var arr = [
            {
                "flag":examEndTime==0 || projectEndTime==0 || val<(projectEndTime-examEndTime),//判断 考试持续时间 是否小于 考试结束时间到项目结束时间差
                "reason":"考试持续时间 超过 考试结束时间到项目结束时间差"
            },
        ];

        var flag = isAllTrue(arr).flag;
        var reason = isAllTrue(arr).reason;
        if(flag){
            $("input").removeClass("wrong");
        }else{
            that.addClass("wrong");
            console.log("%c"+reason,"color:red");
        }

        examDurationTime = val;
        console.log("examDurationTime : "+examDurationTime+" \n "+new Date(examDurationTime)+" \n ");
    });
}


$(function(){
    projectTime();
    examTime();
});