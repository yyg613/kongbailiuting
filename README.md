# 空白流汀 — 个人主页

在代码与画笔之间，捕捉生活中每一个温柔的瞬间。

一个纯手工打造的个人主页，采用清新自然的绿色系设计，融合二次元文化与前端技术。

## 功能特性

- **响应式布局** — 完美适配桌面端与移动端
- **飘叶动画** — Canvas 绘制的浮动树叶粒子效果
- **滚动渐入** — IntersectionObserver 驱动的元素入场动画
- **图片灯箱** — 点击图片全屏预览，支持 ESC 关闭
- **留言板** — 基于 utteranc.es 的评论系统
- **动态时间轴** — 生活碎片以时间线形式展示
- **作品画廊** — 瀑布流式作品展示
- **无障碍支持** — 完整的 ARIA 标签与键盘导航

## 项目结构

```
kongbailiuting/
├── index.html        # 主页（关于/动态/作品/留言）
├── moments.html      # 动态详情页
├── css/
│   └── style.css     # 全部样式，CSS Variables 主题管理
├── js/
│   └── main.js       # 原生 JS 交互逻辑，零依赖
└── images/
    └── avatar.jpg    # 头像
```

## 技术实现

| 模块 | 方案 |
|------|------|
| 样式架构 | CSS Variables + BEM 命名 |
| 动画系统 | Canvas 粒子 + CSS Transition + IntersectionObserver |
| 导航交互 | 滚动吸顶 + 移动端汉堡菜单 + 锚点平滑滚动 |
| 图片预览 | 自定义 Lightbox 组件 |
| 留言系统 | utteranc.es (GitHub Issues) |
| 字体 | ZCOOL XiaoWei + Noto Serif SC + 系统字体栈 |

## 使用方式

纯静态页面，无需构建，直接打开 `index.html` 即可预览。

部署到 GitHub Pages：

```bash
# 在仓库设置中开启 GitHub Pages，选择 main 分支即可
```

## 作者

**空白流汀** — 二次元创作者 / 代码与艺术的探索者

---

用心记录每一个瞬间 🍃
