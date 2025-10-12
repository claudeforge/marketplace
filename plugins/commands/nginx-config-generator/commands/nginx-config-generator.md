---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge Nginx configuration generator with reverse proxy, SSL/TLS, load balancing, caching, rate limiting, and security headers.
---

# ClaudeForge Nginx Config Generator

ClaudeForge intelligent Nginx configuration generator that creates production-ready nginx.conf files with reverse proxy setup, SSL/TLS configuration, load balancing, caching strategies, rate limiting, and comprehensive security headers for robust web server deployment.

## Purpose

Transform Nginx configuration from manual editing to intelligent generation with best practices, security hardening, performance optimization, and modern web server patterns for reliable and secure application deployment.

## Features

- **Reverse Proxy**: Configure reverse proxy for backend applications
- **SSL/TLS**: HTTPS setup with Let's Encrypt and modern cipher suites
- **Load Balancing**: Round-robin, least connections, and IP hash algorithms
- **Caching**: Static file caching and proxy cache configuration
- **Rate Limiting**: Request rate limiting and connection throttling
- **Security Headers**: HSTS, CSP, X-Frame-Options, and more
- **Gzip Compression**: Optimize response sizes with gzip
- **HTTP/2 Support**: Enable HTTP/2 for better performance

## Usage

```bash
/nginx-config-generator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise use interactive mode)

## Code Examples

### Nginx Config Generator (TypeScript)

```typescript
import * as fs from 'fs';

interface NginxConfig {
  serverName: string;
  listenPort: number;
  sslEnabled: boolean;
  sslCertPath?: string;
  sslKeyPath?: string;
  proxyPass?: string;
  rootPath?: string;
  indexFiles?: string[];
  clientMaxBodySize?: string;
  enableGzip?: boolean;
  enableHttp2?: boolean;
  securityHeaders?: boolean;
  rateLimit?: RateLimitConfig;
  caching?: CacheConfig;
  loadBalancing?: LoadBalancerConfig;
}

interface RateLimitConfig {
  requestsPerSecond: number;
  burst: number;
  zone: string;
}

interface CacheConfig {
  enabled: boolean;
  path: string;
  maxSize: string;
  inactive: string;
}

interface LoadBalancerConfig {
  upstreams: string[];
  method: 'round_robin' | 'least_conn' | 'ip_hash';
}

class NginxConfigGenerator {
  private config: NginxConfig;

  constructor(config: NginxConfig) {
    this.config = {
      indexFiles: ['index.html', 'index.htm'],
      clientMaxBodySize: '10M',
      enableGzip: true,
      enableHttp2: true,
      securityHeaders: true,
      ...config
    };
  }

  generate(): string {
    const sections: string[] = [];

    // Add rate limiting zone if configured
    if (this.config.rateLimit) {
      sections.push(this.generateRateLimitZone());
    }

    // Add upstream for load balancing
    if (this.config.loadBalancing) {
      sections.push(this.generateUpstream());
    }

    // Add main server block
    sections.push(this.generateServerBlock());

    // Add SSL redirect if SSL is enabled
    if (this.config.sslEnabled) {
      sections.push(this.generateHttpRedirect());
    }

    return sections.join('\n\n');
  }

  private generateRateLimitZone(): string {
    const { rateLimit } = this.config;
    if (!rateLimit) return '';

    return `# Rate limiting zone
limit_req_zone $binary_remote_addr zone=${rateLimit.zone}:10m rate=${rateLimit.requestsPerSecond}r/s;`;
  }

