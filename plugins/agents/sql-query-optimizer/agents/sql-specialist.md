# SQL Query Optimization Specialist

A comprehensive guide to SQL query optimization, covering indexing strategies, execution plan analysis, JOIN optimization, and performance tuning techniques across different database systems.

## Table of Contents

- [Introduction](#introduction)
- [Query Optimization Fundamentals](#query-optimization-fundamentals)
- [Index Strategies](#index-strategies)
- [Execution Plan Analysis](#execution-plan-analysis)
- [JOIN Optimization](#join-optimization)
- [Subqueries vs CTEs](#subqueries-vs-ctes)
- [Query Rewriting Techniques](#query-rewriting-techniques)
- [Database-Specific Optimizations](#database-specific-optimizations)
- [Monitoring and Profiling](#monitoring-and-profiling)
- [Best Practices](#best-practices)

## Introduction

Query optimization is critical for database performance. A well-optimized query can be orders of magnitude faster than an unoptimized one, reducing server load, improving response times, and lowering infrastructure costs.

### Performance Metrics

```sql
-- Key metrics to monitor
-- 1. Execution time
-- 2. Rows examined vs rows returned
-- 3. Index usage
-- 4. Temporary table creation
-- 5. File sorts
-- 6. Lock wait time
-- 7. Buffer pool hit ratio
```

## Query Optimization Fundamentals

### Understanding Query Execution

```sql
-- Query execution order (logical):
-- 1. FROM (including JOINs)
-- 2. WHERE
-- 3. GROUP BY
-- 4. HAVING
-- 5. SELECT
-- 6. DISTINCT
-- 7. ORDER BY
-- 8. LIMIT/OFFSET

-- Example: Understanding execution flow
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.country = 'USA'
    AND o.order_date >= '2024-01-01'
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) > 5
ORDER BY total_spent DESC
LIMIT 100;

-- Optimization considerations:
-- 1. Filter early with WHERE
-- 2. Use appropriate JOIN type
-- 3. Ensure indexes on JOIN and WHERE columns
-- 4. GROUP BY only necessary columns
-- 5. Apply HAVING filters efficiently
-- 6. Order only final result set
```

### Avoiding Common Anti-Patterns

```sql
-- BAD: Using functions on indexed columns
SELECT * FROM users
WHERE YEAR(created_at) = 2024;

-- GOOD: Use range comparison
SELECT * FROM users
WHERE created_at >= '2024-01-01'
    AND created_at < '2025-01-01';

-- BAD: Using OR with different columns
SELECT * FROM products
WHERE category_id = 1 OR brand_id = 5;

-- GOOD: Use UNION or separate queries
SELECT * FROM products WHERE category_id = 1
UNION ALL
SELECT * FROM products WHERE brand_id = 5;

-- BAD: SELECT * when you don't need all columns
SELECT * FROM orders;

-- GOOD: Select only needed columns
SELECT order_id, customer_id, order_date, total_amount
FROM orders;

-- BAD: Using LIKE with leading wildcard
SELECT * FROM users
WHERE email LIKE '%@gmail.com';

-- GOOD: Use full-text search or redesign schema
-- Or at minimum, avoid leading wildcard
SELECT * FROM users
WHERE email LIKE 'john%';

-- BAD: NOT IN with subquery
SELECT * FROM orders
WHERE customer_id NOT IN (
    SELECT customer_id FROM banned_customers
);

-- GOOD: Use NOT EXISTS or LEFT JOIN
SELECT o.*
FROM orders o
LEFT JOIN banned_customers bc ON o.customer_id = bc.customer_id
WHERE bc.customer_id IS NULL;

-- Or use NOT EXISTS
SELECT * FROM orders o
WHERE NOT EXISTS (
    SELECT 1 FROM banned_customers bc
    WHERE bc.customer_id = o.customer_id
);
```

## Index Strategies

### Types of Indexes

```sql
-- 1. Primary Key Index (Clustered)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Unique Index
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- 3. Regular Index (B-Tree)
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4. Composite Index (Multiple columns)
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, order_date);

-- 5. Covering Index (includes all query columns)
CREATE INDEX idx_orders_covering
ON orders(customer_id, order_date)
INCLUDE (total_amount, status);

-- 6. Partial Index (Filtered index)
-- PostgreSQL
CREATE INDEX idx_active_users
ON users(email)
WHERE active = true;

-- SQL Server
CREATE INDEX idx_active_users
ON users(email)
WHERE active = 1;

-- 7. Full-Text Index
CREATE FULLTEXT INDEX idx_products_search
ON products(name, description);

-- 8. Spatial Index (for geographic data)
CREATE SPATIAL INDEX idx_locations_point
ON locations(coordinates);
```

### Index Design Principles

```sql
-- Composite Index Column Order
-- Rule: Most selective columns first, then by query frequency

-- Example: Orders table
-- Queries frequently filter by customer_id, then date, then status

-- GOOD: Follows query patterns
CREATE INDEX idx_orders_optimal
ON orders(customer_id, order_date, status);

-- This index supports:
SELECT * FROM orders WHERE customer_id = 123;
SELECT * FROM orders WHERE customer_id = 123 AND order_date > '2024-01-01';
SELECT * FROM orders WHERE customer_id = 123 AND order_date > '2024-01-01' AND status = 'shipped';

-- BAD: Wrong order
CREATE INDEX idx_orders_suboptimal
ON orders(status, order_date, customer_id);
-- Less efficient for customer-specific queries

-- Covering Indexes
-- Include all columns used in SELECT to avoid table lookups

CREATE INDEX idx_orders_report
ON orders(customer_id, order_date)
INCLUDE (total_amount, status, product_count);

-- Now this query uses only the index:
SELECT total_amount, status, product_count
FROM orders
WHERE customer_id = 123
    AND order_date >= '2024-01-01';

-- Index Selectivity
-- High selectivity = good for indexing
-- Low selectivity = poor for indexing

-- GOOD: High selectivity (email, username, order_id)
CREATE INDEX idx_users_email ON users(email);

-- POOR: Low selectivity (gender, boolean flags)
-- Generally avoid indexing columns with few distinct values
-- Exception: Partial indexes on filtered data

-- Calculate selectivity
SELECT
    COUNT(DISTINCT email) * 1.0 / COUNT(*) as email_selectivity,
    COUNT(DISTINCT gender) * 1.0 / COUNT(*) as gender_selectivity
FROM users;
-- email_selectivity ≈ 1.0 (good)
-- gender_selectivity ≈ 0.5 (poor)
```

### Index Maintenance

```sql
-- Analyze index usage (PostgreSQL)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find unused indexes (PostgreSQL)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%_pkey';

-- Index size (PostgreSQL)
SELECT
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- Rebuild fragmented indexes (SQL Server)
ALTER INDEX idx_orders_customer_date
ON orders REBUILD;

-- Update statistics (SQL Server)
UPDATE STATISTICS orders;

-- Analyze table (MySQL)
ANALYZE TABLE orders;

-- Optimize table (MySQL - rebuilds indexes)
OPTIMIZE TABLE orders;
```

## Execution Plan Analysis

### Reading Explain Plans

```sql
-- PostgreSQL EXPLAIN
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.country = 'USA'
GROUP BY c.customer_id, c.customer_name;

-- Key metrics to look for:
-- 1. Seq Scan vs Index Scan
-- 2. Rows estimated vs actual
-- 3. Execution time
-- 4. Buffer usage
-- 5. Sort operations
-- 6. Hash joins vs nested loops

-- MySQL EXPLAIN
EXPLAIN FORMAT=JSON
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.country = 'USA'
GROUP BY c.customer_id, c.customer_name;

-- Look for:
-- type: ALL (bad), index, range, ref, eq_ref, const (good)
-- key: Which index is used
-- rows: Estimated rows examined
-- Extra: Using filesort, Using temporary, Using index

-- SQL Server Execution Plan
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.country = 'USA'
GROUP BY c.customer_id, c.customer_name;
```

### Interpreting Common Issues

```sql
-- Issue 1: Sequential Scan
-- Problem
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- Seq Scan on orders (cost=0.00..1234.00 rows=1 width=100)

-- Solution: Add index
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Issue 2: Type = ALL (MySQL)
-- Problem
EXPLAIN SELECT * FROM orders WHERE YEAR(order_date) = 2024;
-- type: ALL, rows: 1000000

-- Solution: Use sargable query
EXPLAIN SELECT * FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';
-- type: range, rows: 50000

-- Issue 3: Using filesort
-- Problem
EXPLAIN SELECT * FROM orders ORDER BY customer_id, order_date;
-- Extra: Using filesort

-- Solution: Add index matching ORDER BY
CREATE INDEX idx_orders_sort ON orders(customer_id, order_date);

-- Issue 4: Using temporary
-- Problem
EXPLAIN SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id
ORDER BY COUNT(*) DESC;
-- Extra: Using temporary; Using filesort

-- Solution: Add covering index
CREATE INDEX idx_orders_group
ON orders(customer_id)
INCLUDE (order_id);

-- Issue 5: High cost nested loop
-- Problem: Nested loop join with large tables

-- Solution: Force hash join (PostgreSQL)
SET enable_nestloop = OFF;
-- Or provide better statistics
ANALYZE customers;
ANALYZE orders;
```

## JOIN Optimization

### JOIN Types and Performance

```sql
-- 1. INNER JOIN (most efficient)
SELECT o.order_id, c.customer_name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;

-- Index requirements:
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_customers_pk ON customers(customer_id);

-- 2. LEFT JOIN (can be slower)
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;

-- Optimization: Filter before joining
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
    AND o.order_date >= '2024-01-01'
WHERE c.country = 'USA'
GROUP BY c.customer_id, c.customer_name;

-- 3. CROSS JOIN (use with caution)
-- BAD: Unintentional cross join
SELECT *
FROM orders o, customers c
WHERE o.order_date = '2024-01-01';
-- Results in cartesian product!

-- GOOD: Explicit join condition
SELECT *
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date = '2024-01-01';
```

### JOIN Strategy Optimization

```sql
-- Small table to large table
-- Always join smaller result set first

-- BAD: Large table first
SELECT *
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.customer_id = 123;
-- Joins all orders first, then filters

-- GOOD: Filter first
SELECT *
FROM (
    SELECT * FROM orders WHERE customer_id = 123
) o
INNER JOIN order_items oi ON o.order_id = oi.order_id;
-- Or let optimizer handle it with proper indexes

-- Multiple JOINs optimization
-- BAD: No indexes, joins in suboptimal order
SELECT *
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;

-- GOOD: With proper indexes and order
-- Indexes needed:
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Query optimizer usually handles join order, but you can force it:
-- SQL Server
SELECT *
FROM customers c WITH (INDEX(idx_customers_pk))
INNER HASH JOIN orders o ON c.customer_id = o.customer_id
INNER MERGE JOIN order_items oi ON o.order_id = oi.order_id;

-- Derived table joins
-- BAD: Joining to large derived table
SELECT c.customer_name, summary.total_orders
FROM customers c
LEFT JOIN (
    SELECT customer_id, COUNT(*) as total_orders
    FROM orders
    GROUP BY customer_id
) summary ON c.customer_id = summary.customer_id;

-- BETTER: Use CTE or materialized view
WITH order_summary AS (
    SELECT customer_id, COUNT(*) as total_orders
    FROM orders
    GROUP BY customer_id
)
SELECT c.customer_name, os.total_orders
FROM customers c
LEFT JOIN order_summary os ON c.customer_id = os.customer_id;
```

### JOIN Performance Tips

```sql
-- 1. Use EXISTS instead of IN with subquery
-- BAD
SELECT * FROM customers
WHERE customer_id IN (
    SELECT customer_id FROM orders WHERE order_date >= '2024-01-01'
);

-- GOOD
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
        AND o.order_date >= '2024-01-01'
);

-- 2. Use INNER JOIN instead of WHERE IN
-- BAD
SELECT * FROM orders
WHERE customer_id IN (
    SELECT customer_id FROM customers WHERE country = 'USA'
);

-- GOOD
SELECT o.*
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE c.country = 'USA';

-- 3. Semi-join for existence checks
-- Get customers who have placed orders
SELECT DISTINCT c.*
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- BETTER: Use EXISTS
SELECT c.*
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);

-- 4. Anti-join for non-existence
-- Get customers who haven't placed orders
-- BAD
SELECT * FROM customers
WHERE customer_id NOT IN (
    SELECT customer_id FROM orders
);

-- GOOD
SELECT c.*
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.customer_id IS NULL;

-- BETTER
SELECT c.*
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

## Subqueries vs CTEs

### Subquery Types

```sql
-- Scalar subquery (returns single value)
SELECT
    order_id,
    total_amount,
    (SELECT AVG(total_amount) FROM orders) as avg_amount,
    total_amount - (SELECT AVG(total_amount) FROM orders) as diff_from_avg
FROM orders;

-- Correlated subquery (references outer query)
-- BAD: Executes for each row
SELECT
    c.customer_name,
    (SELECT COUNT(*)
     FROM orders o
     WHERE o.customer_id = c.customer_id) as order_count
FROM customers c;

-- GOOD: Use JOIN instead
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;

-- Derived table (subquery in FROM)
SELECT
    customer_id,
    avg_amount
FROM (
    SELECT
        customer_id,
        AVG(total_amount) as avg_amount
    FROM orders
    GROUP BY customer_id
) derived
WHERE avg_amount > 100;
```

### Common Table Expressions (CTEs)

```sql
-- Simple CTE
WITH order_summary AS (
    SELECT
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent,
        AVG(total_amount) as avg_order_value
    FROM orders
    WHERE order_date >= '2024-01-01'
    GROUP BY customer_id
)
SELECT
    c.customer_name,
    os.order_count,
    os.total_spent,
    os.avg_order_value
FROM customers c
INNER JOIN order_summary os ON c.customer_id = os.customer_id
WHERE os.order_count > 5;

-- Multiple CTEs
WITH
    active_customers AS (
        SELECT customer_id, customer_name, country
        FROM customers
        WHERE active = true
    ),
    recent_orders AS (
        SELECT customer_id, order_id, total_amount
        FROM orders
        WHERE order_date >= '2024-01-01'
    ),
    customer_totals AS (
        SELECT
            customer_id,
            COUNT(*) as order_count,
            SUM(total_amount) as total_spent
        FROM recent_orders
        GROUP BY customer_id
    )
SELECT
    ac.customer_name,
    ac.country,
    ct.order_count,
    ct.total_spent
FROM active_customers ac
INNER JOIN customer_totals ct ON ac.customer_id = ct.customer_id
WHERE ct.total_spent > 1000;

-- Recursive CTE (for hierarchical data)
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT
        category_id,
        parent_id,
        category_name,
        0 as level,
        CAST(category_name AS VARCHAR(1000)) as path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: child categories
    SELECT
        c.category_id,
        c.parent_id,
        c.category_name,
        ct.level + 1,
        CAST(ct.path || ' > ' || c.category_name AS VARCHAR(1000))
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT * FROM category_tree
ORDER BY path;

-- Materialized CTE (PostgreSQL)
-- Forces CTE evaluation once and reuse
WITH MATERIALIZED customer_summary AS (
    SELECT
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    GROUP BY customer_id
)
SELECT * FROM customer_summary WHERE total_spent > 1000
UNION ALL
SELECT * FROM customer_summary WHERE order_count > 10;
```

### CTE vs Subquery Performance

```sql
-- CTE advantages:
-- 1. Readability and maintainability
-- 2. Can be referenced multiple times
-- 3. Recursive queries
-- 4. Can be materialized (PostgreSQL)

-- Subquery advantages:
-- 1. Can be optimized as part of main query
-- 2. Inline evaluation possible
-- 3. Sometimes faster for simple cases

-- Example: CTE referenced multiple times
WITH order_stats AS (
    SELECT
        customer_id,
        AVG(total_amount) as avg_amount,
        MAX(total_amount) as max_amount,
        MIN(total_amount) as min_amount
    FROM orders
    GROUP BY customer_id
)
SELECT
    c.customer_name,
    os1.avg_amount,
    os2.max_amount,
    os3.min_amount
FROM customers c
LEFT JOIN order_stats os1 ON c.customer_id = os1.customer_id
LEFT JOIN order_stats os2 ON c.customer_id = os2.customer_id
LEFT JOIN order_stats os3 ON c.customer_id = os3.customer_id;
-- CTE calculated once, reused three times

-- Same with subquery would calculate three times
SELECT
    c.customer_name,
    (SELECT AVG(total_amount) FROM orders WHERE customer_id = c.customer_id) as avg_amount,
    (SELECT MAX(total_amount) FROM orders WHERE customer_id = c.customer_id) as max_amount,
    (SELECT MIN(total_amount) FROM orders WHERE customer_id = c.customer_id) as min_amount
FROM customers c;
-- Subquery executed 3 times per customer!
```

## Query Rewriting Techniques

### Optimization Examples

```sql
-- 1. Eliminate DISTINCT when possible
-- BAD: Unnecessary DISTINCT
SELECT DISTINCT o.order_id
FROM orders o
WHERE o.customer_id = 123;
-- order_id is unique, DISTINCT is redundant

-- GOOD
SELECT o.order_id
FROM orders o
WHERE o.customer_id = 123;

-- 2. Use UNION ALL instead of UNION
-- BAD: UNION removes duplicates (expensive)
SELECT customer_id FROM orders_2023
UNION
SELECT customer_id FROM orders_2024;

-- GOOD: If you know there are no duplicates
SELECT customer_id FROM orders_2023
UNION ALL
SELECT customer_id FROM orders_2024;

-- 3. Partition pruning
-- BAD: Scans all partitions
SELECT * FROM orders
WHERE order_date >= '2024-01-01';

-- GOOD: Explicitly filter on partition key
SELECT * FROM orders
WHERE order_date >= '2024-01-01'
    AND order_date < '2024-02-01';
-- Only scans relevant partition

-- 4. Batch operations
-- BAD: Multiple queries
INSERT INTO orders (customer_id, total_amount) VALUES (1, 100);
INSERT INTO orders (customer_id, total_amount) VALUES (2, 200);
INSERT INTO orders (customer_id, total_amount) VALUES (3, 300);

-- GOOD: Single batch insert
INSERT INTO orders (customer_id, total_amount)
VALUES
    (1, 100),
    (2, 200),
    (3, 300);

-- 5. Avoid OR across columns
-- BAD
SELECT * FROM products
WHERE category_id = 1 OR brand_id = 5;

-- GOOD: UNION ALL
SELECT * FROM products WHERE category_id = 1
UNION ALL
SELECT * FROM products WHERE brand_id = 5 AND category_id != 1;

-- 6. Window functions instead of self-joins
-- BAD: Self-join for ranking
SELECT o1.*
FROM orders o1
LEFT JOIN orders o2 ON o1.customer_id = o2.customer_id
    AND o1.order_date < o2.order_date
WHERE o2.order_id IS NULL;
-- Gets latest order per customer

-- GOOD: Window function
SELECT *
FROM (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) as rn
    FROM orders
) ranked
WHERE rn = 1;

-- 7. Aggregate pushdown
-- BAD: Aggregate after join
SELECT
    c.customer_name,
    SUM(o.total_amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;

-- GOOD: Aggregate before join
SELECT
    c.customer_name,
    COALESCE(order_summary.total_spent, 0) as total_spent
FROM customers c
LEFT JOIN (
    SELECT customer_id, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY customer_id
) order_summary ON c.customer_id = order_summary.customer_id;
```

## Database-Specific Optimizations

| Feature | PostgreSQL | MySQL | SQL Server |
|---------|------------|-------|------------|
| **Execution Plan** | `EXPLAIN (ANALYZE, BUFFERS)` | `EXPLAIN FORMAT=JSON` | `SET STATISTICS IO/TIME ON` |
| **Partial Indexes** | ✅ `WHERE status = 'active'` | ❌ Use filtered query | ✅ Filtered indexes |
| **Expression Indexes** | ✅ `LOWER(email)` | ❌ Generated columns | ✅ Computed columns |
| **Parallel Queries** | ✅ `max_parallel_workers` | ✅ Auto (8.0+) | ✅ `MAXDOP` hint |
| **Maintenance** | `VACUUM ANALYZE` | `OPTIMIZE TABLE` | `UPDATE STATISTICS` |
| **Partitioning** | `PARTITION BY RANGE` | `PARTITION BY RANGE` | Partition functions |

### PostgreSQL Optimizations

```sql
-- Partial index for active records
CREATE INDEX idx_active ON orders(customer_id) WHERE status = 'active';

-- BRIN for sequential data (time-series)
CREATE INDEX idx_date_brin ON orders USING BRIN(order_date);

-- Maintenance
VACUUM ANALYZE orders;
```

### MySQL Optimizations

```sql
-- Force index usage
SELECT * FROM orders FORCE INDEX (idx_customer) WHERE customer_id = 123;

-- Optimize data types
CREATE TABLE order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL
);
```

### SQL Server Optimizations

```sql
-- Indexed view (materialized)
CREATE VIEW summary WITH SCHEMABINDING AS
SELECT customer_id, COUNT_BIG(*) as cnt
FROM dbo.orders GROUP BY customer_id;
CREATE UNIQUE CLUSTERED INDEX idx_summary ON summary(customer_id);

-- Columnstore for analytics
CREATE COLUMNSTORE INDEX idx_analytics ON orders_history;
```

## Monitoring and Profiling

### Slow Query Identification

```sql
-- PostgreSQL: pg_stat_statements
SELECT query, calls, total_time/1000 as total_sec, mean_time/1000 as avg_sec
FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- MySQL: Performance Schema
SELECT DIGEST_TEXT, COUNT_STAR, AVG_TIMER_WAIT/1000000000 as avg_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;

-- SQL Server: Query Store
SELECT query_sql_text, count_executions, avg_duration/1000 as avg_ms
FROM sys.query_store_runtime_stats rs
JOIN sys.query_store_query q ON rs.plan_id = q.query_id
ORDER BY avg_duration DESC;
```

### Performance Metrics

**Buffer Hit Ratio** (target >90%):
- PostgreSQL: `pg_statio_user_tables` - heap_blks_hit / total
- MySQL: `SHOW STATUS LIKE 'Innodb_buffer_pool_read%'`
- SQL Server: `sys.dm_os_performance_counters` - Buffer cache hit ratio

**Table Statistics**:
- Monitor dead rows (PostgreSQL `n_dead_tup`)
- Check last vacuum/analyze timestamps
- Verify index usage with `pg_stat_user_indexes`

## Best Practices

### Optimization Checklist

**Index Strategy**:
- ✓ Index foreign keys, WHERE/JOIN/ORDER BY columns
- ✓ Use composite indexes (most selective column first)
- ✓ Create covering indexes for frequent queries
- ✓ Remove unused indexes (check `pg_stat_user_indexes`)

**Query Writing**:
- ✓ Select only needed columns (avoid SELECT *)
- ✓ Use WHERE not HAVING for filtering
- ✓ Avoid functions on indexed columns
- ✓ Use EXISTS instead of IN with subqueries
- ✓ Use UNION ALL instead of UNION when appropriate

**Data Types**:
- ✓ Use smallest appropriate type (INT not VARCHAR for IDs)
- ✓ Use DATE not DATETIME when time not needed
- ✓ Use ENUM/CHECK constraints for fixed values

**Maintenance**:
- ✓ Update statistics regularly (ANALYZE/OPTIMIZE)
- ✓ Rebuild fragmented indexes
- ✓ Partition large tables
- ✓ Archive old data

**Application Level**:
- ✓ Use connection pooling
- ✓ Implement query result caching
- ✓ Use batch operations
- ✓ Paginate large result sets

### Query Optimization Workflow

1. **Identify**: Use monitoring tools to find slow queries
2. **Analyze**: Run `EXPLAIN ANALYZE` to see execution plan
3. **Check**: Look for sequential scans, missing indexes, filesorts
4. **Optimize**: Add indexes, rewrite queries, adjust join order
5. **Measure**: Compare execution time, logical reads, CPU usage
6. **Monitor**: Watch for regressions and plan changes

## Related Agents

- **database-expert**: Database design and schema optimization
- **cache-strategist**: Redis caching for query results
- **microservices-architect**: Database scaling strategies
- **sre-reliability-engineer**: Database monitoring and SLAs

Comprehensive SQL optimization guide applicable across PostgreSQL, MySQL, and SQL Server.
