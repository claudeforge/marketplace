---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge mock data generator with Faker.js integration, realistic test data, custom generators, and fixture creation.
---

# ClaudeForge Mock Data Generator

ClaudeForge intelligent mock data generation system that creates realistic test data using Faker.js, custom generators, and schema-based generation for comprehensive testing, prototyping, and development needs.

## Purpose

Transform test data creation from manual entry to intelligent automation that generates realistic, diverse, and consistent mock data for testing, development, and prototyping with minimal effort.

## Features

- **Faker.js Integration**: Leverage Faker.js for realistic data generation
- **Schema-Based Generation**: Generate data from JSON schemas or TypeScript types
- **Custom Generators**: Create domain-specific data generators
- **Realistic Data**: Generate names, emails, addresses, phone numbers, etc.
- **Relational Data**: Create data with proper relationships and foreign keys
- **Bulk Generation**: Generate thousands of records efficiently
- **Fixture Files**: Export data as JSON, CSV, SQL, or TypeScript fixtures
- **Seeding**: Consistent data generation with seeds for reproducibility

## Usage

```bash
/mock-data-generator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise use interactive mode)

### Generation Actions

**Generate User Data:**
```bash
/mock-data-generator users --count=100 --output=users.json
```
Creates realistic user data including:
- First and last names
- Email addresses
- Phone numbers
- Addresses (street, city, state, zip, country)
- Birth dates and ages
- Avatars and profile pictures
- Usernames and passwords
- Job titles and companies
- Social media handles
- Account creation dates

**Generate from Schema:**
```bash
/mock-data-generator from-schema --schema=user.schema.json --count=50
```
Generates data based on JSON schema:
- Respects type constraints
- Honors min/max values
- Follows regex patterns
- Uses enum values
- Handles required properties
- Nested object generation
- Array generation with proper lengths
- Date/time formatting

**Generate Database Seed:**
```bash
/mock-data-generator db-seed --tables=users,posts,comments --format=sql
```
Creates database seed data with:
- Primary key generation
- Foreign key relationships
- Proper data types
- Referential integrity
- Realistic timestamps
- SQL INSERT statements
- Transaction grouping
- Index-friendly data

**Generate API Fixtures:**
```bash
/mock-data-generator api-fixtures --spec=openapi.yaml --output=fixtures/
```
Creates API test fixtures for:
- Request payloads
- Response bodies
- Error responses
- Pagination data
- Authentication tokens
- Headers and cookies
- Query parameters
- Path parameters

## Code Examples

### Mock Data Generator (TypeScript)

```typescript
import { faker } from '@faker-js/faker';
import * as fs from 'fs';

interface GeneratorOptions {
  count: number;
  seed?: number;
  locale?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  birthDate: Date;
  company: {
    name: string;
    jobTitle: string;
    department: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

class MockDataGenerator {
  constructor(seed?: number) {
    if (seed !== undefined) {
      faker.seed(seed);
    }
  }

  generateUsers(count: number): User[] {
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      users.push({
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country()
        },
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        company: {
          name: faker.company.name(),
          jobTitle: faker.person.jobTitle(),
          department: faker.commerce.department()
        },
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent({ days: 30 })
      });
    }

    return users;
  }

