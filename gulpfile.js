var gulp = require('gulp'),
    gulpConfig=require('./gulpfile.config.js'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    clean = require('gulp-clean'),
    uglify=require('gulp-uglify'),//压缩pulg
    rename = require('gulp-rename'),//重命名 pulg
    renameMd5=require('gulp-rename-md5'),//MD5 重命名 pulg
    babel=require('gulp-babel'),//Es6 to Es5
    webpack = require('webpack'),//webpack 引入
    //webpackconf=require('./webpack.config.js'),//webpack 配置文件
    htmlmin=require('gulp-htmlmin'),
    es6m=require('es6-module-transpiler-amd-formatter'),
    rev=require('gulp-rev'),//对文件名加MD5后缀
    imagemin=require('gulp-imagemin'),//图片压缩
    connect = require('gulp-connect'),//livereload
    plumber=require('gulp-plumber'),//防止错误中断
    revCollector = require('gulp-rev-collector');//路径替换
/**
 * 复制src html文件至dist
 */
gulp.task("htmlCopy",function(){
    return gulp.src([gulpConfig.html.src])//获取文件
        .pipe(plugins.plumber())//异常消息
        .pipe(plugins.changed(gulpConfig.html.dist))
        .pipe(gulp.dest(gulpConfig.html.dist))//保存文件
});
/**
 *压缩img文件
 */
gulp.task('minImg',function(){
    return gulp.src([gulpConfig.img.src])
        .pipe(plugins.changed(gulpConfig.img.dist))
        // .pipe(plugins.imagemin())
        .pipe(gulp.dest(gulpConfig.img.dist));
});
/**
 * 压缩js文件,并且设置随机号，可以在json文件中查看修改的数据,方便html中文件连接修改
 */
gulp.task('minJs',function () {
    return gulp.src([gulpConfig.js.src])//js文件路径
        .pipe(plugins.plumber())//异常消息提醒，防止中断
       // .pipe(plugins.babel({presets: ['es2015']}))
        .pipe(plugins.changed(gulpConfig.js.dist))//只有改变的js需要重新压缩
      //  .pipe(plugins.uglify())//文件压缩
        .pipe(plugins.rev())//添加文件后缀
        .pipe(gulp.dest(gulpConfig.js.dist))//文件输出
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(gulpConfig.rev.js));//输出json文件路径
})
/**
 * 压缩css文件，并且设置随机号，可以在json文件中查看修改的数据，方便html中文件连接修改
 */
gulp.task('minCss',function(){
    return gulp.src([gulpConfig.css.src])//css文件路径
        .pipe(plugins.plumber())//异常消息
        .pipe(plugins.changed(gulpConfig.css.dist))//只有改变的css需要重新压缩
        .pipe(plugins.minifyCss())//css文件压缩
        .pipe(plugins.rev())//设置文件后缀
        .pipe(gulp.dest(gulpConfig.css.dist))//文件输出路径
        .pipe(plugins.rev.manifest())//修改后文件json
        .pipe(gulp.dest(gulpConfig.rev.css));//输出json文件路径
});
/**
 * 替换copy src中文件并且替换dist html中文件链接
 */
gulp.task('revHtml',['minImg','minJs','minCss'], function() {
    gulp.src([gulpConfig.dist_rev,gulpConfig.html.src])   //- 读取 rev-manifest.json 文件以及需要进行js/css名替换的文件
        .pipe(plugins.plumber())//异常消息
        .pipe(plugins.revCollector())                                   //- 执行文件内js/css名的替换
        .pipe(gulp.dest(gulpConfig.html.dist)) //- 替换后的文件输出的目录
        .pipe(connect.reload());
});
/**
 * 清空生产环境css数据
 */
gulp.task('cleanCss',function(){
    gulp.src([gulpConfig.css.dist])
        .pipe(plugins.plumber())
        .pipe(plugins.clean());//删除dist css生产环境数据
});
/**
 * 清空生产环境js数据
 */
gulp.task('cleanJs',function(){
    gulp.src([gulpConfig.js.dist])
        .pipe(plugins.plumber())
        .pipe(plugins.clean());//删除dist css生产环境数据
});
/**
 * 清空生产环境Img数据
 */
