# XRE BOOKING 首页优化文档

## 📁 文件位置
- **优化后文件**: `index_optimized.html`
- **原文件**: `index.html`

---

## 🎯 主要修改内容

### 1. HERO背景图本地化
**修改前:**
```css
background-image: url('https://livegigsasia.com/image/p-p-3.png');
background-position: center center;
```

**修改后:**
```css
background-image: url('./images/p-p-3.jpg');
background-position: center top;
```

**说明:** 
- 使用本地图片路径，减少外部依赖
- 针对竖版海报调整显示位置为顶部

---

### 2. 竖版海报适配优化
**新增CSS:**
```css
/* 竖版屏幕适配 */
@media (max-aspect-ratio: 3/4) {
    .hero-bg {
        background-size: cover;
        background-position: center 20%;
    }
}

/* 移动端优化 */
@media (max-width: 768px) {
    .hero-bg {
        background-attachment: scroll;
        background-position: center top;
    }
}

/* 超小屏幕 */
@media (max-width: 480px) {
    .hero-bg {
        background-position: center 10%;
    }
    .hero-title { font-size: clamp(40px, 12vw, 60px); }
    .hero-subtitle { font-size: clamp(10px, 2.8vw, 12px); }
}

/* 横屏手机 */
@media (max-height: 500px) and (orientation: landscape) {
    .hero-bg { background-position: center 30%; }
    .hero-content { margin-top: 80px; }
}
```

---

### 3. 艺人链接优化

#### THE NONAME (已有链接)
```javascript
{ name: "THE NONAME無名", image: "./assets/artists/TheNoname.jpg", 
  slug: "thenoname", link: "./artist.html?name=thenoname" }
```

#### ÖNIKA LI (新增链接)
```javascript
// 修改前
{ name: "ÖNIKA LI", image: "./assets/artists/OnikaLi.jpg", slug: "onikali" }

// 修改后
{ name: "ÖNIKA LI", image: "./assets/artists/OnikaLi.jpg", 
  slug: "onikali", link: "./artist.html?name=onikali" }
```

#### 其他艺人 (无链接但保留hover)
```javascript
// 例如: ACIDEZ, BAOPIGOU, BIG D 等
// 没有link属性，名字显示为纯文本，但hover时仍有红色效果
```

---

### 4. 渲染函数优化
**修改前:**
```javascript
const hasLink = artist.link && artist.link !== '#';
const link = hasLink ? artist.link : (artist.slug === '#' ? '#' : './artist/' + artist.slug + '.html');
const isClickable = link !== '#';
const nameHtml = isClickable 
    ? `<a href="${link}"...>${artist.name}</a>`
    : artist.name;
```

**修改后:**
```javascript
// 只有明确设置了link的艺人才能点击
const hasLink = artist.link && artist.link !== '#' && artist.link !== '';

// 有链接的用<a>标签，无链接的用<span>标签，但都保持hover效果
const nameHtml = hasLink 
    ? `<a href="${artist.link}" class="artist-name-link" style="...">${artist.name}</a>`
    : `<span class="artist-name-text" style="cursor: default;">${artist.name}</span>`;
```

---

### 5. 样式优化
**新增hover样式支持:**
```css
.artist-name-below .artist-name-link:hover {
    color: var(--xre-red);
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}
.artist-name-below .artist-name-text:hover {
    color: var(--xre-red);
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}
```

**强化比例保持:**
```css
.artist-card {
    padding-bottom: 48% !important; /* 750*360比例 */
}
.artist-card[style] {
    padding-bottom: 48% !important; /* 防止被覆盖 */
}
```

---

## 📂 目录结构要求

```
项目根目录/
├── index.html (优化后的文件)
├── images/
│   ├── p-p-3.jpg (竖版海报 - HERO背景)
│   ├── xrelogoL.png (导航栏logo)
│   └── webtop.png (Hero区域装饰logo)
├── assets/
│   └── artists/
│       ├── ACIDEZ.jpg
│       ├── baopigou.jpg
│       ├── bigd.jpg
│       ├── BrainFailure.jpg
│       ├── Massachrist.jpg
│       ├── NonServium.jpg
│       ├── OnikaLi.jpg
│       ├── yshc.jpg
│       ├── SKARFACE.jpg
│       ├── TheGreed.jpg
│       ├── TheGTBitches.jpg
│       ├── TheNoname.jpg
│       ├── TheSinoHeart.jpg
│       ├── thestirrers.jpg
│       └── NewArtistComing.webp
└── artist.html (艺人详情页，接收name参数)
```

---

## 🔗 关于链接路径的说明

### 相对路径 vs 绝对路径

**当前使用 (推荐):**
```
./artist.html?name=thenoname
```
✅ 优点:
- 自动适配 http/https
- 本地开发和线上环境通用
- 不受域名变更影响
- 加载速度更快 (无DNS解析)

**另一种选择 (完整URL):**
```
https://xrebooking.com/artist.html?name=thenoname
```
❌ 缺点:
- 本地开发时需要修改
- 更换域名时需要批量替换
- 混合内容警告风险 (http/https)

**结论:** 保持使用 `./artist.html?name=xxx` 是最佳实践

---

## 📱 竖版海报显示策略

### 问题
- 竖版海报 (如 1080x1920) 在宽屏上会被裁剪
- 移动端横竖屏切换时需要重新适配

### 解决方案
1. **桌面端**: `background-position: center top` - 显示海报上半部分
2. **竖屏移动端**: `background-position: center 20%` - 稍微下移，显示核心内容
3. **超小屏幕**: `background-position: center 10%` - 更靠上，确保标题可见
4. **横屏手机**: `background-position: center 30%` - 横屏时显示中间偏上

### 建议
如果 `./images/p-p-3.jpg` 是竖版海报，建议准备多个版本:
- `p-p-3.jpg` - 竖版原图 (用于移动端)
- `p-p-3-wide.jpg` - 横版裁剪版 (用于桌面端，可选)

---

## ✅ 检查清单

部署前请确认:
- [ ] `./images/p-p-3.jpg` 已上传
- [ ] `./images/xrelogoL.png` 存在
- [ ] `./assets/artists/` 下所有艺人图片存在
- [ ] `./artist.html` 页面已创建，能处理 `name` 参数
- [ ] 移动端测试通过 (iOS Safari, Android Chrome)
- [ ] 桌面端测试通过 (Chrome, Firefox, Safari)

---

## 🚀 快速部署

1. 将 `index_optimized.html` 重命名为 `index.html`
2. 确保 `images/p-p-3.jpg` 存在
3. 上传到服务器
4. 清除浏览器缓存测试 (Ctrl+F5 或 Cmd+Shift+R)
