# DSA List - Coding Problem Management Tool

An application for studying and managing coding problems with advanced features like tagging, progress tracking, update/delete questions, import export bulk questions. It's time to build your own problem set.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dsa-list
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

#### 1. Create/Update your `.env.local` file:

#### 2. Common DATABASE_URL Formats:

**Local PostgreSQL:**

```
postgresql://postgres:password@localhost:5432/dsa_tracker
```

**Cloud Database (Supabase, Railway, etc.):**

```
postgresql://username:password@host:port/database_name
```

#### 3. Initialize Database:

After fixing your `.env.local`, run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View your database
npx prisma studio
```

#### 4. Test Database Connection:

```bash
# Test if Prisma can connect
npx prisma db pull
```

## Tech Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tanstack Query**: Server Side State
- **Zustand**: Client Side State
- **Tailwind CSS**
- **NextAuth 4**
- **Prisma ORM 6**
- **Shadcn Components**
- **Lucide React Icons**

## Get Stated Quickly

1. Login with your Google Account
2. Go to "Manage" page
3. Download Sample Questions / Modify it.
4. "Upload" Sample Questions
5. Start tracking!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write Test cases and test thoroughly
5. Submit a pull request with before and after screenshots and description

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce if applicable

### Todo:

- Fix the ordering of tags using additional order column in DB
- req.body must be validated with zod schema

---

**Happy Coding! 🚀**
