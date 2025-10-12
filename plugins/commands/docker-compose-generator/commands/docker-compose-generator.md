---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge Docker Compose generator with service templates for PostgreSQL, Redis, MongoDB, MySQL, environment variables, networking, and volumes.
---

# ClaudeForge Docker Compose Generator

ClaudeForge intelligent Docker Compose configuration generator that creates production-ready docker-compose.yml files with popular service templates, environment variables, networking, volumes, health checks, and best practices for containerized applications.

## Purpose

Transform Docker Compose configuration from manual YAML writing to intelligent generation with pre-configured service templates, optimized settings, and production best practices for rapid development environment setup.

## Features

- **Service Templates**: Pre-configured templates for PostgreSQL, Redis, MongoDB, MySQL, Elasticsearch
- **Environment Management**: Proper environment variable configuration with .env support
- **Networking**: Automatic network configuration with custom networks
- **Volume Management**: Persistent storage with named volumes and bind mounts
- **Health Checks**: Built-in health checks for service monitoring
- **Development & Production**: Separate configurations for different environments
- **Multi-Container Apps**: Support for complex multi-service architectures
- **Resource Limits**: CPU and memory limits for services

## Usage

```bash
/docker-compose-generator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise use interactive mode)

## Code Examples

### Docker Compose Generator (TypeScript)

```typescript
import * as fs from 'fs';
import * as yaml from 'yaml';

interface Service {
  image: string;
  container_name?: string;
  ports?: string[];
  environment?: Record<string, string>;
  volumes?: string[];
  networks?: string[];
  depends_on?: string[];
  healthcheck?: HealthCheck;
  restart?: string;
  deploy?: DeployConfig;
}

interface HealthCheck {
  test: string[];
  interval: string;
  timeout: string;
  retries: number;
  start_period?: string;
}

interface DeployConfig {
  resources?: {
    limits?: {
      cpus?: string;
      memory?: string;
    };
    reservations?: {
      cpus?: string;
      memory?: string;
    };
  };
}

interface ComposeConfig {
  version: string;
  services: Record<string, Service>;
  networks?: Record<string, any>;
  volumes?: Record<string, any>;
}

class DockerComposeGenerator {
  private config: ComposeConfig;

  constructor() {
    this.config = {
      version: '3.8',
      services: {},
      networks: {},
      volumes: {}
    };
  }

  addPostgreSQL(options?: {
    version?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    volumeName?: string;
  }): this {
    const opts = {
      version: '15-alpine',
      port: 5432,
      database: 'app_db',
      user: 'postgres',
      password: 'postgres',
      volumeName: 'postgres_data',
      ...options
    };

    this.config.services.postgres = {
      image: `postgres:${opts.version}`,
      container_name: 'postgres',
      restart: 'unless-stopped',
      environment: {
        POSTGRES_DB: opts.database,
        POSTGRES_USER: opts.user,
        POSTGRES_PASSWORD: opts.password,
        PGDATA: '/var/lib/postgresql/data/pgdata'
      },
      ports: [`${opts.port}:5432`],
      volumes: [
        `${opts.volumeName}:/var/lib/postgresql/data`
      ],
      networks: ['app-network'],
      healthcheck: {
        test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}'],
        interval: '10s',
        timeout: '5s',
        retries: 5,
        start_period: '10s'
      }
    };

