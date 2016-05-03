var fs = require("fs");
var path = require("path");
var pinyin = require("pinyin");

var baseUrl = "articles/";
var authorReg = /@[a-zA-Z0-9^\u4e00-\u9fa50-9a-zA-Z_-]*@/mg;
var urlReg = /[^\u4e00-\u9fa50-9a-zA-Z]*/g;
var articles = [];

function py(str) {
    return pinyin(str, {
        style: pinyin.STYLE_NORMAL
    }).join("-");
}

function rp(str) {
    return str.replace(urlReg, "");
}

function ar(str) {
    if (authorReg.test(str)) {
        return str.match(authorReg)[0].replace(/@/g, "");
    } else {
        return "CAIWENLONG";
    }
}

fs.readdir(baseUrl, function(err, files) {
    if (err) {
        throw err;
    }
    var file = fs.createWriteStream("articles.json");
    file.on("error", function(err) {
        if (err) {
            throw err;
        }
    });

    // 开始写文件
    var j = 0;
    file.write("[\r\n");
    (function pushArticle() {
        var filePath = files[j],
            fileExtName = path.extname(filePath),
            fileAuthor = ar(filePath),
            fileName = path.basename(filePath, fileExtName).replace(authorReg, "");
        if (j < files.length) {
            fs.stat(baseUrl + files[j], function(err, data) {
                if (err) {
                    throw err;
                }
                var articleObj = {
                    "title": fileName,
                    "author": fileAuthor,
                    "url": py(rp(fileName)),
                    "path": filePath,
                    "mtime": data.mtime.getTime(),
                    "birthtime": data.birthtime.getTime()
                };
                var t = setTimeout(function delayOutput() {
                    articles.push(articleObj);
                    if (j == files.length - 1) {
                        file.write("  " + JSON.stringify(articleObj) + "\r\n");
                    } else {
                        file.write("  " + JSON.stringify(articleObj) + ",\r\n");
                    }
                    console.log("第" + (j + 1) + "条记录：" + articleObj.title + "  写入JSON成功");
                    j++;
                    pushArticle();
                }, 30);
            })
        } else {
            file.end("]");
            console.log("JSON文件写入成功！");
            console.log(articles);
        }
    })();
    // 写文件结束
})
