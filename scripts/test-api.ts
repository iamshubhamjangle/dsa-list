import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAPI() {
  console.log("🧪 Testing API endpoints with dummy data...\n");

  try {
    // Test 1: Get all users
    console.log("1️⃣ Testing User queries...");
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            tags: true,
          },
        },
      },
    });

    console.log(`✅ Found ${users.length} users:`);
    users.forEach((user) => {
      console.log(`   - ${user.name} (${user.email})`);
      console.log(
        `     Questions: ${user._count.questions}, Tags: ${user._count.tags}`
      );
    });

    // Test 2: Get all tags
    console.log("\n2️⃣ Testing Tag queries...");
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            questionTags: true,
          },
        },
      },
    });

    console.log(`✅ Found ${tags.length} tags:`);
    tags.forEach((tag) => {
      console.log(
        `   - ${tag.name} (${tag.color}) - ${tag._count.questionTags} questions`
      );
    });

    // Test 3: Get all questions with tags
    console.log("\n3️⃣ Testing Question queries...");
    const questions = await prisma.question.findMany({
      include: {
        questionTags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Found ${questions.length} questions:`);
    questions.forEach((question) => {
      const tagNames = question.questionTags
        .map((qt) => qt.tag.name)
        .join(", ");
      console.log(`   - ${question.name} (${question.difficulty})`);
      console.log(`     User: ${question.user.name}, Tags: ${tagNames}`);
      console.log(
        `     Completed: ${question.completed}, Starred: ${question.starred}`
      );
    });

    // Test 4: Test filtering by difficulty
    console.log("\n4️⃣ Testing Question filtering...");
    const easyQuestions = await prisma.question.findMany({
      where: {
        difficulty: "Easy",
      },
      include: {
        questionTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(`✅ Found ${easyQuestions.length} Easy questions:`);
    easyQuestions.forEach((q) => {
      console.log(`   - ${q.name}`);
    });

    // Test 5: Test filtering by completion status
    console.log("\n5️⃣ Testing completion status...");
    const completedQuestions = await prisma.question.findMany({
      where: {
        completed: true,
      },
      include: {
        questionTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(`✅ Found ${completedQuestions.length} completed questions:`);
    completedQuestions.forEach((q) => {
      console.log(`   - ${q.name} (solved at: ${q.solvedAt})`);
    });

    // Test 6: Test tag-question relationships
    console.log("\n6️⃣ Testing tag-question relationships...");
    const arrayTag = await prisma.tag.findFirst({
      where: {
        name: "Array",
      },
      include: {
        questionTags: {
          include: {
            question: {
              select: {
                name: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    if (arrayTag) {
      console.log(
        `✅ Array tag has ${arrayTag.questionTags.length} questions:`
      );
      arrayTag.questionTags.forEach((qt) => {
        console.log(`   - ${qt.question.name} (${qt.question.difficulty})`);
      });
    }

    // Test 7: Test user-specific data
    console.log("\n7️⃣ Testing user-specific data...");
    const testUser = await prisma.user.findFirst({
      where: {
        email: "test@example.com",
      },
      include: {
        questions: {
          include: {
            questionTags: {
              include: {
                tag: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    if (testUser) {
      console.log(`✅ Test user data:`);
      console.log(`   - Questions: ${testUser.questions.length}`);
      console.log(`   - Tags: ${testUser.tags.length}`);
      console.log(
        `   - Completed questions: ${
          testUser.questions.filter((q) => q.completed).length
        }`
      );
      console.log(
        `   - Starred questions: ${
          testUser.questions.filter((q) => q.starred).length
        }`
      );
    }

    console.log("\n🎉 All API tests completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - Completed: ${completedQuestions.length}`);
    console.log(`   - Easy questions: ${easyQuestions.length}`);
  } catch (error) {
    console.error("❌ Error during API testing:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