    this.config.volumes![opts.volumeName] = {};
    return this;
  }

  addRedis(options?: {
    version?: string;
    port?: number;
    volumeName?: string;
  }): this {
    const opts = {
      version: '7-alpine',
      port: 6379,
      volumeName: 'redis_data',
      ...options
    };

    this.config.services.redis = {
      image: `redis:${opts.version}`,
      container_name: 'redis',
      restart: 'unless-stopped',
      ports: [`${opts.port}:6379`],
      volumes: [
        `${opts.volumeName}:/data`
      ],
      networks: ['app-network'],
      healthcheck: {
        test: ['CMD', 'redis-cli', 'ping'],
        interval: '10s',
        timeout: '3s',
        retries: 5
      },
      deploy: {
        resources: {
          limits: {
            cpus: '0.5',
            memory: '512M'
          }
        }
      }
    };

    this.config.volumes![opts.volumeName] = {};
    return this;
  }

  addMongoDB(options?: {
    version?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    volumeName?: string;
  }): this {
    const opts = {
      version: '6.0',
      port: 27017,
      database: 'app_db',
      user: 'admin',
      password: 'admin',
      volumeName: 'mongo_data',
      ...options
    };

    this.config.services.mongodb = {
      image: `mongo:${opts.version}`,
      container_name: 'mongodb',
      restart: 'unless-stopped',
      environment: {
        MONGO_INITDB_ROOT_USERNAME: opts.user,
        MONGO_INITDB_ROOT_PASSWORD: opts.password,
        MONGO_INITDB_DATABASE: opts.database
      },
      ports: [`${opts.port}:27017`],
      volumes: [
        `${opts.volumeName}:/data/db`,
        `mongo_config:/data/configdb`
      ],
      networks: ['app-network'],
      healthcheck: {
        test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")'],
        interval: '10s',
        timeout: '5s',
        retries: 5,
        start_period: '20s'
      }
    };

    this.config.volumes![opts.volumeName] = {};
    this.config.volumes!.mongo_config = {};
    return this;
  }

  addMySQL(options?: {
    version?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    rootPassword?: string;
    volumeName?: string;
  }): this {
    const opts = {
      version: '8.0',
      port: 3306,
      database: 'app_db',
      user: 'user',
      password: 'password',
      rootPassword: 'rootpassword',
      volumeName: 'mysql_data',
      ...options
    };

    this.config.services.mysql = {
      image: `mysql:${opts.version}`,
      container_name: 'mysql',
      restart: 'unless-stopped',
      environment: {
        MYSQL_ROOT_PASSWORD: opts.rootPassword,
        MYSQL_DATABASE: opts.database,
        MYSQL_USER: opts.user,
        MYSQL_PASSWORD: opts.password
      },
      ports: [`${opts.port}:3306`],
      volumes: [
        `${opts.volumeName}:/var/lib/mysql`
      ],
      networks: ['app-network'],
      healthcheck: {
        test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-u', 'root', '-p${MYSQL_ROOT_PASSWORD}'],
        interval: '10s',
        timeout: '5s',
        retries: 5
      }
    };

    this.config.volumes![opts.volumeName] = {};
    return this;
  }

  addNginx(options?: {
    port?: number;
    configPath?: string;
    staticPath?: string;
  }): this {
    const opts = {
      port: 80,
      configPath: './nginx/nginx.conf',
      staticPath: './public',
      ...options
    };

    this.config.services.nginx = {
      image: 'nginx:alpine',
      container_name: 'nginx',
      restart: 'unless-stopped',
      ports: [`${opts.port}:80`],
      volumes: [
        `${opts.configPath}:/etc/nginx/nginx.conf:ro`,
        `${opts.staticPath}:/usr/share/nginx/html:ro`
      ],
      networks: ['app-network'],
      depends_on: ['app'],
      healthcheck: {
        test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health'],
        interval: '30s',
        timeout: '10s',
        retries: 3
      }
    };

    return this;
  }

  addApplication(options: {
    name: string;
    image?: string;
    build?: string;
    port?: number;
    environment?: Record<string, string>;
    dependsOn?: string[];
  }): this {
    const service: Service = {
      container_name: options.name,
      restart: 'unless-stopped',
      networks: ['app-network']
    };

    if (options.image) {
      service.image = options.image;
    } else if (options.build) {
      service['build'] = {
        context: options.build,
        dockerfile: 'Dockerfile'
      };
    }

    if (options.port) {
      service.ports = [`${options.port}:${options.port}`];
    }

    if (options.environment) {
      service.environment = options.environment;
    }

    if (options.dependsOn && options.dependsOn.length > 0) {
      service.depends_on = options.dependsOn;
    }

    this.config.services[options.name] = service;
    return this;
  }

  addNetwork(name: string = 'app-network'): this {
    if (!this.config.networks) {
      this.config.networks = {};
    }

    this.config.networks[name] = {
      driver: 'bridge'
    };

    return this;
  }

  generate(): string {
    // Add default network if not exists
    if (Object.keys(this.config.services).length > 0 && Object.keys(this.config.networks || {}).length === 0) {
      this.addNetwork();
    }

    return yaml.stringify(this.config);
  }

  save(filename: string = 'docker-compose.yml'): void {
    const content = this.generate();
    fs.writeFileSync(filename, content);
    console.log(`✅ Docker Compose file saved to ${filename}`);
  }

  generateEnvFile(filename: string = '.env.example'): void {
    const envVars: string[] = [
      '# Database Configuration',
      'POSTGRES_DB=app_db',
      'POSTGRES_USER=postgres',
      'POSTGRES_PASSWORD=your-secure-password',
      '',
      '# Redis Configuration',
      'REDIS_URL=redis://redis:6379',
      '',
      '# MongoDB Configuration',
      'MONGO_INITDB_ROOT_USERNAME=admin',
      'MONGO_INITDB_ROOT_PASSWORD=your-secure-password',
      '',
      '# Application Configuration',
      'NODE_ENV=development',
      'APP_PORT=3000',
      'APP_URL=http://localhost:3000',
      ''
    ];

    fs.writeFileSync(filename, envVars.join('\n'));
    console.log(`✅ Environment template saved to ${filename}`);
  }
}

