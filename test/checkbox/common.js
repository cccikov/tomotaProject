var ccc = {};
// 设置localStorage
ccc.setStorage = function(key, value) {
    if (arguments.length === 2) {
        var v = value;
        if (typeof v == 'object') {
            v = JSON.stringify(v);
            v = 'obj-' + v;
        } else {
            v = 'str-' + v;
        }
        var ls = window.localStorage;
        if (ls) {
            ls.setItem(key, v);
            return v;
        }
    }
};
// 访问localStorage
ccc.getStorage = function(key) {
    var ls = window.localStorage;
    if (ls) {
        var v = ls.getItem(key);
        if (!v) {
            return;
        }
        if (v.indexOf('obj-') === 0) {
            v = v.slice(4);
            return JSON.parse(v);
        } else if (v.indexOf('str-') === 0) {
            return v.slice(4);
        }
    }
};
// 删除localStorage
ccc.rmStorage = function(key) {
    var ls = window.localStorage;
    if (ls && key) {
        ls.removeItem(key);
    }
};
// 清空localStorage
ccc.clearStorage = function() {
    var ls = window.localStorage;
    if (ls) {
        ls.clear();
    }
};