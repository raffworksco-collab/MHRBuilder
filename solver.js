/*
 * MHR Armor Finder - solver
 *
 * MHRsolve(data, query) -> { results, nodes, elapsedMs, timedOut, found, candidates }
 *
 * Fungsi ini sengaja ditulis satu blok self-contained (tiada rujukan luar) supaya
 * boleh dijalankan dalam Web Worker melalui MHRsolve.toString(), dan juga di Node untuk ujian.
 *
 * data  = window.MHR dari data.js  ({skills, decos, armor})
 * query = {
 *   targets:     { skill_id: level, ... },          // skill yang dimahukan
 *   tiers:       ["lr","hr","mr"],                  // rank armor yang dibenarkan
 *   charms:      [{name, skills:{id:level}, slots:[3,1,0]}],  // charm yang pemain ada (kosong = tiada charm)
 *   weaponSlots: [3,1],                             // slot deco pada senjata (optional)
 *   maxResults:  100,
 *   timeLimitMs: 8000
 * }
 *
 * Cara kerja:
 *  1. Untuk setiap bahagian (head..legs) tapis piece yang "didominasi" piece lain
 *     (skill yang dimahukan <= dan slot <= ), supaya ruang carian mengecil.
 *  2. DFS merentas charm + 5 bahagian dengan pruning (had atas skill + had atas kapasiti slot).
 *  3. Di hujung setiap cabang, semak sama ada baki skill boleh dipenuhi dengan deco
 *     (syarat Hall untuk slot bersarang: bilangan deco bersaiz >= k tidak boleh melebihi
 *     bilangan slot bersaiz >= k), dan pilih agihan deco yang guna slot paling sedikit.
 *  4. Simpan hasil terbaik: slot kosong paling banyak, kemudian defense asas.
 */
