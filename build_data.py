"""Generate data.js for index.html from the JSON files in source_data/.

Usage:   python build_data.py [json_folder] [output_file]
Default: source_data  ->  data.js

Source files: skills.json, armor.json, decorations.json, weapons.json, rampage.json
(produced by convert_mhrice.py, or edited by hand). armor_naming_schemes.json is only
needed for armor pieces without an explicit name (legacy format).

Re-run this script after editing any JSON in source_data/.
"""
import json
import os
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "source_data"
out = sys.argv[2] if len(sys.argv) > 2 else "data.js"


def load(name, required=True):
    path = os.path.join(src, name)
    if not os.path.exists(path):
        if required:
            sys.exit("ERROR: %s not found in '%s'" % (name, src))
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


skills = load("skills.json")
armor = load("armor.json")
decos = load("decorations.json")
schemes = load("armor_naming_schemes.json", required=False) or {}
weapons = load("weapons.json", required=False)
ramp = load("rampage.json", required=False)

PARTS = ["head", "chest", "arms", "waist", "legs"]

# skills: [id, nama, maxLevel, icon, penerangan, [teks setiap level]]
S = [[s["id"], s["name"], s["maxLevels"], s.get("icon", ""), s.get("description", ""), s.get("levels", [])] for s in skills]
known = {s[0] for s in S}
assert len(known) == len(S), "duplicate skill id in skills.json"

# decos: [nama, slotSize, skillId, level, icon]  (setiap deco satu skill sahaja)
D = []
for _, d in decos:
    name = d.get("verbatimName") or "%s Jewel %d" % (d["name"], d["slotSize"])
    for k, v in d["skills"].items():
        assert k in known, "unknown decoration skill: %s (%s)" % (k, name)
        D.append([name, d["slotSize"], k, v, d.get("icon", "")])

# senjata: [id, jenis, nama, rarity, attack, affinity, element, jenisElement, [slot...], [rampSlot...], searchHint,
#           element2, jenisElement2, icon]
WP = []
if weapons is not None:
    for wid, w in weapons:
        WP.append([wid, w["weaponType"], w["name"], w["rarity"], w["attack"], w["affinity"], w["element"],
                   w["elementType"], sorted(w["slots"], reverse=True), sorted(w["rampSlots"], reverse=True),
                   w.get("searchHint", ""), w.get("element2", 0), w.get("elementType2", "none"), w.get("icon", "")])
else:
    print("WARNING: weapons.json not found in '%s' -> weapon list is empty" % src)

# armor: [id, setName, tier, rarity, def, {part: [namaPiece, [slot...], {skill: level}, icon]}, [f,w,t,i,d]]
# [f,w,t,i,d] = element def set (api, air, petir, ais, naga); nilai sama untuk setiap piece dalam set.
A = []
for sid, a in armor:
    pieces = {}
    for i, part in enumerate(PARTS):
        pd = a["pieces"].get(part)
        if pd is None:  # set yang tiada piece tu
            continue
        slots, sk = pd[0], pd[1]
        if sk is not None:
            for k in sk:
                assert k in known, "unknown armor skill: %s (set %s)" % (k, a["setName"])
        if len(pd) >= 3 and pd[2]:  # nama piece eksplisit (format mhrice)
            name = pd[2]
        else:  # format lama: prefix + scheme + suffix
            prefix = a["prefix"] if isinstance(a["prefix"], list) else [a["prefix"]] * 5
            scheme = schemes[a["namingScheme"]]
            name = " ".join(x for x in (prefix[i], scheme[i], a["suffix"]) if x)
        icon = pd[3] if len(pd) >= 4 else ""
        pieces[part] = [name, slots, sk, icon]
    df = a["defenses"]
    elem = [df["f"], df["w"], df["t"], df["i"], df["d"]]
    A.append([sid, a["setName"], a["tier"], a["rarity"], df["defLvl1"], pieces, elem])

# rampage decorations: skills [id, name, desc, icon], decos [name, slotSize, skillId, icon, weaponFlags]
R = {"skills": [], "decos": []}
if ramp is not None:
    rk = {s["id"] for s in ramp["skills"]}
    R["skills"] = [[s["id"], s["name"], s.get("description", ""), s.get("icon", "")] for s in ramp["skills"]]
    for d in ramp["decos"]:
        assert d["skill"] in rk, "unknown rampage skill: %s (%s)" % (d["skill"], d["name"])
        R["decos"].append([d["name"], d["slotSize"], d["skill"], d.get("icon", ""), d.get("weaponFlags", [])])
else:
    print("WARNING: rampage.json not found in '%s' -> no rampage decorations" % src)

with open(out, "w", encoding="utf-8") as f:
    f.write("window.MHR=" + json.dumps({"skills": S, "decos": D, "armor": A, "weapons": WP, "rampage": R}, separators=(",", ":"), ensure_ascii=False) + ";\n")

print("OK: %d skills, %d armor sets, %d decorations, %d rampage, %d weapons -> %s" % (len(S), len(A), len(D), len(R["decos"]), len(WP), out))
