# 背景音乐目录

在此目录放置 MP3 格式的音乐文件，然后在 `src/composables/useMusic.js` 中的 `playlist` 数组添加对应的音乐信息。

## 添加音乐步骤

1. 将 MP3 文件放入此目录
2. 编辑 `src/composables/useMusic.js`
3. 在 `playlist` 数组中添加音乐信息：

```javascript
{
  id: 3,  // 唯一ID
  title: '歌曲名称',
  artist: '艺术家',
  src: '/music/your-song.mp3',  // 文件路径
  cover: null  // 可选：封面图片路径
}
```

## 支持的格式

- MP3（推荐，兼容性最好）
- WAV
- OGG
- AAC

## 注意事项

- 音乐文件会被打包到构建输出中
- 建议控制文件大小，避免影响加载速度
- 用户也可以通过播放器界面添加本地音乐文件
