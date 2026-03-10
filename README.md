# XRE BOOKING 子域名系统说明

## 文件列表

### 1. index.html（艺人列表页）
- ✅ 所有艺人链接已改为子域名格式：`https://xxxx.xrebooking.com`
- ✅ 点击艺人卡片可分享，默认使用艺人照片
- ✅ 分享按钮悬停显示（右上角红色圆圈）

### 2. artist.html（艺人详情页）
- ✅ 支持子域名自动识别（如 `thenoname.xrebooking.com` 自动加载 thenoname 数据）
- ✅ 同时兼容 URL 参数格式（`artist.html?name=thenoname`）

### 3. artist-editor.html（艺人编辑器）
- ✅ 添加子域名链接预览功能
- ✅ 输入艺人ID时自动显示对应的子域名链接

## 服务器配置要求

要使子域名正常工作，需要以下配置：

### 1. DNS 配置
添加通配符 A 记录：
```
*.xrebooking.com → 你的服务器IP
```

### 2. Web 服务器配置

#### Nginx 示例：
```nginx
server {
    listen 80;
    server_name *.xrebooking.com xrebooking.com;

    location / {
        root /var/www/xrebooking;
        index index.html;
        try_files $uri $uri/ /artist.html;
    }
}
```

#### Apache 示例（.htaccess）：
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(.+)\.xrebooking\.com$ [NC]
RewriteRule ^$ /artist.html [L]
```

## 艺人子域名列表

| 艺人 | 子域名 |
|------|--------|
| ACIDEZ (MX) | acidez.xrebooking.com |
| BAOPIGOU豹皮狗 | baopigou.xrebooking.com |
| BIG D & THE KIDS TABLE | bigdandthekidstable.xrebooking.com |
| BRAIN FAILURE腦濁 | brainfailure.xrebooking.com |
| MASSACHRIST | massachrist.xrebooking.com |
| NON SERVIUM (ES) | nonservium.xrebooking.com |
| ÖNIKA LI | onikali.xrebooking.com |
| SILVER ASH銀色灰塵 | silverash.xrebooking.com |
| SKARFACE (FR) | skarface.xrebooking.com |
| THE GREED (TH) | thegreed.xrebooking.com |
| THE GT BITCHES | thegtbitches.xrebooking.com |
| THE NONAME無名 | thenoname.xrebooking.com |
| THE SINO HEARTS | thesinohearts.xrebooking.com |
| THE STIRRERS | thestirrers.xrebooking.com |

## 新增艺人流程

1. 打开 `artist-editor.html`
2. 点击"添加新艺人"
3. 填写艺人信息
   - 艺人ID：用于子域名（如 `newartist` → `newartist.xrebooking.com`）
   - 系统会自动预览子域名链接
4. 保存并下载 `artists-data.json`
5. 将 JSON 文件上传到服务器
6. 在 DNS 添加对应的子域名记录（如果使用通配符则自动生效）

## 注意事项

- 所有文件需要上传到同一目录
- `artists-data.json` 需要与 HTML 文件在同一目录
- 子域名访问时，会自动从 `artists-data.json` 查找对应艺人数据
