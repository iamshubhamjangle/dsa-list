# Database Setup Guide

## The Issue

The error you're seeing indicates that your `DATABASE_URL` is incorrectly configured:

```
ERROR: password authentication failed for user 'scienceseekho@gmail.com'
```

This suggests your `DATABASE_URL` is using an email as the username instead of a proper database username.

## Fix Your Database Connection

### 1. Create/Update your `.env.local` file:

```env
# Database - Fix this URL format
DATABASE_URL="postgresql://username:password@host:port/database_name"

# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/dsa_tracker"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Common DATABASE_URL Formats:

**Local PostgreSQL:**

```
postgresql://postgres:password@localhost:5432/dsa_tracker
```

**Cloud Database (Supabase, Railway, etc.):**

```
postgresql://username:password@host:port/database_name
```

### 3. Initialize Database:

After fixing your `.env.local`, run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View your database
npx prisma studio
```

### 4. Test Database Connection:

```bash
# Test if Prisma can connect
npx prisma db pull
```

## What's Been Added

✅ **Toast Notifications**: Added react-hot-toast for user feedback
✅ **Loading States**: Sign-in button shows loading spinner
✅ **Error Handling**: Better error messages for auth failures
✅ **Middleware**: Added authentication middleware for route protection

## Next Steps

1. Fix your `DATABASE_URL` in `.env.local`
2. Run `npx prisma generate && npx prisma db push`
3. Test the authentication flow

The authentication should work properly once the database connection is fixed!