function MHRsolve(data, q) {
  "use strict";
  var t0 = Date.now();
  var PARTS = ["head", "chest", "arms", "waist", "legs"];
  var timeLimit = q.timeLimitMs || 8000;
  var topK = q.maxResults || 100;

  var info = {};
  data.skills.forEach(function (s) { info[s[0]] = { name: s[1], max: s[2] }; });

  // ---- skill yang dimahukan ----
  var wanted = [], target = [];
  Object.keys(q.targets || {}).forEach(function (id) {
    if (!info[id]) return;
    var lv = Math.min(parseInt(q.targets[id], 10) || 0, info[id].max);
    if (lv > 0) { wanted.push(id); target.push(lv); }
  });
  var W = wanted.length;
  if (!W) return { error: "Select at least one skill." };
  var widx = {};
  wanted.forEach(function (id, i) { widx[id] = i; });

  // ---- pilihan deco untuk setiap skill yang dimahukan ----
  var opts = wanted.map(function () { return []; });
  data.decos.forEach(function (d) {
    var i = widx[d[2]];
    if (i !== undefined) opts[i].push({ name: d[0], size: d[1], level: d[3] });
  });
  var minCost = opts.map(function (o) {
    var m = Infinity;
    o.forEach(function (x) { m = Math.min(m, x.size / x.level); });
    return m;
  });

  // ---- piece ----
  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }

  function makePiece(name, slots, skills, meta) {
    var sl = [];
    (slots || []).forEach(function (s) { s = s | 0; if (s >= 1 && s <= 4) sl.push(s); });
    sl.sort(function (a, b) { return b - a; });
    var cnt = [0, 0, 0, 0], sum = 0;
    sl.forEach(function (s) { cnt[s - 1]++; sum += s; });
    var skv = zeros(W);
    Object.keys(skills || {}).forEach(function (k) {
      if (widx[k] !== undefined) skv[widx[k]] += skills[k];
    });
    var weight = sum;
    skv.forEach(function (v) { weight += v * 5; });
    return {
      name: name, slots: sl, skills: skills || {}, skv: skv, cnt: cnt,
      cum: [cnt[0] + cnt[1] + cnt[2] + cnt[3], cnt[1] + cnt[2] + cnt[3], cnt[2] + cnt[3], cnt[3]],
      slotSum: sum, alts: [], meta: meta || {}, w: weight
    };
  }

  // b sekurang-kurangnya sama bagus dengan a (untuk skill yang dimahukan dan slot)
  function dom(b, a) {
    for (var i = 0; i < W; i++) if (b.skv[i] < a.skv[i]) return false;
    for (var k = 0; k < 4; k++) if (b.cum[k] < a.cum[k]) return false;
    return true;
  }

  function prune(list) {
    list = list.slice().sort(function (a, b) { return b.w - a.w; });
    var kept = [];
    list.forEach(function (p) {
      for (var i = 0; i < kept.length; i++) {
        if (dom(kept[i], p)) {
          if (dom(p, kept[i])) kept[i].alts.push(p.name); // sama persis -> simpan sebagai alternatif
          return;
        }
      }
      kept = kept.filter(function (k) { return !dom(p, k); });
      kept.push(p);
    });
    return kept;
  }

  var tiers = {};
  (q.tiers || ["lr", "hr", "mr"]).forEach(function (t) { tiers[t] = 1; });

  var byPart = {};
  PARTS.forEach(function (p) { byPart[p] = []; });
  data.armor.forEach(function (a) {
    if (!tiers[a[2]]) return;
    PARTS.forEach(function (part) {
      var pc = a[5][part];
      if (!pc) return;
      byPart[part].push(makePiece(pc[0], pc[1], pc[2], { set: a[1], tier: a[2], rarity: a[3], def: a[4] }));
    });
  });

  var charmCands = [];
  (q.charms || []).forEach(function (c) {
    charmCands.push(makePiece(c.name || "Charm", c.slots || [], c.skills || {}, {}));
  });
  charmCands.push(makePiece("(tiada charm)", [], {}, { none: true }));

  var weapon = makePiece("Senjata", q.weaponSlots || [], {}, {});

  var partEntries = PARTS.map(function (p) { return { id: p, list: prune(byPart[p]) }; });
  var candidates = {};
  partEntries.forEach(function (e) { candidates[e.id] = e.list.length; });
  for (var pi = 0; pi < partEntries.length; pi++) {
    if (!partEntries[pi].list.length) return { error: "No armor for slot " + partEntries[pi].id + " (check rank filter)." };
  }
  partEntries.sort(function (a, b) { return a.list.length - b.list.length; });

  var order = [{ id: "charm", list: prune(charmCands) }].concat(partEntries);
  var n = order.length;

  // ---- had atas untuk pruning ----
  var remSkill = [], remSlot = [];
  for (var pos = 0; pos <= n; pos++) {
    var rs = zeros(W), sl = 0;
    for (var j = pos; j < n; j++) {
      var pm = zeros(W), ms = 0;
      order[j].list.forEach(function (p) {
        for (var i = 0; i < W; i++) if (p.skv[i] > pm[i]) pm[i] = p.skv[i];
        if (p.slotSum > ms) ms = p.slotSum;
      });
      for (var i = 0; i < W; i++) rs[i] += pm[i];
      sl += ms;
    }
    remSkill.push(rs);
    remSlot.push(sl);
  }

  // ---- agihan deco ----
  var choiceCache = {};
  function getChoices(i, dd) {
    var key = i + ":" + dd;
    if (choiceCache[key]) return choiceCache[key];
    var o = opts[i], res = [];
    (function rec(j, total, ns) {
      if (j === o.length) {
        if (total < dd) return;
        for (var a = 0; a < o.length; a++) if (ns[a] > 0 && total - o[a].level >= dd) return; // bazir
        var N = [0, 0, 0, 0];
        for (var a2 = 0; a2 < o.length; a2++) for (var k = 0; k < o[a2].size; k++) N[k] += ns[a2];
        res.push({ N: N, ns: ns.slice() });
        return;
      }
      var mx = Math.ceil(dd / o[j].level);
      for (var c = 0; c <= mx; c++) { ns[j] = c; rec(j + 1, total + c * o[j].level, ns); }
      ns[j] = 0;
    })(0, 0, zeros(o.length));
    // buang pilihan yang didominasi
    var out = [];
    res.forEach(function (x, xi) {
      for (var yi = 0; yi < res.length; yi++) {
        if (yi === xi) continue;
        var y = res[yi], le = true, lt = false;
        for (var k = 0; k < 4; k++) { if (y.N[k] > x.N[k]) le = false; if (y.N[k] < x.N[k]) lt = true; }
        if (le && (lt || yi < xi)) return;
      }
      out.push(x);
    });
    choiceCache[key] = out;
    return out;
  }

  var allocCache = {};
  // d = baki level setiap skill, c = bilangan slot mengikut saiz [c1..c4]
  function alloc(d, c) {
    var M = [c[0] + c[1] + c[2] + c[3], c[1] + c[2] + c[3], c[2] + c[3], c[3]];
    var key = d.join(",") + "|" + M.join(",");
    if (key in allocCache) return allocCache[key];
    var need = [];
    for (var i = 0; i < W; i++) if (d[i] > 0) need.push(i);
    var lists = [];
    for (var a = 0; a < need.length; a++) {
      var L = getChoices(need[a], d[need[a]]);
      if (!L.length) { allocCache[key] = null; return null; }
      lists.push(L);
    }
    var best = null, pick = [];
    // jumlah saiz slot yang sebenarnya terpakai bila deco terbesar diletak ke slot terkecil yang muat
    function usedCap(N) {
      var dn = [N[0] - N[1], N[1] - N[2], N[2] - N[3], N[3]]; // bilangan deco bersaiz 1..4
      var free = c.slice(), used = 0;
      for (var s = 4; s >= 1; s--) {
        for (var z = 0; z < dn[s - 1]; z++) {
          var t = s;
          while (t <= 4 && free[t - 1] === 0) t++;
          if (t > 4) return Infinity;
          free[t - 1]--;
          used += t;
        }
      }
      return used;
    }
    (function rec(j, N) {
      var cost = N[0] + N[1] + N[2] + N[3]; // had bawah kepada used
      if (best && cost >= best.used) return;
      if (j === need.length) {
        var u = usedCap(N);
        if (!best || u < best.used) best = { cost: cost, used: u, picks: pick.slice() };
        return;
      }
      var L2 = lists[j];
      for (var x = 0; x < L2.length; x++) {
        var N2 = [N[0] + L2[x].N[0], N[1] + L2[x].N[1], N[2] + L2[x].N[2], N[3] + L2[x].N[3]];
        if (N2[0] > M[0] || N2[1] > M[1] || N2[2] > M[2] || N2[3] > M[3]) continue;
        pick[j] = [need[j], L2[x].ns];
        rec(j + 1, N2);
      }
      pick.length = j;
    })(0, [0, 0, 0, 0]);
    allocCache[key] = best;
    return best;
  }

  // ---- DFS ----
  var cur = zeros(W), cnt = weapon.cnt.slice(), slotSum = weapon.slotSum, defSum = 0;
  var chosen = new Array(n), nodes = 0, found = 0, timedOut = false;
  var kept = [], minScore = -Infinity;

  function bound(p) {
    var need = 0, rs = remSkill[p];
    for (var i = 0; i < W; i++) {
      var d = target[i] - cur[i] - rs[i];
      if (d > 0) {
        if (minCost[i] === Infinity) return false;
        need += d * minCost[i];
      }
    }
    return need <= slotSum + remSlot[p] + 1e-9;
  }

  function leaf() {
    var d = zeros(W);
    var any = false;
    for (var i = 0; i < W; i++) {
      var x = target[i] - cur[i];
      if (x > 0) { d[i] = x; any = true; }
    }
    var used = 0, picks = [];
    if (any) {
      var r = alloc(d, cnt);
      if (!r) return;
      used = r.used;
      picks = r.picks;
    }
    found++;
    var score = (slotSum - used) * 1000 + defSum;
    if (score < minScore) return;
    kept.push({ score: score, chosen: chosen.slice(), picks: picks });
    if (kept.length > topK * 4) {
      kept.sort(function (a, b) { return b.score - a.score; });
      kept.length = topK;
      minScore = kept[topK - 1].score;
    }
  }

  function dfs(p) {
    nodes++;
    if ((nodes & 2047) === 0 && Date.now() - t0 > timeLimit) timedOut = true;
    if (timedOut) return;
    if (!bound(p)) return;
    if (p === n) { leaf(); return; }
    var list = order[p].list;
    for (var j = 0; j < list.length; j++) {
      var pc = list[j];
      for (var i = 0; i < W; i++) cur[i] += pc.skv[i];
      for (var k = 0; k < 4; k++) cnt[k] += pc.cnt[k];
      slotSum += pc.slotSum;
      var dd = pc.meta.def || 0;
      defSum += dd;
      chosen[p] = pc;
      dfs(p + 1);
      defSum -= dd;
      slotSum -= pc.slotSum;
      for (var k2 = 0; k2 < 4; k2++) cnt[k2] -= pc.cnt[k2];
      for (var i2 = 0; i2 < W; i2++) cur[i2] -= pc.skv[i2];
      if (timedOut) return;
    }
  }

  dfs(0);

  kept.sort(function (a, b) { return b.score - a.score; });
  if (kept.length > topK) kept.length = topK;

  // ---- bina hasil akhir ----
  function build(rec) {
    var slotObjs = [];
    var mk = function (piece, src) {
      var arr = piece.slots.map(function (s) { var o = { size: s, deco: null, src: src }; slotObjs.push(o); return o; });
      return arr;
    };
    var weaponSlots = mk(weapon, "weapon");
    var parts = [];
    var charm = null;
    var totals = {};
    var def = 0;
    var addSkills = function (sk) {
      Object.keys(sk).forEach(function (k) { totals[k] = (totals[k] || 0) + sk[k]; });
    };
    rec.chosen.forEach(function (pc, idx) {
      var id = order[idx].id;
      var entry = {
        part: id, name: pc.name, alts: pc.alts.slice(0, 4), set: pc.meta.set || "", tier: pc.meta.tier || "",
        rarity: pc.meta.rarity || 0, def: pc.meta.def || 0, skills: pc.skills, none: !!pc.meta.none,
        slots: mk(pc, id)
      };
      addSkills(pc.skills);
      def += entry.def;
      if (id === "charm") charm = entry; else parts.push(entry);
    });
    var order5 = {}; PARTS.forEach(function (p, i) { order5[p] = i; });
    parts.sort(function (a, b) { return order5[a.part] - order5[b.part]; });

    // letak deco: deco terbesar dahulu ke slot terkecil yang muat
    var decos = [];
    rec.picks.forEach(function (pk) {
      var si = pk[0], ns = pk[1];
      for (var a = 0; a < ns.length; a++) for (var c = 0; c < ns[a]; c++) {
        decos.push({ si: si, o: opts[si][a] });
      }
    });
    decos.sort(function (a, b) { return b.o.size - a.o.size; });
    var asc = slotObjs.slice().sort(function (a, b) { return a.size - b.size; });
    decos.forEach(function (dc) {
      for (var i = 0; i < asc.length; i++) {
        if (!asc[i].deco && asc[i].size >= dc.o.size) { asc[i].deco = dc.o.name; break; }
      }
      var sk = {}; sk[wanted[dc.si]] = dc.o.level; addSkills(sk);
    });

    var leftover = [];
    slotObjs.forEach(function (s) { if (!s.deco) leftover.push(s.size); });
    leftover.sort(function (a, b) { return b - a; });

    var skills = Object.keys(totals).map(function (id) {
      var wi = widx[id];
      return { id: id, name: info[id].name, level: totals[id], max: info[id].max, wanted: wi !== undefined, target: wi !== undefined ? target[wi] : 0 };
    });
    skills.sort(function (a, b) {
      if (a.wanted !== b.wanted) return a.wanted ? -1 : 1;
      return b.level - a.level;
    });

    return { parts: parts, charm: charm, weaponSlots: weaponSlots, leftover: leftover, def: def, skills: skills };
  }

  return {
    results: kept.map(build),
    nodes: nodes,
    found: found,
    elapsedMs: Date.now() - t0,
    timedOut: timedOut,
    candidates: candidates
  };
}

if (typeof module !== "undefined" && module.exports) module.exports = MHRsolve;
