/*
 * @Author: sihui.cao
 * @Date:   2016-12-22 14:32:56
* @Last modified by:   Jet.Chan
* @Last modified time: 2017-01-10T20:34:56+08:00
 */

'use strict';

import cui from 'c-ui'
import WarnTip from '../../components/tips/warnTip'
import SuccessTip from '../../components/tips/successTip'
import loading from '../../components/loading/index'
import session from '../../dao/sessionContext'
import dalExamList from '../../dao/examManagement/examList'
import '../../components/commonTab/style.less'
import '../../components/share/hfCommon'
import './setScore.less'
import _ from 'lodash';


class SetScore {
    constructor() {
        this.textBoxes = Array.from($('.cui-textBoxContainer'), (v) => new cui.TextBox($(v)))
        this.checkboxes = Array.from($('.cui-checkboxContainer'), (v) => new cui.Checkbox($(v)))
        this.radioGroups = Array.from($('.cui-radioGroupContainer'), (v) => new cui.RadioGroup($(v)))
        this.selectBoxes = Array.from($('.cui-selectBoxContainer'), (v) => new cui.SelectBox($(v)))
        this.initScore()
        this.watch()
    }
    initScore() {
        let score = 0
        for (let v of $('.cui-textBoxContainer.score')) {
            if ($(v).find('input').val() != '' && parseFloat($(v).find('input').val())) {
                score += parseFloat($(v).find('input').val())
            }
        }
        $('#totalScore').text(score)
    }
    move($el = null) {
            if (!$el){
                let $preview = $('.preview-question.failure:eq(0)'),
                    $preview_i = $('.preview-question input.fail:first').parents('.preview-question'),
                    index = $preview.index('.preview-question'),
                    index_i = $preview_i.index('.preview-question')
                if(index==-1){
                    $el = $preview_i
                }
                else if(index_i == -1){
                    $el = $preview
                }
                else{
                    $el = index<index_i ? $preview:$preview_i
                }
            }
            let top = $el.offset().top - $(window).height() / 4
            $('html,body').scrollTop(top)
    }
    //检查分数和答案
    checkScore() {
            let vaild = true,
                self = this;
            let arr = ['.preview-question.single', '.preview-question.multiple',
                '.preview-question.obj-completion', '.preview-question.sub-completion', '.preview-upload-question'
            ]
            for (let [i, el] of arr.entries()) {
                let $els = $(el + ' .setting-score .score input').concat($(el + ' .setting-score .long input'))
                for (let v of $els) {
                    if ($(v).val() == '') {
                        vaild = false;
                        $(v).addClass('fail');
                        new WarnTip($(v).parent(), '分数不能为空', {
                            width: '75px'
                        });
                    }
                }

                if (i < 2) {
                    for (let v of $(el + ' .preview-options')) {
                        if ($(v).find('input:checked').length == 0) {
                            vaild = false;
                            $(v).parents('.preview-question').addClass('failure')
                        }
                    }
                }
                if (i == 2) {
                    for (let v of $(el + ' .preview-options')) {
                        for (let k of $(v).find('textarea')) {
                            if ($.trim($(k).val()) == '') {
                                vaild = false;
                                $(v).parents('.preview-question').addClass('failure')
                            }
                        }
                    }
                    for (let v of $(el + ' .setting .cui-radioGroupContainer')) {
                        if ($(v).find('input:checked').length == 0) {
                            vaild = false;
                            $(v).parents('.preview-question').addClass('failure')
                        }
                    }
                }
            }
            return vaild;
    }
    //获取数据
    getValue() {
        let self = this,
            arr = [],
            model = {
                score:$('#totalScore').text(),
                dOptions: [], //选择题集合
                dAttachments: [], //附加题
                dBlanks: [], //填空题
            };
        //单选
        for (let v of $('.preview-question.single')) {
            model.dOptions.push({
                "dOptionScoreSetting": {
                    "answer": $(v).find('.preview-option input:checked').val(),
                    "score": $(v).find('.setting-score .cui-textBoxContainer.score input').val()
                },
                "unicode": $(v).data('code'),
                "type": 4
            })
        }

        //多选
        for (let v of $('.preview-question.multiple')) {
            let _i = $(v).index('.preview-question.multiple');
            let answers = Array.from($(v).find('.preview-option input:checked'), (k) => $(k).val());
            model.dOptions.push({
                "dOptionScoreSetting": {
                    "answers": answers,
                    "score": $(v).find('.setting-score .cui-textBoxContainer.score input.total').val(),
                    "scoreRule": (self.selectBoxes[_i].getValue() || {value: 0}).value,
                    "subScore": $(v).find('.setting-score .cui-textBoxContainer.long input.sub').val()
                },
                "unicode": $(v).data('code'),
                "type": 5
            })
        }

        //客观填空题
        for (let v of $('.preview-question.obj-completion')) {
            let total = 0;
            let dBlankScoreDetails = Array.from($(v).find('.preview-option'), (k) => {
                let _i = parseInt($(k).find('.option-index').text())
                let score = $(v).find('.setting-score .cui-textBoxContainer.score').eq(--_i).find('input').val()
                total += parseInt(score)
                return {
                    "seqNo": $(k).find('textarea').data('code'),
                    "answer": $(k).find('textarea').val(),
                    "score": score
                }
            })
            model.dBlanks.push({
                "dBlankScoreSetting": {
                    "dBlankScoreDetails": dBlankScoreDetails,
                    "score": total,
                    "scoreRule": $(v).find('.setting .cui-radioContainer input:checked').val(),
                    "explanation": $(v).find('.analysis-content textarea').val()
                },
                "unicode": $(v).data('code'),
                "type": 6
            })
        }

        //主观填空题
        for (let v of $('.preview-question.sub-completion')) {
            let total = 0;
            let dBlankScoreDetails = Array.from($(v).find('.preview-option'), (k) => {
                let _i = parseInt($(k).find('.option-index').text())
                let score = $(v).find('.setting-score .cui-textBoxContainer.score').eq(--_i).find('input').val()
                total += parseInt(score)
                return {
                    "seqNo": $(k).find('textarea').data('code'),
                    "answer": $(k).find('textarea').val(),
                    "score": score
                }
            })
            model.dBlanks.push({
                "dBlankScoreSetting": {
                    "dBlankScoreDetails": dBlankScoreDetails,
                    "score": total,
                    "scoreRule": $(v).find('.setting .cui-radioContainer input:checked').val(),
                    "explanation": $(v).find('.analysis-content textarea').val()
                },
                "unicode": $(v).data('code'),
                "type": 6
            })
        }

        //上传题
        for (let v of $('.preview-question.preview-upload-question')) {
            model.dAttachments.push({
                "dAttachmentScoreSetting": {
                    "score": $(v).find('.cui-textBoxContainer.score input').val(),
                    "scoreRule": $(v).find('.cui-textBoxContainer textarea').val()
                },
                "unicode": $(v).data('code'),
                "type": 7
            })
        }

        return JSON.stringify(model)
    }
    save(type) {
        let self = this;
        if (!self.checkScore()) {
            self.move()
            cui.popTips.error('还有题目未设置答案或分数')
            return;
        }
        let paperUnicode = $('#paperUnicode').val()
        let value = self.getValue();
        debugger;
        loading.open()
        session.customer()
            .then((res) => {
                return dalExamList.savePaperScore(paperUnicode, res.accessToken, value)
            })
            .then((res) => {
                loading.close()
                if (res && res.code == 0) {
                    new SuccessTip('操作成功', function() {
                        // if (type == 1)
                        //     window.location.href = `/customer/examList/setPaperRemark/${paperUnicode}?mode=` + $('#mode').val()
                        // else
                        //     window.location.href = `/customer/examList/setCompletion/${paperUnicode}?mode=` + $('#mode').val()
                    }, null, 800)
                }else{
                    cui.popTips.error(res.message ? res.message : '操作失败');
                }
            }, (err) => {
                loading.close()
                cui.popTips.error(err.message ? err.message : '操作失败');
            })
    }
    watch() {
        let self = this;

        //输入限制和判断
        $('.cui-textBoxContainer.score')
            .on('focus', 'input', (e) => {
                $(e.target).removeClass('fail succ')
            })
            .on('keydown', 'input', (e) => {
                if (e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 190 || e.keyCode == 110 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                    return true;
                }
                return false;
            })
            .on('keyup', 'input', (e) => {
                let val = e.target.value;
                if (val != '') {
                    let reg = new RegExp(/^\d{1,3}($|\.\d?$)/)
                        // let reg = new RegExp(/^\d{1,3}$|^\d{1,3}\.\d?$/)
                        // let reg = new RegExp(/^(\d{1,3}\.\d{1})$|^(\d{1,3}[\.])$|^(\d{1,3})$/)
                    if (!reg.test(val)) {
                        e.target.value = '';
                        new WarnTip($(e.target).parent(), '请输入小于999.9的正数', {
                            width: '127px',
                            top: '41px'
                        });
                    }
                }
            })
            .on('blur', 'input', (e) => {
                let val = e.target.value;
                if (val == '')
                    return;
                let reg = new RegExp(/^\d{1,3}($|\.\d?$)/)
                    // let reg = new RegExp(/^\d{1,3}$|^\d{1,3}\.\d?$/)
                    // let reg = new RegExp(/^(\d{1,3}[\.]\d{1})$|^(\d{1,3}[\.])$|^(\d{1,3})$/)
                if (!reg.test(val)) {
                    $(e.target).addClass('fail').val('')
                    new WarnTip($(e.target).parent(), '请输入小于999.9的正数', {
                        width: '127px',
                        top: '41px'
                    });
                } else {
                    if ($(e.target).hasClass('sub')) { //多选题子题分数
                        let total = $(e.target).parents('.setting-score').find('.item:first input').val();
                        if (total == '' || parseFloat(total) < parseFloat(val)) {
                            $(e.target).addClass('fail').val('')
                            new WarnTip($(e.target).parent(), '不能大于本题总分', {
                                width: '100px',
                                top: '41px'
                            });
                        } else {
                            $(e.target).addClass('succ').val(parseFloat(val))
                        }
                    } else {
                        let total = 0;
                        for (let v of $('.cui-textBoxContainer.score input')) {
                            let val = $(v).val()
                            if (val != '' && reg.test(val)) {
                                total += parseFloat(val)
                            }
                        }
                        $('#totalScore').text(total)
                        $(e.target).addClass('succ').val(parseFloat(val))
                    }
                }
            })

        //清除警告
        $('.preview-question.single .preview-option').on('click', '.cui-radioContainer i', (e) => {
            $(e.target).parents('.preview-question.single').removeClass('failure')
        }).on('click', '.option-content', (e) => {
            $(e.target).prev('.cui-radioContainer').find('i').trigger('click')
            $(e.target).parents('.preview-question.single').removeClass('failure')
        })

        $('.preview-question.multiple .preview-option').on('click', '.cui-checkboxContainer i', (e) => {
            $(e.target).parents('.preview-question.multiple').removeClass('failure')
        }).on('click', '.option-content', (e) => {
            $(e.target).prev('.cui-checkboxContainer').find('i').trigger('click')
            $(e.target).parents('.preview-question.multiple').removeClass('failure')
        })

        $('.preview-question.obj-completion').on('focus', '.preview-option textarea', (e) => {
            $(e.target).parents('.preview-question.obj-completion').removeClass('failure')
        }).on('click', '.setting .cui-radioContainer label>i,.setting .cui-radioContainer label>span', (e) => {
            $(e.target).parents('.preview-question.obj-completion').removeClass('failure')
        })

        $('.setting-score .cui-textBoxContainer.score input').on('focus', (e) => {
            $(e.target).parents('.preview-question').removeClass('failure')
        })


        //多选题
        for (let v of self.selectBoxes) {
            v.$el.on('click', '.cui-options li', (e) => {
                let $el = $(e.target);
                if ($el.data('value') == '1') {
                    v.$el.parent().next().removeClass('dis');
                } else {
                    v.$el.parent().next().addClass('dis');
                }
            })
        }

        //检查分数、下一步、完成
        $('#checkScore').on('click', ()=>{
            if(self.checkScore()){
                return new SuccessTip('检查通过')
            }else{
                this.move()
                return cui.popTips.error('还有题目未设置答案或分数')
            }
        })

        $('.setting-action').on('click', '.next', (e) => {
            self.save(1)
        }).on('click', '.save', (e) => {
            self.save(2)
        })


        //选中内容触发选中选项
        $('.option-content').on('click',(e)=>{
            let $el = $(e.target).hasClass('option-content') ? $(e.target) : ($(e.target).parents('.option-content')),
                $option = $el.prev('.cui-checkboxContainer').length>0 ? $el.prev('.cui-checkboxContainer') : $el.prev('.cui-radioContainer')
            $option.find('input').click()
        })
    }
}
new SetScore()
