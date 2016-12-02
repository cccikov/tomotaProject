$(function(){
    $(".file-name").on("focus click",function(){
        $(".file").click();
    });

    $(".file").on("change",function(){
        var that = $(this);
        if(that[0].files){
            var file = that[0].files[0];
            var fileName = file.name;
        }else{
            var file = that.val();
            var fileName = file.slice(file.lastIndexOf("\\")+1);
        }
        var fileSuffix = fileName.slice(fileName.lastIndexOf(".")+1);//后缀
        if(fileSuffix != "jpg" && fileSuffix !="png"){
            that.add(".file-name").val('');
            alert("上传的文件格式错误，请上传格式为jpg、png的图片文件");
            return false;
        }
        $(".file-name").val(fileName);
    }).on("focus",function(){//为避免白痴ie在那闪闪光标
        $(this).blur();
    });
});