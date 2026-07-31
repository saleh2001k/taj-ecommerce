/**
 * Filled tab glyphs, as raw SVG path data.
 *
 * ── Why not `expo-symbols` here? ──
 * On Android `SymbolView` renders Material Symbols from a FONT
 * (`@expo-google-fonts/material-symbols`), and that package ships the
 * **Outlined** face only — seven weights, no FILL axis. There is no prop that
 * gets you a solid icon out of it. So the four tab glyphs are drawn instead,
 * straight from Google's own `material-design-icons` repo: the
 * **Rounded, fill=1** variants, to match the capsule's shape language.
 *
 * Keyed by the SAME Material Symbols name the rest of the app uses (`NavItem.md`),
 * so the tab bar and the iOS native tab bar can't drift apart on which icon a
 * route owns.
 *
 * Everything else (the website nav, the iOS tab bar) still goes through
 * `expo-symbols` — this exists only because the filled Android face doesn't.
 */

/**
 * Material Symbols' own coordinate system (not the 0 0 24 24 of the older
 * Material Icons set) — the baseline sits at y=0, so the box runs upward.
 */
export const GLYPH_VIEW_BOX = '0 -960 960 960';

export const TAB_GLYPHS = {
  home: 'M160-200v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H600q-17 0-28.5-11.5T560-160v-200q0-17-11.5-28.5T520-400h-80q-17 0-28.5 11.5T400-360v200q0 17-11.5 28.5T360-120H240q-33 0-56.5-23.5T160-200Z',
  shopping_bag:
    'M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm160-640h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720Zm200 200q17 0 28.5-11.5T640-560v-80h-80v80q0 17 11.5 28.5T600-520Zm-240 0q17 0 28.5-11.5T400-560v-80h-80v80q0 17 11.5 28.5T360-520Z',
  grid_view:
    'M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600Z',
  person:
    'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z',
} as const;

/** The Material Symbols names the tab bar can draw filled. */
export type TabGlyph = keyof typeof TAB_GLYPHS;
