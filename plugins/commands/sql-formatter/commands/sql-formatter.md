---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge SQL query formatter with beautification, syntax highlighting, optimization hints, and multiple dialect support.
---

# ClaudeForge SQL Formatter

ClaudeForge intelligent SQL query formatting system that beautifies SQL queries, applies consistent styling, provides syntax highlighting, and offers optimization hints for better query performance and readability.

## Purpose

Transform SQL query management from inconsistent, hard-to-read code to beautifully formatted, optimized queries with consistent styling and best practices for improved maintainability and performance.

## Features

- **Query Beautification**: Format SQL queries with consistent indentation and spacing
- **Multiple Dialects**: Support for PostgreSQL, MySQL, SQL Server, Oracle, SQLite
- **Syntax Highlighting**: Color-coded output for better readability
- **Optimization Hints**: Suggest query optimizations and best practices
- **Keyword Casing**: Configure uppercase/lowercase for keywords
- **Indentation Styles**: Customizable indentation (spaces/tabs, width)
- **Line Length**: Wrap long queries at configurable line length
- **Batch Processing**: Format multiple queries or entire SQL files

## Usage

```bash
/sql-formatter [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise use current selection)

## Code Examples

### SQL Formatter (TypeScript)

```typescript
import { format } from 'sql-formatter';

interface FormatterOptions {
  language: 'sql' | 'postgresql' | 'mysql' | 'mariadb' | 'db2' | 'plsql' | 'n1ql' | 'redshift' | 'spark' | 'tsql';
  indent: string;
  uppercase: boolean;
  linesBetweenQueries: number;
}

class SQLFormatter {
  private options: FormatterOptions;

  constructor(options?: Partial<FormatterOptions>) {
    this.options = {
      language: 'postgresql',
      indent: '  ',
      uppercase: true,
      linesBetweenQueries: 2,
      ...options
    };
  }

  format(query: string): string {
    return format(query, {
      language: this.options.language,
      indent: this.options.indent,
      uppercase: this.options.uppercase,
      linesBetweenQueries: this.options.linesBetweenQueries
    });
  }

  formatFile(filePath: string): void {
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    const formatted = this.format(content);
    fs.writeFileSync(filePath, formatted);
    console.log(`✅ Formatted ${filePath}`);
  }

