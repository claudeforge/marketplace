# robots.txt Generator

Generate robots.txt files for SEO optimization, crawler management, sitemap integration, and controlling search engine access.

## Why robots.txt Matters

- Control search engine crawling
- Prevent duplicate content indexing
- Protect sensitive areas
- Manage crawl budget
- Improve site performance
- Reduce server load
- Optimize bandwidth usage

## Basic Syntax

```text
# User-agent: specifies which crawler
User-agent: *

# Disallow: paths that should not be crawled
Disallow: /admin/
Disallow: /private/

# Allow: explicitly allows crawling
Allow: /public/

# Sitemap: location of sitemap
Sitemap: https://example.com/sitemap.xml

# Crawl-delay: delay between requests (seconds)
Crawl-delay: 10
```

## robots.txt Generator

```javascript
class RobotsTxtGenerator {
  constructor(options = {}) {
    this.options = { baseUrl: options.baseUrl || 'https://example.com', ...options };
    this.rules = [];
    this.sitemaps = [];
  }

  addUserAgent(userAgent = '*') {
    this.rules.push({ userAgent, disallow: [], allow: [], crawlDelay: null });
    return this;
  }

  disallow(path, userAgent = '*') {
    let rule = this.rules.find(r => r.userAgent === userAgent);
    if (!rule) {
      this.addUserAgent(userAgent);
      rule = this.rules.find(r => r.userAgent === userAgent);
    }
    if (!rule.disallow.includes(path)) rule.disallow.push(path);
    return this;
  }

  allow(path, userAgent = '*') {
    let rule = this.rules.find(r => r.userAgent === userAgent);
    if (!rule) {
      this.addUserAgent(userAgent);
      rule = this.rules.find(r => r.userAgent === userAgent);
    }
    if (!rule.allow.includes(path)) rule.allow.push(path);
    return this;
  }

  setCrawlDelay(seconds, userAgent = '*') {
    let rule = this.rules.find(r => r.userAgent === userAgent);
    if (!rule) {
      this.addUserAgent(userAgent);
      rule = this.rules.find(r => r.userAgent === userAgent);
    }
    rule.crawlDelay = seconds;
    return this;
  }

  addSitemap(sitemapUrl) {
    if (!this.sitemaps.includes(sitemapUrl)) this.sitemaps.push(sitemapUrl);
    return this;
  }

  generate() {
    let content = '';

    this.rules.forEach((rule, index) => {
      if (index > 0) content += '\n';
      content += `User-agent: ${rule.userAgent}\n`;

      rule.disallow.forEach(path => { content += `Disallow: ${path}\n`; });
      rule.allow.forEach(path => { content += `Allow: ${path}\n`; });

      if (rule.crawlDelay !== null) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }
    });

    if (this.sitemaps.length > 0) {
      content += '\n';
      this.sitemaps.forEach(sitemap => { content += `Sitemap: ${sitemap}\n`; });
    }

    return content;
  }
}

// Usage
const generator = new RobotsTxtGenerator({ baseUrl: 'https://example.com' });

generator
  .addUserAgent('*')
  .disallow('/admin/')
  .disallow('/private/')
  .allow('/api/public/')
  .setCrawlDelay(10)
  .addSitemap('https://example.com/sitemap.xml');

console.log(generator.generate());
```

## Preset Configurations

```javascript
const presets = {
  default: () => generator
    .addUserAgent('*')
    .disallow('/admin/')
    .disallow('/private/')
    .setCrawlDelay(10),

  restrictive: () => generator
    .addUserAgent('*')
    .disallow('/admin/')
    .disallow('/private/')
    .disallow('/api/')
    .disallow('/*?*')  // Block query parameters
    .setCrawlDelay(30),

  ecommerce: () => generator
    .addUserAgent('*')
    .disallow('/cart/')
    .disallow('/checkout/')
    .disallow('/account/')
    .disallow('/*?sort=')
    .disallow('/*?filter=')
    .addSitemap(`${baseUrl}/sitemap-products.xml`)
    .addSitemap(`${baseUrl}/sitemap-categories.xml`),

  blog: () => generator
    .addUserAgent('*')
    .disallow('/wp-admin/')
    .disallow('/wp-login.php')
    .allow('/wp-admin/admin-ajax.php')
    .addSitemap(`${baseUrl}/sitemap.xml`)
    .addSitemap(`${baseUrl}/post-sitemap.xml`),

  blockAll: () => generator
    .addUserAgent('*')
    .disallow('/')
};
```

## Common Crawler Management

```javascript
// Block bad bots
const badBots = ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'];
badBots.forEach(bot => generator.addUserAgent(bot).disallow('/'));

// Optimize for Google
generator
  .addUserAgent('Googlebot')
  .allow('/*.js')
  .allow('/*.css')
  .allow('/images/')
  .disallow('/admin/')
  .setCrawlDelay(5);

// Optimize for Bing
generator
  .addUserAgent('Bingbot')
  .allow('/*.js')
  .allow('/*.css')
  .disallow('/admin/')
  .setCrawlDelay(10);
```

## Best Practices

### General
- Place robots.txt in root directory
- Use UTF-8 encoding
- Keep file size under 500KB
- Use lowercase for directives
- One directive per line
- Test with Google Search Console

### SEO
- Allow CSS and JavaScript files
- Include sitemap URLs
- Block duplicate content
- Optimize crawl budget
- Block search and filter pages

### Security
- Block admin areas
- Protect sensitive directories
- Hide development/staging areas
- Block known bad bots
- Use .htaccess for access control

### Performance
- Set appropriate crawl delays
- Block resource-intensive pages
- Limit crawling of large files
- Use multiple sitemaps for large sites
- Monitor server logs
