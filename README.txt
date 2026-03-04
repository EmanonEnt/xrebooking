# XRE BOOKING 艺人管理系统

## 文件说明

### 1. artist-editor.html (艺人信息编辑器)
- 用途：管理艺人资料，生成JSON数据
- 部署：不需要上传到服务器，在本地浏览器打开即可使用
- 特点：数据自动保存到浏览器本地存储

### 2. artist.html (艺人展示页面)
- 用途：前端展示艺人信息
- 部署：需要上传到网站服务器
- 路径：与 artists-data.json 放在同一目录

### 3. artists-data.json (艺人数据文件)
- 用途：存储所有艺人信息
- 部署：需要上传到网站服务器
- 更新：通过编辑器生成后替换此文件

## 使用流程

### 第一步：本地编辑艺人信息
1. 在本地电脑用浏览器打开 artist-editor.html
2. 添加/编辑艺人信息
3. 点击"下载 artists-data.json"保存文件

### 第二步：上传到服务器
1. 将新的 artists-data.json 上传到网站服务器
   - 路径：网站根目录 或 与 artist.html 同目录

2. 确保 artist.html 已上传到服务器
   - 访问方式：yourdomain.com/artist.html?name=艺人ID

### 第三步：访问艺人页面
- 示例：yourdomain.com/artist.html?name=thenoname
- 示例：yourdomain.com/artist.html?name=the-noname

## 编辑器支持的字段

### 基本信息
- 艺人ID (URL标识，如：thenoname)
- 艺人名称 (如：THE NONAME)
- 艺人照片路径 (如：./assets/artists/TheNoname.jpg)
- 艺人简介 (支持HTML标签)

### 经纪人信息
- 经纪人姓名
- 经纪人邮箱

### 社交媒体 (14种，留空则不显示)
- Facebook, Instagram, Spotify, YouTube
- Twitter, 微博, 小红书, 微信
- Telegram, TikTok, 抖音
- QQ音乐 (显示黄绿色 #31c27c)
- 网易云音乐 (显示红色 #c62f2f)
- 官方网站

### 视频链接
- 支持 YouTube, Youku, Bilibili
- 留空则不显示 VIDEO 区域

### 媒体包
- Google Drive 链接
- 百度网盘链接
- 都留空则不显示 MEDIA KIT 区域

### 巡演日期
- 日期、城市、场馆、国家、购票链接
- 无数据则不显示 TOUR DATES 区域

## 注意事项

1. **编辑器不需要上传服务器**
   - 它是纯前端工具，在本地使用即可
   - 数据保存在浏览器本地存储中

2. **只需要上传生成的 JSON 文件**
   - 每次编辑后下载新的 artists-data.json
   - 替换服务器上的旧文件即可更新

3. **艺人照片路径**
   - 建议使用相对路径
   - 示例：./assets/artists/ArtistName.jpg

4. **URL参数格式**
   - artist.html?name=艺人ID
   - 艺人ID就是编辑器中设置的"艺人ID"字段

## 技术支持

如有问题，请联系：xrebooking@hotmail.com
