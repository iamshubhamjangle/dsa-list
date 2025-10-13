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
export const DEFAULT_TAGS = [
  {
    name: "Array",
    color: "#3B82F6", // blue
    description: "Array manipulation and traversal problems",
  },
  {
    name: "String",
    color: "#10B981", // green
    description: "String processing and manipulation",
  },
  {
    name: "Intervals",
    color: "#3B82F6", // blue
    description: "Interval problems",
  },
  {
    name: "Hash Table",
    color: "#8B5CF6", // purple
    description: "Hash map and hash set problems",
  },
  {
    name: "Dynamic Programming",
    color: "#6366F1", // indigo
    description: "DP optimization problems",
  },
  {
    name: "Math",
    color: "#F59E0B", // amber
    description: "Mathematical and numerical problems",
  },
  {
    name: "Sorting",
    color: "#EC4899", // pink
    description: "Sorting algorithms and problems",
  },
  {
    name: "Binary Search",
    color: "#EF4444", // red
    description: "Binary search and its variants",
  },
  {
    name: "Tree",
    color: "#10B981", // green
    description: "Binary trees and tree traversals",
  },
  {
    name: "Depth-First Search",
    color: "#3B82F6", // blue
    description: "DFS algorithms and problems",
  },
  {
    name: "Breadth-First Search",
    color: "#6366F1", // indigo
    description: "BFS algorithms and problems",
  },
  {
    name: "Graph",
    color: "#8B5CF6", // purple
    description: "Graph algorithms and problems",
  },
  {
    name: "Greedy",
    color: "#F59E0B", // amber
    description: "Greedy algorithm problems",
  },
  {
    name: "Backtracking",
    color: "#EF4444", // red
    description: "Backtracking and recursion",
  },
  {
    name: "Stack",
    color: "#EC4899", // pink
    description: "Stack data structure problems",
  },
  {
    name: "Queue",
    color: "#6B7280", // gray
    description: "Queue data structure problems",
  },
  {
    name: "Linked List",
    color: "#3B82F6", // blue
    description: "Linked list manipulation",
  },
  {
    name: "Heap",
    color: "#10B981", // green
    description: "Priority queue and heap problems",
  },
  {
    name: "Two Pointers",
    color: "#8B5CF6", // purple
    description: "Two pointer technique",
  },
  {
    name: "Sliding Window",
    color: "#6366F1", // indigo
    description: "Sliding window technique",
  },
  {
    name: "Bit Manipulation",
    color: "#EF4444", // red
    description: "Bitwise operations and tricks",
  },
  {
    name: "Trie",
    color: "#10B981", // green
    description: "Trie data structure and problems",
  },
  {
    name: "Segment Tree",
    color: "#10B981", // pink
    description: "Segment tree data structure and problems",
  },
] as const;
