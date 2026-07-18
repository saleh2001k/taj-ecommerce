import { readFileSync } from 'node:fs';

/** Minimal TTF table reader: head (unitsPerEm), hhea (asc/desc/gap), OS/2 (win + typo). */
function metrics(path) {
  const b = readFileSync(path);
  const numTables = b.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    tables[b.toString('ascii', o, o + 4).trim()] = { off: b.readUInt32BE(o + 8) };
  }
  const head = tables.head.off;
  const unitsPerEm = b.readUInt16BE(head + 18);

  const hhea = tables.hhea.off;
  const hheaAsc = b.readInt16BE(hhea + 4);
  const hheaDesc = b.readInt16BE(hhea + 6);
  const hheaGap = b.readInt16BE(hhea + 8);

  const os2 = tables['OS/2'].off;
  const version = b.readUInt16BE(os2);
  const sTypoAscender = b.readInt16BE(os2 + 68);
  const sTypoDescender = b.readInt16BE(os2 + 70);
  const sTypoLineGap = b.readInt16BE(os2 + 72);
  const usWinAscent = b.readUInt16BE(os2 + 74);
  const usWinDescent = b.readUInt16BE(os2 + 76);
  const fsSelection = b.readUInt16BE(os2 + 62);
  const USE_TYPO_METRICS = (fsSelection & 0x80) !== 0; // bit 7

  return {
    unitsPerEm,
    USE_TYPO_METRICS,
    version,
    // What browsers/RN actually use for the content box:
    winRatio: (usWinAscent + usWinDescent) / unitsPerEm,
    hheaRatio: (hheaAsc - hheaDesc + hheaGap) / unitsPerEm,
    typoRatio: (sTypoAscender - sTypoDescender + sTypoLineGap) / unitsPerEm,
    raw: {
      usWinAscent,
      usWinDescent,
      hheaAsc,
      hheaDesc,
      hheaGap,
      sTypoAscender,
      sTypoDescender,
      sTypoLineGap,
    },
  };
}

const base = '/Users/saleh/Desktop/os/ecommerce-app/node_modules/@expo-google-fonts';
const fonts = {
  Cairo_400Regular: `${base}/cairo/400Regular/Cairo_400Regular.ttf`,
  Cairo_700Bold: `${base}/cairo/700Bold/Cairo_700Bold.ttf`,
  Tajawal_400Regular: `${base}/tajawal/400Regular/Tajawal_400Regular.ttf`,
  Tajawal_700Bold: `${base}/tajawal/700Bold/Tajawal_700Bold.ttf`,
  IBMPlexSansArabic_400Regular: `${base}/ibm-plex-sans-arabic/400Regular/IBMPlexSansArabic_400Regular.ttf`,
  IBMPlexSansArabic_700Bold: `${base}/ibm-plex-sans-arabic/700Bold/IBMPlexSansArabic_700Bold.ttf`,
  Rubik_400Regular: `${base}/rubik/400Regular/Rubik_400Regular.ttf`,
  Rubik_700Bold: `${base}/rubik/700Bold/Rubik_700Bold.ttf`,
};

console.log('Font intrinsic line box, as a multiple of font-size (em):\n');
console.log('font                          upem  useTypo   win    hhea   typo');
let maxWin = 0;
let maxHhea = 0;
for (const [name, p] of Object.entries(fonts)) {
  try {
    const m = metrics(p);
    maxWin = Math.max(maxWin, m.winRatio);
    maxHhea = Math.max(maxHhea, m.hheaRatio);
    console.log(
      `${name.padEnd(29)} ${String(m.unitsPerEm).padEnd(5)} ${String(m.USE_TYPO_METRICS).padEnd(8)} ` +
        `${m.winRatio.toFixed(3)}  ${m.hheaRatio.toFixed(3)}  ${m.typoRatio.toFixed(3)}`,
    );
  } catch (e) {
    console.log(name, 'ERR', e.message);
  }
}

console.log('\nCairo detail (the reported culprit):');
console.log(JSON.stringify(metrics(fonts.Cairo_700Bold), null, 1));

console.log('\n── What this means ──');
console.log('max win ratio  :', maxWin.toFixed(3), '(content box browsers reserve)');
console.log('max hhea ratio :', maxHhea.toFixed(3), '(what RN/Android normally uses)');
console.log('our lineHeight : 1.200  <-- current token ratio');
console.log(
  '\nlineHeight below the intrinsic ratio => NEGATIVE half-leading => glyphs overflow the line box.',
);
for (const [size, lh] of [
  [12, 14],
  [14, 17],
  [16, 19],
  [18, 22],
  [22, 26],
  [28, 34],
  [34, 41],
  [44, 53],
]) {
  const need = size * maxWin;
  console.log(
    `  fontSize ${String(size).padStart(2)} -> lineHeight ${String(lh).padStart(2)}  needs ${need.toFixed(1)}  ` +
      (lh < need ? `CLIPS by ${(need - lh).toFixed(1)}px` : 'ok'),
  );
}
