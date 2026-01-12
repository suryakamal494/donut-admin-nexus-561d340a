// Mock topic data for chapters (in real app, this would come from masterData)

export interface TopicInfo {
  id: string;
  name: string;
  duration: string;
  status: "completed" | "in_progress" | "pending";
}

export const MOCK_TOPICS: Record<string, TopicInfo[]> = {
  "phy-10-1": [
    { id: "t1", name: "Reflection of Light", duration: "2h", status: "completed" },
    { id: "t2", name: "Spherical Mirrors", duration: "3h", status: "completed" },
    { id: "t3", name: "Refraction of Light", duration: "2h", status: "completed" },
    { id: "t4", name: "Refraction by Spherical Lenses", duration: "3h", status: "completed" },
  ],
  "phy-10-2": [
    { id: "t1", name: "Human Eye", duration: "2h", status: "completed" },
    { id: "t2", name: "Defects of Vision", duration: "2h", status: "completed" },
    { id: "t3", name: "Dispersion of Light", duration: "2h", status: "in_progress" },
  ],
  "phy-10-3": [
    { id: "t1", name: "Electric Current and Circuit", duration: "2h", status: "in_progress" },
    { id: "t2", name: "Electric Potential and Potential Difference", duration: "2h", status: "pending" },
    { id: "t3", name: "Ohm's Law", duration: "3h", status: "pending" },
    { id: "t4", name: "Resistance and Resistivity", duration: "2h", status: "pending" },
    { id: "t5", name: "Heating Effect of Electric Current", duration: "2h", status: "pending" },
  ],
  "mat-6-6": [
    { id: "t1", name: "Introduction to Integers", duration: "1h", status: "completed" },
    { id: "t2", name: "Representation of Integers on Number Line", duration: "1h", status: "completed" },
    { id: "t3", name: "Addition of Integers", duration: "2h", status: "in_progress" },
    { id: "t4", name: "Subtraction of Integers", duration: "2h", status: "pending" },
  ],
};

// Get mock topics for a chapter (falls back to generated topics)
export const getTopicsForChapter = (chapterId: string, chapterName: string): TopicInfo[] => {
  if (MOCK_TOPICS[chapterId]) {
    return MOCK_TOPICS[chapterId];
  }
  // Generate placeholder topics
  return [
    { id: "t1", name: `Introduction to ${chapterName.split(' ').slice(0, 3).join(' ')}`, duration: "2h", status: "pending" as const },
    { id: "t2", name: "Core Concepts", duration: "2h", status: "pending" as const },
    { id: "t3", name: "Practice Problems", duration: "2h", status: "pending" as const },
  ];
};
