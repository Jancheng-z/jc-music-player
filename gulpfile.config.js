var SRC_DIR = './src/';     // 源文件目录
var SRC_HTML_DIR=SRC_DIR+"/**/";//处理后的html文件路径
var SRC_IMG_DIR=SRC_DIR+"img/**/";//处理后的img文件路径
var SRC_CSS_DIR=SRC_DIR+"css/**/";//处理后的css文件路径
var SRC_JS_DIR=SRC_DIR+"js/**/";//处理后的js文件路径

var DIST_DIR = './dist/';   // 文件处理后存放的目录(生产环境)
var DIST_HTML_DIR=DIST_DIR+"html/";//处理后的html文件路径
var DIST_IMG_DIR=DIST_DIR+"img/";//处理后的img文件路径
var DIST_CSS_DIR=DIST_DIR+"css/";//处理后的css文件路径
var DIST_JS_DIR=DIST_DIR+"js/";//处理后的js文件路径
var DIST_JS_REV=DIST_DIR+"rev/js"//js文件名修改后json文件路径
var DIST_CSS_REV=DIST_DIR+"rev/css"//css文件名修改后json文件路径

var TEST_DIR = './test/';     // 测试文件目录
var TEST_HTML_DIR=TEST_DIR+"/**/";//测试文件html文件路径
var TEST_IMG_DIR=TEST_DIR+"img/**/";//测试文件img文件路径
var TEST_CSS_DIR=TEST_DIR+"css/**/";//测试文件css文件路径
var TEST_JS_DIR=TEST_DIR+"js/**/";//测试文件js文件路径

var Config={
    dist_dir:DIST_DIR,
    dist_rev:DIST_DIR+"rev/**/*.json",
    src_dir:SRC_DIR,
    test_dir:TEST_DIR,
    html:{
        src:SRC_HTML_DIR+"*.html",
        src_director:SRC_HTML_DIR,
        dist:DIST_DIR,
        test:TEST_HTML_DIR,
    },
    css:{
        src:SRC_CSS_DIR+"*.css",
        src_director:SRC_CSS_DIR,
        dist:DIST_CSS_DIR,
        test:TEST_CSS_DIR
    },
    js:{
        src:SRC_JS_DIR+"*.js",
        src_director:SRC_JS_DIR,
        dist:DIST_JS_DIR,
        test:TEST_JS_DIR
    },
    img:{
        src:SRC_IMG_DIR+"*.{jpg,png,gif,svg}",
        src_director:SRC_IMG_DIR,
        dist:DIST_IMG_DIR,
        test:TEST_IMG_DIR
    },
    rev:{
        js:DIST_JS_REV,
        css:DIST_CSS_REV
    }
}
module.exports = Config;
