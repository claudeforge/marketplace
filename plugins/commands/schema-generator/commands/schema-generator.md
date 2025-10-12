---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge database schema and migration generator for PostgreSQL, MySQL, MongoDB with ORM integration.
---

# ClaudeForge Schema Generator

ClaudeForge intelligent database schema design and migration system that creates optimized, scalable database architectures with automated migration generation and comprehensive ORM integration across multiple database platforms.

## Purpose

Transform database design from manual schema creation to intelligent automation that ensures data integrity, performance optimization, and seamless migration management across relational and NoSQL databases.

## Features

- **Multi-Database Support**: Generate schemas for PostgreSQL, MySQL, MongoDB, and other major databases
- **ORM Integration**: Seamless integration with Prisma, TypeORM, Sequelize, and Mongoose
- **Migration Generation**: Automated migration script creation with rollback capabilities
- **Schema Validation**: Comprehensive validation and constraint enforcement
- **Performance Optimization**: Index creation, query optimization, and denormalization strategies
- **Relationship Management**: Automatic detection and creation of entity relationships
- **Version Control**: Database version control with migration history tracking
- **Documentation**: Auto-generated schema documentation with ER diagrams

## Usage

```bash
/schema-generator [database] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current scope)

### Database Types

**PostgreSQL Schema Design:**
```bash
/schema-generator postgres --entity=User,Post,Comment --relations=true
```
Generates PostgreSQL schema with:
- Properly typed columns with PostgreSQL-specific types (JSONB, UUID, ARRAY)
- Foreign key constraints with CASCADE/RESTRICT options
- Check constraints for data validation
- Unique constraints and composite indexes
- Partial indexes for query optimization
- Full-text search configuration
- Table partitioning strategies
- Materialized views for complex queries

**MySQL Schema Design:**
```bash
/schema-generator mysql --entity=Product --storage-engine=InnoDB
```
Creates MySQL schema including:
- InnoDB storage engine with foreign key support
- Proper character set (utf8mb4) and collation
- Indexed columns for query performance
- Trigger definitions for data integrity
- Auto-increment primary keys
- Timestamp columns with automatic updates
- Enum and Set types for predefined values
- Spatial data types for location data

**MongoDB Schema Design:**
```bash
/schema-generator mongodb --collection=Order --validation=strict
```
Designs MongoDB schema with:
- JSON Schema validation rules
- Embedded document structures
- Reference patterns for relationships
- Index definitions (single, compound, text)
- TTL indexes for automatic expiration
- Unique constraints across fields
- Sharding key recommendations
- Aggregation pipeline optimization

### ORM Integration

**Prisma Schema Generation:**
```bash
/schema-generator prisma --datasource=postgresql --models=User,Profile
```
Generates Prisma schema with:
- Model definitions with proper field types
- Relation annotations (@relation)
- Unique and index constraints (@@unique, @@index)
- Default values and auto-increment fields
- Enum definitions for type safety
- Database-level functions (now(), autoincrement())
- Multi-field unique constraints
- Custom table names and field mappings

**TypeORM Entity Generation:**
```bash
/schema-generator typeorm --database=mysql --decorators=true
```
Creates TypeORM entities including:
- Entity decorators (@Entity, @Column, @PrimaryGeneratedColumn)
- Relationship decorators (@OneToMany, @ManyToOne, @ManyToMany)
- Column type definitions with database-specific types
- Custom repository implementations
- Entity listeners and subscribers
- Embedded entities for complex types
- Tree structures (Closure Table, Nested Set)
- View entities for complex queries

**Sequelize Model Generation:**
```bash
/schema-generator sequelize --dialect=postgres --associations=true
```
Generates Sequelize models with:
- Model definitions with field validations
- Association methods (hasMany, belongsTo, belongsToMany)
- Instance and class methods
- Hooks for lifecycle events
- Scopes for reusable query modifiers
- Virtual fields and getters/setters
- Paranoid (soft delete) configuration
- Custom table and column names

### Migration Strategies

**Version-Based Migrations:**
```bash
/schema-generator migrate --type=versioned --from=v1 --to=v2
```
Creates versioned migrations with:
- Sequential version numbering (001, 002, 003)
- Up and down migration scripts
- Idempotent operations (IF NOT EXISTS)
- Data migration along with schema changes
- Transaction wrapping for atomicity
- Checksum validation for integrity
- Migration dependency tracking
- Automatic rollback on failure

**Timestamp-Based Migrations:**
```bash
/schema-generator migrate --type=timestamp --auto-generate=true
```
Generates timestamp migrations including:
- Timestamp-based migration naming (20231201_120000)
- Automatic detection of schema changes
- Column additions, modifications, deletions
- Index and constraint changes
- Table renames with data preservation
- Batch data transformations
- Performance-optimized bulk operations
- Zero-downtime migration strategies

**Schema Synchronization:**
```bash
/schema-generator sync --mode=safe --backup=true
```
Performs schema synchronization with:
- Comparison between code models and database schema
- Safe synchronization with data preservation
- Automatic backup before changes
- Detection of breaking changes
- Advisory warnings for data loss operations
- Dry-run mode for preview
- Differential schema reports
- Rollback capabilities

## Design Principles

### Normalization Standards
- **First Normal Form (1NF)**: Eliminate repeating groups and arrays
- **Second Normal Form (2NF)**: Remove partial dependencies
- **Third Normal Form (3NF)**: Eliminate transitive dependencies
- **Boyce-Codd Normal Form (BCNF)**: Advanced normalization for complex schemas
- **Denormalization**: Strategic denormalization for performance optimization

### Data Integrity
- **Entity Integrity**: Primary key constraints on all tables
- **Referential Integrity**: Foreign key constraints with proper cascading
- **Domain Integrity**: Data type constraints and validation rules
- **User-Defined Integrity**: Business rule enforcement through constraints
- **Temporal Integrity**: Audit trails and versioning mechanisms

### Performance Optimization
- **Index Strategy**: Covering indexes, partial indexes, and composite indexes
- **Query Optimization**: Analyze query patterns and optimize accordingly
- **Partitioning**: Table and index partitioning for large datasets
- **Caching**: Materialized views and query result caching
- **Connection Pooling**: Optimal database connection management

### Schema Design Patterns
- **Single Table Inheritance**: One table for class hierarchy
- **Class Table Inheritance**: Separate tables per class
- **Polymorphic Associations**: Flexible relationship patterns
- **Soft Deletes**: Logical deletion with timestamp tracking
- **Audit Logging**: Change tracking with user attribution

## Code Generation Examples

### PostgreSQL Schema
```sql
-- Users table with advanced PostgreSQL features
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile JSONB DEFAULT '{}',
  roles TEXT[] DEFAULT ARRAY['user'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT username_length CHECK (LENGTH(username) >= 3)
);

