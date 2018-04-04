#jc-music-player v1.0

jc-music-player 是一款基于Jquery+H5实现的音乐播放插件，支持CMD/AMD/CommonJs规范 ,运用gulp工具进行发布。
###gulp运行命令
``` bash
gulp default  
``` 
###API:
####initMusicPanel(obj)
初始化播放器面板，obj={id:dom-id}
####addMusicList(list)
添加音乐，list为音乐列表
list=[{
        "id":"Jc01",//音乐id
        "src":"demo-music.mp3",//音乐文件访问路径
        "cover":"./demo-img.png",//音乐封面
        "singer":"JC",//歌手
        "title":"Demo",//标题
        "name":"Jc01"//歌名用于滚动展示名字
    }]
####removeMusicListById(id)
通过音乐id,把音乐列表中的音乐移除，id=Jc01
####removeMusicListByIndex(index)
通过音乐id,把音乐列表中的音乐移除，index=0
####removeAllMusicList()
移除音乐列表中的所有音乐
####playMusicById(id)
播放指定id音乐,id=Jc01
####playMusicByIndex(index)
播放指定索引音乐,index=0

###使用方式
在header中引入
``` bash
 <link rel="stylesheet" href="your_path/css/jcplayer.css">
 <script src="your_path/js/vendor/jquery-3.2.1.min.js"></script>
 <script src="your_path/js/jcplayer.js"></script>
``` 
Jquery直接使用
``` bash
$(function(){
    Jcplayer.initMusicPanel({
        id:"#appedId",
    });
    Jcplayer.removeAllMusicList();
    Jcplayer.addMusicList([{
        "id":"Jc01",
        "src":"demo-music.mp3",
        "cover":"./demo-img.png",
        "singer":"JC",
        "title":"Demo",
        "name":"Jc01"
    }]);
})
``` 
