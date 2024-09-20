const audioPlayer = document.getElementById("audioPlayer");
const lyricsDiv = document.getElementById("lyrics");
let lyricsData = [];
let currentLyricIndex = 0;
// 定义音乐数组，存储本地音乐文件的名称
let availableMusic = [
  "01 青春コンプレックス.flac",
  "02 ひとりぼっち東京.flac",
  "03 Distortion!!.flac",
  "04 ひみつ基地.flac",
  "05 ギターと孤独と蒼い惑星.flac",
  "06 ラブソングが歌えない.flac",
  "07 あのバンド.flac",
  "08 カラカラ.flac",
  "09 小さな海.flac",
  "10 なにが悪い.flac",
  "11 忘れてやらない.flac",
  "12 星座になれたら.flac",
  "13 フラッシュバッカー.flac",
  "14 転がる岩君に朝が降る (V0).mp3",
]; // 示例音乐文件

let playlist = [];
let currentIndex = -1; // 当前播放的音乐索引

// 加载可用音乐列表到侧边栏
function loadAvailableMusic(musicArray) {
  const musicList = document.getElementById("musicList");
  musicList.innerHTML = ""; // 清空现有列表
  musicArray.forEach((music) => {
    const listItem = document.createElement("li");
    listItem.textContent = music;
    listItem.onclick = () => addToPlaylist(music);
    musicList.appendChild(listItem);
  });
}

// 搜索功能
function searchMusic() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filteredMusic = availableMusic.filter((music) =>
    music.toLowerCase().includes(searchInput)
  );
  loadAvailableMusic(filteredMusic);
}

// 添加音乐到播放列表
function addToPlaylist(music) {
  if (!playlist.includes(music)) {
    playlist.push(music);
    updatePlaylist();
  } else {
    alert("该音乐已在播放列表中");
  }
}

// 更新播放列表界面
function updatePlaylist() {
  const playlistElement = document.getElementById("playlist");
  playlistElement.innerHTML = ""; // 清空现有播放列表

  playlist.forEach((music, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = music;

    const playButton = document.createElement("button");
    playButton.textContent = "播放";
    playButton.onclick = () => playMusic(index);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";
    deleteButton.onclick = () => removeFromPlaylist(index);

    listItem.appendChild(playButton);
    listItem.appendChild(deleteButton);

    playlistElement.appendChild(listItem);
  });
}

// 从播放列表中删除音乐
function removeFromPlaylist(index) {
  playlist.splice(index, 1);
  updatePlaylist();
}

// 播放选中的音乐
function playMusic(index) {
  currentIndex = index;
  const audioPlayer = document.getElementById("audioPlayer");
  const audioSource = document.getElementById("audioSource");
  audioSource.src = "music/" + playlist[currentIndex]; // 更新音乐来源
  loadLyrics(playlist[currentIndex]);

  audioPlayer.load(); // 重新加载音频文件
  audioPlayer.play(); // 播放音乐
}

// 下一首音乐（按顺序播放）
function playNext() {
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    playMusic(currentIndex);
  } else {
    alert("已经是最后一首音乐了");
  }
}

// 添加新音乐到本地音乐列表
function addSong() {
  const songName = document.getElementById("songName").value.trim();
  if (songName && !availableMusic.includes(songName + ".flac")) {
    availableMusic.push(songName + ".flac");
    loadAvailableMusic(availableMusic); // 更新可用音乐列表
    document.getElementById("songName").value = ""; // 清空输入框
  } else {
    alert("该音乐已存在或名称无效");
  }
}

// 页面加载时初始化
window.onload = () => {
  // 检查用户是否已登录
  const loggedIn = localStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "login.html";
    return; // 停止后续代码执行
  }
  loadAvailableMusic(availableMusic); // 加载可用音乐列表
  updatePlaylist(); // 更新播放列表

  // 自动播放下一首音乐
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.onended = playNext; // 当当前音乐播放结束时，自动播放下一首
};

// 侧边栏切换功能
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggleButton = document.getElementById("sidebarToggle");

  // 侧边栏切换功能
  sidebarToggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
  });
});
// 加载 .lrc 歌词文件
function loadLyrics(lrcFileName) {
  var reg1 = new RegExp(".flac", "g");
  var a1 = lrcFileName.replace(reg1, "");
  fetch("../music/lrc/" + a1 + ".lrc")
    .then((response) => response.text())
    .then((data) => {
      parseLyrics(data);
      currentLyricIndex = 0; // 重置歌词索引
    })
    .catch((error) => {
      console.log(`无法加载歌词文件: ${lrcFileName}`, error);
    });
}

// 解析 .lrc 歌词
function parseLyrics(lrcText) {
  lyricsData = [];
  const lines = lrcText.split("\n");
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{3})]/; // 匹配时间戳 [mm:ss.xxx]

  lines.forEach((line) => {
    const match = timeReg.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeReg, "").trim(); // 去掉时间戳的歌词
      if (text) {
        lyricsData.push({ time, text });
      }
    }
  });
  const dom = document.querySelector("#gcdom");
  let domText = `
  <div id="lyricsBody">
  `;
  lyricsData.forEach((item) => {
    domText += `<p>${item.text}<p/>`;
  });
  domText += `</div>`;
  domText += `<a href="javascript:void(0);" id="toggleLyrics" onclick="toggleLyrics()">展开</a>`;
  dom.innerHTML = domText;
}
// 用于控制歌词显示和隐藏的函数
function toggleLyrics() {
  const lyricsBody = document.getElementById(`lyricsBody`);
  const toggleLink = document.getElementById(`toggleLyrics`);

  // 确保 lyricsBody 不为 null
  if (lyricsBody) {
    if (lyricsBody.classList.contains("open")) {
      lyricsBody.classList.remove("open");
      toggleLink.textContent = "展开";
    } else {
      lyricsBody.classList.add("open");
      toggleLink.textContent = "收起";
    }

    // 更新当前歌词显示
    // displayLyric();
  } else {
    console.error(`歌词部分 ID: lyricsBody 不存在`);
  }
}
