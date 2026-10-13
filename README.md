# 空白流汀

Vue 3 + Vite 构建的个人静态博客，以低饱和粉色、纸张质感与清晰排版记录生活与灵感。支持浅色和深色模式，默认跟随系统，手动选择会保存在本机。

## 开发与部署

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

开发地址：`http://localhost:5173/kongbailiuting/`。生产产物位于 `dist/`，GitHub Actions 自动部署 `main` 分支到 GitHub Pages。`vite.config.js` 中的 `base` 为 `/kongbailiuting/`；部署到其他目录时相应修改。使用 Hash 路由，无需服务器配置路由回退。

## 内容维护

- `src/data/moments.json`：动态。`id` 必须唯一，`date` 使用 `YYYY-MM-DD`。页面自动按时间倒序排列；动态页支持文字、地点、日期搜索和月份筛选，每次展示 6 条。
- `src/data/gallery.json`：作品与画面收藏。包含标题、描述与图片地址，原作者署名请保留在标题或描述中。
- `src/data/guestbook.json`：静态精选留言。在线留言由 Utterances 提供，仓库配置位于 `GuestbookComments.vue`。
- `src/data/contact.js`：收件邮箱和邮件主题。“关于我”和页脚的“给我发邮件”入口使用 `mailto:` 打开访客默认邮件应用，并自动填写收件人和主题。
- `public/images/avatar.jpg`：个人头像。
- `src/composables/useMusic.js`：默认播放列表，音乐与封面资源放在 `public/` 下，使用 `import.meta.env.BASE_URL` 拼接路径。
- `src/views/HomeView.vue`：个人介绍、社交链接与 B 站视频。保留原视频，用户点击后才加载播放器。

## 交互与体验

点赞只保存本机偏好，不代表服务器实时统计；添加的本地音乐仅在当前会话有效。评论需要 GitHub 账号，首次点击才加载第三方脚本；连接失败时可重试或前往 GitHub 讨论区。外链图片加载失败会显示占位提示。

导航、音乐进度、播放列表和图片预览支持键盘操作。图片预览支持 Escape 关闭、焦点约束与返回；系统开启减少动态效果后会关闭过渡。首页与动态页使用不同页面标题，动态路由单独加载。

全局颜色、主题与响应式布局集中在 `src/style.css`；播放器局部样式位于 `src/components/MusicPlayer.vue`。