gulp.task('cleanImg',function(){
    gulp.src([gulpConfig.img.dist]).pipe(plugins.clean());//删除dist css生产环境数据
});
/**
 * 清空生产环境Html数据
 */
gulp.task('cleanHtml',function(){
    gulp.src([gulpConfig.html.dist+'**/*.html',gulpConfig.html.dist+'html']).pipe(plugins.clean());//删除dist css生产环境数据
});
/**
 * 清空生产环境rev数据
 */
gulp.task('cleanRev',function(){
    gulp.src([gulpConfig.dist_dir+'rev/']).pipe(plugins.clean());//删除dist css生产环境数据
});
/**
 * 清空生产环境数据
 */
gulp.task('cleanDist',['cleanCss','cleanJs','cleanImg','cleanHtml','cleanRev']);
/**
 * 监控Dist文件
 */
gulp.task('watchDist', function () {
    gulp.watch(gulpConfig.html.src,['revHtml']);//html文件修改后自启动buildHtml
    gulp.watch(gulpConfig.css.src,['revHtml']);//css文件修改后自启动buildHtml
    gulp.watch(gulpConfig.js.src,['revHtml']);//css文件修改后自启动buildHtml
});

/**
 * 重新加载JS
 */
gulp.task('reloadJs',function () {
    return gulp.src([gulpConfig.js.src])//js文件路径
        .pipe(plugins.plumber())//异常消息提醒，防止中断
        .pipe(connect.reload());
})
/**
 * 重新加载CSS
 */
gulp.task('reloadCss',function(){
    return gulp.src([gulpConfig.css.src])//css文件路径
        .pipe(plugins.plumber())//异常消息
        .pipe(connect.reload());
});
/**
 * 重新加载Html
 */
gulp.task('reloadHtml',['reloadCss','reloadJs'], function() {
    gulp.src([gulpConfig.html.src])   //- 读取 rev-manifest.json 文件以及需要进行js/css名替换的文件
        .pipe(plugins.plumber())//异常消息         //- 执行文件内js/css名的替换
        .pipe(connect.reload());
});

/**
 * 监控Src文件
 */
gulp.task('watchSrc', function () {
    gulp.watch(gulpConfig.html.src,['reloadHtml']);//html文件修改后自启动刷新HTML
    gulp.watch(gulpConfig.css.src,['reloadHtml']);//css文件修改后自启动刷新HTML
    gulp.watch(gulpConfig.js.src,['reloadHtml']);//css文件修改后自启动刷新HTML
});

/**
 * 监控test文件
 */
gulp.task('watchTest', function () {
    gulp.watch(gulpConfig.html.test,['reloadHtml']);//html文件修改后自启动刷新HTML
    gulp.watch(gulpConfig.css.test,['reloadHtml']);//css文件修改后自启动刷新HTML
    gulp.watch(gulpConfig.js.test,['reloadHtml']);//css文件修改后自启动刷新HTML
});

/**
 * 定义test Server任务
 */
gulp.task('connectTest', function () {
    connect.server({
        name: 'CPM-DCV2.0',
        root: 'test',//允许访问根目录
        index:false,//是否开气默认引导页
        port: 8003,//服务端口号
        livereload: true//是否启动自刷新
    });
});

/**
 * 定义src Server任务
 */
gulp.task('connectSrc', function () {
    connect.server({
        name: 'CPM-DCV2.0',
        root: 'src',//允许访问根目录
        index:false,//是否开气默认引导页
        port: 8001,//服务端口号
        livereload: true//是否启动自刷新
    });
});
/**
 * 定义dist Server任务
 */
gulp.task('connectDist', function () {
    connect.server({
        name: 'CPM-DCV2.0',
        root: 'dist',//允许访问根目录
        index:false,//是否开气默认引导页
        port: 8001,//服务端口号
        livereload: true//是否启动自刷新
    });
});
/**
 * 默认DIST任务
 * （1）gulp cleanDist
 * (2)gulp  defaultDist
 */
gulp.task('defaultDist',['revHtml','watchDist','connectDist']);
/**
 * 默认test任务
 */
gulp.task('defaultTest',['watchTest','connectTest']);
/**
 * 默认Src任务
 */
gulp.task('default',['watchSrc','connectSrc']);

