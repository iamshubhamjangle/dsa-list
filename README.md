- Get, update, delete all questions
- Get, update, delete all tags
- Upload - BatchCreateQuestions
- tag color should be enum with fixed colors on FE/BE

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

## Data Persistence

All data is stored in the browser's localStorage:

- **Questions**: Problem list with metadata
- **Tags**: Custom and default tags with colors
- **Progress**: Completion status and star marks
- **Study Options**: User preferences for study mode

## CSV Format Requirements

For successful CSV uploads, ensure your file has:

- **Header row**: `title,url,difficulty,tags`
- **Title**: Human-readable question name
- **URL**: Valid LeetCode problem URLs
- **Difficulty**: One of: Easy, Medium, Hard
- **Tags**: Comma-separated tag names

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
