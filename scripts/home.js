let $olSongs = $('ol#songs')
let $hotSearch = $('.hot-search .list')
// 查询保存的数据
var query = new AV.Query('Song')
query.find().then(function (results) {
    $('#songs-loading').remove()
    for(var i=0;i<results.length;i++){
        let song = results[i].attributes
        let id = results[i].id
        let li = `
                <li data-id=${id}>
                    <h3>${song.name}</h3>
                    <p>
                        <svg class="icon icon-sq" aria-hidden="true">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${song.singer} - ${song.name}
                    </p>
                    
                    <a href="./song.html?id=${id}" class="playButton">
                        <svg class="icon icon-play" aria-hidden="true">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </a>
                </li>                
        `
        $olSongs.append(li)

        let hotLi = `<li data-id=${id}><a href="javascript:void(0);">${song.name}</a></li>`                
        $hotSearch.append(hotLi)
        
    }
}, function (error) {
    console.log('获取数据失败')
});

$olSongs.on('click','li',function(e){
    let $targetLi = $(e.currentTarget)
    let id = $targetLi.attr('data-id')
    window.location.href = `./song.html?id=${id}`
})

// 点击搜索词
$('.hot-search .list').on('click','li',function(e){
    let $targetLi = $(e.currentTarget)
    let id = $targetLi.attr('data-id')
    window.location.href = `./song.html?id=${id}`
})

// tab
$('.tabs').on('click','li',function(e){
    let $li = $(e.currentTarget)
    let index = $li.index()
    $li.addClass('active').siblings().removeClass('active')
    $('.tab-content').children().eq(index)
        .addClass('active').siblings().removeClass('active')
})

let timer = null
// 搜索数据
$('#search').on('input',function(e){
    // 函数节流,减少发送请求
    if(timer){
        clearTimeout(timer)
    }
    timer = setTimeout(function() {
        timer = null
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if(value === ''){
            $('#searchResult').empty()
            return;
        }
        var queryName = new AV.Query('Song')
        queryName.contains('name', value);
        var querySinger = new AV.Query('Song')
        querySinger.contains('singer', value);
        // 组合查询
        var query = AV.Query.or(queryName,querySinger);
        query.find().then(function (results) {
            console.log(results)
            $('#searchResult').empty()
            if(results.length === 0){
                $('#searchResult').html('没有结果')
            }else{
                for(var i=0;i<results.length;i++){
                    let song = results[i].attributes
                    let id = results[i].id
                    // let li = `
                    //     <li data-id=${id}><a href="./song.html?id=${id}">${song.name}-${song.singer}</a></li>
                    // `
                    let li = `
                        <li data-id=${id} class="search-item">
                            <svg class="icon search" aria-hidden="true">
                                <use xlink:href="#icon-search"></use>
                            </svg>
                            <a href="./song.html?id=${id}">${song.name}</a>
                        </li>
                    `
                    $('#searchResult').append(li)
                }
            }              
        });
    }, 400);           
})


// 保存数据
// var SongObject = AV.Object.extend('Song');//选择表名
// var songObject = new SongObject();//生成一条数据
// songObject.save({//数据里面的内容
//     singer:'李志',
//     name:'天空之城',
//     url:'http://ox5h6qw45.bkt.clouddn.com/2e98%252F398c%252F79c9%252Fee4e22dbaeaba3ac656cc19da7c73bb6.mp3'
// }).then(function(object) {
//     alert('LeanCloud Rocks!');
// })

// 批量保存,感觉还是麻烦
// var SongObject = AV.Object.extend('Song')
// var songObject = new SongObject()
// songObject.set('name','1')
// var songObject1 = new SongObject()
// songObject1.set('name','2')
// let songs = [songObject,songObject1]
// AV.Object.saveAll(songs)