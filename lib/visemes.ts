export type Viseme = { id: number; tMs: number };

// Azure viseme IDs 0–21
export const VISEME_SILENCE = 0;
export const VISEME_COUNT = 22;

// Grouped mouth shapes for rendering
export type MouthShape = 'closed' | 'slight' | 'open' | 'wide' | 'round' | 'teeth';

// Azure viseme ID → simplified mouth shape
export const VISEME_TO_MOUTH: Record<number, MouthShape> = {
  0: 'closed',   // silence
  1: 'slight',   // æ
  2: 'open',     // ɑ
  3: 'wide',     // ɑː
  4: 'open',     // ɔ
  5: 'slight',   // eɪ, ɛ, ə
  6: 'round',    // w, uː
  7: 'round',    // oʊ
  8: 'teeth',    // ð, d, n, t
  9: 'slight',   // tʃ, ʃ, ʒ
  10: 'open',    // ɜ
  11: 'slight',  // r
  12: 'teeth',   // f, v
  13: 'open',    // ɪ
  14: 'slight',  // l
  15: 'closed',  // m, b, p
  16: 'slight',  // ŋ, k, g
  17: 'closed',  // p, b (alt)
  18: 'round',   // ɔː wide round
  19: 'teeth',   // s, z
  20: 'teeth',   // θ
  21: 'teeth',   // f, v (alt)
};

export const MOUTH_SHAPES: Record<MouthShape, { height: number; width: number; borderRadius: number }> = {
  closed: { height: 4, width: 44, borderRadius: 2 },
  slight: { height: 14, width: 42, borderRadius: 7 },
  open:   { height: 24, width: 44, borderRadius: 12 },
  wide:   { height: 28, width: 50, borderRadius: 14 },
  round:  { height: 24, width: 24, borderRadius: 12 },
  teeth:  { height: 8, width: 38, borderRadius: 4 },
};
