# XRE BOOKING - LiveGigs Asia 数据同步方案

## 架构概览

```
LiveGigs Asia 编辑器
        ↓
生成 events.json (包含所有活动数据)
        ↓
GitHub Pages (emanonent.github.io/livegigsasia/)
        ↓
XRE BOOKING 自动获取
```

## 数据格式要求

### events.json 结构
```json
{
  "events": [
    {
      "id": "event_001",
      "title": "PUNK HEART FESTIVAL 2026",
      "subtitle": "ASIA TOUR",
      "startDate": "2026-03-01",
      "endDate": "2026-03-15",
      "city": "Bangkok",
      "country": "Thailand",
      "venue": "Live Venue",
      "status": "ON TOUR",
      "poster": "https://example.com/poster.jpg",
      "poster1": "https://example.com/poster1.jpg",
      "link": "https://ticketlink.com",
      "btn_text": "BUY TICKETS"
    }
  ]
}
```

### 关键字段说明

| 字段 | 类型 | 说明 | XRE BOOKING使用 |
|------|------|------|-----------------|
| `id` | string | 唯一标识符 | ✅ 用于追踪 |
| `title` | string | 活动标题 | ✅ 显示在卡片 |
| `subtitle` | string | 副标题 | ✅ 显示在标题下方 |
| `startDate` | string | 开始日期 (YYYY-MM-DD) | ✅ 格式化显示 |
| `endDate` | string | 结束日期 (YYYY-MM-DD) | ✅ 计算日期范围 |
| `city` | string | 城市 | ✅ 显示位置 |
| `country` | string | 国家 | ✅ 显示位置 |
| `status` | string | 活动状态 | ✅ **关键筛选字段** |
| `poster` / `poster1` | string | 海报图片URL | ✅ 卡片背景 |
| `link` | string | 购票/详情链接 | ✅ 按钮跳转 |
| `btn_text` | string | 按钮文字 | ✅ 按钮显示 |

## 筛选逻辑

### Branded Tours 显示规则
```javascript
// 只要 status === 'ON TOUR' 就显示（不限制天数）
events.filter(event => {
    const status = (event.status || '').toLowerCase();
    return status === 'on tour' || status === 'ontour';
})
```

**注意：** 
- 2天到15天的ON TOUR都会显示
- 不再限制必须 >15天
- 状态判断不区分大小写

## GitHub Pages 设置步骤

### 1. 创建 GitHub 仓库
- 仓库名: `livegigsasia`
- 公开 (Public) 或 私有 (Private) 都可以

### 2. 启用 GitHub Pages
```
Settings → Pages → Source → Deploy from a branch → main /root
```

### 3. 创建数据文件
在仓库根目录创建 `events.json`：
```bash
/livegigsasia/
├── index.html          # 网站主页
├── events.html         # 活动页面
├── events.json         # ★ 数据文件 (XRE BOOKING会读取这个)
└── ...
```

### 4. 数据文件示例
`events.json`:
```json
{
  "lastUpdated": "2026-03-03T10:30:00Z",
  "events": [
    {
      "id": "tour_001",
      "title": "THE NONAME",
      "subtitle": "CHINA TOUR 2026",
      "startDate": "2026-03-10",
      "endDate": "2026-03-20",
      "city": "Multiple Cities",
      "country": "China",
      "status": "ON TOUR",
      "poster1": "https://livegigsasia.com/image/thenoname-tour.jpg",
      "link": "https://livegigsasia.com/events.html",
      "btn_text": "VIEW DATES"
    },
    {
      "id": "tour_002", 
      "title": "ACIDEZ",
      "subtitle": "S.E.ASIA TOUR",
      "startDate": "2026-04-05",
      "endDate": "2026-04-12",
      "city": "Bangkok",
      "country": "Thailand",
      "status": "ON TOUR",
      "poster1": "https://livegigsasia.com/image/acidez-tour.jpg",
      "link": "",
      "btn_text": "COMING SOON"
    }
  ]
}
```

### 5. 访问地址
- 数据URL: `https://emanonent.github.io/livegigsasia/events.json`
- 此URL需要在XRE BOOKING代码中配置

## 更新流程

### 管理员操作
1. 编辑器生成新的活动数据
2. 导出 `events.json` 文件
3. 上传到 GitHub 仓库
4. GitHub Pages 自动部署（约1-2分钟）
5. XRE BOOKING 自动获取最新数据

### 自动同步（可选高级方案）
可以设置 GitHub Actions 自动同步：
```yaml
# .github/workflows/sync.yml
name: Sync Events Data
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
```

## XRE BOOKING 代码配置

### 当前配置（已更新）
```javascript
// 从GitHub Pages获取数据
const response = await fetch('https://emanonent.github.io/livegigsasia/events.json', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
    }
});
```

### 如需更改数据源
修改 `index.html` 中的 `loadBrandedTours()` 函数：
```javascript
const DATA_SOURCE = 'https://your-domain.com/events.json';
const response = await fetch(DATA_SOURCE);
```

## 样式一致性

### 与LiveGigs自主活动区域对比

| 特性 | LiveGigs自主活动 | XRE Branded Tours |
|------|------------------|-------------------|
| 卡片比例 | 3:4 | ✅ 3:4 |
| Hover效果 | 上移+变亮+阴影 | ✅ 相同 |
| 状态标签 | 右上角 | ✅ 右上角 |
| 内容布局 | 标题/日期/地点/按钮 | ✅ 相同 |
| 按钮样式 | Neon效果 | ✅ 相同 |
| Load More | 每次+3个 | ✅ 每次+3个 |
| 响应式 | 1/2/3列 | ✅ 相同 |

## 故障排查

### 问题1: 数据无法加载
**检查:**
1. GitHub Pages是否已启用
2. events.json 是否存在且格式正确
3. CORS设置（GitHub Pages默认允许跨域）

### 问题2: ON TOUR活动不显示
**检查:**
1. status字段是否为 "ON TOUR"（大小写不敏感）
2. JSON格式是否有效（可用jsonlint.com验证）

### 问题3: 图片不显示
**检查:**
1. poster/poster1字段是否为有效URL
2. 图片URL是否支持跨域访问

## 安全建议

1. **数据验证**: 在编辑器端验证所有字段
2. **备份策略**: 保留events.json的历史版本
3. **访问控制**: 如需限制访问，可使用GitHub私有仓库 + Personal Access Token

---

**最后更新:** 2026-03-03
**版本:** v1.0
