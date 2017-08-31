/**
 * Created by Jancheng on 2017/8/15.
 */
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
    },{
        "id":"Jc02",
        "src":"demo-music02.mp3",
        "cover":"./demo-img02.jpg",
        "singer":"JC",
        "title":"Demo02",
        "name":"Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02Jc02"
    }]);
})

