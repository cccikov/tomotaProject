$(function() {
    $(".file-name").on("focus click", function() {
        $(".file").click();
    });

    $(".file").on("change", function() {
        var that = $(this);

        /*//单纯获取fileName , 不考虑大小
        if(that[0].files){
            var file = that[0].files[0];
            var fileName = file.name;
        }else{
            var file = that.val();
            var fileName = file.slice(file.lastIndexOf("\\")+1); //通过value值获取fileName
        }*/

        if (that[0].files) { //现代浏览器,支持files API浏览器
            var file = that[0].files[0];
        } else {
            var filePath = that.val();
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");//ie 自带 Active-x插件
            var file = fileSystem.GetFile(filePath);
        }
        var fileName = file.name;
        var fileType = file.type;
        var fileSize = file.size/1024/1024;



        var fileSuffix = fileName.slice(fileName.lastIndexOf(".") + 1); //后缀
        if (fileSuffix != "jpg" && fileSuffix != "png" && fileSuffix != "gif" && fileSuffix != "bmp") {
            that.add(".file-name").val('');
            alert("上传的文件格式错误，请上传格式为jpg、png、bmp、gif的图片文件");
            return false;
        }

        if(fileSize>1){
            alert("上传的文件不得大于1m");
            return false;
        }

        $(".file-name").val(fileName);
    }).on("focus", function() { //为避免白痴ie在那闪闪光标
        $(this).blur();
    });
});






function ie(target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;

    function fileChange(target) {

        var fileSize = 0;
        if (isIE && !target.files) {
            var filePath = target.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            console.log(file);
            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
        var size = fileSize / 1024;
        if (size > 10000) {
            alert("附件不能大于10M");


        }

    }
}
