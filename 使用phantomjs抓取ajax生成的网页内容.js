//参考了这里的代码： https://stackoverflow.com/questions/31188021/using-multiple-page-open-in-one-script/

var urls = new Array("https://www.example.com/1.html","https://www.example.com/2.html","https://www.example.com/3.html");
var page = new WebPage();
var fs = require('fs');
var count = 1; //文件序号

//将文件序号格式化为3位，例如1.html变为001.html
function lpad(value, padding) {
    var zeroes = new Array(padding+1).join("0");
    return (zeroes + value).slice(-padding);
}

function handle_page(url) {
    page.open(url, function () {
        setTimeout(function () {
            var ct = page.evaluate(function () {
                return document.getElementsByClassName('content');//返回网页中所需要的部分，也即ajax生成的内容。
            });

            var fn = 'd:\\TEMP\\html\\' + lpad(count,3) + '.html';
            console.log(fn);
            try {
                fs.write(fn, ct[0].textContent, 'w');
            } catch (e) {
                console.log(e);
            };
            count += 1;
            next_page();
        }, 1000);//延时1s，防止网页未完全加载导致获取ajax内容失败。
    });
}

function next_page() {
    var url = urls.shift();
    if (!url) {
        phantom.exit(0);
    }
    handle_page(url);
}

next_page();
