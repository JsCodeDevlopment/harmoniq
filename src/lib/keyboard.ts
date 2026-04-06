export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const INTERVALS: Record<string, number[]> = {
  "": [0, 4, 7],
  "m": [0, 3, 7],
  "7": [0, 4, 7, 10],
  "m7": [0, 3, 7, 10],
  "maj7": [0, 4, 7, 11],
  "sus4": [0, 5, 7],
  "sus2": [0, 2, 7],
  "add9": [0, 4, 7, 14],
  "9": [0, 4, 7, 10, 14],
  "dim": [0, 3, 6],
  "aug": [0, 4, 8],
  "6": [0, 4, 7, 9],
  "m6": [0, 3, 7, 9],
  "7sus4": [0, 5, 7, 10],
};

export function getKeyboardNotes(chordName: string): number[] {
  // Extract root and suffix
  let root = "";
  let rest = "";

  if (chordName[1] === "#" || chordName[1] === "b") {
    root = chordName.slice(0, 2);
    rest = chordName.slice(2);
  } else {
    root = chordName.slice(0, 1);
    rest = chordName.slice(1);
  }

  // Normalize root
  const rootMap: Record<string, string> = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#",
  };
  const normalizedRoot = rootMap[root] || root;
  const rootIndex = NOTES.indexOf(normalizedRoot);

  if (rootIndex === -1) return [];

  // Parse suffix - very basic for now
  // In a real app we'd want a more robust parser
  let suffix = rest.split("/")[0]; // ignore bass note for now
  
  // Try to find the intervals
  let intervals = INTERVALS[suffix] || INTERVALS[""];

  // If no match, try to match common prefixes
  if (!INTERVALS[suffix]) {
    if (suffix.startsWith("m")) {
       if (suffix.startsWith("maj7")) intervals = INTERVALS["maj7"];
       else if (suffix.startsWith("m7")) intervals = INTERVALS["m7"];
       else if (suffix.startsWith("m6")) intervals = INTERVALS["m6"];
       else intervals = INTERVALS["m"];
    } else if (suffix.startsWith("7")) {
       if (suffix.startsWith("7sus4")) intervals = INTERVALS["7sus4"];
       else intervals = INTERVALS["7"];
    }
  }

  return intervals.map(interval => (rootIndex + interval) % 12);
}
