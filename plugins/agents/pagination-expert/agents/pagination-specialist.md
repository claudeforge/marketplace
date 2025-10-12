# Pagination Specialist

A comprehensive guide to pagination strategies, implementation patterns, and best practices for building efficient and scalable paginated APIs and user interfaces.

## Table of Contents

- [Introduction](#introduction)
- [Pagination Types](#pagination-types)
- [Offset-Based Pagination](#offset-based-pagination)
- [Cursor-Based Pagination](#cursor-based-pagination)
- [Keyset Pagination](#keyset-pagination)
- [Infinite Scroll](#infinite-scroll)
- [Database Optimization](#database-optimization)
- [API Design Patterns](#api-design-patterns)
- [Frontend Implementation](#frontend-implementation)
- [Performance Considerations](#performance-considerations)

## Introduction

Pagination is essential for handling large datasets efficiently. Proper pagination improves performance, user experience, and reduces server load by limiting the amount of data transferred and processed.

### When to Use Pagination

```javascript
// Use pagination when:
const paginationCriteria = {
  datasetSize: '> 100 records',
  responseTime: '> 1 second for full dataset',
  networkPayload: '> 1MB',
  userExperience: 'Progressive loading preferred',
  realtime: 'Data changes frequently'
};
```

## Pagination Types

### Overview

```javascript
const paginationTypes = {
  offsetBased: {
    pros: [
      'Simple to implement',
      'Random page access',
      'Easy to understand'
    ],
    cons: [
      'Performance degrades with large offsets',
      'Inconsistent results with data changes',
      'Not suitable for real-time data'
    ],
    useCases: ['Admin panels', 'Small datasets', 'Static data']
  },
  cursorBased: {
    pros: [
      'Consistent results',
      'Efficient for large datasets',
      'Handles real-time data well'
    ],
    cons: [
      'No random page access',
      'More complex to implement',
      'Requires unique sortable field'
    ],
    useCases: ['Social feeds', 'Real-time data', 'Mobile apps']
  },
  keysetBased: {
    pros: [
      'Best performance',
      'Consistent results',
      'Works with complex sorting'
    ],
    cons: [
      'Most complex to implement',
      'Requires indexed columns',
      'No random page jumps'
    ],
    useCases: ['High-volume APIs', 'Time-series data', 'Logs']
  }
};
```

## Offset-Based Pagination

Offset-based pagination uses `limit` and `offset` (or `skip`) parameters to paginate through results.

### Basic Implementation

```javascript
// Express.js API endpoint
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      db.query('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]),
      db.query('SELECT COUNT(*) as count FROM users')
    ]);

    const totalPages = Math.ceil(total[0].count / limit);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total: total[0].count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### With Query Builder (Knex.js)

```javascript
const knex = require('knex')(config);

async function getUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    knex('users')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset),
    knex('users').count('* as count').first()
  ]);

  const total = totalCount.count;
  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}
```

### With ORM (Sequelize)

```javascript
const { User } = require('./models');

async function getUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const { rows: users, count: total } = await User.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: page > 1
    }
  };
}
```

### With Filters and Search

```javascript
async function searchUsers(filters = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = null,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = filters;

  const offset = (page - 1) * limit;

  let query = knex('users').select('*');
  let countQuery = knex('users');

  // Apply search filter
  if (search) {
    const searchPattern = `%${search}%`;
    query = query.where(function() {
      this.where('name', 'like', searchPattern)
        .orWhere('email', 'like', searchPattern);
    });
    countQuery = countQuery.where(function() {
      this.where('name', 'like', searchPattern)
        .orWhere('email', 'like', searchPattern);
    });
  }

  // Apply role filter
  if (role) {
    query = query.where('role', role);
    countQuery = countQuery.where('role', role);
  }

  // Apply sorting and pagination
  query = query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);

  const [users, totalCount] = await Promise.all([
    query,
    countQuery.count('* as count').first()
  ]);

  const total = totalCount.count;

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: page > 1
    },
    filters: {
      search,
      role,
      sortBy,
      sortOrder
    }
  };
}
```

### MongoDB Implementation

```javascript
const mongoose = require('mongoose');

