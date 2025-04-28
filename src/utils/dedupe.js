// src/utils/dedupe.js
export const dedupeByPreview = list => {
    const seen = new Set();
    return list.filter(item => {
      const id = item.preview; // blob: או URL
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };
  