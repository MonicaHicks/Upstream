// types/string-similarity.d.ts

declare module "string-similarity" {
  const compareTwoStrings: (first: string, second: string) => number;
  const findBestMatch: (
    mainString: string,
    targetStrings: string[]
  ) => {
    ratings: { target: string; rating: number }[];
    bestMatch: { target: string; rating: number };
    bestMatchIndex: number;
  };
  export { compareTwoStrings, findBestMatch };
}
