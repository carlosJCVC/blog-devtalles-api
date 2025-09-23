# Blog API - NestJS with Clean Architecture & CQRS

A scalable blog API built with NestJS, PostgreSQL, and Prisma following Clean Architecture principles, CQRS pattern, and Event-Driven architecture.

## 🚀 Features

- Clean Architecture with separated layers
- CQRS Pattern for optimal performance
- Event-Driven Architecture for decoupling
- JWT Authentication & Role-based Authorization
- Input validation with class-validator, zod.
- Centralized error handling

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: ZOD
- **Testing**: Jest

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- pnpm

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd back-blog-devtalles
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   **Configure your `.env` file with the following variables:**
   
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
   
   # JWT Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   JWT_EXPIRES_IN=7d              # Token expiration (7 days)
   JWT_REFRESH_SECRET=your-refresh-secret-key-also-change-in-production
   JWT_REFRESH_EXPIRES_IN=30d     # Refresh token expiration (30 days)
   
   # Discord OAuth (Optional - for Discord login)
   DISCORD_CLIENT_ID=your-discord-app-client-id
   DISCORD_CLIENT_SECRET=your-discord-app-client-secret
   DISCORD_REDIRECT_URL=http://localhost:3000/auth/discord/callback
   
   # API Configuration
   PORT=3000                      # Server port
   NODE_ENV=development           # Environment (development/production)
   ```
   
   **Important Security Notes:**
   - Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong, random strings (min 32 characters)
   - Use different secrets for development and production
   - Never commit your `.env` file to version control
   - For production, use environment-specific values
   - Keep Discord credentials secure and never expose them publicly

## 🎮 Discord OAuth Setup (Optional)

If you want to enable Discord login, follow these steps:

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to the "OAuth2" section in the sidebar

2. **Configure OAuth2**
   - Copy the **Client ID** and **Client Secret**
   - Add redirect URL: `http://localhost:3000/auth/discord/callback`
   - In "Scopes" section, select: `identify` and `email`

3. **Add to Environment Variables**
   ```env
   DISCORD_CLIENT_ID=your-client-id-from-discord
   DISCORD_CLIENT_SECRET=your-client-secret-from-discord
   DISCORD_REDIRECT_URL=http://localhost:3000/auth/discord/callback
   ```

4. **For Production**
   - Update redirect URL to your production domain
   - Example: `https://yourdomain.com/auth/discord/callback`

**Discord OAuth Flow:**
- Login: `GET /api/v1/auth/discord`
- Callback: `GET /auth/discord/callback` (handled automatically)

4. **Start PostgreSQL**
   ```bash
   # Make sure PostgreSQL is installed and running locally
   # Create the database
   createdb blog_db
   
   # Or connect to your existing PostgreSQL instance
   # Update DATABASE_URL in .env with your connection details
   ```

5. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the application**
   ```bash
   npm run start:dev
   ```

7. **Access the API**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following configuration:

### Database
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://user:pass@localhost:5432/blog_db` | ✅ |

### JWT Authentication
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-super-secret-32-char-string` | ✅ |
| `JWT_EXPIRES_IN` | Access token expiration | `7d` | ✅ |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-refresh-secret-key` | ✅ |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `30d` | ✅ |

### Discord OAuth (Optional)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DISCORD_CLIENT_ID` | Discord application client ID | `123456789132455` | ❌ |
| `DISCORD_CLIENT_SECRET` | Discord application secret | `HSAHJSAJDHJAkjahsjahasasaexample` | ❌ |
| `DISCORD_REDIRECT_URL` | Discord OAuth callback URL | `http://localhost:3000/auth/discord/callback` | ❌ |

### API Configuration
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | ✅ |
| `NODE_ENV` | Environment mode | `development` | ✅ |



```
src/
├─ app.module.ts
├─ main.ts
├─ config/
├─ common/
├─ database/
├─ shared/
└─ modules/
   ├─ auth/
   ├─ users/
   ├─ posts/
```

## 🔧 Available Scripts

```bash
pnpm run start          # Start application
pnpm run start:dev      # Start in development mode
pnpm run build          # Build for production
pnpm run test           # Run tests
pnpm run test:e2e       # Run e2e tests
```

## 📚 API Endpoints

Main API endpoints available:

- **Authentication**
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/login` - User login
  - `GET /api/v1/auth/profile` - Get user profile
  - `POST /api/v1/auth/refresh` - Refresh token
  - `GET /api/v1/auth/discord` - Discord OAuth login
  - `GET /oauth/discord` - Discord OAuth callback
  - `GET /api/v1/auth/logout` - Logout

- **Posts**
  - `GET /api/v1/posts` - Get all posts
  - `GET /api/v1/posts/:id` - Get post by ID
  - `POST /api/v1/posts` - Create new post
  - `PUT /api/v1/posts/:id` - Update post
  - `DELETE /api/v1/posts/:id` - Delete post

  - Search: `GET /api/v1/posts/search?query=Theatrum`
  - Most Popular: `GET /api/v1/posts/popular`
  - Related: `GET /api/v1/posts/{{postId}}/related`
  - Get by slug: `GET /api/v1/posts/{{slug}}`
  - List: `GET /api/v1/admin/posts`
  - Update: `PUT /api/v1/admin/posts/{{postId}}/publish`
  - Soft delete: `PUT /api/v1/admin/posts/{{postId}}/publish`

## 🔐 Authentication

The API supports multiple authentication methods:

### Traditional JWT
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Profile: `GET /api/v1/auth/profile`

### Discord OAuth
- Login: `GET /api/v1/auth/discord` (redirects to Discord)
- Callback: `GET /auth/discord/callback` (handles Discord response)

**Include JWT token in requests:**
```
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.