# CORS Security Expert

A comprehensive guide to Cross-Origin Resource Sharing (CORS) configuration, security best practices, and implementation patterns across different frameworks and languages.

## Table of Contents

- [Introduction](#introduction)
- [CORS Fundamentals](#cors-fundamentals)
- [Access-Control Headers](#access-control-headers)
- [Preflight Requests](#preflight-requests)
- [Security Best Practices](#security-best-practices)
- [Framework Examples](#framework-examples)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Testing CORS](#testing-cors)
- [Troubleshooting](#troubleshooting)

## Introduction

CORS is a security mechanism that allows servers to specify which origins can access their resources. Understanding CORS is critical for building secure web applications that interact with APIs across different domains.

## CORS Fundamentals

### What is CORS?

CORS enables controlled access to resources located outside of a given domain. When a browser makes a cross-origin request, it includes an `Origin` header, and the server responds with appropriate `Access-Control-*` headers.

### Same-Origin Policy

The Same-Origin Policy restricts how documents or scripts from one origin can interact with resources from another origin. Two URLs have the same origin if:

- Protocol matches (http vs https)
- Domain matches (example.com vs api.example.com)
- Port matches (80 vs 8080)

```javascript
// Same origin examples
'https://example.com/app'
'https://example.com/api/users'

// Different origins
'http://example.com'      // Different protocol
'https://api.example.com' // Different subdomain
'https://example.com:8080' // Different port
```

## Access-Control Headers

### Access-Control-Allow-Origin

Specifies which origins can access the resource.

```javascript
// Allow single origin
res.setHeader('Access-Control-Allow-Origin', 'https://trusted-site.com');

// Allow all origins (NOT RECOMMENDED for production)
res.setHeader('Access-Control-Allow-Origin', '*');

// Dynamic origin (validate first!)
const allowedOrigins = ['https://site1.com', 'https://site2.com'];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### Access-Control-Allow-Methods

Specifies allowed HTTP methods.

```javascript
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

// More restrictive
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
```

### Access-Control-Allow-Headers

Specifies allowed request headers.

```javascript
res.setHeader(
  'Access-Control-Allow-Headers',
  'Content-Type, Authorization, X-Requested-With'
);

// Allow custom headers
res.setHeader(
  'Access-Control-Allow-Headers',
  'Content-Type, Authorization, X-API-Key, X-Custom-Header'
);
```

### Access-Control-Allow-Credentials

Allows cookies and authentication headers.

```javascript
// Enable credentials
res.setHeader('Access-Control-Allow-Credentials', 'true');

// IMPORTANT: Cannot use '*' for origin when credentials are enabled
// BAD:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// GOOD:
res.setHeader('Access-Control-Allow-Origin', 'https://trusted-site.com');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

### Access-Control-Max-Age

Specifies how long preflight results can be cached.

```javascript
// Cache preflight for 1 hour (3600 seconds)
res.setHeader('Access-Control-Max-Age', '3600');

// Cache for 24 hours
res.setHeader('Access-Control-Max-Age', '86400');
```

### Access-Control-Expose-Headers

Specifies which headers are accessible to the browser.

```javascript
// Expose custom headers
res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Number');

// Multiple headers
res.setHeader(
  'Access-Control-Expose-Headers',
  'Content-Length, ETag, X-RateLimit-Limit, X-RateLimit-Remaining'
);
```

## Preflight Requests

Preflight requests are OPTIONS requests sent by browsers before certain cross-origin requests to check if the actual request is safe to send.

### When Preflight Occurs

Preflight is triggered for:
- Methods other than GET, HEAD, POST
- Custom headers beyond simple headers
- Content-Type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain

### Simple Request (No Preflight)

```javascript
// Simple GET request - no preflight
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
});
```

### Preflight Request Example

```javascript
// This triggers preflight due to custom header
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ data: 'value' })
});

// Browser sends OPTIONS request first:
// OPTIONS /data HTTP/1.1
// Origin: https://frontend.com
// Access-Control-Request-Method: POST
// Access-Control-Request-Headers: authorization, content-type
```

### Handling Preflight in Node.js

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const allowedOrigin = 'https://trusted-site.com';

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle actual request
  if (req.method === 'POST' && req.url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Success' }));
  }
});

server.listen(3000);
```

## Security Best Practices

### 1. Validate Origins

Never use `*` in production for sensitive endpoints.

```javascript
// SECURE: Whitelist specific origins
const allowedOrigins = [
  'https://app.example.com',
  'https://admin.example.com',
  'https://mobile.example.com'
];

function validateOrigin(origin) {
  return allowedOrigins.includes(origin);
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (validateOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // Log suspicious request
    console.warn(`Blocked CORS request from: ${origin}`);
  }
}
```

### 2. Environment-Based Configuration

```javascript
// config/cors.js
const corsConfig = {
  development: {
    origins: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true
  },
  production: {
    origins: [
      'https://app.example.com',
      'https://www.example.com'
    ],
    credentials: true
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = corsConfig[env];
```

### 3. Restrict Methods and Headers

```javascript
// Only allow necessary methods
const allowedMethods = ['GET', 'POST'];
const allowedHeaders = ['Content-Type', 'Authorization'];

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
}
```

### 4. Use Vary Header

```javascript
// Ensure caching works correctly with CORS
res.setHeader('Vary', 'Origin');

// If you also vary on other headers
res.setHeader('Vary', 'Origin, Accept-Encoding');
```

## Framework Examples

### Express.js

#### Manual Implementation

```javascript
const express = require('express');
const app = express();

const allowedOrigins = ['https://app.example.com', 'https://www.example.com'];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS enabled' });
});

app.listen(3000);
```

#### Using cors Package

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Simple usage - Allow all origins (NOT RECOMMENDED)
app.use(cors());

// Recommended: Whitelist origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://app.example.com', 'https://www.example.com'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Route-specific CORS
app.get('/api/public', cors(), (req, res) => {
  res.json({ data: 'Public data' });
});

app.get('/api/private', cors(corsOptions), (req, res) => {
  res.json({ data: 'Private data' });
});

app.listen(3000);
```

### NestJS

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['https://app.example.com', 'https://www.example.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 3600,
  });

  await app.listen(3000);
}
bootstrap();

// Dynamic origin validation
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  await app.listen(3000);
}
```

### FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
allowed_origins = [
    "https://app.example.com",
    "https://www.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Total-Count"],
    max_age=3600,
)

@app.get("/api/data")
async def get_data():
    return {"message": "CORS enabled"}

# Route-specific CORS
@app.get("/api/public")
async def public_data():
    return {"data": "Public"}

# Dynamic origin validation
def validate_origin(origin: str) -> bool:
    return origin in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.example\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Django

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Whitelist origins
CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
    "https://www.example.com",
]

# Or use regex
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://\w+\.example\.com$",
]

# Allow credentials
CORS_ALLOW_CREDENTIALS = True

# Allowed methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Allowed headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
]

# Expose headers
CORS_EXPOSE_HEADERS = [
    'X-Total-Count',
]

# Preflight cache
CORS_PREFLIGHT_MAX_AGE = 86400
```

### Go (Gin Framework)

```go
package main

import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "time"
)

func main() {
    r := gin.Default()

    // CORS configuration
    config := cors.Config{
        AllowOrigins:     []string{"https://app.example.com", "https://www.example.com"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        ExposeHeaders:    []string{"X-Total-Count"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }

    r.Use(cors.New(config))

    // Routes
    r.GET("/api/data", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "CORS enabled",
        })
    })

    r.Run(":3000")
}

// Custom CORS middleware
func customCORS() gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")
        allowedOrigins := []string{"https://app.example.com", "https://www.example.com"}

        allowed := false
        for _, allowedOrigin := range allowedOrigins {
            if origin == allowedOrigin {
                allowed = true
                break
            }
        }

        if allowed {
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
            c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
            c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            c.Writer.Header().Set("Access-Control-Max-Age", "86400")
        }

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

## Common Vulnerabilities

### 1. Wildcard Origin with Credentials

```javascript
// VULNERABLE - Never do this!
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// Browsers will reject this combination
// If you need credentials, specify exact origin
```

### 2. Origin Reflection Without Validation

```javascript
// VULNERABLE - Reflects any origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// SECURE - Validate before reflecting
const allowedOrigins = ['https://trusted.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});
```

### 3. Null Origin

```javascript
// VULNERABLE - Null origin can be exploited
if (origin === 'null' || allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}

// SECURE - Never allow null origin
if (origin && allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### 4. Subdomain Wildcard Issues

```javascript
// VULNERABLE - Regex too permissive
const originRegex = /^https:\/\/.*\.example\.com$/;
if (originRegex.test(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
// This allows: https://evil.example.com.attacker.com

// SECURE - Proper regex
const originRegex = /^https:\/\/[a-z0-9-]+\.example\.com$/;
if (originRegex.test(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
```

## Testing CORS

### Using curl

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://app.example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v \
  https://api.example.com/data

# Test actual request
curl -X POST \
  -H "Origin: https://app.example.com" \
  -H "Content-Type: application/json" \
  -d '{"data":"value"}' \
  -v \
  https://api.example.com/data
```

### Browser Testing

```javascript
// Test CORS in browser console
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  credentials: 'include',
  body: JSON.stringify({ data: 'value' })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('CORS Error:', error));
```

### Automated Testing

```javascript
const request = require('supertest');
const app = require('./app');

describe('CORS Configuration', () => {
  test('Should allow whitelisted origin', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://app.example.com');

    expect(response.headers['access-control-allow-origin'])
      .toBe('https://app.example.com');
  });

  test('Should reject non-whitelisted origin', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'https://evil.com');

    expect(response.headers['access-control-allow-origin'])
      .toBeUndefined();
  });

  test('Should handle preflight correctly', async () => {
    const response = await request(app)
      .options('/api/data')
      .set('Origin', 'https://app.example.com')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods'])
      .toContain('POST');
  });
});
```

## Troubleshooting

### Common Error Messages

#### "No 'Access-Control-Allow-Origin' header is present"

```javascript
// Problem: Origin not whitelisted or CORS not configured
// Solution: Add origin to whitelist
const allowedOrigins = ['https://yourapp.com'];
```

#### "The 'Access-Control-Allow-Origin' header contains multiple values"

```javascript
// Problem: Setting header multiple times
// Bad:
app.use(corsMiddleware1);
app.use(corsMiddleware2); // Sets header again

// Solution: Use only one CORS middleware
app.use(corsMiddleware);
```

#### "Credentials flag is 'true', but origin is '*'"

```javascript
// Problem: Cannot use wildcard with credentials
// Bad:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// Solution: Specify exact origin
res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

### Debugging Checklist

1. Verify origin is in whitelist
2. Check preflight response (OPTIONS)
3. Ensure credentials configuration matches
4. Verify all required headers are allowed
5. Check for multiple CORS middleware
6. Validate origin format (no trailing slash)
7. Test with curl/Postman first
8. Check browser console for specific errors

This comprehensive guide covers CORS implementation, security, and troubleshooting across multiple frameworks and languages.