-- Composite index for common queries
CREATE INDEX idx_users_email_active ON users(email) WHERE deleted_at IS NULL;

-- GIN index for JSONB queries
CREATE INDEX idx_users_profile ON users USING GIN(profile);

-- Full-text search index
CREATE INDEX idx_users_search ON users USING GIN(to_tsvector('english', username || ' ' || email));

-- Trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique @db.VarChar(255)
  username      String    @unique @db.VarChar(50)
  passwordHash  String    @map("password_hash") @db.VarChar(255)
  profile       Json      @default("{}")
  roles         String[]  @default(["user"])
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt     DateTime? @map("deleted_at") @db.Timestamptz

  @@index([email], where: { deletedAt: null })
  @@map("users")
}

model Post {
  id          String    @id @default(uuid())
  title       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  content     String    @db.Text
  published   Boolean   @default(false)
  authorId    String    @map("author_id")
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments    Comment[]
  tags        Tag[]
  viewCount   Int       @default(0) @map("view_count")
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  publishedAt DateTime? @map("published_at") @db.Timestamptz

  @@index([authorId])
  @@index([slug])
  @@index([published, createdAt])
  @@map("posts")
}

model Comment {
  id        String   @id @default(uuid())
  content   String   @db.Text
  postId    String   @map("post_id")
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String   @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parentId  String?  @map("parent_id")
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@index([postId])
  @@index([authorId])
  @@index([parentId])
  @@map("comments")
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique @db.VarChar(50)
  slug  String @unique @db.VarChar(50)
  posts Post[]

  @@map("tags")
}
```

### TypeORM Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('users')
@Index('idx_users_email_active', ['email'], { where: '"deleted_at" IS NULL' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'jsonb', default: {} })
  profile: Record<string, any>;

  @Column({ type: 'text', array: true, default: () => "ARRAY['user']" })
  roles: string[];

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}

@Entity('posts')
@Index('idx_posts_author', ['authorId'])
@Index('idx_posts_published_created', ['published', 'createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt?: Date;
}
```

## Migration Examples

### Prisma Migration
```sql
-- CreateTable: Users
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "profile" JSONB NOT NULL DEFAULT '{}',
    "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE INDEX "users_email_idx" ON "users"("email") WHERE "deleted_at" IS NULL;
CREATE INDEX "users_profile_idx" ON "users" USING GIN ("profile");

-- AddColumn: Add new column with default
ALTER TABLE "users" ADD COLUMN "last_login" TIMESTAMPTZ;

-- AlterColumn: Change column type
ALTER TABLE "users" ALTER COLUMN "username" TYPE VARCHAR(100);

-- RenameColumn: Rename column safely
ALTER TABLE "users" RENAME COLUMN "password_hash" TO "hashed_password";
```

## Best Practices

### Schema Design
- **Naming Conventions**: Use consistent, descriptive names (snake_case for PostgreSQL, camelCase for MongoDB)
- **Data Types**: Choose appropriate data types to minimize storage and maximize performance
- **Nullable Columns**: Carefully consider nullable vs. NOT NULL based on business logic
- **Default Values**: Provide sensible defaults to simplify application logic
- **Indexing Strategy**: Create indexes based on query patterns, not assumptions

### Migration Management
- **Version Control**: Always commit migrations to version control
- **Testing**: Test migrations on production-like data before deployment
- **Reversibility**: Ensure all migrations have proper rollback scripts
- **Performance**: Use batch operations for large data migrations
- **Zero Downtime**: Design migrations that don't require application downtime

### Security Considerations
- **Sensitive Data**: Use appropriate encryption for sensitive columns
- **Access Control**: Implement row-level security where appropriate
- **SQL Injection**: Use parameterized queries and ORM protections
- **Audit Trails**: Track schema changes and data modifications
- **Backup Strategy**: Maintain regular backups before schema changes

---

**ClaudeForge Schema Generator** - Enterprise-grade database schema design with intelligent automation, comprehensive ORM integration, and seamless migration management across all major database platforms.
