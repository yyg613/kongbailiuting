import { ref, computed, onUnmounted } from 'vue'

// 音乐播放列表 - 请将音乐文件放入 public/music/ 目录
const playlist = ref([
  // 示例配置，取消注释并修改为你自己的音乐
  // {
  //   id: 1,
  //   title: '你的歌曲名',
  //   artist: '艺术家',
  //   src: '/music/your-song.mp3',
  //   cover: '/music/cover.jpg'  // 可选封面图
  // },
  {
  id: 1,
  title: '一样的月光',
  artist: '徐佳莹',
  src: import.meta.env.BASE_URL + 'music/徐佳莹 - 一样的月光.mp3',
  cover: import.meta.env.BASE_URL + 'images/徐佳莹.png'  // 可选封面图
},
  
])

// 播放状态
const isPlaying = ref(false)
const currentTrackIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const isExpanded = ref(false)

// Audio 实例
let audio = null

export function useMusic() {
  // 当前播放曲目
  const currentTrack = computed(() => playlist.value[currentTrackIndex.value] || null)

  // 进度百分比
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // 格式化时间
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 初始化音频
  function initAudio() {
    if (audio) return

    audio = new Audio()
    audio.volume = volume.value
    audio.preload = 'metadata'

    // 事件监听
    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime
    })

    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration
    })

    audio.addEventListener('ended', () => {
      nextTrack()
    })

    audio.addEventListener('play', () => {
      isPlaying.value = true
    })

    audio.addEventListener('pause', () => {
      isPlaying.value = false
    })

    audio.addEventListener('error', (e) => {
      console.error('音频加载错误:', e)
      isPlaying.value = false
    })
  }

  // 加载曲目
  function loadTrack(index) {
    if (!audio) initAudio()
    if (index < 0 || index >= playlist.value.length) return

    currentTrackIndex.value = index
    const track = playlist.value[index]
    audio.src = track.src
    audio.load()
  }

  // 播放
  async function play() {
    if (!audio) initAudio()

    // 如果没有加载曲目，加载第一首
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(0)
    }

    try {
      await audio.play()
    } catch (e) {
      console.error('播放失败:', e)
    }
  }

  // 暂停
  function pause() {
    if (audio) {
      audio.pause()
    }
  }

  // 切换播放/暂停
  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  // 下一首
  function nextTrack() {
    const nextIndex = (currentTrackIndex.value + 1) % playlist.value.length
    loadTrack(nextIndex)
    if (isPlaying.value) {
      play()
    }
  }

  // 上一首
  function prevTrack() {
    const prevIndex = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length
    loadTrack(prevIndex)
    if (isPlaying.value) {
      play()
    }
  }

  // 跳转到指定时间
  function seekTo(percent) {
    if (audio && duration.value > 0) {
      audio.currentTime = (percent / 100) * duration.value
    }
  }

  // 设置音量
  function setVolume(val) {
    volume.value = Math.max(0, Math.min(1, val))
    if (audio) {
      audio.volume = volume.value
    }
    if (volume.value > 0) {
      isMuted.value = false
    }
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (audio) {
      audio.muted = isMuted.value
    }
  }

  // 切换展开/收起
  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }

  // 添加音乐到播放列表
  function addTrack(track) {
    playlist.value.push({
      id: Date.now(),
      ...track
    })
  }

  // 从文件添加音乐
  function addTrackFromFile(file) {
    const url = URL.createObjectURL(file)
    const track = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ''), // 移除扩展名
      artist: '本地音乐',
      src: url,
      cover: null
    }
    addTrack(track)
    return track
  }

  // 移除音乐
  function removeTrack(trackId) {
    const index = playlist.value.findIndex(t => t.id === trackId)
    if (index === -1) return

    // 如果删除的是当前播放的曲目
    if (index === currentTrackIndex.value) {
      pause()
      playlist.value.splice(index, 1)
      if (playlist.value.length > 0) {
        const newIndex = Math.min(index, playlist.value.length - 1)
        loadTrack(newIndex)
      }
    } else {
      playlist.value.splice(index, 1)
      // 调整当前播放索引
      if (index < currentTrackIndex.value) {
        currentTrackIndex.value--
      }
    }
  }

  // 清理
  function cleanup() {
    if (audio) {
      audio.pause()
      audio.src = ''
      audio = null
    }
  }

  // 组件卸载时清理（可选，因为是全局状态）
  onUnmounted(() => {
    // 不清理，因为是全局共享状态
  })

  return {
    // 状态
    playlist,
    isPlaying,
    currentTrack,
    currentTrackIndex,
    currentTime,
    duration,
    volume,
    isMuted,
    isExpanded,
    progress,

    // 方法
    formatTime,
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleExpanded,
    addTrack,
    addTrackFromFile,
    removeTrack,
    loadTrack,
    cleanup
  }
}
