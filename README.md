# google-translate-proxy

一个用于 Google Translate 的反向代理，旨在解决某些环境下的访问限制问题。

## 体验地址
### (反向代理谷歌翻译页面)
*   [https://abc15018045126.github.io/google-translate-proxy/](https://abc15018045126.github.io/google-translate-proxy/)
*   [https://google-translate-proxy.abc15018045126.ip-dynamic.org](https://google-translate-proxy.abc15018045126.ip-dynamic.org) 
### (转发谷歌翻译)

#### get请求翻译结果 
*   [https://translate.googleapis.com/translate_a/single?client=gtx&sl={fromLang}&tl={toLang}&dt=t&q={text}](https://translate.googleapis.com/translate_a/single?client=gtx&sl={fromLang}&tl={toLang}&dt=t&q={text})
#### URL 示例：
https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello

说明：
- `sl=en` 表示源语言为英语。
- `tl=zh-CN` 表示目标语言为简体中文。
- `q=hello` 表示需要翻译的文本为 "hello"。
#### 替代 
*   [https://translate.googleapis.com](https://translate.googleapis.com)
#### URL 示例：
https://google-translate-proxy-workers.abc15018045126.ip-dynamic.org/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello
#### 代理翻译结果
*   [https://google-translate-proxy-workers.abc15018045126.ip-dynamic.org](https://google-translate-proxy-workers.abc15018045126.ip-dynamic.org)
*   [https://google-translate-proxy-min.deno.dev/](https://google-translate-proxy-min.deno.dev/)


## 部署方式

### 1. 使用 Cloudflare Workers 部署 `worker.js`

Cloudflare Workers 提供了一个便捷的方式来部署你的 `worker.js` 文件，从而实现反向代理功能。

1.  注册或登录 [Cloudflare](https://www.cloudflare.com/) 账户。
2.  创建一个新的 Worker 项目。
3.  将 `worker.js` 的代码复制到 Cloudflare Worker 的编辑器中。
4.  配置你的 Worker 路由，使其能够拦截并代理 Google Translate 的请求。
5.  保存并部署你的 Worker。

### 2. 使用 dash.deno.com 部署 `deno.tsx`

[dash.deno.com](https://dash.deno.com/) 是一个用于部署 Deno 应用的平台，你可以使用它来部署 `deno.tsx` 文件。

1.  访问 [dash.deno.com](https://dash.deno.com/) 并创建一个新的项目。
2.  将 `deno.tsx` 文件上传到你的项目中。
3.  配置项目的入口点为 `deno.tsx`。
4.  部署你的 Deno 应用。

### 3. 使用 GitHub Pages 部署 `index.html`

你可以使用 GitHub Pages 来部署一个简单的 `index.html` 文件，用于提供用户界面或引导用户。

1.  创建一个 GitHub 仓库。
2.  将 `index.html` 文件添加到你的仓库中。
3.  在仓库的设置中，找到 GitHub Pages 选项。
4.  选择你的 `index.html` 文件所在的 branch 作为部署源。
5.  GitHub Pages 将会自动部署你的 `index.html` 文件，并提供一个访问链接。

通过以上三种方式，你可以灵活地部署你的 Google Translate 反向代理，以满足不同的需求。