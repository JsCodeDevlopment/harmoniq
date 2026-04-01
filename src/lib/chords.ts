export type Fret = number | null;

export interface ChordShape {
  id: string;
  name: string; // "E", "A", etc (base shape)
  baseFret: number; // casa base (0 = aberto)
  frets: Fret[]; // [E, A, D, G, B, e]
  fingers?: number[]; // opcional (1,2,3,4)
  difficulty: number; // 1 a 5
  isBarre?: boolean;
  tags?: string[]; // ["open", "triad", "barre"]
}

export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const BASE_SHAPES: ChordShape[] = [
  {
    id: "E_open",
    name: "E",
    baseFret: 0,
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [2, 3, 1],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "Em_open",
    name: "Em",
    baseFret: 0,
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [2, 3],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "E_barre",
    name: "E",
    baseFret: 0,
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [1, 3, 4, 2, 1, 1], // Pestana!
    difficulty: 3,
    isBarre: true,
    tags: ["barre"]
  },
  {
    id: "A_open",
    name: "A",
    baseFret: 0,
    frets: [null, 0, 2, 2, 2, 0],
    fingers: [1, 2, 3],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "Am_open",
    name: "Am",
    baseFret: 0,
    frets: [null, 0, 2, 2, 1, 0],
    fingers: [2, 3, 1],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "C_open",
    name: "C",
    baseFret: 0,
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [3, 2, 1],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "D_open",
    name: "D",
    baseFret: 0,
    frets: [null, null, 0, 2, 3, 2],
    fingers: [1, 3, 2],
    difficulty: 1,
    tags: ["open"]
  },
  {
    id: "G_open",
    name: "G",
    baseFret: 0,
    frets: [3, 2, 0, 0, 3, 3],
    fingers: [2, 1, 3, 4],
    difficulty: 1,
    tags: ["open"]
  }
];

export function transposeShape(shape: ChordShape, semitones: number): ChordShape {
  // Se transpondo de um shape aberto para fora da casa 0, ele vira pestana
  const needsBarre = shape.baseFret + semitones > 0 && shape.tags?.includes("open");
  
  return {
    ...shape,
    id: `${shape.id}_transposed_${semitones}`,
    baseFret: shape.baseFret + semitones,
    frets: shape.frets.map(f => (f === null ? null : f + semitones)),
    isBarre: shape.isBarre || needsBarre,
  };
}

export function getChordIndex(note: string) {
  const index = NOTES.indexOf(note);
  if (index !== -1) return index;

  const map: Record<string, string> = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#",
  };
  return NOTES.indexOf(map[note] || note);
}

export function getSemitones(from: string, to: string) {
  const fromBase = from.split("/")[0].replace(/m$/, "");
  const toBase = to.split("/")[0].replace(/m$/, "");
  
  const fromIndex = getChordIndex(fromBase);
  const toIndex = getChordIndex(toBase);
  
  if (fromIndex === -1 || toIndex === -1) return 0;
  
  return (toIndex - fromIndex + 12) % 12;
}

export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;
  
  const base = chord.split("/")[0];
  const isMinor = base.endsWith("m") && !base.endsWith("bm");
  const suffix = isMinor ? "m" : "";
  const root = base.replace(/m$/, "");
  
  const index = getChordIndex(root);
  if (index === -1) return chord;
  
  const newIndex = (index + semitones + 24) % 12;
  const newRoot = NOTES[newIndex];
  
  const parts = chord.split("/");
  if (parts.length > 1) {
    const bass = parts[1];
    const newBass = transposeChord(bass, semitones);
    return `${newRoot}${suffix}/${newBass}`;
  }
  
  return `${newRoot}${suffix}`;
}

export function generateChordShapes(target: string): ChordShape[] {
  const targetBase = target.split("/")[0];
  const isMinor = targetBase.endsWith("m") && !targetBase.endsWith("bm");
  
  return BASE_SHAPES
    .filter(shape => {
      const shapeIsMinor = shape.name.endsWith("m");
      return isMinor ? shapeIsMinor : !shapeIsMinor;
    })
    .map(shape => {
      const semitones = getSemitones(shape.name, target);
      return transposeShape(shape, semitones);
    });
}

export function rankShapes(shapes: ChordShape[]) {
  return [...shapes].sort((a, b) => {
    const scoreA = (a.baseFret === 0 ? 0 : 2) + a.difficulty + (a.isBarre ? 2 : 0);
    const scoreB = (b.baseFret === 0 ? 0 : 2) + b.difficulty + (b.isBarre ? 2 : 0);
    return scoreA - scoreB;
  });
}

const chordCache = new Map<string, ChordShape[]>();

export function getChordsForName(name: string): ChordShape[] {
  if (chordCache.has(name)) return chordCache.get(name)!;
  
  const shapes = rankShapes(generateChordShapes(name));
  chordCache.set(name, shapes);
  return shapes;
}

export function distance(a: ChordShape, b: ChordShape) {
  return Math.abs(a.baseFret - b.baseFret);
}
