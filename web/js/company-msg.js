$(function(){
    $(".file-name").on("focus click",function(){
        $(".file").click();
    });
    $(".file").on("change",function(){
        var that = $(this);
        var file = that[0].files[0];
        console.log(file);
        var fileName = file.name;
        var fileSize = file.size;
        var fileSuffix = fileName.slice(fileName.lastIndexOf(".")+1);//后缀
        var fileType = file.type;
        if(fileSuffix != "jpg" && fileSuffix !="png"){
            that.add(".file-name").val('');
            alert("上传的文件格式错误");
            return false;
        }
        $(".file-name").val(fileName);
    });
});