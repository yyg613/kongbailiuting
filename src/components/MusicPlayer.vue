<template>
  <div class="music-player" :class="{ 'music-player--expanded': isExpanded }">
    <!-- 进度条 -->
    <input class="music-player__seek" type="range" min="0" max="100" step="0.1" :value="progress" :disabled="!duration" aria-label="播放进度" :aria-valuetext="formatTime(currentTime) + ' / ' + formatTime(duration)" @input="seekTo(Number($event.target.value))">
    <p v-if="playbackError" class="music-player__error" role="status">{{ playbackError }}</p>

    <!-- 主控制区 -->
    <div class="music-player__main">
      <!-- 歌曲信息 -->
      <div class="music-player__info">
        <button class="music-player__cover" @click="toggleExpanded" aria-label="展开或收起播放列表" :aria-expanded="isExpanded">
          <span v-if="!currentTrack?.cover">🎵</span>
          <img v-else :src="currentTrack.cover" :alt="currentTrack.title">
        </button>
        <div class="music-player__meta" @click="toggleExpanded">
          <div class="music-player__title">{{ currentTrack?.title || '未选择音乐' }}</div>
          <div class="music-player__artist">{{ currentTrack?.artist || '点击添加音乐' }}</div>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="music-player__controls">
        <button class="music-player__btn" @click="prevTrack" aria-label="上一首" :disabled="!playlist.length">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        <button class="music-player__btn music-player__btn--play" @click="togglePlay" :disabled="!playlist.length" :aria-label="isPlaying ? '暂停' : '播放'">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <button class="music-player__btn" @click="nextTrack()" aria-label="下一首" :disabled="!playlist.length">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <!-- 右侧控制 -->
      <div class="music-player__right">
        <span class="music-player__time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        <button class="music-player__btn" @click="toggleMute" :aria-label="isMuted ? '取消静音' : '静音'">
          <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
        <div class="music-player__volume-wrap">
          <input
            type="range"
            class="music-player__volume"
            min="0"
            max="1"
            step="0.01"
            :value="isMuted ? 0 : volume"
            @input="handleVolumeChange"
            aria-label="音量"
          >
        </div>
        <button class="music-player__btn music-player__btn--list" @click="toggleExpanded" aria-label="播放列表" :aria-expanded="isExpanded" aria-controls="music-playlist">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 播放列表面板 -->
    <div v-if="isExpanded" id="music-playlist" class="music-player__playlist">
      <div class="music-player__playlist-header">
        <h3>播放列表</h3>
        <label class="music-player__add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          添加音乐
          <input type="file" accept="audio/*" @change="handleFileAdd" class="music-player__file-input">
        </label>
      </div>
      <ul class="music-player__list">
        <li
          v-for="(track, index) in playlist"
          :key="track.id"
          class="music-player__item"
          :class="{ 'music-player__item--active': index === currentTrackIndex }"
        >
          <span class="music-player__item-index">{{ index + 1 }}</span>
          <button class="music-player__item-title" @click="playTrack(index)" :aria-label="'播放 ' + track.title">{{ track.title }}</button>
          <span class="music-player__item-artist">{{ track.artist }}</span>
          <button class="music-player__item-remove" @click.stop="removeTrack(track.id)" :aria-label="'移除 ' + track.title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useMusic } from '../composables/useMusic.js'

const {
  playlist,
  playbackError,
  isPlaying,
  currentTrack,
  currentTrackIndex,
  currentTime,
  duration,
  volume,
  isMuted,
  isExpanded,
  progress,
  formatTime,
  togglePlay,
  play,
  nextTrack,
  prevTrack,
  seekTo,
  setVolume,
  toggleMute,
  toggleExpanded,
  addTrackFromFile,
  removeTrack,
  loadTrack
} = useMusic()

function handleVolumeChange(e) {
  setVolume(parseFloat(e.target.value))
}

function playTrack(index) {
  loadTrack(index)
  play()
}

function handleFileAdd(e) {
  const file = e.target.files[0]
  if (file) {
    addTrackFromFile(file)
  }
  // 重置 input
  e.target.value = ''
}
</script>

