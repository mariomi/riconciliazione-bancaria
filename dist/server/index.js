function withSecurityHeaders(response) {
  var headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    if (url.pathname === '/') url.pathname = '/index.html';

    var response = await env.ASSETS.fetch(new Request(url, request));
    return withSecurityHeaders(response);
  },
};
