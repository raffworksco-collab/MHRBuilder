# MHR Equipment Builder

A static web page for building Monster Hunter Rise + Sunbreak equipment. Pick the skills you want
(e.g. Attack Boost 7, Critical Eye 5) and the armor grid shows every piece that carries them. Click a
piece to equip it, then click a hexagon slot to choose a jewel that fits. Also supports weapons, charms,
skill totals and element defense. There is no damage calculator.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main page (UI) |
| `solver.js` | Search engine (DFS + pruning + decoration allocation). Standalone, not wired into the UI yet |
| `data.js` | Armor / skill / decoration / weapon data (generated, do not edit by hand) |
| `build_data.py` | Generates `data.js` from `source_data/*.json` |
| `source_data/` | Source data: `skills.json`, `armour.json`, `decorations.json`, `weapons.json` |
| `icons/` | Icons referenced by the data (`armor/`, `weapon/`, `skill/`, `decoration/`) |
| `LICENSE` | AGPL-3.0 |

## Hosting on GitHub Pages

1. Create a new repo and upload everything in this folder (keep `LICENSE`).
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Wait a minute, then open `https://<username>.github.io/<repo-name>/`.

You can also open `index.html` directly in a browser for local testing.

## Updating data

1. Edit the files in `source_data/`. One armor set looks like this (each piece is `[slots, skills, name, icon]`):

   ```json
   [401, {
       "tier": "mr", "rarity": 10,
       "setName": "Set Name", "searchHint": "",
       "pieces": {
           "head":  [[3,1], {"attack_boost": 2, "critical_eye": 1}, "Piece Name", "armor/head_rare10.png"],
           "chest": [[4],   {"attack_boost": 1}, "Piece Name", "armor/chest_rare10.png"],
           "arms":  [[3],   {"agitator": 2}, "Piece Name", "armor/arm_rare10.png"],
           "waist": [[3,3], {"critical_eye": 2}, "Piece Name", "armor/waist_rare10.png"],
           "legs":  [[3,3], {"agitator": 1}, "Piece Name", "armor/leg_rare10.png"]
       },
       "defenses": {"defLvl1": 126, "f": 0, "w": 0, "t": 0, "i": 0, "d": 0}
   }]
   ```

   - `[3,1]` are decoration slots (size 3 and size 1). A piece without slots uses `[]`.
   - Sets with missing parts use `null` for that part (e.g. head-only sets).
   - Skill keys (`attack_boost`) must exist in `skills.json`.
   - Set IDs must be unique. Never change existing IDs.
   - `defenses` holds the element defense: fire, water, thunder, ice, dragon.
   - Add new skills and decorations to `skills.json` / `decorations.json` using the existing format.
2. Run `python3 build_data.py` (no external dependencies). It validates the data and regenerates `data.js`.
3. Commit and push.

## Known limitations

- Set bonus and group skills (e.g. Kushala Blessing, Chain Crit) only count if they exist on the piece itself in the data. There is no separate "wear 2/3 pieces for a bonus" logic.
- Rampage decorations are not selectable yet (weapon rampage slots are displayed only).
- `solver.js` is not connected to the UI yet. The UI only filters pieces by the selected skills.
- Resistance skills are counted as +3 element defense per level in the UI; the in-game text values differ, so this may be inaccurate.
- Charms are stored in your browser only (localStorage).

## License and credits

- Originally based on [simshadows/monster-hunter-rise-builder](https://github.com/simshadows/monster-hunter-rise-builder), licensed **AGPL-3.0**. Because this project is derived from it and hosted publicly, this repo must remain AGPL-3.0 with open source and credit to the original author.
- Game data is extracted with [mhrice](https://github.com/wwylele/mhrice).
- Monster Hunter, armor names and game data are property of Capcom. Fan project, not an official product.
