// utils/checkAnswer.ts
import stringSimilarity from "string-similarity";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim()
    .replace(/^a |^an |^the /, ""); // remove leading articles
}

export function checkAnswer(userInput: string, correctAnswer: string): boolean {
  const normalizedUser = normalize(userInput);
  const normalizedAnswer = normalize(correctAnswer);

  if (normalizedUser === normalizedAnswer) return true;

  // Optional fuzzy match
  const similarity = stringSimilarity.compareTwoStrings(
    normalizedUser,
    normalizedAnswer
  );
  return similarity > 0.8; // adjust threshold if needed
}
