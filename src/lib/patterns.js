/* Generative monochrome "exposures" — pure-CSS patterns that stand in for
   photography across the site (gallery frames, event card art) until real
   photos replace them. */
export const PATTERNS = {
  dots: {
    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
    backgroundSize: '12px 12px',
  },
  diag: {
    backgroundImage:
      'repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 10px)',
  },
  grid: {
    backgroundImage:
      'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
    backgroundSize: '22px 22px',
  },
  cross: {
    backgroundImage:
      'repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #ffffff 0 1px, transparent 1px 12px)',
  },
  lines: {
    backgroundImage:
      'repeating-linear-gradient(0deg, #ffffff 0 1px, transparent 1px 8px)',
  },
  rings: {
    backgroundImage:
      'repeating-radial-gradient(circle at 50% 50%, #ffffff 0 1px, transparent 1px 16px)',
  },
}
