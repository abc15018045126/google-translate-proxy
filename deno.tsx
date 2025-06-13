/**
 * Deno Deploy reverse proxy script for Google Translate API.
 * This version includes CORS support and directly proxies the incoming path and query string to translate.googleapis.com.
 * For example: a request to /translate_a/single?... will be proxied to https://translate.googleapis.com/translate_a/single?...
 * This version is modified to return the raw JSON response from the Google Translate API, instead of just the translated text.
 *
 * Deno Deploy 反向代理脚本，用于 Google Translate API。
 * 此版本增加了 CORS 支持，并修改为直接代理传入的路径和查询字符串到 translate.googleapis.com。
 * 例如：请求 /translate_a/single?... 会被代理到 https://translate.googleapis.com/translate_a/single?...
 * 此版本修改为返回 Google Translate API 的原始 JSON 响应，而不是仅仅翻译后的文本。
 */

// Listener for all incoming fetch events (Cloudflare Worker style).
// In Deno Deploy, we use Deno.serve() instead for starting the HTTP server.
// 监听所有传入的 fetch 事件（Cloudflare Worker 风格）。
// 在 Deno Deploy 中，我们使用 Deno.serve() 来启动 HTTP 服务器。
// Removed: addEventListener('fetch', event => { event.respondWith(handleRequest(event.request)); });

/**
 * Handles the incoming request and performs translation proxying.
 * 处理传入的请求并执行翻译代理。
 * @param {Request} request - The incoming request object. 传入的请求对象。
 * @returns {Promise<Response>} A Promise that resolves to a Response object containing the translation result. 包含翻译结果的响应对象。
 */
async function handleRequest(request) {
    // Preflight request (OPTIONS) handling.
    // 预检请求 (OPTIONS) 处理。
    if (request.method === 'OPTIONS') {
        return handleOptions(request);
    }

    try {
        const url = new URL(request.url);

        // Get the full path and query string after the Worker URL.
        // For example, if the request is https://worker.dev/translate_a/single?query=abc
        // then fullPathAndQuery will be /translate_a/single?query=abc
        // 获取 Worker URL 后的完整路径和查询字符串。
        // 例如，如果请求是 https://worker.dev/translate_a/single?query=abc
        // 则 fullPathAndQuery 将是 /translate_a/single?query=abc
        const fullPathAndQuery = url.pathname + url.search;

        // Construct the target Google Translate API URL.
        // Always proxy to translate.googleapis.com.
        // 构建目标 Google Translate API 的 URL。
        // 始终代理到 translate.googleapis.com。
        const targetUrl = `https://translate.googleapis.com${fullPathAndQuery}`;

        // Check if the path contains the expected translation API path to avoid invalid requests.
        // This is a simple check; more rigorous validation can be added as needed.
        // 检查路径是否包含预期的翻译API路径，以避免无效请求。
        // 这是一个简单的检查，可以根据需要进行更严格的验证。
        if (!fullPathAndQuery.includes('/translate_a/single')) {
            return new Response('Invalid API path. Please use /translate_a/single followed by query parameters.', {
                status: 400,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }

        // Make the request to the Google Translate API.
        // 发起对 Google Translate API 的请求。
        const apiResponse = await fetch(targetUrl);

        if (!apiResponse.ok) {
            // If the API response is not successful, return an error message.
            // 如果 API 响应不成功，返回错误信息。
            return new Response(`Error from upstream API: ${apiResponse.status} ${apiResponse.statusText}`, {
                status: apiResponse.status,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }

        // Create a new Response object from the upstream API response.
        // This will preserve the original content (JSON) and headers.
        // 从上游 API 响应创建新的响应对象。
        // 这将保留原始内容（JSON）和头部信息。
        const response = new Response(apiResponse.body, apiResponse);

        // Add CORS headers to the response.
        // 在响应中添加 CORS 头。
        response.headers.set('Access-Control-Allow-Origin', '*'); // Allow access from all origins. 允许所有来源访问。
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed HTTP methods. 允许的 HTTP 方法。
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allowed request headers. 允许的请求头。

        return response;

    } catch (error) {
        console.error('Request handler error:', error);
        return new Response(`Internal server error: ${error.message}`, {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

/**
 * Handles OPTIONS preflight requests.
 * 处理 OPTIONS 预检请求。
 * @param {Request} request - The incoming request object. 传入的请求对象。
 * @returns {Response} A Response containing CORS preflight headers. 包含 CORS 预检头的响应。
 */
function handleOptions(request) {
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allow access from all origins. 允许所有来源访问。
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed HTTP methods. 允许的 HTTP 方法。
        'Access-Control-Allow-Headers': 'Content-Type', // Allowed request headers. 允许的请求头。
        'Access-Control-Max-Age': '86400', // Cache duration for preflight requests (seconds). 预检请求的缓存时间（秒）。
    };
    return new Response(null, {
        status: 204, // No Content.
        headers: headers
    });
}

// Start the Deno HTTP server.
// Deno.serve() directly takes the request handler function.
// 启动 Deno HTTP 服务器。
// Deno.serve() 直接接收请求处理函数。
Deno.serve(handleRequest);
