# Pagination Specialist

Expert guidance on pagination strategies, implementation patterns, and best practices for building efficient paginated APIs and user interfaces.

## Core Competencies

**When to Use Pagination:**
- Dataset > 100 records
- Response time > 1 second for full dataset
- Network payload > 1MB
- Real-time data or progressive loading needed

## Pagination Strategy Comparison

| Type | Best For | Pros | Cons |
|------|----------|------|------|
| **Offset** | Admin panels, small datasets | Simple, random page access | Poor performance at large offsets, inconsistent with data changes |
| **Cursor** | Social feeds, real-time data | Consistent results, efficient | No random access, requires unique field |
| **Keyset** | High-volume APIs, time-series | Best performance, consistent | Complex implementation, requires indexes |

## 1. Offset-Based Pagination

**Use Case:** Admin panels, small datasets with random page access needs

### Complete Implementation Example

```javascript
// Express.js with comprehensive features
app.get('/api/users', async (req, res) => {
  const { page = 1, limit = 10, search = '', role, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
  const offset = (page - 1) * limit;

  let query = knex('users').select('*');
  let countQuery = knex('users');

  // Filters
  if (search) {
    const pattern = `%${search}%`;
    query = query.where(function() {
      this.where('name', 'like', pattern).orWhere('email', 'like', pattern);
    });
    countQuery = countQuery.where(function() {
      this.where('name', 'like', pattern).orWhere('email', 'like', pattern);
    });
  }
  if (role) {
    query = query.where('role', role);
    countQuery = countQuery.where('role', role);
  }

  // Pagination
  query = query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  const [users, totalCount] = await Promise.all([query, countQuery.count('* as count').first()]);

  res.json({
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit),
      hasNext: offset + limit < totalCount.count,
      hasPrev: page > 1
    }
  });
});
```

**MongoDB Version:**
```javascript
async function getUsersMongo(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments()
  ]);
  return { data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
```

**Anti-Pattern:** Avoid COUNT(*) on every request for large tables. Use `LIMIT + 1` to check for more pages instead.

## 2. Cursor-Based Pagination

**Use Case:** Social feeds, real-time data, mobile apps

### Timestamp + ID Cursor (Recommended)

```javascript
app.get('/api/posts', async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  let query = knex('posts')
    .select('*')
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')  // Secondary sort for consistency
    .limit(limit + 1);

  if (cursor) {
    const [timestamp, id] = Buffer.from(cursor, 'base64').toString().split(':');
    query = query.where(function() {
      this.where('created_at', '<', timestamp)
        .orWhere(function() {
          this.where('created_at', '=', timestamp).andWhere('id', '<', id);
        });
    });
  }

  const posts = await query;
  const hasNext = posts.length > limit;
  if (hasNext) posts.pop();

  const nextCursor = hasNext
    ? Buffer.from(`${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}`).toString('base64')
    : null;

  res.json({ data: posts, pagination: { nextCursor, hasNext, limit } });
});
```

### Bidirectional Cursor (For Prev/Next Navigation)

```javascript
async function getBidirectionalPosts(cursor, direction = 'next', limit = 10) {
  let query = knex('posts').select('*');

  if (cursor) {
    const [timestamp, id] = cursor.split(':');
    if (direction === 'next') {
      query = query.where(function() {
        this.where('created_at', '<', timestamp)
          .orWhere(function() { this.where('created_at', '=', timestamp).andWhere('id', '<', id); });
      }).orderBy('created_at', 'desc').orderBy('id', 'desc');
    } else {
      query = query.where(function() {
        this.where('created_at', '>', timestamp)
          .orWhere(function() { this.where('created_at', '=', timestamp).andWhere('id', '>', id); });
      }).orderBy('created_at', 'asc').orderBy('id', 'asc');
    }
  } else {
    query = query.orderBy('created_at', 'desc').orderBy('id', 'desc');
  }

  let posts = await query.limit(limit + 1);
  if (direction === 'prev') posts = posts.reverse();

  const hasNext = posts.length > limit;
  if (hasNext) posts.pop();

  return {
    data: posts,
    nextCursor: hasNext ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}` : null,
    prevCursor: posts[0] ? `${posts[0].created_at}:${posts[0].id}` : null
  };
}
```

## 3. Keyset Pagination (Seek Method)

**Use Case:** High-volume APIs, time-series data, analytics

### Multi-Column Keyset (Advanced)

```javascript
async function getProductsKeyset({ lastPrice, lastRating, lastId, limit = 20, sortOrder = 'desc' }) {
  let query = knex('products')
    .select('id', 'name', 'price', 'rating')
    .limit(limit);

  // Keyset condition for price + rating + id sort
  if (lastPrice !== null && lastRating !== null && lastId !== null) {
    query = query.where(function() {
      if (sortOrder === 'desc') {
        this.where('price', '<', lastPrice)
          .orWhere(function() {
            this.where('price', '=', lastPrice).andWhere('rating', '<', lastRating);
          })
          .orWhere(function() {
            this.where('price', '=', lastPrice).andWhere('rating', '=', lastRating).andWhere('id', '<', lastId);
          });
      }
    });
  }

  query = query.orderBy('price', sortOrder).orderBy('rating', sortOrder).orderBy('id', sortOrder);
  const products = await query;

  return {
    data: products,
    pagination: {
      lastPrice: products[products.length - 1]?.price,
      lastRating: products[products.length - 1]?.rating,
      lastId: products[products.length - 1]?.id,
      hasMore: products.length === limit
    }
  };
}
```

**Required Index:** `CREATE INDEX idx_products_keyset ON products(price DESC, rating DESC, id DESC);`

## 4. Infinite Scroll Implementation

### React with Intersection Observer

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';

function InfiniteScrollFeed() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params = new URLSearchParams({ limit: 20 });
    if (cursor) params.append('cursor', cursor);

    const response = await fetch(`/api/feed?${params}`);
    const data = await response.json();

    setPosts(prev => [...prev, ...data.data]);
    setCursor(data.cursor);
    setHasMore(data.hasMore);
    setLoading(false);
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries[0].isIntersecting && hasMore && !loading && loadMore(),
      { threshold: 0.5 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observerTarget.current && observer.unobserve(observerTarget.current);
  }, [loadMore, hasMore, loading]);

  useEffect(() => { loadMore(); }, []);

  return (
    <div className="feed">
      {posts.map(post => <div key={post.id}><h3>{post.title}</h3><p>{post.content}</p></div>)}
      {loading && <div>Loading...</div>}
      <div ref={observerTarget} />
      {!hasMore && <div>No more posts</div>}
    </div>
  );
}
```

