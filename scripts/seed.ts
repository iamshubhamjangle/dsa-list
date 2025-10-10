import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      image: "https://via.placeholder.com/150",
    },
  });

  console.log("✅ Created test user:", testUser.email);

  // Create tags
  const tags = [
    {
      name: "Array",
      color: "#3B82F6",
      description: "Array and list manipulation problems",
    },
    {
      name: "Linked List",
      color: "#10B981",
      description: "Linked list traversal and manipulation",
    },
    {
      name: "Dynamic Programming",
      color: "#F59E0B",
      description: "Dynamic programming problems",
    },
    {
      name: "Binary Search",
      color: "#EF4444",
      description: "Binary search and related algorithms",
    },
    {
      name: "Tree",
      color: "#8B5CF6",
      description: "Tree traversal and manipulation",
    },
    {
      name: "Graph",
      color: "#06B6D4",
      description: "Graph algorithms and traversal",
    },
    {
      name: "Hash Table",
      color: "#84CC16",
      description: "Hash table and map problems",
    },
    {
      name: "Two Pointers",
      color: "#F97316",
      description: "Two pointer technique",
    },
  ];

  const createdTags = [];
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: {
        name_userId: {
          name: tagData.name,
          userId: testUser.id,
        },
      },
      update: {},
      create: {
        ...tagData,
        userId: testUser.id,
      },
    });
    createdTags.push(tag);
  }

  console.log("✅ Created tags:", createdTags.map((t) => t.name).join(", "));

  // Create questions
  const questions = [
    {
      name: "Two Sum",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "Easy",
      tagNames: ["Array", "Hash Table"],
      notes: "Classic two sum problem. Use hash map for O(n) solution.",
    },
    {
      name: "Add Two Numbers",
      url: "https://leetcode.com/problems/add-two-numbers/",
      difficulty: "Medium",
      tagNames: ["Linked List", "Math"],
      notes: "Add two numbers represented as linked lists.",
    },
    {
      name: "Longest Substring Without Repeating Characters",
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      difficulty: "Medium",
      tagNames: ["Hash Table", "Two Pointers"],
      notes: "Use sliding window with hash set.",
    },
    {
      name: "Median of Two Sorted Arrays",
      url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      difficulty: "Hard",
      tagNames: ["Array", "Binary Search"],
      notes:
        "Complex binary search problem. Need to understand the algorithm well.",
    },
    {
      name: "Longest Palindromic Substring",
      url: "https://leetcode.com/problems/longest-palindromic-substring/",
      difficulty: "Medium",
      tagNames: ["Dynamic Programming", "Two Pointers"],
      notes: "Expand around centers approach is more efficient.",
    },
    {
      name: "ZigZag Conversion",
      url: "https://leetcode.com/problems/zigzag-conversion/",
      difficulty: "Medium",
      tagNames: ["String"],
      notes: "Simulate the zigzag pattern.",
    },
    {
      name: "Reverse Integer",
      url: "https://leetcode.com/problems/reverse-integer/",
      difficulty: "Easy",
      tagNames: ["Math"],
      notes: "Handle overflow carefully.",
    },
    {
      name: "String to Integer (atoi)",
      url: "https://leetcode.com/problems/string-to-integer-atoi/",
      difficulty: "Medium",
      tagNames: ["String", "Math"],
      notes: "Handle all edge cases and whitespace.",
    },
    {
      name: "Palindrome Number",
      url: "https://leetcode.com/problems/palindrome-number/",
      difficulty: "Easy",
      tagNames: ["Math"],
      notes: "Convert to string or reverse half of the number.",
    },
    {
      name: "Regular Expression Matching",
      url: "https://leetcode.com/problems/regular-expression-matching/",
      difficulty: "Hard",
      tagNames: ["Dynamic Programming", "String"],
      notes: "Complex DP problem with many edge cases.",
    },
  ];

  const createdQuestions = [];
  for (const questionData of questions) {
    // Find tag IDs
    const tagIds = createdTags
      .filter((tag) => questionData.tagNames.includes(tag.name))
      .map((tag) => tag.id);

    const question = await prisma.question.create({
      data: {
        name: questionData.name,
        url: questionData.url,
        difficulty: questionData.difficulty,
        notes: questionData.notes,
        userId: testUser.id,
        questionTags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });
    createdQuestions.push(question);
  }

  console.log(
    "✅ Created questions:",
    createdQuestions.map((q) => q.name).join(", ")
  );

  // Mark some questions as completed and starred
  await prisma.question.updateMany({
    where: {
      id: {
        in: createdQuestions.slice(0, 3).map((q) => q.id), // First 3 questions
      },
    },
    data: {
      completed: true,
      solvedAt: new Date(),
    },
  });

  await prisma.question.updateMany({
    where: {
      id: {
        in: createdQuestions.slice(1, 4).map((q) => q.id), // Questions 2-4
      },
    },
    data: {
      starred: true,
    },
  });

  console.log("✅ Updated question status (completed and starred)");

  // Get final counts
  const userCount = await prisma.user.count();
  const tagCount = await prisma.tag.count();
  const questionCount = await prisma.question.count();
  const completedCount = await prisma.question.count({
    where: { completed: true },
  });
  const starredCount = await prisma.question.count({
    where: { starred: true },
  });

  console.log("\n📊 Database Statistics:");
  console.log(`👥 Users: ${userCount}`);
  console.log(`🏷️  Tags: ${tagCount}`);
  console.log(`❓ Questions: ${questionCount}`);
  console.log(`✅ Completed: ${completedCount}`);
  console.log(`⭐ Starred: ${starredCount}`);

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