  analyzeQuery(query: string): QueryAnalysis {
    const analysis: QueryAnalysis = {
      warnings: [],
      suggestions: [],
      complexity: 'low',
      hasIndexHints: false,
      hasJoins: false,
      hasSubqueries: false
    };

    const upperQuery = query.toUpperCase();

    // Check for SELECT *
    if (upperQuery.includes('SELECT *')) {
      analysis.warnings.push('Avoid using SELECT * - specify columns explicitly');
      analysis.suggestions.push('List specific columns for better performance and clarity');
    }

    // Check for missing WHERE in UPDATE/DELETE
    if ((upperQuery.includes('UPDATE ') || upperQuery.includes('DELETE ')) && !upperQuery.includes('WHERE')) {
      analysis.warnings.push('UPDATE/DELETE without WHERE clause will affect all rows');
      analysis.suggestions.push('Add WHERE clause to limit affected rows');
    }

    // Check for NOT IN
    if (upperQuery.includes('NOT IN')) {
      analysis.warnings.push('NOT IN can be slow with NULL values');
      analysis.suggestions.push('Consider using NOT EXISTS or LEFT JOIN instead');
    }

    // Check for OR in WHERE
    if (upperQuery.match(/WHERE.*\bOR\b/)) {
      analysis.suggestions.push('OR conditions may prevent index usage - consider UNION');
    }

    // Check for function on indexed column
    if (upperQuery.match(/WHERE\s+\w+\s*\(/)) {
      analysis.warnings.push('Function on indexed column prevents index usage');
      analysis.suggestions.push('Avoid functions on indexed columns in WHERE clause');
    }

    // Complexity analysis
    const joinCount = (upperQuery.match(/\bJOIN\b/g) || []).length;
    const subqueryCount = (upperQuery.match(/\(SELECT\b/g) || []).length;

    if (joinCount > 3 || subqueryCount > 2) {
      analysis.complexity = 'high';
    } else if (joinCount > 0 || subqueryCount > 0) {
      analysis.complexity = 'medium';
    }

    analysis.hasJoins = joinCount > 0;
    analysis.hasSubqueries = subqueryCount > 0;

    return analysis;
  }
}

interface QueryAnalysis {
  warnings: string[];
  suggestions: string[];
  complexity: 'low' | 'medium' | 'high';
  hasIndexHints: boolean;
  hasJoins: boolean;
  hasSubqueries: boolean;
}

// Usage examples
const formatter = new SQLFormatter({
  language: 'postgresql',
  indent: '  ',
  uppercase: true
});

const uglyQuery = `select u.id,u.name,o.total from users u join orders o on u.id=o.user_id where o.status='completed' and o.total>100`;

console.log('Formatted Query:');
console.log(formatter.format(uglyQuery));

const analysis = formatter.analyzeQuery(uglyQuery);
console.log('\\nQuery Analysis:', analysis);

// Output:
// SELECT
//   u.id,
//   u.name,
//   o.total
// FROM
//   users u
//   JOIN orders o ON u.id = o.user_id
// WHERE
//   o.status = 'completed'
//   AND o.total > 100
```

### Complex Query Formatting

```typescript
const complexQuery = `
WITH monthly_sales AS (
  SELECT
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as sales,
    COUNT(*) as order_count
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', order_date)
),
customer_stats AS (
  SELECT
    customer_id,
    COUNT(*) as lifetime_orders,
    SUM(total_amount) as lifetime_value
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 5
)
SELECT
  c.customer_name,
  c.email,
  cs.lifetime_orders,
  cs.lifetime_value,
  RANK() OVER (ORDER BY cs.lifetime_value DESC) as value_rank,
  ARRAY_AGG(p.product_name ORDER BY oi.quantity DESC) as top_products
FROM customers c
JOIN customer_stats cs ON c.id = cs.customer_id
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE c.status = 'active'
GROUP BY c.id, c.customer_name, c.email, cs.lifetime_orders, cs.lifetime_value
ORDER BY cs.lifetime_value DESC
LIMIT 100;
`;

console.log(formatter.format(complexQuery));
```

### CLI Tool

```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import { SQLFormatter } from './sql-formatter';

const program = new Command();

program
  .name('sql-fmt')
  .description('Format SQL queries')
  .version('1.0.0');

program
  .command('format')
  .description('Format SQL file or query')
  .option('-i, --input <file>', 'Input SQL file')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .option('-d, --dialect <dialect>', 'SQL dialect', 'postgresql')
  .option('--uppercase', 'Use uppercase for keywords', true)
  .option('--indent <spaces>', 'Indentation spaces', '2')
  .action((options) => {
    const formatter = new SQLFormatter({
      language: options.dialect,
      indent: ' '.repeat(parseInt(options.indent)),
      uppercase: options.uppercase
    });

    if (options.input) {
      const content = fs.readFileSync(options.input, 'utf-8');
      const formatted = formatter.format(content);
      const output = options.output || options.input;
      fs.writeFileSync(output, formatted);
      console.log(`✅ Formatted and saved to ${output}`);
    }
  });

program
  .command('analyze')
  .description('Analyze SQL query for optimization')
  .requiredOption('-i, --input <file>', 'Input SQL file')
  .action((options) => {
    const formatter = new SQLFormatter();
    const content = fs.readFileSync(options.input, 'utf-8');
    const analysis = formatter.analyzeQuery(content);

    console.log('Query Analysis:');
    console.log(`  Complexity: ${analysis.complexity}`);
    console.log(`  Has Joins: ${analysis.hasJoins}`);
    console.log(`  Has Subqueries: ${analysis.hasSubqueries}`);

    if (analysis.warnings.length > 0) {
      console.log('\\n⚠️  Warnings:');
      analysis.warnings.forEach(w => console.log(`  - ${w}`));
    }

    if (analysis.suggestions.length > 0) {
      console.log('\\n💡 Suggestions:');
      analysis.suggestions.forEach(s => console.log(`  - ${s}`));
    }
  });

program.parse();
```

## Best Practices

### Formatting Style
- **Consistent Keywords**: Use uppercase or lowercase consistently
- **Indentation**: Use 2-4 spaces for indentation
- **Line Breaks**: Break long queries into multiple lines
- **Column Alignment**: Align column names for readability
- **Comments**: Add comments for complex logic

### Query Optimization
- **Specific Columns**: Always specify column names instead of SELECT *
- **Proper Indexing**: Use indexes on frequently queried columns
- **WHERE Clause**: Always include WHERE clause in UPDATE/DELETE
- **JOIN Order**: Order JOINs from largest to smallest tables
- **Subquery Alternatives**: Consider JOINs instead of subqueries

### Team Standards
- **Style Guide**: Document SQL style guide for the team
- **Pre-commit Hooks**: Format SQL files before committing
- **Code Review**: Review SQL queries for optimization
- **Version Control**: Track SQL files in version control
- **Documentation**: Document complex queries and their purpose

---

**ClaudeForge SQL Formatter** - Enterprise-grade SQL query formatting with beautification, optimization hints, multi-dialect support, and best practices for maintainable database code.
