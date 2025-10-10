// Shared constants between frontend and backend

export const TAG_COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // green-500
  "#8B5CF6", // purple-500
  "#6366F1", // indigo-500
  "#EF4444", // red-500
  "#F59E0B", // amber-500
  "#EC4899", // pink-500
  "#6B7280", // gray-500
] as const;

export const DEFAULT_TAG_COLOR = "#10B981"; // green-500

export type TagColor = (typeof TAG_COLORS)[number];
