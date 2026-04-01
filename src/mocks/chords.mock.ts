export interface ChordShape {
  fingers: [number, number, string?][];
  muted?: number[];
  open?: number[];
  barra?: number;
}

export const CHORD_SHAPES_MOCK: Record<string, ChordShape[]> = {
  'C': [
    { fingers: [[1, 5], [2, 3], [3, 2]], muted: [5], open: [0, 2] },
    { barra: 3, fingers: [[3, 2, '1'], [5, 3, '2'], [5, 4, '3'], [5, 5, '4']], muted: [5], open: [] },
  ],
  'D': [
    { fingers: [[2, 4], [2, 6], [3, 5]], muted: [4, 5], open: [3] },
    { barra: 5, fingers: [[5, 2, '1'], [7, 3, '2'], [7, 4, '3'], [7, 5, '4']], muted: [5], open: [] },
  ],
  'E': [
    { fingers: [[1, 4], [2, 2], [2, 3]], muted: [], open: [0, 1, 5] },
    { barra: 7, fingers: [[7, 2, '1'], [9, 3, '3'], [9, 4, '4'], [8, 5, '2']], muted: [5], open: [] },
  ],
  'G': [
    { fingers: [[2, 2], [3, 1], [3, 6, '3']], muted: [], open: [1, 2, 3] },
    { barra: 3, fingers: [[3, 1, '1'], [5, 2, '3'], [5, 3, '4'], [4, 4, '2']], muted: [], open: [] },
  ],
  'A': [
    { fingers: [[2, 3, '1'], [2, 4, '2'], [2, 5, '3']], muted: [5], open: [0, 4] },
    { barra: 5, fingers: [[5, 1, '1'], [7, 2, '3'], [7, 3, '4'], [6, 4, '2']], muted: [], open: [] },
  ],
  'Am': [
    { fingers: [[1, 5], [2, 3], [2, 4, '3']], muted: [5], open: [0, 4] },
    { barra: 5, fingers: [[5, 1, '1'], [7, 2, '3'], [7, 3, '4']], muted: [], open: [] },
  ],
  'Bm': [
    { barra: 2, fingers: [[2, 2, '1'], [4, 3, '3'], [4, 4, '4'], [3, 5, '2']], muted: [5], open: [] },
    { barra: 7, fingers: [[7, 1, '1'], [9, 2, '3'], [9, 3, '4']], muted: [], open: [] },
  ],
  'F': [
    { barra: 1, fingers: [[1, 1, '1'], [3, 2, '3'], [3, 3, '4'], [2, 4, '2']], muted: [], open: [] },
  ],
  'Fm': [
    { barra: 1, fingers: [[1, 1, '1'], [3, 2, '3'], [3, 3, '4']], muted: [], open: [] },
  ],
  'F#m': [
    { barra: 2, fingers: [[2, 1, '1'], [4, 2, '3'], [4, 3, '4']], muted: [], open: [] },
  ],
  'C#m': [
    { barra: 4, fingers: [[4, 2, '1'], [6, 3, '3'], [6, 4, '4'], [5, 5, '2']], muted: [5], open: [] },
  ],
  'B': [
    { barra: 2, fingers: [[2, 2, '1'], [4, 3, '2'], [4, 4, '3'], [4, 5, '4']], muted: [5], open: [] },
  ],
  'Dm': [
    { fingers: [[1, 6, '1'], [3, 5, '3'], [2, 4, '2']], muted: [4, 5], open: [3] },
  ],
  'Em': [
    { fingers: [[2, 2, '2'], [2, 3, '3']], muted: [], open: [0, 1, 4, 5] },
  ],
  'G#m': [
    { barra: 4, fingers: [[4, 1, '1'], [6, 2, '3'], [6, 3, '4']], muted: [], open: [] },
  ],
};