<style scoped>
.music-player {
  position: fixed;
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 95;
  background: var(--color-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 4px 30px var(--color-shadow);
  transition: all var(--transition-normal);
}

.music-player--expanded {
  max-height: 70vh;
}

.music-player__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px calc(10px + env(safe-area-inset-bottom, 0px));
  max-width: 1200px;
  margin: auto;
  gap: 20px;
}

.music-player__info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.music-player__cover {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-sage-light), var(--color-teal-light));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
}

.music-player__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-player__meta {
  min-width: 0;
}

.music-player__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-player__artist {
  font-size: 12px;
  color: var(--color-ink-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-player__controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.music-player__btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.music-player__btn:hover {
  background: var(--color-border);
  color: var(--color-sage);
}

.music-player__btn--play {
  width: 44px;
  height: 44px;
  background: var(--color-sage);
  color: var(--color-bg);
}

.music-player__btn--play:hover {
  background: var(--color-sage-dark);
  color: var(--color-bg);
  transform: scale(1.05);
}

.music-player__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.music-player__time {
  font-size: 12px;
  color: var(--color-ink-light);
  font-variant-numeric: tabular-nums;
}

.music-player__volume-wrap {
  width: 80px;
}

.music-player__volume {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border);
  border-radius: 2px;

}

.music-player__volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--color-sage);
  border-radius: 50%;
  cursor: pointer;
}

.music-player__volume::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--color-sage);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.music-player__playlist {
  position: absolute;
  bottom: 100%;
  right: 20px;
  width: min(480px, calc(100vw - 40px));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px 12px 0 0;
  border-top: 1px solid var(--color-border);
  max-height: 300px;
  overflow-y: auto;
}

.music-player__playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.music-player__playlist-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
}

.music-player__add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-sage);
  color: var(--color-bg);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.music-player__add-btn:hover {
  background: var(--color-sage-dark);
}

.music-player__file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.music-player__add-btn:focus-within { outline: 3px solid var(--color-primary); outline-offset: 3px; }
.music-player__seek { display: block; width: 100%; height: 6px; margin: -3px 0 0; appearance: none; background: var(--color-border); accent-color: var(--color-primary); cursor: pointer; }
.music-player__seek::-webkit-slider-thumb { appearance: none; width: 10px; height: 10px; border-radius: 50%; background: var(--color-primary); }
.music-player__seek::-moz-range-thumb { width: 10px; height: 10px; border: 0; border-radius: 50%; background: var(--color-primary); }
.music-player__seek:disabled { opacity: .5; }
.music-player__error { font-size: 12px; padding: 4px 24px; color: var(--color-primary); }

.music-player__list {
  list-style: none;
  padding: 8px 0;
}

.music-player__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.music-player__item:hover {
  background: var(--color-border);
}

.music-player__item--active {
  background: rgba(107, 143, 92, 0.1);
}

.music-player__item-index {
  font-size: 12px;
  color: var(--color-ink-light);
  width: 24px;
  text-align: center;
}

.music-player__item--active .music-player__item-index {
  color: var(--color-sage);
}

.music-player__item-title {
  text-align: left;
  flex: 1;
  font-size: 13px;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-player__item--active .music-player__item-title {
  color: var(--color-sage);
  font-weight: 600;
}

.music-player__item-artist {
  font-size: 12px;
  color: var(--color-ink-light);
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-player__item-remove {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-light);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: all var(--transition-fast);
}

.music-player__item:hover .music-player__item-remove {
  opacity: 1;
}

.music-player__item-remove:hover {
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
}

/* 响应式 */
@media (max-width: 768px) {
  .music-player__main { gap: 8px; padding-left: 12px; padding-right: 12px; }
  .music-player__controls { gap: 0; }
  .music-player__info { gap: 8px; }
  .music-player__right > .music-player__btn:not(.music-player__btn--list) { display: none; }
  .music-player__cover { width: 34px; height: 34px; padding: 0; }
  .music-player__right {
    gap: 8px;
  }

  .music-player__time {
    display: none;
  }

  .music-player__volume-wrap {
    display: none;
  }

  .music-player__btn--list {
    display: flex;
  }
}
</style>
