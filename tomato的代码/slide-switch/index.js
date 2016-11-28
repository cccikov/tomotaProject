/*
* @Author: sihui.cao
* @Date:   2016-11-25 14:19:43
* @Last Modified by:   sihui.cao
* @Last Modified time: 2016-11-25 17:53:50
*/

'use strict';
import $ from 'jquery'

import './style.less'

class SlideSwitch{
    constructor(obj,cls="active") {
        this.obj = obj;
        this.cls = cls;
        this.init()
    }
    init() {
        $(this.obj).on('click',(e)=>{
            e.preventDefault()
            e.stopPropagation()
            this.toggleClass()
        })
    }
    judge() {
        return !!this.obj.className.match(new RegExp('(\\s|^)' + this.cls + '(\\s|$)'));
    }

    set(status=true) {
        if (!this.judge()&&status) this.obj.className += " " + this.cls;
        if (this.judge()&&!status) {
            let reg = new RegExp('(\\s|^)' + this.cls + '(\\s|$)');
            this.obj.className = this.obj.className.replace(reg, ' ');
        }
    }

    get() {
        return this.judge();
    }

    toggleClass(){
        return this.judge()?this.set(false):this.set(true);
    }



}
export default SlideSwitch