  generateProducts(count: number) {
    const products = [];

    for (let i = 0; i < count; i++) {
      products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric(10).toUpperCase(),
        stock: faker.number.int({ min: 0, max: 500 }),
        image: faker.image.url(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        reviews: faker.number.int({ min: 0, max: 1000 }),
        isActive: faker.datatype.boolean(),
        tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
          faker.commerce.productAdjective()
        ),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 7 })
      });
    }

    return products;
  }

  generateBlogPosts(count: number) {
    const posts = [];

    for (let i = 0; i < count; i++) {
      const createdAt = faker.date.past({ years: 1 });

      posts.push({
        id: faker.string.uuid(),
        title: faker.lorem.sentence({ min: 3, max: 10 }),
        slug: faker.helpers.slugify(faker.lorem.sentence()).toLowerCase(),
        content: faker.lorem.paragraphs(faker.number.int({ min: 3, max: 10 })),
        excerpt: faker.lorem.paragraph(),
        author: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar()
        },
        status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
        featured: faker.datatype.boolean(),
        views: faker.number.int({ min: 0, max: 10000 }),
        likes: faker.number.int({ min: 0, max: 1000 }),
        comments: faker.number.int({ min: 0, max: 500 }),
        tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
          faker.lorem.word()
        ),
        category: faker.helpers.arrayElement(['Technology', 'Business', 'Lifestyle', 'Travel', 'Food']),
        publishedAt: faker.date.between({ from: createdAt, to: new Date() }),
        createdAt,
        updatedAt: faker.date.recent({ days: 30 })
      });
    }

    return posts;
  }

  generateOrders(userIds: string[], productIds: string[], count: number) {
    const orders = [];

    for (let i = 0; i < count; i++) {
      const itemCount = faker.number.int({ min: 1, max: 5 });
      const items = [];
      let subtotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const price = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
        const quantity = faker.number.int({ min: 1, max: 3 });
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        items.push({
          productId: faker.helpers.arrayElement(productIds),
          quantity,
          price,
          total: itemTotal
        });
      }

      const tax = subtotal * 0.08;
      const shipping = faker.number.float({ min: 5, max: 20, precision: 0.01 });
      const total = subtotal + tax + shipping;

      orders.push({
        id: faker.string.uuid(),
        orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
        userId: faker.helpers.arrayElement(userIds),
        status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
        items,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer']),
        shippingAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country()
        },
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 })
      });
    }

    return orders;
  }

  generateFromSchema(schema: any, count: number): any[] {
    const items = [];

    for (let i = 0; i < count; i++) {
      items.push(this.generateItemFromSchema(schema));
    }

    return items;
  }

  private generateItemFromSchema(schema: any): any {
    if (schema.type === 'object') {
      const obj: any = {};

      for (const [key, propSchema] of Object.entries(schema.properties || {})) {
        const isRequired = schema.required?.includes(key);

        if (isRequired || faker.datatype.boolean()) {
          obj[key] = this.generateValueFromSchema(propSchema as any);
        }
      }

      return obj;
    }

    return this.generateValueFromSchema(schema);
  }

  private generateValueFromSchema(schema: any): any {
    // Handle enum
    if (schema.enum) {
      return faker.helpers.arrayElement(schema.enum);
    }

    // Handle format
    if (schema.format) {
      switch (schema.format) {
        case 'email':
          return faker.internet.email();
        case 'uri':
        case 'url':
          return faker.internet.url();
        case 'date-time':
          return faker.date.recent().toISOString();
        case 'date':
          return faker.date.recent().toISOString().split('T')[0];
        case 'uuid':
          return faker.string.uuid();
      }
    }

    // Handle type
    switch (schema.type) {
      case 'string':
        if (schema.pattern) {
          return faker.helpers.fromRegExp(new RegExp(schema.pattern));
        }
        const minLength = schema.minLength || 1;
        const maxLength = schema.maxLength || 50;
        return faker.lorem.words(faker.number.int({ min: minLength / 5, max: maxLength / 5 }));

      case 'number':
      case 'integer':
        const min = schema.minimum ?? 0;
        const max = schema.maximum ?? 1000;
        return schema.type === 'integer'
          ? faker.number.int({ min, max })
          : faker.number.float({ min, max, precision: 0.01 });

      case 'boolean':
        return faker.datatype.boolean();

      case 'array':
        const arrayLength = faker.number.int({
          min: schema.minItems || 1,
          max: schema.maxItems || 5
        });
        return Array.from({ length: arrayLength }, () =>
          this.generateValueFromSchema(schema.items)
        );

      case 'object':
        return this.generateItemFromSchema(schema);

      default:
        return null;
    }
  }

  exportToJSON(data: any[], filename: string): void {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✅ Exported ${data.length} records to ${filename}`);
  }

  exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) {
      console.log('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(',')];

    // Add data rows
    for (const item of data) {
      const values = headers.map(header => {
        const value = item[header];
        // Handle objects and arrays
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes in strings
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvLines.push(values.join(','));
    }

    fs.writeFileSync(filename, csvLines.join('\n'));
    console.log(`✅ Exported ${data.length} records to ${filename}`);
  }

  exportToSQL(tableName: string, data: any[], filename: string): void {
    if (data.length === 0) {
      console.log('No data to export');
      return;
    }

    const sqlLines: string[] = [];
    sqlLines.push(`-- Mock data for ${tableName}`);
    sqlLines.push(`-- Generated at ${new Date().toISOString()}\n`);

    const columns = Object.keys(data[0]);

    for (const item of data) {
      const values = columns.map(col => {
        const value = item[col];

        if (value === null || value === undefined) {
          return 'NULL';
        }

        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }

        if (typeof value === 'object') {
          return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        }

        if (value instanceof Date) {
          return `'${value.toISOString()}'`;
        }

        return value;
      });

      sqlLines.push(
        `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`
      );
    }

    fs.writeFileSync(filename, sqlLines.join('\n'));
    console.log(`✅ Exported ${data.length} SQL statements to ${filename}`);
  }
}

// Usage examples

// Generate users with seed for reproducibility
const generator = new MockDataGenerator(12345);

// Generate 100 users
const users = generator.generateUsers(100);
generator.exportToJSON(users, 'mock-users.json');

// Generate products
const products = generator.generateProducts(50);
generator.exportToCSV(products, 'mock-products.csv');

// Generate blog posts
const posts = generator.generateBlogPosts(200);
generator.exportToJSON(posts, 'mock-posts.json');

// Generate orders with relationships
const userIds = users.map(u => u.id);
const productIds = products.map(p => p.id);
const orders = generator.generateOrders(userIds, productIds, 500);
generator.exportToSQL('orders', orders, 'mock-orders.sql');

// Generate from JSON schema
const userSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 50 },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 18, maximum: 100 },
    role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
    verified: { type: 'boolean' }
  }
};

const schemaBasedUsers = generator.generateFromSchema(userSchema, 100);
generator.exportToJSON(schemaBasedUsers, 'schema-users.json');
```

### Custom Generator for Specific Domains

```typescript
class EcommerceDataGenerator {
  private faker = faker;

  generateInventory(count: number) {
    return Array.from({ length: count }, () => ({
      sku: this.faker.string.alphanumeric(10).toUpperCase(),
      warehouse: this.faker.location.city(),
      quantity: this.faker.number.int({ min: 0, max: 1000 }),
      reserved: this.faker.number.int({ min: 0, max: 50 }),
      reorderPoint: this.faker.number.int({ min: 10, max: 100 }),
      lastRestocked: this.faker.date.past({ months: 6 }),
      supplier: {
        id: this.faker.string.uuid(),
        name: this.faker.company.name(),
        contact: this.faker.person.fullName(),
        phone: this.faker.phone.number()
      }
    }));
  }

  generateCustomerReviews(productIds: string[], count: number) {
    return Array.from({ length: count }, () => ({
      id: this.faker.string.uuid(),
      productId: this.faker.helpers.arrayElement(productIds),
      rating: this.faker.number.int({ min: 1, max: 5 }),
      title: this.faker.lorem.sentence({ min: 3, max: 8 }),
      comment: this.faker.lorem.paragraphs(this.faker.number.int({ min: 1, max: 3 })),
      helpful: this.faker.number.int({ min: 0, max: 100 }),
      verified: this.faker.datatype.boolean(),
      author: {
        name: this.faker.person.fullName(),
        avatar: this.faker.image.avatar()
      },
      createdAt: this.faker.date.past({ years: 1 })
    }));
  }
}
```

## Best Practices

### Data Generation
- **Use Seeds**: Use seeds for reproducible test data
- **Realistic Data**: Generate data that resembles production data
- **Relationships**: Maintain proper relationships between entities
- **Constraints**: Respect data constraints and validation rules
- **Diversity**: Generate diverse data to cover edge cases
- **Volume**: Test with realistic data volumes

### Testing Strategy
- **Fixture Files**: Create reusable fixture files for tests
- **Isolation**: Generate fresh data for each test suite
- **Cleanup**: Clean up generated data after tests
- **Seeding**: Use consistent seeds for deterministic tests
- **Performance**: Optimize generation for large datasets

### Development Workflow
- **Prototyping**: Use mock data for rapid prototyping
- **Demos**: Generate realistic data for demonstrations
- **Development**: Populate development databases with mock data
- **Documentation**: Use generated data in API documentation
- **Staging**: Maintain staging environments with mock data

---

**ClaudeForge Mock Data Generator** - Enterprise-grade test data generation with Faker.js integration, schema-based generation, and realistic fixtures for comprehensive testing and development.
