export interface ChordShape {
  fingers: [number, number][];
  muted?: number[];
  open?: number[];
  barra?: number;
}

export const CHORD_SHAPES_MOCK: Record<string, ChordShape> = {
  'C': { fingers: [[2, 4], [3, 2], [2, 1]], muted: [5], open: [0, 3] },
  'D': { fingers: [[1, 2], [3, 2], [2, 3]], muted: [4, 5], open: [0] },
  'E': { fingers: [[3, 1], [4, 2], [5, 2]], open: [0, 1, 2] },
  'G': { fingers: [[1, 5], [2, 6], [1, 1]], open: [2, 3, 4] },
  'A': { fingers: [[2, 2], [3, 2], [4, 2]], muted: [5], open: [0, 3] },
  'Am': { fingers: [[2, 1], [3, 2], [4, 2]], muted: [5], open: [0, 3] },
  'Bm': { barra: 2, fingers: [[3, 4], [4, 4], [2, 3]], muted: [5] },
};
