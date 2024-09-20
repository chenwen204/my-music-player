// 定义音乐数组，存储本地音乐文件的名称
let availableMusic = ['01 青春コンプレックス.flac', '02 ひとりぼっち東京.flac', '03 Distortion!!.flac',
  '04 ひみつ基地.flac', '05 ギターと孤独と蒼い惑星.flac', '06 ラブソングが歌えない.flac',
  '07 あのバンド.flac', '08 カラカラ.flac', '09 小さな海.flac', '10 なにが悪い.flac',
  '11 忘れてやらない.flac', '12 星座になれたら.flac', '13 フラッシュバッカー.flac',
  '14 転がる岩君に朝が降る (V0).mp3']; // 示例音乐文件

let playlist = [];
let currentIndex = -1; // 当前播放的音乐索引

// 加载可用音乐列表到侧边栏
function loadAvailableMusic(musicArray) {
  const musicList = document.getElementById('musicList');
  musicList.innerHTML = ''; // 清空现有列表
  musicArray.forEach(music => {
    const listItem = document.createElement('li');
    listItem.textContent = music;
    listItem.onclick = () => addToPlaylist(music);
    musicList.appendChild(listItem);
  });
}

// 搜索功能
function searchMusic() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredMusic = availableMusic.filter(music => music.toLowerCase().includes(searchInput));
  loadAvailableMusic(filteredMusic);
}

// 添加音乐到播放列表
function addToPlaylist(music) {
  if (!playlist.includes(music)) {
    playlist.push(music);
    updatePlaylist();
  } else {
    alert('该音乐已在播放列表中');
  }
}

// 更新播放列表界面
function updatePlaylist() {
  const playlistElement = document.getElementById('playlist');
  playlistElement.innerHTML = ''; // 清空现有播放列表

  playlist.forEach((music, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = music;

    const playButton = document.createElement('button');
    playButton.textContent = '播放';
    playButton.onclick = () => playMusic(index);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
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
  const audioPlayer = document.getElementById('audioPlayer');
  const audioSource = document.getElementById('audioSource');
  const currentMusic = playlist[currentIndex];

  // 根据文件扩展名确定 MIME 类型
  const extension = currentMusic.split('.').pop().toLowerCase();
  let mimeType = '';

  switch (extension) {
    case 'mp3':
      mimeType = 'audio/mpeg';
      break;
    case 'flac':
      mimeType = 'audio/flac';
      break;
    case 'wav':
      mimeType = 'audio/wav';
      break;
    case 'ogg':
      mimeType = 'audio/ogg';
      break;
    case 'aac':
      mimeType = 'audio/aac';
      break;
    default:
      alert('不支持的音频格式：' + extension);
      return;
  }

  // 更新音频源并播放
  audioSource.src = 'music/' + currentMusic; // 假设音乐文件在 'music/' 目录下
  audioSource.type = mimeType; // 设置正确的 MIME 类型
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
  const songName = document.getElementById('songName').value.trim();
  if (songName && !availableMusic.includes(songName)) {
    availableMusic.push(songName); // 不限制扩展名
    loadAvailableMusic(availableMusic); // 更新可用音乐列表
    document.getElementById('songName').value = ''; // 清空输入框
  } else {
    alert('该音乐已存在或名称无效');
  }
}

// 页面加载时初始化
window.onload = () => {
  loadAvailableMusic(availableMusic); // 加载可用音乐列表
  updatePlaylist(); // 更新播放列表

  // 自动播放下一首音乐
  const audioPlayer = document.getElementById('audioPlayer');
  audioPlayer.onended = playNext; // 当当前音乐播放结束时，自动播放下一首
};

