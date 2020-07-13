/**
 * Created by yanglu on 20-07-03
 * flatted.js将dealCryp处理过function的js对象转成字符串
 */
$(function () {
  //给页面增加一个固定定位的按钮
  let fixedStr='<div style="position: fixed;bottom:50px;right:60px;height:50px;z-index:10000;" class="fixedButton">' +
  '<input type="text" id="playListId" placeholder="输入歌单id" /><button id="getListInfo" style="width:80px;height:25px;font-size:10px;">获取</button></div>'
  $('body').append(fixedStr)
  // 分析请求必须的js
  // 点击获取按钮
  $('#getListInfo').click(function () {
    let id = $('#playListId').val()
    eve.emit('encryptStart', id)
  })

  // 接口请求分析
  // detail接口: {"id":"5101959860","offset":"0","total":"true","limit":"1000","n":"1000","csrf_token":"abbd0ab5e81a88e5a04c331e54817710"}
  // 下载歌曲
  function downMusic (arr) {
    if (arr.length > 0) {
      arr.forEach(item => {
        let defaultUrl = 'http://music.163.com/song/media/outer/url?id='
        // let idAndExtension = calCurrentBestQuality(item)
        let href = defaultUrl + item.id
        // 歌单详情:https://music.163.com/api/playlist/detail?id=2557908184 才20项
        let name = item.name + '.mp3'
        // 由于同源策略，浏览器默认会预览文件，而不是下载，改用blob
        axios({
          method:'get',
          url: href,
          responseType: 'blob'
        }).then(function(res) {
          let aa = document.createElement('a')
          let aHref = URL.createObjectURL(new Blob([res.data]))
          aa.setAttribute('href', aHref)
          aa.setAttribute('download', name)
          aa.click()
        })
      })
    }
  }
  // 计算出当前的最佳音质
  function calCurrentBestQuality (obj) {
    if (obj.hasOwnProperty('hMusic')) {
      return [obj.hMusic.id, obj.hMusic.extension]
    } else if (obj.hasOwnProperty('mMusic')) {
      return [obj.mMusic.id, obj.mMusic.extension]
    } else {
      return [obj.lMusic.id, obj.lMusic.extension]
    }
  }
  // 给页面创建一个脚本,用于获取全局的window对象
  function getGlobalWindow () {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = 'function deepCopy (obj) {const target = {};if ((!obj && typeof obj != "undefined" && obj != 0) || typeof obj !== "object") {return obj};for (const key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {if (typeof obj[key] === "object") {target[key] = this.deepCopy(obj[key])} else {target[key] = obj[key]}}};return target};function getWindow() { console.log(window) };getWindow();'
    document.body.appendChild(script)
  }
  // 初始化，获取全局的window对象
  // getGlobalWindow()
  // 全局监听加密完成事件
  eve.on('encryptFinished', readyToQuest)
  function readyToQuest (data) {
    let url = 'https://music.163.com/weapi/v6/playlist/detail?csrf_token='
    url += window.crsfToken
    let query = {
      params: data.encText,
      encSecKey: data.encSecKey
    }
    let newQuery = Qs.stringify(query)
    axios.post(url, newQuery)
    .then(function (res) {
      let tracks = res.data.playlist.tracks
      downMusic(tracks)
    })
    .catch(function (err) {
      console.log(err)
    })
  }
})