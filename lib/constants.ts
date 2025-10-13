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

// Default tags for new users
// Color mapping based on difficulty: green shades (easy), amber/pink (medium), red (hard)
export const DEFAULT_TAGS = [
  // Green-200 level (Easiest)
  {
    name: "Arrays",
    color: "#10B981", // green
    description: "Array manipulation and traversal problems",
  },
  {
    name: "Heap",
    color: "#10B981", // green
    description: "Priority queue and heap problems",
  },
  {
    name: "Two Pointers",
    color: "#10B981", // green
    description: "Two pointer technique",
  },
  {
    name: "Sliding Window",
    color: "#10B981", // green
    description: "Sliding window technique",
  },
  // Green-300 level (Easy-Medium)
  {
    name: "Stack",
    color: "#3B82F6", // blue
    description: "Stack data structure problems",
  },
  {
    name: "Binary Search",
    color: "#3B82F6", // blue
    description: "Binary search and its variants",
  },
  {
    name: "Linked List",
    color: "#3B82F6", // blue
    description: "Linked list manipulation",
  },
  {
    name: "Trees",
    color: "#3B82F6", // blue
    description: "Binary trees and tree traversals",
  },
  // Green-500 level (Medium)
  {
    name: "Graph Basics",
    color: "#6366F1", // indigo
    description: "Basic graph algorithms and traversals",
  },
  // Red-300 level (Medium-Hard)
  {
    name: "Backtracking",
    color: "#8B5CF6", // purple
    description: "Backtracking and recursion",
  },
  {
    name: "Tries",
    color: "#8B5CF6", // purple
    description: "Trie data structure and problems",
  },
  {
    name: "Graphs",
    color: "#8B5CF6", // purple
    description: "Graph algorithms and problems",
  },
  {
    name: "Advanced Graphs",
    color: "#8B5CF6", // purple
    description: "Advanced graph algorithms (MST, shortest paths, etc.)",
  },
  // Red-400 level (Hard)
  {
    name: "DP 1D",
    color: "#EC4899", // pink
    description: "1D Dynamic Programming problems",
  },
  {
    name: "DP 2D",
    color: "#EC4899", // pink
    description: "2D Dynamic Programming problems",
  },
  {
    name: "Greedy",
    color: "#EC4899", // pink
    description: "Greedy algorithm problems",
  },
  {
    name: "Intervals",
    color: "#EC4899", // pink
    description: "Interval problems",
  },
  // Red-500 level (Hardest)
  {
    name: "Segment Tree",
    color: "#EF4444", // red
    description: "Segment tree data structure and problems",
  },
  {
    name: "Math",
    color: "#EF4444", // red
    description: "Mathematical and numerical problems",
  },
  {
    name: "Bit Manipulation",
    color: "#EF4444", // red
    description: "Bitwise operations and tricks",
  },
] as const;
