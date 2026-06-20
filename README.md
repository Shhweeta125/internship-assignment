# Finance Extractor Backend

Backend API built using Hono, TypeScript, PostgreSQL, and Prisma.

## Features

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes
* Transaction Extraction API
* PostgreSQL Database Integration
* Prisma ORM

## Tech Stack

* TypeScript
* Hono
* PostgreSQL
* Prisma
* JWT
* bcryptjs

## Setup

```bash
npm install
```

Configure `.env`:

```env
DATABASE_URL=your_database_url
```

Run migrations:

```bash
npx prisma migrate dev
```

Start server:

```bash
npm run dev
```

## API Endpoints

### Register

POST `/api/auth/register`

### Login

POST `/api/auth/login`

### Extract Transaction

POST `/api/transactions/extract`

Requires JWT token in Authorization header.

## Author

Shweta
