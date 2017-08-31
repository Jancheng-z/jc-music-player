/**
 * Created by Jancheng on 2017/8/30.
 */
/**
 * 自定义插件方法
 * 入参：obj
 * jcPlayType：播放类型{R:随机;C:循环;默认：R}
 * 歌曲信息：id:歌曲id
 *          src：歌曲链接
 *          cover:歌曲封面
 *          name:歌曲名
 *          singer:歌手
 *          title:标题
 */
;(function(name, definition){
    // 检测上下文环境是否为AMD或CMD
        var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})("Jcplayer",function(){
    var tag = false,ox = 0,left = 0,bgleft = 0,jcplayerkey="jc-player-key",isLeft=true;
    /**
     * api
     * @type {{initMusicPanel: initMusicPanel, addMusicList: addMusicList, removeMusicListById: removeMusicListById, removeMusicListByIndex: removeMusicListByIndex, removeAllMusicList: removeAllMusicList, playMusicById: playMusicById, playMusicByIndex: playMusicByIndex}}
     */
    var api={
        //初始化面板
        initMusicPanel:function(obj){
            if(obj!=undefined&&obj!=null&&obj.id!=undefined){
                initPanel(obj.id).then(changePlayType("C")).then(playOnEnded()).then(initProgress()).then(playControls()).then(nextMusic());
            }
        },
        //添加歌曲
        addMusicList:function(list){
            list=list instanceof Array?list:[];
            //支持sessionStorage
            if(window.sessionStorage!==undefined){
                var musicList=window.sessionStorage.getItem(jcplayerkey);
                var array=new Array();
                if(musicList!=null){
                    array=JSON.parse(musicList).concat(list);//追加在后面
                }else{
                    array=list;
                }
                window.sessionStorage.removeItem(jcplayerkey);
                window.sessionStorage.setItem(jcplayerkey,JSON.stringify(array));//设置缓冲数据
                changeMusicListCount();//修改数量
                if($("#jc-player-audio").attr("src")==null||$("#jc-player-audio").attr("src")==undefined){
                    var obj=getMusicItemByIndex(1);
                    if(obj==null){
                        return ;
                    }else{
                        loadMusic(obj);
                    }
                }
            }
        },
        //通过歌曲id移除数据
        removeMusicListById:function (value){
            if(window.sessionStorage!==undefined&&value!=null){
                var musicList=window.sessionStorage.getItem(jcplayerkey);
                var array=new Array();
                if(musicList!=null){
                    array=JSON.parse(musicList);
                    for(var i in array){
                        if(array[i].id==value){
                            array.slice(parseInt(i),1);//移除该音乐列表项
                        }
                    }
                }
                window.sessionStorage.removeItem(jcplayerkey);
                window.sessionStorage.setItem(jcplayerkey,JSON.stringify(array));//设置缓冲数据
            }
        },
        //通过歌曲index移除数据
        removeMusicListByIndex:function (index){
            if(window.sessionStorage!==undefined&&index!=null){
                var musicList=window.sessionStorage.getItem(jcplayerkey);
                var array=new Array();
                if(musicList!=null){
                    array=JSON.parse(musicList);
                    if(array.length>index-1&&index>0){
                        array.slice(parseInt(index-1),1);//移除该音乐列表项
                    }
                }
                window.sessionStorage.removeItem(jcplayerkey);
                window.sessionStorage.setItem(jcplayerkey,JSON.stringify(array));//设置缓冲数据
            }
        },
        //移除所有音乐数据
        removeAllMusicList:function (){
            if(window.sessionStorage!==undefined){
                window.sessionStorage.removeItem(jcplayerkey);//清除数据
            }
        },
        /**
         * 播放指定id歌曲
         * @param value
         */
        playMusicById:function(value){
            var music=getMusicItemById(value);
            if(music!=null){
                loadMusic(music);
                playMusic();
            }
        },
        /**
         * 播放指定index歌曲
         * @param index
         */
        playMusicByIndex:function (index) {
            var obj=getMusicItemByIndex(index);
            if(obj!=null){
                loadMusic(obj);
                playMusic();
            }
        }
    };
    return api;
    /**
     * 音乐加载
     * @param obj
     */
    function loadMusic(obj){
        var data=obj.data;
        var index=obj.index;
        var id=data.id||"";
        var src=data.src||"";
        var cover=data.cover||"";
        var name=data.name||"";
        var singer=data.singer||"";
        var title=data.title||"";
        $(".music-pic img").attr("src",cover);
        $(".music-name").html(name);
        $("#jc-player-audio").attr({"src":src,"musicId":id,"currentIndex":index});//移除时需要更新索引
        playOnEnded();//监听结束
        initProgress();//设置进度
        listnerError();//监听错误
        scrollMusicName();//设置滚动
    }
    /**
     * 初始化面板
     * @param appendId
     */
    function initPanel(appendId){
        //检测该节点id是否存在
        var initP=new Promise(function (resolve,reject) {
            if($(appendId).length>0){
                var html='<div class="jc-player">'+
                    '    <div class="jc-player-music-pic">                                              '+
                    '        <div class="music-pic">                                                    '+
                    '            <img>                                        '+
                    '        </div>                                                                     '+
                    '        <div class="music-name">                                                   '+
                    '        </div>                                                                     '+
                    '    </div>                                                                         '+
                    '    <div class="jc-player-music-controls">                                         '+
                    '        <span class="play-bg-img"></span>                                                              '+
                    '        <span></span>                                                              '+
                    '    </div>                                                                         '+
                    '    <div class="jc-player-music-projress">                                         '+
                    '        <div class="player-position"></div>                                   '+
                    '        <div class="progress">                                                     '+
                    '            <div class="playing"></div>                                            '+
                    '            <div class="dot-panel">                                                '+
                    '                <a class="player-dot"></a>                                         '+
                    '            </div>                                                                 '+
                    '        </div>                                                                     '+
                    '        <div class="player-duration"></div>                                   '+
                    '    </div>                                                                         '+
                    '    <div class="jc-player-music-volume">                                           '+
                    '        <span></span>            '+
                    '        <div class="volume-large">                                                 '+
                    '            <div class="volume-panel"></div>                                       '+
                    '        </div>                                                                     '+
                    '    </div>                                                                         '+
                    '    <div class="jc-player-music-tracks">                                           '+
                    '        <span class="play-type play-type-random"></span>                                            '+
                    '        <span class="music-rcl"></span>                                            '+
                    '        <span class="music-list"></span>                                           '+
                    '        <span class="music-list-num"></span>                                    '+
                    '    </div>                                                                         '+
                    '</div>                                                                             '+
                    '<audio id="jc-player-audio"  controls></audio>                                               ';
                $(appendId).append(html);
            }
        });
        return initP;
    }
    /**
     * 初始化进度
     */
    function initProgress(){
        //获取总长度
        $("#jc-player-audio").on('canplay',function(){
            var duration=$("#jc-player-audio")[0].duration;
            var time=formateTime(duration);
            $(".jc-player .player-duration").text(time);
            playControls();
            drafMusicProgress();
            drafMusicVolume();
        });
        //获取当前播放时间
        $("#jc-player-audio").on('timeupdate',function(){
            var currentTime=$("#jc-player-audio")[0].currentTime;
            var time=formateTime(currentTime);
            $(".jc-player .player-position").text(time);
            changePlayProgress();
        });
    }
    /**
     * 改变播放进度
     */
    function changePlayProgress(){
        var duration=$("#jc-player-audio")[0].duration;
        var currentTime=$("#jc-player-audio")[0].currentTime;
        var percent=duration==0?0:(currentTime/duration)*100;
        $(".jc-player .jc-player-music-projress .progress .playing").css('width',percent+"%");
        $(".jc-player .jc-player-music-projress .progress .dot-panel").css('width',percent+"%");
    }
    /**
     * 监听播放/暂停按钮
     */
    function playControls(){
        $(".jc-player-music-controls span:first-child").unbind();
        $(".jc-player-music-controls span:first-child").on("click",function () {
            //如果没有歌曲，需要从本地session中加载一首
            if($("#jc-player-audio").attr("src")==null||$("#jc-player-audio").attr("src")==undefined){
                var obj=getMusicItemByIndex(1);
                if(obj==null){
                    return ;
                }else{
                    loadMusic(obj);
                }
            }
            var played=$("#jc-player-audio")[0].paused;
            if(played){
                playMusic();
                $(".jc-player  .jc-player-music-controls span:first-child").removeClass("play-bg-img").addClass("pause-bg-img");
            }else{
                pauseMusic();
                $(".jc-player  .jc-player-music-controls span:first-child").removeClass("pause-bg-img").addClass("play-bg-img");
            }
        });
    }
    /**
     * 拖动设置音乐进度条
     * touchstart--->onmousedown
     * touchmove--->onmousemove
     * touchend--->onmouseup
     */
    function drafMusicProgress(){
        //播放点，点击事件
        $(".player-dot").unbind();
        $(".player-dot").on("mousedown",function(e){
            ox = e.pageX - left;
            tag=true;
            var percent=0;
            //鼠标移动
            $(document).on("mousemove",function(e){
                if(tag){
                    var progressWith= $(".player-dot").closest(".progress").width();
                    left = e.pageX - ox;
                    if (left <= 0) {
                        left = 0;
                    }else if (left > progressWith) {
                        left = progressWith;
                    }
                    percent=progressWith==0?0:(left/progressWith)*100;
                    $(".jc-player .jc-player-music-projress .progress .playing").css('width',percent+"%");
                    $(".jc-player .jc-player-music-projress .progress .dot-panel").css('width',percent+"%");
                }
            });
            //鼠标松开点击
            $(document).on('mouseup',function(){
                if(tag){
                    var duration=$("#jc-player-audio")[0].duration;
                    var currentTime=(duration*percent)/100;
                    $("#jc-player-audio")[0].currentTime=parseFloat(currentTime);
                }
                percent=0;
                tag = false;
            });
        });
        //播放进度条点击
        $(".progress").unbind();
        $(".progress").click(function(e){
            if(!tag){
                var bgleft =$(this).offset().left;
                var progressWith= $(this).width();
                var left = e.pageX - bgleft;
                if(left < 0){
                    left = 0;
                }
                if(left > progressWith){
                    left = progressWith;
                }
                var  percent=progressWith==0?0:(left/progressWith)*100;
                $(".jc-player .jc-player-music-projress .progress .playing").css('width',percent+"%");
                $(".jc-player .jc-player-music-projress .progress .dot-panel").css('width',percent+"%");
                var duration=$("#jc-player-audio")[0].duration;
                var currentTime=(duration*percent)/100;
                $("#jc-player-audio")[0].currentTime=parseFloat(currentTime);
            }
        });
    }
    /**
     * 拖动设置音量
     */
    function drafMusicVolume(){
        $(".volume-large").unbind();
        $(".volume-large").on('click',function(e){
            var bgleft=$(this).offset().left;
            var volumeWith= $(this).width();
            var left = e.pageX - bgleft;
            if(left < 0){
                left = 0;
            }
            if(left > volumeWith){
                left = volumeWith;
            }
            var  percent=volumeWith==0?0:(left/volumeWith)*100;
            $(".volume-panel").css("width",percent+"%");
            $("#jc-player-audio")[0].volume=percent/100;
        })
    }
    /**
     * 改变播放类型
     */
    function changePlayType(jcPlayType){
        if(jcPlayType!=null&&jcPlayType!=undefined&&jcPlayType.match(/^R|C$/)){
            if(jcPlayType=='C'){
                $(".play-type").addClass('play-type-cycle');
            }else{
                $(".play-type").addClass('play-type-random');
            }
        }
        $(".play-type").on('click',function(){
            if($(".play-type").hasClass('play-type-cycle')){
                $(".play-type").removeClass('play-type-cycle').addClass('play-type-random');
            }else{
                $(".play-type").removeClass('play-type-random').addClass('play-type-cycle');
            }
        });
    }
    /**
     *播放结束后处理
     */
    function playOnEnded() {
        $("#jc-player-audio").unbind();
        $("#jc-player-audio").on("ended", function () {
            loadMusic(getRandomOrNextMusic());
            playMusic();
        });
    }
    /**
     * 播放下一曲
     */
    function nextMusic(){
        $(".jc-player-music-controls span:last-child").unbind();
        $(".jc-player-music-controls span:last-child").on("click",function(){
            var obj=getRandomOrNextMusic();
            if(obj==null){
                return ;
            }else{
                loadMusic(obj);
                var played=$("#jc-player-audio")[0].paused;
                if(played){
                    playMusic();
                    $(".jc-player  .jc-player-music-controls span:first-child").removeClass("play-bg-img").addClass("pause-bg-img");
                }else{
                    pauseMusic();
                    $(".jc-player  .jc-player-music-controls span:first-child").removeClass("pause-bg-img").addClass("play-bg-img");
                }
            }
        });
    }
    /**
     * 获取音乐项
     * @returns {*}
     */
    function getRandomOrNextMusic(){
        var total=parseInt(getMusicListCount());
        //返回随机
        if($(".play-type.play-type-cycle").length==0){
            var randomIndex=Math.floor(Math.random()*total+1);
            return getMusicItemByIndex(randomIndex);
        }else{
            var currentIndex=$("#jc-player-audio").attr('currentIndex');
            //返回顺序下一曲，如果是最后就结束
            if(currentIndex<total){
                return getMusicItemByIndex(parseInt(currentIndex)+1);
            }else{
                return getMusicItemByIndex(1);
            }
        }
    }
    /**
     * 过程歌曲id值获取信息
     * @param value：必填
     *
     */
    function getMusicItemById(value){
        if(window.sessionStorage!==undefined&&value!=null){
            var musicList=window.sessionStorage.getItem(jcplayerkey);
            var array=new Array();
            if(musicList!=null){
                array=JSON.parse(musicList);
                for(var i in array){
                    if(array[i].id==value){
                        var obj=new Object();
                        obj.data= array[i];
                        obj.index=(i+1);
                        return obj;
                    }
                }
            }
        }
        return null;
    }
    /**
     * 通过索引获取歌曲信息
     * @param index
     * @returns {*}
     */
    function getMusicItemByIndex(index){
        if(window.sessionStorage!==undefined&&index!=null){
            var musicList=window.sessionStorage.getItem(jcplayerkey);
            var array=new Array();
            if(musicList!=null){
                array=JSON.parse(musicList);
                if(array.length>index-1&&index>0){
                    var obj=new Object();
                    obj.data=array[index-1];
                    obj.index=(index);
                    return obj
                }
            }
        }
        return null;
    }
    /**
     * 获取音乐列表数量
     */
    function getMusicListCount(){
        if(window.sessionStorage!==undefined){
            var musicList=window.sessionStorage.getItem(jcplayerkey);
            var array=new Array();
            if(musicList!=null){
                array=JSON.parse(musicList);
                return array.length;
            }
        }
        return 0;
    }
    /**
     * 格式化时间
     * @param duration
     * @returns {string}
     */
    function formateTime(duration){
        var m=parseInt(duration/60);
        var s=parseInt(duration%60)>=10?parseInt(duration%60):"0"+parseInt(duration%60);
        return m+":"+s;
    }
    /**
     * 调整歌曲列表数量
     */
    function changeMusicListCount(){
        var num=getMusicListCount();
        $(".music-list-num").text(num);
    }
    /**
     * 播放音乐
     */
    function playMusic(){
        $(".jc-player .music-pic img").addClass("scroll");
        $("#jc-player-audio")[0].play().catch(function(error){
            $(".jc-player  .jc-player-music-controls span:first-child").removeClass("pause-bg-img").addClass("play-bg-img");
            $(".jc-player .music-pic img").removeClass("scroll");
            $(".jc-player .music-name").html("<span style='color:red;font-size: 10px'>播放错误</span>");
        });
    }
    /**
     * 暂停音乐
     */
    function pauseMusic(){
        $(".jc-player .music-pic img").removeClass("scroll");
        $("#jc-player-audio")[0].pause();
    }
    /**
     * 错误监听
     */
    function listnerError(){
        //图片错误默认加载
        $(".jc-player img").on("error",function(){
            $(this).attr("src", "../img/jc-player-default.png");
        })
    }
    /**
     * 滚动名字
     */
    function scrollMusicName(){
        var obj=$(".jc-player .jc-player-music-pic .music-name")[0];
        if(obj.offsetWidth>45){
            setInterval(function(){
                //最左边
                if(obj.scrollLeft<=obj.offsetWidth&&isLeft){
                    obj.scrollLeft++;
                }else{
                 //最右边返回
                    obj.scrollLeft--;
                    isLeft=false;
                }
                //在最左边设置滚动返回
                if(obj.scrollLeft<=0){
                    isLeft=true;
                }
            },250)
        }
    }
});
