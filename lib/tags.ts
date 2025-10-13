import { prisma } from "./db";
import { DEFAULT_TAGS } from "./constants";

/**
 * Creates default tags for a new user
 * This function is called when a new user signs in for the first time
 * @param userId - The ID of the user to create tags for
 * @returns Promise resolving to the created tags count
 */
export async function createDefaultTagsForUser(
  userId: string
): Promise<number> {
  console.log("Creating default tags for user", userId);
  try {
    // Check if user already has tags to avoid duplication
    const existingTagsCount = await prisma.tag.count({
      where: { userId },
    });

    if (existingTagsCount > 0) {
      console.log(
        `User ${userId} already has ${existingTagsCount} tags, skipping default tag creation`
      );
      return 0;
    }

    // Create all default tags in a transaction for atomicity
    const result = await prisma.tag.createMany({
      data: DEFAULT_TAGS.map((tag) => ({
        name: tag.name,
        color: tag.color,
        description: tag.description,
        userId: userId,
      })),
      skipDuplicates: true, // Skip any that might somehow already exist
    });

    console.log(
      `Successfully created ${result.count} default tags for user ${userId}`
    );
    return result.count;
  } catch (error) {
    console.error(`Error creating default tags for user ${userId}:`, error);
    // Don't throw error to prevent blocking user authentication
    // Tags can be created manually later if this fails
    return 0;
  }
}

/**
 * Checks if a user has any tags
 * @param userId - The ID of the user
 * @returns Promise resolving to true if user has tags, false otherwise
 */
export async function userHasTags(userId: string): Promise<boolean> {
  try {
    const count = await prisma.tag.count({
      where: { userId },
    });
    return count > 0;
  } catch (error) {
    console.error(`Error checking tags for user ${userId}:`, error);
    return false;
  }
}
