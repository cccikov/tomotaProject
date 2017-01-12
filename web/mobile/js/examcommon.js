// alert("我写了一个动画事件,就是双箭头按钮那里触发的-弹出题目选择");

// 共用js

//动画出现
function animateShow(obj){
    obj.show();
    var timer = setTimeout(function(){
        obj.addClass("active");
    },16.7);
}
// 动画消失
function animateHide(obj){
    obj.removeClass("active");
    var timer = setTimeout(function(){
        obj.hide();
    },316.7);
}

// 蒙层出现,消失
function maskShow(){
    animateShow($(".mask"));
}
function maskHide(){
    animateHide($(".mask"));
}

// 题目出现,消失
function selectShow(){
    animateShow($(".subject-select"));
}
function selectHide(){
    animateHide($(".subject-select"));
}

// 上传文件出现,消失
function uploadShow(){
    animateShow($(".upload-type"));
}
function uploadHide(){
    animateHide($(".upload-type"));
}

