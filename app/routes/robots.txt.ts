export function loader() {
  const robotText = `
    User-agent: Googlebot
    Disallow: /nogooglebot/
    User-Agent: *
    Allow: /
    Sitemap: https://tickets-fragrant-sky-883.fly.dev/sitemap.xml`;

  return new Response(robotText, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
