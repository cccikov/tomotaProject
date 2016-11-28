/*
* @Author: sihui.cao
* @Date:   2016-11-24 15:28:35
* @Last Modified by:   sihui.cao
* @Last Modified time: 2016-11-28 10:27:12
*/

'use strict';
import $ from 'jquery'
import cui from 'c-ui'

import SlideSwitch from '../../components/slide-switch/index'
import '../../components/share/hfCommon'

import '../../components/commonTab/style.less'
import './email.less'

class EmailTem {
    constructor(){
        this.init();
    }
    init(){
        this.initSlideButton();
        this.initCheckbox();
    }
    initSlideButton(){
        let slideBtns = document.querySelectorAll('.tpl-main .slideBtn')
        this.slideList = Array.from(slideBtns,(elem)=>new SlideSwitch(elem))
    }
    initCheckbox(){
        this.checkboxes = Array.from($('.cui-checkboxContainer'),(v)=>new cui.Checkbox($(v)))
    }
    // addEmailTemplate(){
    //     var tmpHeader = $('<span>创建邮件模板</span>');

    //     var tmpContent = $('');
    //     var modalPanel = new cui.Panel(tmpHeader, tmpContent);
    //     var modalBrocken = new cui.Brocken();
    //     var modal = new cui.Modal(modalBrocken.getBrocken(), modalPanel.getPanel());
    //     $('#cui-modal-open').on('click', function() {
    //         modal.open();
    //     });
    // }
}

let emailTem = new EmailTem();

