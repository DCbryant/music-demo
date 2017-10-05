// 暂停/播放
$('div.play').click(function(){
    if(audio.paused){
        $(this).find('svg.play').hide()
        $(this).find('svg.pause').show()
        $('.circle.playing').removeClass('pause')
        audio.play()
    }else{
        $(this).find('svg.pause').hide()
        $(this).find('svg.play').show()
        $('.circle.playing').addClass('pause')
        audio.pause()
    }
})

// 获取url的id
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
      
let id = getParameterByName('id')       
let query = new AV.Query('Song');
let audio = document.createElement('audio')

query.get(id).then(function (song) {         
    let {url,lyric,name,singer,cover} = song.attributes
    let array = []
    let parts = lyric.split('\n')
    parts.forEach(function(string,index) {
        let lyricpart = string.split(']')
        lyricpart[0] = lyricpart[0].substring(1)
        let reg = /(\d+):([\d.]+)/
        let matches = lyricpart[0].match(reg)
        let min = +matches[1]
        let sec = +matches[2]
        array.push({
            time:min*60+sec,
            lyric:lyricpart[1],
            name:name,
            singer:singer
        })

        // 设置封面
        $('.page').css('background',`url(${cover})`)
        $('.circle .cover').attr('src',cover)
        
    }, this);
    let $lyric = $('.lyric')
    array.map(function(ele){
        let $songTitle = $('.songTitle')
        $songTitle.text(ele.name)
        let $singer = $('<span class="singer"></span>')
        $singer.text(' - ' + ele.singer)
        let $p = $('<p/>')
        $singer.appendTo($songTitle)
        $p.attr('data-time',ele.time).text(ele.lyric)
        $p.appendTo($lyric.children('.lines'))
    })
    
    //渲染歌词           
    setInterval(() => {
        let seconds = audio.currentTime //数字
        let $lines = $('.lines > p') //字符串
        let $whichLine
        for(let i=0;i<$lines.length;i++){
            if($lines.eq(i+1).length > 0  && +$lines.eq(i).attr('data-time')<seconds && +$lines.eq(i+1).attr('data-time')>seconds){
                $whichLine = $lines.eq(i)
                break;
            }
        }
        if($whichLine){
            $whichLine.addClass('active').prev().removeClass('active')
            let top = $whichLine.offset().top
            let linesTop = $('.lines').offset().top
            let delta = top - linesTop - $('.lyric').height() / 3
            // console.log(top,linesTop,$('.lyric').height() / 3)
            $('.lines').css('transform',`translateY(-${delta}px)`)                 
        }
    },500)           
    audio.src = url
    audio.play()            
})