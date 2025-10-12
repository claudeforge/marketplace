# .htaccess Generator

A comprehensive guide to generating and configuring Apache .htaccess files for URL rewriting, security headers, caching, redirects, and performance optimization.

## Table of Contents

- [Introduction](#introduction)
- [URL Rewriting](#url-rewriting)
- [Security Headers](#security-headers)
- [Cache Control](#cache-control)
- [Redirects](#redirects)
- [Performance Optimization](#performance-optimization)
- [Access Control](#access-control)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

## Introduction

The .htaccess file is a powerful configuration file for Apache web servers that allows per-directory configuration changes.

### Basic Structure

```apache
# Enable rewrite engine
RewriteEngine On

# Custom error pages
ErrorDocument 404 /errors/404.html
ErrorDocument 500 /errors/500.html

# Server settings
Options -Indexes
ServerSignature Off
```

## URL Rewriting

### Basic Rewrite Rules

```apache
# Enable mod_rewrite
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Remove www prefix
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Or force www prefix
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteCond %{HTTP_HOST} !^localhost [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]

# Remove trailing slash
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.+)/$
RewriteRule ^ %1 [R=301,L]

# Add trailing slash to directories
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_URI} !(.+)/$
RewriteRule ^(.+)$ $1/ [R=301,L]

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# Remove .php extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.php [NC,L]

# Clean URL routing for single page app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### Advanced Rewriting

```apache
# API routing
RewriteRule ^api/users/?$ api/users.php [L]
RewriteRule ^api/users/([0-9]+)/?$ api/users.php?id=$1 [L]
RewriteRule ^api/posts/?$ api/posts.php [L]
RewriteRule ^api/posts/([0-9]+)/?$ api/posts.php?id=$1 [L]

# Pretty URLs for blog
RewriteRule ^blog/([0-9]{4})/([0-9]{2})/([0-9]{2})/([a-z0-9\-]+)/?$ blog/post.php?year=$1&month=$2&day=$3&slug=$4 [L]

# User profile URLs
RewriteRule ^user/([a-zA-Z0-9_-]+)/?$ profile.php?username=$1 [L]

# Category and tag pages
RewriteRule ^category/([a-z0-9\-]+)/?$ category.php?slug=$1 [L]
RewriteRule ^tag/([a-z0-9\-]+)/?$ tag.php?slug=$1 [L]

# Search with query string
RewriteRule ^search/([^/]+)/?$ search.php?q=$1 [L]

# Language prefix routing
RewriteRule ^(en|es|fr|de)/(.*)$ $2?lang=$1 [L,QSA]

# Subdomain to query parameter
RewriteCond %{HTTP_HOST} ^([^.]+)\.example\.com$ [NC]
RewriteCond %{HTTP_HOST} !^www\.example\.com$ [NC]
RewriteRule ^(.*)$ /index.php?subdomain=%1&path=$1 [L,QSA]

# Block specific user agents
RewriteCond %{HTTP_USER_AGENT} (bot|crawler|spider) [NC]
RewriteRule .* - [F,L]
```

### Conditional Rewrites

```apache
# Only rewrite if file doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=$1 [L,QSA]

# Rewrite based on request method
RewriteCond %{REQUEST_METHOD} ^POST$
RewriteRule ^api/(.*)$ api-post.php?endpoint=$1 [L]

RewriteCond %{REQUEST_METHOD} ^GET$
RewriteRule ^api/(.*)$ api-get.php?endpoint=$1 [L]

# Rewrite based on query string
RewriteCond %{QUERY_STRING} ^oldparam=(.*)$
RewriteRule ^(.*)$ $1?newparam=%1 [R=301,L]

# Rewrite based on referrer
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\.)?example\.com [NC]
RewriteRule \.(jpg|jpeg|png|gif)$ - [F,L]

# Environment-based rewriting
RewriteCond %{HTTP_HOST} ^dev\.example\.com$ [NC]
RewriteRule ^(.*)$ /development/$1 [L]

RewriteCond %{HTTP_HOST} ^staging\.example\.com$ [NC]
RewriteRule ^(.*)$ /staging/$1 [L]
```

## Security Headers

### Essential Security Headers

```apache
# HTTP Strict Transport Security (HSTS)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Frame-Options (prevent clickjacking)
Header always set X-Frame-Options "SAMEORIGIN"

# X-Content-Type-Options (prevent MIME sniffing)
Header always set X-Content-Type-Options "nosniff"

# X-XSS-Protection
Header always set X-XSS-Protection "1; mode=block"

# Referrer Policy
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content Security Policy (CSP)
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com; frame-ancestors 'self'"

# Permissions Policy (formerly Feature Policy)
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# Remove sensitive server information
Header always unset X-Powered-By
Header unset X-Powered-By
ServerSignature Off
```

### Advanced CSP Configuration

```apache
# Strict CSP for production
<IfModule mod_headers.c>
  # Base policy
  Header always set Content-Security-Policy "\
    default-src 'self'; \
    script-src 'self' https://cdn.example.com; \
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
    font-src 'self' https://fonts.gstatic.com; \
    img-src 'self' data: https: blob:; \
    media-src 'self' https://media.example.com; \
    object-src 'none'; \
    frame-src 'self' https://www.youtube.com https://player.vimeo.com; \
    frame-ancestors 'self'; \
    base-uri 'self'; \
    form-action 'self'; \
    upgrade-insecure-requests; \
    block-all-mixed-content"

  # Report violations
  Header always append Content-Security-Policy-Report-Only "default-src 'self'; report-uri /csp-report"
</IfModule>

# CSP for development
<If "%{HTTP_HOST} == 'localhost' || %{HTTP_HOST} == 'dev.example.com'">
  Header always set Content-Security-Policy "\
    default-src 'self' 'unsafe-inline' 'unsafe-eval'; \
    script-src 'self' 'unsafe-inline' 'unsafe-eval'; \
    style-src 'self' 'unsafe-inline'"
</If>
```

### CORS Headers

```apache
# Enable CORS for specific origin
<IfModule mod_headers.c>
  SetEnvIf Origin "^https?://(www\.)?(example\.com|api\.example\.com)$" ORIGIN_ALLOWED=$0

  Header always set Access-Control-Allow-Origin "%{ORIGIN_ALLOWED}e" env=ORIGIN_ALLOWED
  Header always set Access-Control-Allow-Credentials "true" env=ORIGIN_ALLOWED
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
  Header always set Access-Control-Max-Age "3600"

  # Handle preflight requests
  RewriteCond %{REQUEST_METHOD} OPTIONS
  RewriteRule ^(.*)$ $1 [R=204,L]
</IfModule>

# Allow all origins (development only - NOT for production)
<IfModule mod_headers.c>
  Header always set Access-Control-Allow-Origin "*"
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## Cache Control

### Browser Caching

```apache
<IfModule mod_expires.c>
  ExpiresActive On

  # Default expiration
  ExpiresDefault "access plus 1 month"

  # HTML (no cache)
  ExpiresByType text/html "access plus 0 seconds"

  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"

  # Images
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"

  # Fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"

  # Media
  ExpiresByType audio/ogg "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType video/webm "access plus 1 year"

  # Documents
  ExpiresByType application/pdf "access plus 1 month"

  # Data
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType application/xml "access plus 0 seconds"
  ExpiresByType text/xml "access plus 0 seconds"
</IfModule>
```

### Cache-Control Headers

```apache
<IfModule mod_headers.c>
  # Default cache control
  Header set Cache-Control "public, max-age=2592000"

  # HTML - no cache
  <FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>

  # CSS and JavaScript - cache for 1 year
  <FilesMatch "\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Images - cache for 1 year
  <FilesMatch "\.(jpg|jpeg|png|gif|svg|webp|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Fonts - cache for 1 year
  <FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Media - cache for 1 year
  <FilesMatch "\.(mp4|webm|ogg|mp3)$">
    Header set Cache-Control "public, max-age=31536000"
  </FilesMatch>

  # API responses - no cache
  <FilesMatch "\.php$">
    Header set Cache-Control "no-cache, no-store, must-revalidate, private"
  </FilesMatch>
</IfModule>
```

### ETags and Validation

```apache
# Enable ETags
FileETag MTime Size

# Or disable ETags (for multi-server setups)
FileETag None
Header unset ETag

# Enable Last-Modified headers
<IfModule mod_headers.c>
  <FilesMatch "\.(html|css|js|jpg|jpeg|png|gif|svg)$">
    Header set Last-Modified "%{LAST_MODIFIED}e"
  </FilesMatch>
</IfModule>
```

## Redirects

### Common Redirects

```apache
# Redirect single page
Redirect 301 /old-page.html /new-page.html

# Redirect directory
Redirect 301 /old-directory/ /new-directory/

# Redirect to external site
Redirect 301 /external https://example.com

# Redirect with query string preservation
RedirectMatch 301 ^/old-page\.html$ /new-page.html

# Multiple redirects
Redirect 301 /about-us.html /about
Redirect 301 /contact-us.html /contact
Redirect 301 /products.html /shop

# Redirect non-www to www
RewriteCond %{HTTP_HOST} ^example\.com$ [NC]
RewriteRule ^(.*)$ https://www.example.com/$1 [R=301,L]

# Redirect www to non-www
RewriteCond %{HTTP_HOST} ^www\.example\.com$ [NC]
RewriteRule ^(.*)$ https://example.com/$1 [R=301,L]

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Redirect old domain to new domain
RewriteCond %{HTTP_HOST} ^(www\.)?olddomain\.com$ [NC]
RewriteRule ^(.*)$ https://newdomain.com/$1 [R=301,L]

# Redirect mobile users
RewriteCond %{HTTP_USER_AGENT} "android|blackberry|iphone|ipad|ipod|opera mini|iemobile" [NC]
RewriteRule ^(.*)$ https://m.example.com/$1 [R=302,L]
```

### Pattern-Based Redirects

```apache
# Redirect all .html files to extension-less URLs
RedirectMatch 301 ^/(.*)\.html$ /$1

# Redirect product pages with new URL structure
RedirectMatch 301 ^/products/([0-9]+)$ /product/$1

# Redirect blog posts
RedirectMatch 301 ^/blog/([0-9]{4})-([0-9]{2})-([0-9]{2})/(.*)$ /blog/$1/$2/$3/$4

# Redirect using regex groups
RewriteRule ^category/([^/]+)/page/([0-9]+)$ /shop/$1?page=$2 [R=301,L]

# Conditional redirect based on query string
RewriteCond %{QUERY_STRING} ^id=([0-9]+)$
RewriteRule ^product\.php$ /product/%1? [R=301,L]
```

## Performance Optimization

### Compression

```apache
<IfModule mod_deflate.c>
  # Enable compression
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/atom_xml
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE font/truetype
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE image/svg+xml

  # Don't compress images
  SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|webp)$ no-gzip dont-vary

  # Handle browser issues
  BrowserMatch ^Mozilla/4 gzip-only-text/html
  BrowserMatch ^Mozilla/4\.0[678] no-gzip
  BrowserMatch \bMSIE !no-gzip !gzip-only-text/html

  # Add Vary header
  Header append Vary User-Agent env=!dont-vary
</IfModule>

# Gzip compression fallback
<IfModule !mod_deflate.c>
  <IfModule mod_gzip.c>
    mod_gzip_on Yes
    mod_gzip_dechunk Yes
    mod_gzip_item_include file \.(html?|txt|css|js|php|pl)$
    mod_gzip_item_include mime ^text/.*
    mod_gzip_item_include mime ^application/x-javascript.*
    mod_gzip_item_exclude mime ^image/.*
    mod_gzip_item_exclude rspheader ^Content-Encoding:.*gzip.*
  </IfModule>
</IfModule>
```

### Brotli Compression

```apache
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css text/javascript
  AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json application/xml
  AddOutputFilterByType BROTLI_COMPRESS application/x-javascript application/xhtml+xml
  AddOutputFilterByType BROTLI_COMPRESS application/rss+xml application/atom_xml
  AddOutputFilterByType BROTLI_COMPRESS image/svg+xml

  # Set compression quality (0-11, higher = better compression but slower)
  BrotliCompressionQuality 6
</IfModule>
```

### HTTP/2 Server Push

```apache
<IfModule mod_http2.c>
  # Enable HTTP/2
  Protocols h2 h2c http/1.1

  # Server push for critical resources
  <FilesMatch "\.html$">
    Header add Link "</css/main.css>; rel=preload; as=style"
    Header add Link "</js/main.js>; rel=preload; as=script"
    Header add Link "</fonts/main.woff2>; rel=preload; as=font; crossorigin"
  </FilesMatch>
</IfModule>
```

## Access Control

### Directory Protection

```apache
# Protect directory with password
AuthType Basic
AuthName "Restricted Area"
AuthUserFile /path/to/.htpasswd
Require valid-user

# Allow specific IP addresses
Require ip 192.168.1.100
Require ip 10.0.0.0/8

# Deny specific IP addresses
<RequireAll>
  Require all granted
  Require not ip 192.168.1.50
  Require not ip 10.0.0.100
</RequireAll>

# Protect specific files
<Files "config.php">
  Require all denied
</Files>

<FilesMatch "\.(env|log|ini)$">
  Require all denied
</FilesMatch>

# Protect directories
<Directory "/var/www/admin">
  Require all denied
</Directory>

# Block access to hidden files
<FilesMatch "^\.">
  Require all denied
</FilesMatch>

# Prevent directory listing
Options -Indexes

# Block access to backup files
<FilesMatch "\.(bak|backup|old|tmp|swp)$">
  Require all denied
</FilesMatch>
```

### IP-Based Access Control

```apache
# Allow only specific IPs
<RequireAll>
  Require ip 192.168.1.100
  Require ip 192.168.1.101
  Require ip 10.0.0.0/24
</RequireAll>

# Block specific IPs
<RequireAll>
  Require all granted
  Require not ip 192.168.1.50
  Require not ip 10.0.0.100
</RequireAll>

# Allow local network
<RequireAny>
  Require ip 192.168.0.0/16
  Require ip 10.0.0.0/8
  Require ip 172.16.0.0/12
</RequireAny>

# Geographic blocking (requires mod_geoip)
<IfModule mod_geoip.c>
  GeoIPEnable On
  SetEnvIf GEOIP_COUNTRY_CODE CN BlockCountry
  SetEnvIf GEOIP_COUNTRY_CODE RU BlockCountry

  Require all granted
  Require not env BlockCountry
</IfModule>
```

## Complete Examples

### WordPress Optimization

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.php$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.php [L]
</IfModule>
# END WordPress

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Protect wp-config.php
<Files wp-config.php>
  Require all denied
</Files>

# Block access to sensitive files
<FilesMatch "(\.htaccess|\.htpasswd|readme\.html|license\.txt)">
  Require all denied
</FilesMatch>

# Disable XML-RPC if not needed
<Files xmlrpc.php>
  Require all denied
</Files>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Single Page Application (SPA)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

  # API routing
  RewriteRule ^api/(.*)$ /api/index.php?route=$1 [L,QSA]

  # SPA routing - send all non-file requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On

  # No cache for index.html
  <FilesMatch "index\.html$">
    ExpiresDefault "access plus 0 seconds"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>

  # Cache static assets
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
</IfModule>
```

## Best Practices

```apache
# Complete production-ready .htaccess example

# =====================================
# SECURITY
# =====================================

# Disable directory browsing
Options -Indexes

# Hide server signature
ServerSignature Off

# Protect sensitive files
<FilesMatch "(^#.*#|\.(bak|backup|conf|dist|fla|in[ci]|log|orig|psd|sh|sql|sw[op])|~)$">
  Require all denied
</FilesMatch>

# Block access to hidden files
<FilesMatch "^\.">
  Require all denied
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always unset X-Powered-By
  Header unset X-Powered-By
</IfModule>

# =====================================
# PERFORMANCE
# =====================================

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json application/xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# =====================================
# URL REWRITING
# =====================================

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

  # Remove trailing slash
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} (.+)/$
  RewriteRule ^ %1 [R=301,L]

  # Clean URLs
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ index.php?route=$1 [L,QSA]
</IfModule>

# =====================================
# ERROR PAGES
# =====================================

ErrorDocument 400 /errors/400.html
ErrorDocument 401 /errors/401.html
ErrorDocument 403 /errors/403.html
ErrorDocument 404 /errors/404.html
ErrorDocument 500 /errors/500.html
ErrorDocument 503 /errors/503.html

# =====================================
# MIME TYPES
# =====================================

<IfModule mod_mime.c>
  # Web fonts
  AddType font/woff2 .woff2
  AddType font/woff .woff
  AddType font/ttf .ttf
  AddType font/otf .otf

  # Modern image formats
  AddType image/webp .webp
  AddType image/avif .avif

  # Other
  AddType application/json .json
  AddType application/manifest+json .webmanifest
</IfModule>
```

This comprehensive guide covers all essential .htaccess configuration patterns for modern web applications, from basic rewrites to advanced security and performance optimization.
