# XRE BOOKING - Website Package

## 文件结构
```
xrebooking/
├── index.html              # 主页面文件
├── README.txt              # 本说明文件
├── image/                  # 图片目录
│   ├── xrebooking-logo.png # Logo (请上传您的PNG)
│   ├── webtop.png          # Tab图标 (自动从LiveGigs获取)
│   └── 1-b-2.jpg           # Hero背景 (自动从LiveGigs获取)
└── assets/                 # 资源目录
    └── artists/            # 艺人照片目录
        ├── OnikaLi.jpg
        ├── TheNoname.jpg
        ├── ACIDEZ.jpg
        ├── BrainFailure.jpg
        ├── Massachrist.jpg
        ├── NonServium.jpg
        ├── SKARFACE.jpg
        ├── TheGT Bitches.jpg
        ├── TheGreed.jpg
        ├── TheSino Heart.jpg
        ├── baopigou.jpg
        ├── bigd.jpg
        ├── thestirrers.jpg
        └── yshc.jpg
```

## 使用前准备

### 1. 上传Logo
将您的 XRE BOOKING logo PNG 文件放入 `image/` 目录，命名为 `xrebooking-logo.png`

### 2. 上传艺人照片
将所有艺人照片放入 `assets/artists/` 目录，确保文件名与上述列表一致

### 3. 表单配置
表单已配置为发送到 xrebooking@hotmail.com
如需更改，请修改 index.html 中的 Web3Forms access_key

## 功能特性

- Hero区域: 固定背景 + 抽屉滚动效果 + 烟雾动画
- Logo: 呼吸 + 闪光动画效果
- 艺人区域: 3列网格(移动端2列) + Hover蒙版效果
- 广告区: 银灰到红色渐变背景
- 底部: LiveGigs风格排版 + 发光文字效果
- BOOKING NOW弹窗: 含日期/国家/城市/场地字段
- 所有按钮: Neon光效 + 扫光动画
- 完全响应式设计

## 技术说明

- 使用 Web3Forms 处理表单提交
- 使用 Spotify Embed 播放列表
- 使用 CSS Variables 统一色彩管理
- 支持 ESC 键关闭弹窗
- 表单数据本地备份到 localStorage

## 联系方式

xrebooking@hotmail.com
