/**
 * Parses multi-line input into individual entries.
 * Supports newline-separated values for bulk data entry.
 * 
 * @param input - Raw text input (can contain multiple lines)
 * @param maxLength - Maximum length per entry (default: 200)
 * @returns Array of trimmed, non-empty strings
 */
export const parseBulkInput = (input: string, maxLength: number = 200): string[] => {
  return input
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.length <= maxLength);
};

/**
 * Validates a single entry name (chapter, topic, etc.)
 * 
 * @param name - Entry name to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 200)
 * @returns Object with isValid and error message
 */
export const validateEntryName = (
  name: string, 
  minLength: number = 1, 
  maxLength: number = 200
): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Name must be at least ${minLength} character(s)` };
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Name must be ${maxLength} characters or less` };
  }
  
  return { isValid: true };
};

/**
 * Counts the number of blanks in a fill-in-the-blank question
 * Supports multiple blank formats: ____, [blank], {blank}
 * 
 * @param text - Question text to analyze
 * @returns Number of blanks found
 */
export const countBlanks = (text: string): number => {
  const blankPatterns = [
    /_{3,}/g,           // ___ (3 or more underscores)
    /\[blank\]/gi,      // [blank]
    /\{blank\}/gi,      // {blank}
  ];
  
  let count = 0;
  for (const pattern of blankPatterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  
  return count;
};
