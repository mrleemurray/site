---
id: motion-study-1
title: Motion Study #1
subtitle: Robust RESTful API for online stores
description: Complete backend solution for e-commerce applications featuring user authentication, product management, order processing, and payment integration.
category: api
tags: [Vue.js, P5.js]
image: /images/motion-study-1/three.gif
featured: false
completedAt: 2024-02-20
duration: 4 weeks
---

# Motion Study #1

Using planetary orbits & explosion diagrams to understand complex relationships between resources.

![API Architecture Diagram](/images/motion-study-1/one.gif)

## Overview

This e-commerce API provides a complete backend solution for online stores, featuring user authentication, product management, order processing, and payment integration.

## API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Products
```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```http
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id/status
```

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Details

### Security Measures

```typescript
// JWT Authentication middleware
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user as JWTPayload
    next()
  })
}
```

### Error Handling

```typescript
export class APIError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

// Global error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: 'error'
    })
  }

  // Log unexpected errors
  logger.error(err.stack)
  
  res.status(500).json({
    error: 'Internal server error',
    status: 'error'
  })
}
```

### Data Validation

```typescript
import Joi from 'joi'

export const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000),
  price: Joi.number().positive().precision(2).required(),
  stock_quantity: Joi.number().integer().min(0),
  category_id: Joi.number().integer().positive()
})

export const validateProduct = (data: any) => {
  const { error, value } = productSchema.validate(data)
  if (error) {
    throw new APIError(error.details[0].message, 400)
  }
  return value
}
```

## Testing

### Unit Tests

```typescript
describe('Product Service', () => {
  beforeEach(async () => {
    await db.migrate.latest()
    await db.seed.run()
  })

  afterEach(async () => {
    await db.migrate.rollback()
  })

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99,
        stock_quantity: 100
      }

      const product = await ProductService.create(productData)

      expect(product).toHaveProperty('id')
      expect(product.name).toBe(productData.name)
      expect(product.price).toBe(productData.price)
    })

    it('should throw error for invalid price', async () => {
      const productData = {
        name: 'Test Product',
        price: -10,
        stock_quantity: 100
      }

      await expect(ProductService.create(productData))
        .rejects
        .toThrow('Price must be positive')
    })
  })
})
```

### Integration Tests

```typescript
describe('Products API', () => {
  let authToken: string

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      })
    
    authToken = response.body.token
  })

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200)

      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=electronics')
        .expect(200)

      expect(response.body.data.every(
        p => p.category === 'electronics'
      )).toBe(true)
    })
  })
})
```

## Performance Optimization

### Database Indexing

```sql
-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_price ON products(price);
```

### Caching Strategy

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const cache = {
  async get(key: string) {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  },

  async set(key: string, value: any, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value))
  },

  async del(key: string) {
    await redis.del(key)
  }
}

// Usage in product service
export const getProduct = async (id: number) => {
  const cacheKey = `product:${id}`
  let product = await cache.get(cacheKey)
  
  if (!product) {
    product = await db('products').where({ id }).first()
    if (product) {
      await cache.set(cacheKey, product, 1800) // 30 minutes
    }
  }
  
  return product
}
```

## Deployment

### Docker Configuration

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ecommerce
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cache
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=https://...
```

## API Documentation

Interactive API documentation is available at `/docs` when running the server. Built with Swagger/OpenAPI 3.0.

### Sample Response

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "stock_quantity": 50,
    "category": {
      "id": 2,
      "name": "Electronics"
    },
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T15:45:30Z",
    "version": "1.0.0"
  }
}
```

## Monitoring & Logging

### Application Metrics

```typescript
import prometheus from 'prom-client'

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
})

const orderCounter = new prometheus.Counter({
  name: 'orders_total',
  help: 'Total number of orders created'
})

// Middleware to track metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration)
  })
  
  next()
}
```

## Links

- **API Documentation**: [api.example-store.com/docs](https://api.example-store.com/docs)
- **Source Code**: [github.com/username/ecommerce-api](https://github.com/username/ecommerce-api)
- **Postman Collection**: [Download Collection](https://www.postman.com/collections/...)

---

*Built with Node.js, Express, PostgreSQL, and modern development practices.*