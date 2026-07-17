# 空白流汀

一个 Vue 3 + Vite 构建的二次元风格个人主页，支持**粉色少女**和**深色模式**两种主题切换。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 路由 | Vue Router 4 (Hash 模式) |
| 样式 | 纯 CSS + CSS 变量 |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── App.vue              # 根布局（背景层、灯箱、Toast、回到顶部）
├── components/
│   ├── AppNav.vue       # 导航栏 + 主题切换
│   ├── AppFooter.vue    # 页脚
│   ├── MusicPlayer.vue  # 底部固定音乐播放器
│   ├── MomentCard.vue   # 动态卡片组件
│   ├── MomentList.vue   # 动态时间线列表
│   └── GalleryGrid.vue  # 作品集网格
├── views/
│   ├── HomeView.vue     # 首页
│   └── MomentsView.vue  # 动态全列表
├── composables/          # 组合式函数
│   ├── useTheme.js      # 主题管理
│   ├── useMusic.js      # 音频播放逻辑
│   ├── useLightbox.js   # 图片灯箱
│   ├── useToast.js      # Toast 通知
│   └── useReveal.js     # 滚动揭示动画
├── themes/
│   └── cyberpunk.css    # 深色模式样式
├── data/                 # JSON 数据源
└── style.css             # 全局样式 + 粉色主题变量
```

## 部署

项目配置了 GitHub Pages 子路径部署（`/kongbailiuting/`），构建产物在 `dist/` 目录。
