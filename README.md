Todo:

- Work on GET tags, GET questions for manage page
- Work on CRUD tags for manage page
- Work on CRUD questions for manage page
- Fix the ordering of tags using additional order column in DB
- Upload - BatchCreateQuestions
- tag color should be enum with fixed colors on FE/BE
- req.body must be validated with zod schema

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
- **TypeScript**
- **Tailwind CSS**
- **Shadcn Components**
- **Lucide React Icons**

## Usage

### Adding Questions

#### Manual Addition

1. Navigate to the **Manage** page
2. Download the sample .csv with neetcode 250 questions and import it OR Click **"Add Question"** to add single question.

> Make sure the question tag is already created else it wont be visible in study page

#### CSV Upload

1. Prepare a CSV file with columns: `title`, `url`, `difficulty`, `tags`
2. Tags should be comma-separated
3. Click **"Upload CSV"** and select your file
4. Questions will be automatically processed and added

**Sample CSV Format:**

```csv
title,url,difficulty,tags
Two Sum,https://leetcode.com/problems/two-sum/,Easy,Arrays,Hash Table
Add Two Numbers,https://leetcode.com/problems/add-two-numbers/,Medium,Linked List,Math
```

### Managing Tags

1. **Add New Tag**:

   - Click **"Add Tag"** on the Manage page
   - Enter tag name and select color
   - Click **"Add"**

2. **Edit Tag**:

   - Click the edit icon (pencil) on any tag
   - Modify name or color
   - Click **"Update"**

3. **Delete Tag**:
   - Click the delete icon (trash) on any tag
   - Confirm deletion

### Studying Problems

1. **Navigate to Study Page**: Click **"Study"** in the navigation
2. **Configure Study Options**:
   - **Hide Difficulty**: Toggle difficulty level visibility
   - **Randomize**: Randomize question order within categories
   - **Category Wise**: Switch between organized and single list views
   - **Fold/Unfold**: Collapse or expand all categories
3. **Track Progress**:
   - Click the circle icon to mark as completed
   - Click the star icon to mark as starred
   - View progress summary at the top

### Study Options Explained

- **Show Difficulty**: Toggle visibility of Easy/Medium/Hard badges
- **Randomize**: Randomize question order for varied study sessions
- **Category Wise**: Organize questions by tags or show as single list
- **Fold/Unfold**: Quickly collapse or expand all tag sections
- **Reset Progress**: Clear all completion and star marks

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

---

**Happy Coding! 🚀**
