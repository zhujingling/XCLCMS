﻿/**
* 动态内容区JS  by xcl
* 项目地址：https://github.com/xucongli1989/dynamicCon
* 使用：
* 引用jquery（时代在进步，不再支持live绑定，请使用较新版本）
* $.DynamicCon();
* 当前版本：v1.3
* 更新日期：2015-05-04
*/
(function ($) {
    var defaults = {
        container: ".dynamicCon", //最外层的容器class
        temp: ".temp", //模板层class
        items: ".items", //具体行class
        minCount: 1, //具体行的最小数量 
        maxCount: 50, //具体行的最大数量
        addBtn: ".addBtn", //添加按钮class
        delBtn: ".delBtn", //删除按钮class
        indexClass: ".dynamicCon-Index",//显示序号的class，如：<span class="dynamicCon-Index"></span>
        autoCreateIdIndexClass: ".dynamicCon-autoCreateIdIndex",//自动创建id索引的class，比如，元素A的id='txt'，则更新为A的id='txt1','txt2','txt3'...
        beforeAddOrDel: function () { return true; },//添加后或删除前事件,其中的this为按钮对象，如果返回false，则阻止增加或删除行。
        afterAddOrDel: function () { }//添加后或删除后事件,其中的this为按钮对象
    };

    $.extend({
        DynamicCon: function (options) {
            options = $.extend({}, defaults, options || {});
            var $conAll = $(options.container);
            $conAll.each(function (i) {
                //当前容器（适应多个调用该插件的情况）
                var $con = $(this);

                //当前容器中的模板行
                var $temp = $con.find(options.temp);

                //更换模板行的class为具体行的class
                $temp.removeClass(options.temp.substring(1, options.temp.length)).addClass(options.items.substring(1, options.items.length)).wrap("<div style='display:none'></div>");

                //将模板的html字符串存放于变量中
                var tempHtml = $temp.parent().html();

                //删除模板dom
                $temp.parent().remove();

                //更新行号
                var updateLineNumber = function () {
                    $con.find(options.items).each(function (index, n) {
                        var idx = index + 1;
                        $(n).find(options.indexClass).text(idx);
                        $(n).attr({ "dynamicCon-index": idx });
                        $(n).find(options.autoCreateIdIndexClass).filter("[id]").each(function () {
                            var oldId = $(this).attr("dynamicCon-oldId"), id = $(this).attr("id");
                            if (oldId) {
                                $(this).attr({ "id": oldId + "" + idx.toString() });
                            } else {
                                $(this).attr({ "dynamicCon-oldId": id });
                                $(this).attr({ "id": id + "" + idx.toString() });
                            }
                        });
                    });
                };
                updateLineNumber();


                //添加行事件 （先移除绑定的事件，主要是避免使用js模板等插件动态生成内容时，重复绑定问题。）
                $(document).off("click", $con.find(options.addBtn).selector).on("click", $con.find(options.addBtn).selector, function () {
                    if (!options.beforeAddOrDel.call(this)) return false;

                    var $conThis = $($conAll[i]);
                    if ($conThis.find(options.items).length == options.maxCount) {
                        alert("最多只能添加" + options.maxCount + "行！");
                        return false;
                    }
                    $(this).closest(options.items).after(tempHtml);
                    updateLineNumber();

                    options.afterAddOrDel.call(this);
                });

                //删除行事件
                $(document).off("click", $con.find(options.delBtn).selector).on("click", $con.find(options.delBtn).selector, function () {
                    if (!options.beforeAddOrDel.call(this)) return false;

                    var $conThis = $($conAll[i]);
                    if ($conThis.find(options.items).length == options.minCount) {
                        alert("最少要有" + options.minCount + "行！");
                        return false;
                    }
                    $(this).closest(options.items).remove();
                    updateLineNumber();

                    options.afterAddOrDel.call(this);
                });

            });
        }
    });
})(jQuery);