**For virtualized lists with 10,000+ items**, consider `react-window` + `react-window-infinite-loader` (see pagination-expert README).

## 5. Database Optimization

### Essential Indexes

```sql
-- Offset pagination
CREATE INDEX idx_users_offset ON users(created_at DESC, id DESC);

-- Cursor pagination
CREATE INDEX idx_posts_cursor ON posts(created_at DESC, id DESC);

-- Keyset with multiple columns
CREATE INDEX idx_products_keyset ON products(price DESC, rating DESC, id DESC);

-- Filtered pagination (covering index)
CREATE INDEX idx_users_filtered ON users(role, created_at DESC, id DESC)
INCLUDE (name, email, status);
```

### Query Optimization Patterns

```javascript
// Anti-Pattern: Expensive COUNT on every request
async function getPaginatedDataBad(page, limit) {
  const total = await knex('posts').count('* as count').first();  // ❌ Expensive
  const posts = await knex('posts').limit(limit).offset((page - 1) * limit);
  return { data: posts, total: total.count };
}

// Better: Use LIMIT + 1 to check for more pages
async function getPaginatedDataGood(page, limit) {
  const posts = await knex('posts').limit(limit + 1).offset((page - 1) * limit);
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();
  return { data: posts, hasNext: hasMore, hasPrev: page > 1 };
}

// Best: Use cursor pagination for large datasets
async function getCursorPaginatedData(cursor, limit) {
  let query = knex('posts').orderBy('created_at', 'desc').orderBy('id', 'desc').limit(limit + 1);
  if (cursor) {
    const [timestamp, id] = cursor.split(':');
    query = query.where(function() {
      this.where('created_at', '<', timestamp)
        .orWhere(function() { this.where('created_at', '=', timestamp).andWhere('id', '<', id); });
    });
  }
  const posts = await query;
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();
  return {
    data: posts,
    cursor: hasMore ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}` : null
  };
}
```

### Caching Strategy

```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function getCachedPage(page, limit) {
  const key = `posts:page:${page}:limit:${limit}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await getPaginatedData(page, limit);
  await redis.setex(key, 300, JSON.stringify(data));  // Cache 5min
  return data;
}

// Invalidate on writes
async function createPost(postData) {
  const post = await knex('posts').insert(postData);
  await redis.del(...await redis.keys('posts:page:*'));  // Clear cache
  return post;
}
```

## 6. API Design Patterns

### RESTful with Link Headers (GitHub Style)

```javascript
app.get('/api/users', async (req, res) => {
  const { page = 1, per_page = 30 } = req.query;
  const result = await getUsers(page, per_page);
  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

  const links = [];
  if (result.pagination.hasNext) {
    links.push(`<${baseUrl}?page=${page + 1}&per_page=${per_page}>; rel="next"`);
    links.push(`<${baseUrl}?page=${result.pagination.totalPages}&per_page=${per_page}>; rel="last"`);
  }
  if (result.pagination.hasPrev) {
    links.push(`<${baseUrl}?page=${page - 1}&per_page=${per_page}>; rel="prev"`);
  }

  if (links.length > 0) res.set('Link', links.join(', '));
  res.set('X-Total-Count', result.pagination.total);
  res.json(result.data);
});
```

### GraphQL Relay Connection (Cursor-Based)

```javascript
const PostConnection = new GraphQLObjectType({
  name: 'PostConnection',
  fields: {
    edges: { type: new GraphQLList(PostEdgeType) },
    pageInfo: {
      type: new GraphQLObjectType({
        name: 'PageInfo',
        fields: {
          hasNextPage: { type: GraphQLBoolean },
          hasPreviousPage: { type: GraphQLBoolean },
          startCursor: { type: GraphQLString },
          endCursor: { type: GraphQLString }
        }
      })
    }
  }
});

// Implementation: Use cursor-based logic from section 2
```

## 7. Frontend Examples

### React Simple Pagination

```javascript
function PaginatedList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (newPage) => {
    setLoading(true);
    const response = await fetch(`/api/users?page=${newPage}&limit=10`);
    const result = await response.json();
    setData(result.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(page); }, [page]);

  return (
    <div>
      {loading ? <div>Loading...</div> : data.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}
```

## Best Practices Summary

| Area | Recommendation |
|------|---------------|
| **Database** | Use indexes on sort columns, avoid COUNT(*), prefer cursor pagination for large datasets |
| **API** | Default limit=20, max=100, use cursor for feeds, cache when appropriate |
| **Frontend** | Show loading states, use virtual scrolling for 10k+ items, prefetch next page |
| **Performance** | Monitor slow queries with EXPLAIN, implement rate limiting, use ETags for caching |

**Cross-Reference:** For related topics, see `database-expert` (SQL optimization), `cache-strategist` (caching patterns), and `rest-api-designer` (API design).
