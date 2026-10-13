import { ref, computed, onUnmounted } from 'vue'

const playlist = ref([{ id: 1, title: '一样的月光', artist: '徐佳莹', src: import.meta.env.BASE_URL + 'music/徐佳莹 - 一样的月光.mp3', cover: import.meta.env.BASE_URL + 'images/徐佳莹.png' }])
const isPlaying = ref(false)
const currentTrackIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const isExpanded = ref(false)
const playbackError = ref('')
let audio = null
let playRequest = 0
const objectUrls = new Set()

export function useMusic() {
  const currentTrack = computed(() => playlist.value[currentTrackIndex.value] || null)
  const progress = computed(() => duration.value > 0 ? Math.min(100, currentTime.value / duration.value * 100) : 0)
  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
  }
  function initAudio() {
    if (audio) return
    audio = new Audio()
    audio.preload = 'none'
    audio.volume = volume.value
    audio.muted = isMuted.value
    audio.ontimeupdate = () => { currentTime.value = audio.currentTime }
    audio.onloadedmetadata = () => { duration.value = Number.isFinite(audio.duration) ? audio.duration : 0 }
    audio.onplay = () => { isPlaying.value = true }
    audio.onpause = () => { isPlaying.value = false }
    audio.onended = () => { nextTrack(true) }
    audio.onerror = () => { isPlaying.value = false; playbackError.value = '音乐暂时无法播放，请重试或添加本地音乐。' }
  }
  function loadTrack(index) {
    if (index < 0 || index >= playlist.value.length) return false
    initAudio()
    playRequest++
    audio.pause()
    currentTrackIndex.value = index
    currentTime.value = 0
    duration.value = 0
    playbackError.value = ''
    audio.src = playlist.value[index].src
    audio.load()
    return true
  }
  async function play() {
    if (!currentTrack.value) return
    initAudio()
    if (!audio.getAttribute('src')) loadTrack(currentTrackIndex.value)
    const request = ++playRequest
    playbackError.value = ''
    try { await audio.play() } catch (error) {
      if (request === playRequest && error.name !== 'AbortError') {
        isPlaying.value = false
        playbackError.value = '播放失败，请点击播放重试，或选择其他音乐。'
      }
    }
  }
  function pause() { playRequest++; audio?.pause() }
  function togglePlay() { isPlaying.value ? pause() : play() }
  function nextTrack(forcePlay = false) {
    if (!playlist.value.length) return
    const resume = forcePlay || isPlaying.value
    loadTrack((currentTrackIndex.value + 1) % playlist.value.length)
    if (resume) play()
  }
  function prevTrack() {
    if (!playlist.value.length) return
    const resume = isPlaying.value
    loadTrack((currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length)
    if (resume) play()
  }
  function seekTo(percent) {
    if (audio && duration.value > 0 && Number.isFinite(percent)) audio.currentTime = Math.max(0, Math.min(100, percent)) / 100 * duration.value
  }
  function setVolume(value) {
    if (!Number.isFinite(value)) return
    volume.value = Math.max(0, Math.min(1, value))
    if (volume.value > 0) isMuted.value = false
    if (audio) { audio.volume = volume.value; audio.muted = isMuted.value }
  }
  function toggleMute() { isMuted.value = !isMuted.value; if (audio) audio.muted = isMuted.value }
  function toggleExpanded() { isExpanded.value = !isExpanded.value }
  function addTrack(track) { playlist.value.push({ id: crypto.randomUUID(), ...track }) }
  function addTrackFromFile(file) {
    const url = URL.createObjectURL(file)
    objectUrls.add(url)
    const track = { id: crypto.randomUUID(), title: file.name.replace(/\.[^/.]+$/, ''), artist: '本地音乐', src: url, cover: null }
    addTrack(track)
    return track
  }
  function removeTrack(id) {
    const index = playlist.value.findIndex(track => track.id === id)
    if (index === -1) return
    const removed = playlist.value[index]
    const isCurrent = index === currentTrackIndex.value
    if (isCurrent) pause()
    playlist.value.splice(index, 1)
    if (isCurrent) {
      if (playlist.value.length) loadTrack(Math.min(index, playlist.value.length - 1))
      else {
        currentTrackIndex.value = 0
        currentTime.value = 0
        duration.value = 0
        playbackError.value = ''
        audio?.removeAttribute('src')
        audio?.load()
      }
    } else if (index < currentTrackIndex.value) currentTrackIndex.value--
    if (objectUrls.delete(removed.src)) URL.revokeObjectURL(removed.src)
  }
  function cleanup() {
    pause()
    if (audio) {
      audio.ontimeupdate = audio.onloadedmetadata = audio.onplay = audio.onpause = audio.onended = audio.onerror = null
      audio.removeAttribute('src')
      audio.load()
      audio = null
    }
    for (const url of objectUrls) URL.revokeObjectURL(url)
    playlist.value = playlist.value.filter(track => !objectUrls.has(track.src))
    objectUrls.clear()
    currentTrackIndex.value = 0
    isPlaying.value = false
    currentTime.value = duration.value = 0
  }
  onUnmounted(cleanup)
  return { playlist, isPlaying, currentTrack, currentTrackIndex, currentTime, duration, volume, isMuted, isExpanded, playbackError, progress, formatTime, play, pause, togglePlay, nextTrack, prevTrack, seekTo, setVolume, toggleMute, toggleExpanded, addTrack, addTrackFromFile, removeTrack, loadTrack, cleanup }
}