  private generateUpstream(): string {
    const { loadBalancing } = this.config;
    if (!loadBalancing) return '';

    const lines: string[] = ['upstream backend {'];

    if (loadBalancing.method !== 'round_robin') {
      lines.push(`    ${loadBalancing.method};`);
    }

    for (const upstream of loadBalancing.upstreams) {
      lines.push(`    server ${upstream};`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  private generateServerBlock(): string {
    const lines: string[] = ['server {'];

    // Listen directives
    if (this.config.sslEnabled) {
      lines.push(`    listen ${this.config.listenPort} ssl${this.config.enableHttp2 ? ' http2' : ''};`);
      lines.push(`    listen [::]:${this.config.listenPort} ssl${this.config.enableHttp2 ? ' http2' : ''};`);
    } else {
      lines.push(`    listen ${this.config.listenPort};`);
      lines.push(`    listen [::]:${this.config.listenPort};`);
    }

    lines.push(`    server_name ${this.config.serverName};`);
    lines.push('');

    // SSL configuration
    if (this.config.sslEnabled && this.config.sslCertPath && this.config.sslKeyPath) {
      lines.push(...this.generateSSLConfig());
      lines.push('');
    }

    // Security headers
    if (this.config.securityHeaders) {
      lines.push(...this.generateSecurityHeaders());
      lines.push('');
    }

    // Client settings
    lines.push(`    client_max_body_size ${this.config.clientMaxBodySize};`);
    lines.push('');

    // Gzip compression
    if (this.config.enableGzip) {
      lines.push(...this.generateGzipConfig());
      lines.push('');
    }

    // Rate limiting
    if (this.config.rateLimit) {
      lines.push(`    limit_req zone=${this.config.rateLimit.zone} burst=${this.config.rateLimit.burst} nodelay;`);
      lines.push('');
    }

    // Location blocks
    if (this.config.proxyPass) {
      lines.push(...this.generateProxyLocation());
    } else if (this.config.rootPath) {
      lines.push(...this.generateStaticLocation());
    }

    lines.push('}');
    return lines.join('\n');
  }

  private generateSSLConfig(): string[] {
    return [
      `    ssl_certificate ${this.config.sslCertPath};`,
      `    ssl_certificate_key ${this.config.sslKeyPath};`,
      '    ssl_protocols TLSv1.2 TLSv1.3;',
      '    ssl_ciphers HIGH:!aNULL:!MD5;',
      '    ssl_prefer_server_ciphers on;',
      '    ssl_session_cache shared:SSL:10m;',
      '    ssl_session_timeout 10m;'
    ];
  }

  private generateSecurityHeaders(): string[] {
    return [
      '    # Security Headers',
      '    add_header X-Frame-Options "SAMEORIGIN" always;',
      '    add_header X-Content-Type-Options "nosniff" always;',
      '    add_header X-XSS-Protection "1; mode=block" always;',
      '    add_header Referrer-Policy "no-referrer-when-downgrade" always;',
      '    add_header Content-Security-Policy "default-src \'self\' http: https: data: blob: \'unsafe-inline\'" always;',
      '    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;'
    ];
  }

  private generateGzipConfig(): string[] {
    return [
      '    # Gzip compression',
      '    gzip on;',
      '    gzip_vary on;',
      '    gzip_proxied any;',
      '    gzip_comp_level 6;',
      '    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;'
    ];
  }

  private generateProxyLocation(): string[] {
    const lines: string[] = [
      '    location / {',
      `        proxy_pass ${this.config.proxyPass};`,
      '        proxy_http_version 1.1;',
      '        proxy_set_header Upgrade $http_upgrade;',
      '        proxy_set_header Connection "upgrade";',
      '        proxy_set_header Host $host;',
      '        proxy_set_header X-Real-IP $remote_addr;',
      '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;',
      '        proxy_set_header X-Forwarded-Proto $scheme;',
      '        proxy_set_header X-Forwarded-Host $host;',
      '        proxy_set_header X-Forwarded-Port $server_port;',
      '        proxy_cache_bypass $http_upgrade;'
    ];

    // Add caching if configured
    if (this.config.caching?.enabled) {
      lines.push('        proxy_cache my_cache;');
      lines.push('        proxy_cache_valid 200 60m;');
      lines.push('        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;');
    }

    lines.push('    }');

    // Add static file caching location
    lines.push('');
    lines.push('    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {');
    lines.push(`        ${this.config.proxyPass ? 'proxy_pass ' + this.config.proxyPass + ';' : ''}`);
    lines.push('        expires 1y;');
    lines.push('        add_header Cache-Control "public, immutable";');
    lines.push('    }');

    return lines;
  }

  private generateStaticLocation(): string[] {
    return [
      '    location / {',
      `        root ${this.config.rootPath};`,
      `        index ${this.config.indexFiles!.join(' ')};`,
      '        try_files $uri $uri/ /index.html;',
      '    }',
      '',
      '    # Static file caching',
      '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {',
      `        root ${this.config.rootPath};`,
      '        expires 1y;',
      '        add_header Cache-Control "public, immutable";',
      '    }'
    ];
  }

  private generateHttpRedirect(): string {
    return `# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ${this.config.serverName};
    return 301 https://$server_name$request_uri;
}`;
  }

  save(filename: string = 'nginx.conf'): void {
    const content = this.generate();
    fs.writeFileSync(filename, content);
    console.log(`✅ Nginx configuration saved to ${filename}`);
  }

  generateFullConfig(): string {
    const mainConfig = `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

${this.config.caching?.enabled ? this.generateCacheConfig() : ''}

${this.generate()}
}`;

    return mainConfig;
  }

  private generateCacheConfig(): string {
    const { caching } = this.config;
    if (!caching) return '';

    return `    # Proxy cache configuration
    proxy_cache_path ${caching.path} levels=1:2 keys_zone=my_cache:${caching.maxSize} inactive=${caching.inactive};
    proxy_cache_key "$scheme$request_method$host$request_uri";
    proxy_cache_methods GET HEAD;
`;
  }
}

// Usage examples

// Example 1: Simple reverse proxy with SSL
const config1 = new NginxConfigGenerator({
  serverName: 'example.com',
  listenPort: 443,
  sslEnabled: true,
  sslCertPath: '/etc/letsencrypt/live/example.com/fullchain.pem',
  sslKeyPath: '/etc/letsencrypt/live/example.com/privkey.pem',
  proxyPass: 'http://localhost:3000',
  rateLimit: {
    requestsPerSecond: 10,
    burst: 20,
    zone: 'api_limit'
  }
});

config1.save('sites-available/example.com');

// Example 2: Load balanced application
const config2 = new NginxConfigGenerator({
  serverName: 'app.example.com',
  listenPort: 443,
  sslEnabled: true,
  sslCertPath: '/etc/ssl/certs/app.crt',
  sslKeyPath: '/etc/ssl/private/app.key',
  proxyPass: 'http://backend',
  loadBalancing: {
    upstreams: [
      'localhost:3001',
      'localhost:3002',
      'localhost:3003'
    ],
    method: 'least_conn'
  },
  caching: {
    enabled: true,
    path: '/var/cache/nginx',
    maxSize: '1g',
    inactive: '60m'
  }
});

console.log('Generated Config:');
console.log(config2.generateFullConfig());

// Example 3: Static site hosting
const config3 = new NginxConfigGenerator({
  serverName: 'static.example.com',
  listenPort: 443,
  sslEnabled: true,
  sslCertPath: '/etc/ssl/certs/static.crt',
  sslKeyPath: '/etc/ssl/private/static.key',
  rootPath: '/var/www/html',
  indexFiles: ['index.html'],
  enableGzip: true,
  enableHttp2: true
});

config3.save('sites-available/static.example.com');
```

### Complete Production Nginx Configuration

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;

    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # Proxy cache
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:100m max_size=1g inactive=60m use_temp_path=off;

    # Upstream servers
    upstream backend {
        least_conn;
        server localhost:3001 max_fails=3 fail_timeout=30s;
        server localhost:3002 max_fails=3 fail_timeout=30s;
        server localhost:3003 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        listen [::]:80;
        server_name example.com www.example.com;
        return 301 https://$server_name$request_uri;
    }

    # Main HTTPS server
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name example.com www.example.com;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_stapling on;
        ssl_stapling_verify on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

        # Client settings
        client_max_body_size 10M;
        client_body_buffer_size 128k;

        # Rate limiting
        limit_req zone=general_limit burst=200 nodelay;
        limit_conn addr 10;

        # API endpoints with stricter rate limiting
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_cache app_cache;
            proxy_cache_valid 200 10m;
            proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
            proxy_cache_bypass $http_cache_control;
            add_header X-Cache-Status $upstream_cache_status;
        }

        # Static files
        location / {
            root /var/www/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # Static assets with long cache
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            root /var/www/html;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Best Practices

### Security
- **HTTPS Only**: Always use HTTPS in production
- **Modern TLS**: Use TLS 1.2 and 1.3 only
- **Security Headers**: Implement all security headers
- **Rate Limiting**: Protect against DoS attacks
- **Hide Version**: Disable server_tokens

### Performance
- **Gzip Compression**: Enable gzip for text files
- **HTTP/2**: Use HTTP/2 for better performance
- **Caching**: Implement proxy and static file caching
- **Keep-Alive**: Use persistent connections
- **Worker Processes**: Set to number of CPU cores

### Reliability
- **Health Checks**: Monitor upstream servers
- **Load Balancing**: Distribute traffic across servers
- **Failover**: Configure max_fails and fail_timeout
- **Logging**: Proper access and error logging
- **Monitoring**: Track cache hit rates and response times

---

**ClaudeForge Nginx Config Generator** - Enterprise-grade Nginx configuration with reverse proxy, SSL/TLS, load balancing, caching, rate limiting, and security best practices.