async function getUsersMongo(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments()
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1
    }
  };
}
```

## Cursor-Based Pagination

Cursor-based pagination uses a pointer (cursor) to the last item retrieved to fetch the next set of results.

### Basic Implementation

```javascript
// Using ID as cursor
app.get('/api/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor; // Last seen post ID

  try {
    let query = knex('posts')
      .select('*')
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc')
      .limit(limit + 1); // Fetch one extra to check if there's more

    if (cursor) {
      query = query.where('id', '<', cursor);
    }

    const posts = await query;
    const hasNext = posts.length > limit;

    if (hasNext) {
      posts.pop(); // Remove the extra item
    }

    const nextCursor = hasNext ? posts[posts.length - 1].id : null;

    res.json({
      data: posts,
      pagination: {
        cursor: nextCursor,
        hasNext,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Timestamp-Based Cursor

```javascript
async function getPostsByTimestamp(cursor = null, limit = 10) {
  let query = knex('posts')
    .select('*')
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc') // Secondary sort for consistent ordering
    .limit(limit + 1);

  if (cursor) {
    // Cursor format: timestamp:id
    const [timestamp, id] = cursor.split(':');
    query = query.where(function() {
      this.where('created_at', '<', timestamp)
        .orWhere(function() {
          this.where('created_at', '=', timestamp)
            .andWhere('id', '<', id);
        });
    });
  }

  const posts = await query;
  const hasNext = posts.length > limit;

  if (hasNext) {
    posts.pop();
  }

  const nextCursor = hasNext
    ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}`
    : null;

  return {
    data: posts,
    pagination: {
      cursor: nextCursor,
      hasNext,
      limit
    }
  };
}
```

### Bidirectional Cursor Pagination

```javascript
async function getBidirectionalPosts(cursor = null, direction = 'next', limit = 10) {
  let query = knex('posts').select('*');

  if (cursor) {
    const [timestamp, id] = cursor.split(':');

    if (direction === 'next') {
      query = query
        .where(function() {
          this.where('created_at', '<', timestamp)
            .orWhere(function() {
              this.where('created_at', '=', timestamp)
                .andWhere('id', '<', id);
            });
        })
        .orderBy('created_at', 'desc')
        .orderBy('id', 'desc');
    } else {
      // Previous page
      query = query
        .where(function() {
          this.where('created_at', '>', timestamp)
            .orWhere(function() {
              this.where('created_at', '=', timestamp)
                .andWhere('id', '>', id);
            });
        })
        .orderBy('created_at', 'asc')
        .orderBy('id', 'asc');
    }
  } else {
    query = query.orderBy('created_at', 'desc').orderBy('id', 'desc');
  }

  query = query.limit(limit + 1);

  let posts = await query;

  if (direction === 'prev') {
    posts = posts.reverse();
  }

  const hasNext = posts.length > limit;
  const hasPrev = cursor !== null;

  if (hasNext) {
    posts.pop();
  }

  const nextCursor = hasNext && posts.length > 0
    ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}`
    : null;

  const prevCursor = posts.length > 0
    ? `${posts[0].created_at}:${posts[0].id}`
    : null;

  return {
    data: posts,
    pagination: {
      nextCursor,
      prevCursor,
      hasNext,
      hasPrev,
      limit
    }
  };
}
```

### Encrypted Cursor

```javascript
const crypto = require('crypto');

class CursorPagination {
  constructor(secret) {
    this.secret = secret;
  }

  encodeCursor(data) {
    const json = JSON.stringify(data);
    const cipher = crypto.createCipher('aes-256-cbc', this.secret);
    let encrypted = cipher.update(json, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.from(encrypted).toString('base64url');
  }

  decodeCursor(cursor) {
    try {
      const encrypted = Buffer.from(cursor, 'base64url').toString('base64');
      const decipher = crypto.createDecipher('aes-256-cbc', this.secret);
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  async paginate(model, cursor = null, limit = 10) {
    let query = model.orderBy('created_at', 'desc').orderBy('id', 'desc');

    if (cursor) {
      const decoded = this.decodeCursor(cursor);
      if (!decoded) {
        throw new Error('Invalid cursor');
      }

      query = query.where(function() {
        this.where('created_at', '<', decoded.timestamp)
          .orWhere(function() {
            this.where('created_at', '=', decoded.timestamp)
              .andWhere('id', '<', decoded.id);
          });
      });
    }

    const items = await query.limit(limit + 1);
    const hasNext = items.length > limit;

    if (hasNext) {
      items.pop();
    }

    const nextCursor = hasNext
      ? this.encodeCursor({
          timestamp: items[items.length - 1].created_at,
          id: items[items.length - 1].id
        })
      : null;

    return {
      data: items,
      pagination: {
        cursor: nextCursor,
        hasNext,
        limit
      }
    };
  }
}

// Usage
const paginator = new CursorPagination(process.env.CURSOR_SECRET);
const result = await paginator.paginate(knex('posts'), cursor, 10);
```

## Keyset Pagination

Keyset pagination (also called seek method) uses the values of the last row to determine the next page.

### Basic Keyset Implementation

```javascript
async function getPostsKeyset(lastId = null, lastCreatedAt = null, limit = 10) {
  let query = knex('posts')
    .select('id', 'title', 'content', 'created_at')
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')
    .limit(limit);

  if (lastId && lastCreatedAt) {
    query = query.where(function() {
      this.where('created_at', '<', lastCreatedAt)
        .orWhere(function() {
          this.where('created_at', '=', lastCreatedAt)
            .andWhere('id', '<', lastId);
        });
    });
  }

  const posts = await query;

  return {
    data: posts,
    pagination: {
      lastId: posts.length > 0 ? posts[posts.length - 1].id : null,
      lastCreatedAt: posts.length > 0 ? posts[posts.length - 1].created_at : null,
      hasMore: posts.length === limit
    }
  };
}
```

### Complex Multi-Column Keyset

```javascript
async function getProductsKeyset(filters = {}) {
  const {
    lastPrice = null,
    lastRating = null,
    lastId = null,
    limit = 20,
    sortBy = 'price', // price, rating, created_at
    sortOrder = 'desc'
  } = filters;

  let query = knex('products')
    .select('id', 'name', 'price', 'rating', 'created_at')
    .limit(limit);

  // Build dynamic keyset query
  if (lastPrice !== null && lastRating !== null && lastId !== null) {
    if (sortBy === 'price') {
      query = query.where(function() {
        if (sortOrder === 'desc') {
          this.where('price', '<', lastPrice)
            .orWhere(function() {
              this.where('price', '=', lastPrice)
                .andWhere('rating', '<', lastRating);
            })
            .orWhere(function() {
              this.where('price', '=', lastPrice)
                .andWhere('rating', '=', lastRating)
                .andWhere('id', '<', lastId);
            });
        } else {
          this.where('price', '>', lastPrice)
            .orWhere(function() {
              this.where('price', '=', lastPrice)
                .andWhere('rating', '>', lastRating);
            })
            .orWhere(function() {
              this.where('price', '=', lastPrice)
                .andWhere('rating', '=', lastRating)
                .andWhere('id', '>', lastId);
            });
        }
      });
    }
  }

  // Apply sorting
  query = query
    .orderBy(sortBy, sortOrder)
    .orderBy('rating', sortOrder)
    .orderBy('id', sortOrder);

  const products = await query;

  return {
    data: products,
    pagination: {
      lastPrice: products.length > 0 ? products[products.length - 1].price : null,
      lastRating: products.length > 0 ? products[products.length - 1].rating : null,
      lastId: products.length > 0 ? products[products.length - 1].id : null,
      hasMore: products.length === limit,
      limit
    }
  };
}
```

## Infinite Scroll

Infinite scroll is a UX pattern that loads more content as the user scrolls.

### Backend API for Infinite Scroll

```javascript
app.get('/api/feed', async (req, res) => {
  const cursor = req.query.cursor;
  const limit = parseInt(req.query.limit) || 20;

  try {
    let query = knex('posts')
      .select('posts.*', 'users.name as author_name')
      .join('users', 'posts.user_id', 'users.id')
      .orderBy('posts.created_at', 'desc')
      .orderBy('posts.id', 'desc')
      .limit(limit + 1);

    if (cursor) {
      const [timestamp, id] = cursor.split(':');
      query = query.where(function() {
        this.where('posts.created_at', '<', timestamp)
          .orWhere(function() {
            this.where('posts.created_at', '=', timestamp)
              .andWhere('posts.id', '<', id);
          });
      });
    }

    const posts = await query;
    const hasMore = posts.length > limit;

    if (hasMore) {
      posts.pop();
    }

    const nextCursor = hasMore
      ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}`
      : null;

    res.json({
      data: posts,
      cursor: nextCursor,
      hasMore
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### React Infinite Scroll Component

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

    try {
      const params = new URLSearchParams({ limit: 20 });
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`/api/feed?${params}`);
      const data = await response.json();

      setPosts(prev => [...prev, ...data.data]);
      setCursor(data.cursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore, loading]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <span>by {post.author_name}</span>
        </div>
      ))}

      {loading && <div className="loading">Loading...</div>}

      <div ref={observerTarget} className="observer-target" />

      {!hasMore && <div className="end">No more posts</div>}
    </div>
  );
}

export default InfiniteScrollFeed;
```

### Virtualized Infinite Scroll

```javascript
import React, { useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function VirtualizedFeed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);

  const loadMoreItems = useCallback(async (startIndex, stopIndex) => {
    if (!hasMore) return;

    try {
      const params = new URLSearchParams({ limit: 50 });
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`/api/feed?${params}`);
      const data = await response.json();

      setPosts(prev => [...prev, ...data.data]);
      setCursor(data.cursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }, [cursor, hasMore]);

  const isItemLoaded = index => !hasMore || index < posts.length;

  const itemCount = hasMore ? posts.length + 1 : posts.length;

  const Item = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    }

    const post = posts[index];
    return (
      <div style={style} className="post">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={600}
          itemCount={itemCount}
          itemSize={150}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default VirtualizedFeed;
```

## Database Optimization

### Index Strategies

```sql
-- Offset pagination: Index on sort columns
CREATE INDEX idx_users_created_at ON users(created_at DESC, id DESC);

-- Cursor pagination: Compound index
CREATE INDEX idx_posts_cursor ON posts(created_at DESC, id DESC);

-- Keyset pagination with multiple sort columns
CREATE INDEX idx_products_keyset ON products(price DESC, rating DESC, id DESC);

-- Filtered pagination: Covering index
CREATE INDEX idx_users_filtered ON users(role, created_at DESC, id DESC)
INCLUDE (name, email, status);

-- Full-text search with pagination
CREATE FULLTEXT INDEX idx_posts_search ON posts(title, content);
CREATE INDEX idx_posts_search_date ON posts(created_at DESC, id DESC);
```

### Query Optimization

```javascript
// BAD: Count query is expensive
async function getPaginatedDataBad(page, limit) {
  const offset = (page - 1) * limit;
  const total = await knex('posts').count('* as count').first();
  const posts = await knex('posts').limit(limit).offset(offset);

  return {
    data: posts,
    total: total.count,
    page,
    totalPages: Math.ceil(total.count / limit)
  };
}

// GOOD: Only count when necessary
async function getPaginatedDataGood(page, limit) {
  const offset = (page - 1) * limit;

  // Fetch one extra to determine if there's more
  const posts = await knex('posts').limit(limit + 1).offset(offset);
  const hasMore = posts.length > limit;

  if (hasMore) {
    posts.pop();
  }

  return {
    data: posts,
    page,
    hasNext: hasMore,
    hasPrev: page > 1
  };
}

// BETTER: Use cursor pagination for large datasets
async function getCursorPaginatedData(cursor, limit) {
  let query = knex('posts')
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')
    .limit(limit + 1);

  if (cursor) {
    const [timestamp, id] = cursor.split(':');
    query = query.where(function() {
      this.where('created_at', '<', timestamp)
        .orWhere(function() {
          this.where('created_at', '=', timestamp)
            .andWhere('id', '<', id);
        });
    });
  }

  const posts = await query;
  const hasMore = posts.length > limit;

  if (hasMore) {
    posts.pop();
  }

  return {
    data: posts,
    cursor: hasMore
      ? `${posts[posts.length - 1].created_at}:${posts[posts.length - 1].id}`
      : null,
    hasMore
  };
}
```

### Caching Strategies

```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function getCachedPaginatedData(page, limit) {
  const cacheKey = `posts:page:${page}:limit:${limit}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await getPaginatedData(page, limit);

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(data));

  return data;
}

// Invalidate cache on data changes
async function createPost(postData) {
  const post = await knex('posts').insert(postData);

  // Invalidate first page cache
  const keys = await redis.keys('posts:page:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return post;
}
```

## API Design Patterns

### RESTful Pagination

```javascript
// Link Header (GitHub style)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.per_page) || 30;

  const result = await getUsers(page, limit);

  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  const links = [];

  if (result.pagination.hasNext) {
    links.push(`<${baseUrl}?page=${page + 1}&per_page=${limit}>; rel="next"`);
    links.push(`<${baseUrl}?page=${result.pagination.totalPages}&per_page=${limit}>; rel="last"`);
  }

  if (result.pagination.hasPrev) {
    links.push(`<${baseUrl}?page=${page - 1}&per_page=${limit}>; rel="prev"`);
    links.push(`<${baseUrl}?page=1&per_page=${limit}>; rel="first"`);
  }

  if (links.length > 0) {
    res.set('Link', links.join(', '));
  }

  res.set('X-Total-Count', result.pagination.total);
  res.json(result.data);
});
```

### GraphQL Pagination (Relay Cursor Connections)

```javascript
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } = require('graphql');

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    createdAt: { type: GraphQLString }
  }
});

const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    hasNextPage: { type: GraphQLBoolean },
    hasPreviousPage: { type: GraphQLBoolean },
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString }
  }
});

const PostEdgeType = new GraphQLObjectType({
  name: 'PostEdge',
  fields: {
    node: { type: PostType },
    cursor: { type: GraphQLString }
  }
});

const PostConnectionType = new GraphQLObjectType({
  name: 'PostConnection',
  fields: {
    edges: { type: new GraphQLList(PostEdgeType) },
    pageInfo: { type: PageInfoType },
    totalCount: { type: GraphQLInt }
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    posts: {
      type: PostConnectionType,
      args: {
        first: { type: GraphQLInt },
        after: { type: GraphQLString },
        last: { type: GraphQLInt },
        before: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const { first, after, last, before } = args;

        // Forward pagination
        if (first) {
          let query = knex('posts')
            .orderBy('created_at', 'desc')
            .orderBy('id', 'desc')
            .limit(first + 1);

          if (after) {
            const [timestamp, id] = Buffer.from(after, 'base64').toString().split(':');
            query = query.where(function() {
              this.where('created_at', '<', timestamp)
                .orWhere(function() {
                  this.where('created_at', '=', timestamp)
                    .andWhere('id', '<', id);
                });
            });
          }

          const posts = await query;
          const hasNextPage = posts.length > first;

          if (hasNextPage) {
            posts.pop();
          }

          const edges = posts.map(post => ({
            node: post,
            cursor: Buffer.from(`${post.created_at}:${post.id}`).toString('base64')
          }));

          return {
            edges,
            pageInfo: {
              hasNextPage,
              hasPreviousPage: after !== null,
              startCursor: edges.length > 0 ? edges[0].cursor : null,
              endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
            },
            totalCount: await knex('posts').count('* as count').first().then(r => r.count)
          };
        }

        // Similar implementation for backward pagination with 'last' and 'before'
      }
    }
  }
});
```

## Frontend Implementation

### React Pagination Component

```javascript
import React, { useState, useEffect } from 'react';

function PaginatedList() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?page=${page}&limit=${pagination.limit}`);
      const result = await response.json();

      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    fetchData(newPage);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="data-list">
            {data.map(item => (
              <div key={item.id} className="data-item">
                {item.name}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PaginatedList;
```

### Vue.js Pagination

```javascript
<template>
  <div>
    <div v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="item in data" :key="item.id" class="item">
        {{ item.name }}
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="!pagination.hasPrev">
          Previous
        </button>

        <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>

        <button @click="nextPage" :disabled="!pagination.hasNext">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      loading: false
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData(page = 1) {
      this.loading = true;
      try {
        const response = await fetch(
          `/api/users?page=${page}&limit=${this.pagination.limit}`
        );
        const result = await response.json();

        this.data = result.data;
        this.pagination = result.pagination;
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.pagination.hasNext) {
        this.fetchData(this.pagination.page + 1);
      }
    },
    prevPage() {
      if (this.pagination.hasPrev) {
        this.fetchData(this.pagination.page - 1);
      }
    }
  }
};
</script>
```

## Performance Considerations

### Best Practices Summary

```javascript
const paginationBestPractices = {
  database: [
    'Always use indexes on sort columns',
    'Avoid COUNT(*) queries when possible',
    'Use LIMIT + 1 to check for more results',
    'Consider cursor pagination for large datasets',
    'Use covering indexes to avoid lookups'
  ],
  api: [
    'Implement reasonable default and maximum limits',
    'Use cursor pagination for real-time feeds',
    'Cache paginated results when appropriate',
    'Return pagination metadata in consistent format',
    'Support multiple sort orders'
  ],
  frontend: [
    'Show loading states during fetches',
    'Implement optimistic UI updates',
    'Use virtual scrolling for large lists',
    'Debounce pagination controls',
    'Prefetch next page for better UX'
  ],
  performance: [
    'Monitor slow queries and optimize',
    'Use database query explain plans',
    'Implement rate limiting on pagination endpoints',
    'Consider ETags for caching',
    'Use CDN for static paginated content'
  ]
};
```

This comprehensive guide covers all major pagination strategies with practical implementations for various use cases.