// Usage examples

// Example 1: Full-stack application with PostgreSQL and Redis
const generator1 = new DockerComposeGenerator();

generator1
  .addApplication({
    name: 'app',
    build: '.',
    port: 3000,
    environment: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://postgres:postgres@postgres:5432/app_db',
      REDIS_URL: 'redis://redis:6379'
    },
    dependsOn: ['postgres', 'redis']
  })
  .addPostgreSQL()
  .addRedis()
  .save('docker-compose.yml');

// Example 2: Microservices with MongoDB and Nginx
const generator2 = new DockerComposeGenerator();

generator2
  .addApplication({
    name: 'api',
    build: './api',
    port: 4000,
    environment: {
      MONGO_URL: 'mongodb://admin:admin@mongodb:27017/api_db?authSource=admin'
    },
    dependsOn: ['mongodb']
  })
  .addApplication({
    name: 'web',
    build: './web',
    port: 3000,
    environment: {
      API_URL: 'http://api:4000'
    },
    dependsOn: ['api']
  })
  .addMongoDB()
  .addNginx({ port: 80 })
  .save('docker-compose.microservices.yml');

// Example 3: Development environment with all databases
const generator3 = new DockerComposeGenerator();

generator3
  .addPostgreSQL({ port: 5432 })
  .addMySQL({ port: 3306 })
  .addMongoDB({ port: 27017 })
  .addRedis({ port: 6379 })
  .save('docker-compose.dev.yml');

generator3.generateEnvFile('.env.example');

console.log('Generated docker-compose.yml:');
console.log(generator3.generate());
```

### Production Docker Compose Template

```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    container_name: myapp
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    container_name: postgres
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./public:/usr/share/nginx/html:ro
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

## Best Practices

### Configuration
- **Environment Variables**: Use .env files for sensitive data
- **Health Checks**: Always include health checks for services
- **Resource Limits**: Set CPU and memory limits for production
- **Restart Policies**: Use appropriate restart policies
- **Named Volumes**: Use named volumes for persistent data

### Security
- **Strong Passwords**: Use strong passwords for databases
- **Network Isolation**: Use custom networks to isolate services
- **Read-Only Volumes**: Mount config files as read-only
- **Non-Root Users**: Run containers as non-root users when possible
- **Secret Management**: Use Docker secrets for sensitive data

### Performance
- **Resource Allocation**: Properly allocate resources to services
- **Volume Performance**: Use volumes for better I/O performance
- **Network Optimization**: Use custom networks for inter-service communication
- **Caching**: Leverage build cache for faster builds
- **Health Checks**: Implement efficient health check commands

---

**ClaudeForge Docker Compose Generator** - Enterprise-grade Docker Compose configuration generation with service templates, best practices, and production-ready settings.
