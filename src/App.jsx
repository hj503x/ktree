import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react";
import {
  Plus, X, Search, Trash2, Pencil, ChevronRight, Sun, Moon,
  ZoomIn, ZoomOut, Maximize2, Download, Upload, FileUp,
} from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600&display=swap');

.ktree-root {
  --paper: #F6F1E4;
  --paper-deep: #ECE2C9;
  --grain: rgba(147,115,47,0.07);
  --ink: #241F18;
  --ink-soft: #6B6152;
  --line: #CFC4A6;
  --brass: #8A6A28;
  --wax: #7A2E27;
  --wax-soft: #8f4a41;
  --sage: #4F5E4A;
  --card: #FFFEFB;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at 1px 1px, var(--grain) 1px, transparent 0) 0 0/16px 16px,
    var(--paper);
  color: var(--ink);
  min-height: 100%;
  width: 100%;
  position: relative;
  transition: background 0.2s ease, color 0.2s ease;
}
.ktree-root[data-theme="dark"] {
  --paper: #1A1611;
  --paper-deep: #242019;
  --grain: rgba(201,162,39,0.06);
  --ink: #EDE6D6;
  --ink-soft: #A79C87;
  --line: #3B342A;
  --brass: #C9A227;
  --wax: #C1584A;
  --wax-soft: #d16a5c;
  --sage: #8FA283;
  --card: #211C15;
}
.ktree-root * { box-sizing: border-box; }
.ktree-serif { font-family: 'Fraunces', serif; }

.ktree-header {
  padding: 26px 32px 18px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ktree-word { display: flex; align-items: baseline; gap: 3px; }
.ktree-word-mark { font-size: 30px; font-weight: 600; font-style: italic; letter-spacing: -0.01em; color: var(--wax); }
.ktree-word-rest { font-size: 30px; font-weight: 500; letter-spacing: -0.01em; }
.ktree-sub { font-size: 13px; color: var(--ink-soft); margin-top: 4px; }
.ktree-header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.ktree-icon-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--card);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--ink);
  flex-shrink: 0;
}
.ktree-icon-btn:hover { border-color: var(--brass); }
.ktree-icon-btn.active { border-color: var(--brass); color: var(--brass); background: var(--paper-deep); }

.ktree-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px 0;
  flex-wrap: wrap;
}
.ktree-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--line); border-radius: 3px;
  padding: 7px 12px; min-width: 220px; flex: 1; max-width: 300px;
}
.ktree-search input {
  border: none; outline: none; background: transparent;
  font-family: 'Inter', sans-serif; font-size: 14px; color: var(--ink); width: 100%;
}
.ktree-search input::placeholder { color: var(--ink-soft); }
.ktree-count { font-size: 13px; color: var(--ink-soft); margin-left: 2px; white-space: nowrap; }

.ktree-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
  border-radius: 3px; padding: 9px 15px; cursor: pointer; border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease; white-space: nowrap;
}
.ktree-btn-primary { background: var(--wax); color: #FBF3EC; }
.ktree-btn-primary:hover { background: var(--wax-soft); }
.ktree-btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
.ktree-btn-ghost:hover { background: var(--paper-deep); }
.ktree-btn-danger { background: transparent; color: var(--wax); border-color: var(--wax); }
.ktree-btn-danger:hover { background: var(--paper-deep); }
.ktree-btn-sm { padding: 6px 10px; font-size: 13px; }
.ktree-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.ktree-legend { display: flex; gap: 18px; padding: 12px 32px 0; font-size: 12.5px; color: var(--ink-soft); flex-wrap: wrap; }
.ktree-legend span { display: inline-flex; align-items: center; gap: 6px; }
.ktree-legend i { width: 14px; height: 0px; border-top: 1.6px solid; display: inline-block; }
.ktree-legend i.dashed { border-top-style: dashed; }

.ktree-sync-note {
  margin: 10px 32px 0; font-size: 12.5px; color: var(--ink-soft);
  border: 1px solid var(--line); background: var(--card); border-radius: 3px;
  padding: 8px 12px; display: flex; align-items: center; gap: 8px; max-width: 560px;
}

.ktree-zoom-bar {
  display: flex; align-items: center; gap: 4px; padding: 12px 32px 0;
}
.ktree-zoom-pct { font-size: 12.5px; color: var(--ink-soft); width: 42px; text-align: center; }

.ktree-canvas-wrap {
  overflow: auto;
  padding: 10px 32px 60px;
  cursor: grab;
}
.ktree-canvas-wrap.panning { cursor: grabbing; }
.ktree-canvas-sizer { position: relative; }
.ktree-canvas {
  position: absolute; top: 0; left: 0;
  padding: 24px 10px 10px;
}
.ktree-row-wrap { display: flex; align-items: center; gap: 18px; margin-bottom: 78px; }
.ktree-gen-badge {
  width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--brass); color: var(--brass);
  font-family: 'Fraunces', serif; font-size: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ktree-row { display: flex; gap: 34px; position: relative; z-index: 1; }

.ktree-card {
  background: var(--card); border: 1px solid var(--line); border-left: 3px solid var(--brass);
  border-radius: 2px; padding: 10px 12px; width: 168px; cursor: pointer;
  transition: border-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  position: relative; display: flex; gap: 10px; align-items: center;
}
.ktree-card:hover { border-color: var(--brass); transform: translateY(-1px); box-shadow: 2px 3px 0 var(--paper-deep); }
.ktree-card.dim { opacity: 0.3; }
.ktree-card.match { box-shadow: 0 0 0 1px var(--wax); border-left-color: var(--wax); }
.ktree-card.selected { box-shadow: 0 0 0 1px var(--brass); }
.ktree-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; object-fit: cover;
  background: var(--paper-deep); display: flex; align-items: center; justify-content: center;
  font-family: 'Fraunces', serif; font-size: 13px; color: var(--brass); border: 1px solid var(--line);
}
.ktree-card-text { min-width: 0; }
.ktree-card-name { font-size: 14.5px; font-weight: 500; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ktree-card-years { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }

.ktree-empty {
  margin: 60px auto; max-width: 380px; text-align: center; padding: 40px 30px;
  border: 1px dashed var(--line); border-radius: 4px; background: var(--card);
}
.ktree-empty h2 { font-size: 20px; margin: 0 0 8px; }
.ktree-empty p { font-size: 14px; color: var(--ink-soft); margin: 0 0 20px; line-height: 1.5; }
.ktree-empty-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

.ktree-overlay { position: fixed; inset: 0; background: rgba(10, 8, 5, 0.4); z-index: 40; display: flex; justify-content: flex-end; }
.ktree-panel { background: var(--paper); width: 380px; max-width: 92vw; height: 100%; overflow-y: auto; padding: 26px 26px 40px; border-left: 1px solid var(--line); }
.ktree-panel-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; gap: 14px; }
.ktree-panel-title { font-size: 20px; font-weight: 600; margin: 0; }
.ktree-close { background: none; border: none; cursor: pointer; color: var(--ink-soft); padding: 4px; border-radius: 3px; flex-shrink: 0; }
.ktree-close:hover { background: var(--paper-deep); }

.ktree-detail-avatar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.ktree-detail-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); background: var(--paper-deep); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 18px; color: var(--brass); flex-shrink: 0; }

.ktree-field { margin-bottom: 16px; }
.ktree-field label { display: block; font-size: 12.5px; color: var(--ink-soft); margin-bottom: 5px; }
.ktree-field input, .ktree-field select { width: 100%; font-family: 'Inter', sans-serif; font-size: 14px; padding: 9px 11px; border: 1px solid var(--line); border-radius: 3px; background: var(--card); color: var(--ink); outline: none; }
.ktree-field input:focus, .ktree-field select:focus { border-color: var(--brass); }
.ktree-field-row { display: flex; gap: 10px; }
.ktree-field-row > div { flex: 1; }
.ktree-photo-row { display: flex; align-items: center; gap: 12px; }
.ktree-photo-preview { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); background: var(--paper-deep); flex-shrink: 0; }

.ktree-panel-actions { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }

.ktree-detail-section { margin-top: 22px; }
.ktree-detail-label { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 8px; }
.ktree-chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.ktree-chip { font-size: 13.5px; padding: 6px 6px 6px 11px; background: var(--card); border: 1px solid var(--line); border-radius: 3px; display: inline-flex; align-items: center; gap: 6px; }
.ktree-chip-name { cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
.ktree-chip-name:hover { color: var(--brass); }
.ktree-chip select { font-size: 12px; border: 1px solid var(--line); border-radius: 2px; background: var(--paper); color: var(--ink-soft); padding: 2px 4px; }
.ktree-empty-note { font-size: 13.5px; color: var(--ink-soft); font-style: italic; }

.ktree-quick-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; align-items: center; }
.ktree-inline-link { display: flex; gap: 6px; margin-top: 10px; }
.ktree-inline-link select { flex: 1; }

.ktree-loading { padding: 80px 20px; text-align: center; color: var(--ink-soft); font-size: 14px; }

@media print {
  .ktree-header-actions, .ktree-toolbar, .ktree-legend, .ktree-sync-note, .ktree-zoom-bar, .ktree-overlay { display: none !important; }
  .ktree-canvas-wrap { overflow: visible !important; padding: 0 !important; }
  .ktree-root { background: white !important; }
}
`;

function uid() {
  return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function toRoman(num) {
  const map = [[10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
  let n = num, out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out || "i";
}

function initials(name) {
  return (name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
}

// normalize legacy data: partners used to be plain id strings, now {id, status}
function normalizePeople(list) {
  return (list || []).map((p) => ({
    ...p,
    parents: p.parents || [],
    partners: (p.partners || []).map((x) => (typeof x === "string" ? { id: x, status: "married" } : x)),
  }));
}

function relaxGenerations(people) {
  const gens = {};
  people.forEach((p) => (gens[p.id] = 0));
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));
  for (let iter = 0; iter < people.length + 6; iter++) {
    let changed = false;
    for (const p of people) {
      let g = gens[p.id];
      (p.parents || []).forEach((pid) => { if (byId[pid]) g = Math.max(g, gens[pid] + 1); });
      (p.partners || []).forEach((pt) => { if (byId[pt.id]) g = Math.max(g, gens[pt.id]); });
      if (g !== gens[p.id]) { gens[p.id] = g; changed = true; }
    }
    if (!changed) break;
  }
  return gens;
}

function groupIntoRows(people, gens) {
  const maxGen = people.length ? Math.max(...people.map((p) => gens[p.id])) : -1;
  const rows = [];
  for (let g = 0; g <= maxGen; g++) {
    const ids = people.filter((p) => gens[p.id] === g).map((p) => p.id);
    const ordered = [];
    const used = new Set();
    ids.forEach((id) => {
      if (used.has(id)) return;
      ordered.push(id); used.add(id);
      const person = people.find((p) => p.id === id);
      (person.partners || []).forEach((pt) => {
        if (ids.includes(pt.id) && !used.has(pt.id)) { ordered.push(pt.id); used.add(pt.id); }
      });
    });
    rows.push(ordered);
  }
  return rows;
}

function familyUnits(people) {
  const units = {};
  people.forEach((p) => {
    const parents = (p.parents || []).filter(Boolean);
    if (parents.length === 0) return;
    const key = [...parents].sort().join("|");
    if (!units[key]) units[key] = { parentIds: parents, childIds: [] };
    units[key].childIds.push(p.id);
  });
  return Object.values(units);
}

function resizeImage(file, maxSize = 128) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image failed"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---- minimal GEDCOM parser (INDI name/birth/death, FAM husb/wife/chil/divorce) ----
function parseGedcom(text) {
  const lines = text.split(/\r?\n/);
  const indis = {};
  const fams = {};
  let cur = null, curType = null, pending = null;

  for (const raw of lines) {
    const m = raw.match(/^\s*(\d+)\s+(@\w[\w-]*@\s+)?(\w+)(?:\s+(.*))?$/);
    if (!m) continue;
    const level = parseInt(m[1], 10);
    const xrefTok = m[2] ? m[2].trim() : null;
    const tag = m[3];
    const val = (m[4] || "").trim();

    if (level === 0 && xrefTok && tag === "INDI") {
      cur = { id: xrefTok, name: "", birthYear: "", deathYear: "" };
      indis[xrefTok] = cur; curType = "INDI"; pending = null;
      continue;
    }
    if (level === 0 && xrefTok && tag === "FAM") {
      cur = { id: xrefTok, husb: null, wife: null, chil: [], divorced: false };
      fams[xrefTok] = cur; curType = "FAM"; pending = null;
      continue;
    }
    if (level === 0) { cur = null; curType = null; pending = null; continue; }
    if (!cur) continue;

    if (curType === "INDI") {
      if (level === 1 && tag === "NAME") { cur.name = val.replace(/\//g, "").replace(/\s+/g, " ").trim(); pending = null; }
      else if (level === 1 && tag === "BIRT") pending = "birthYear";
      else if (level === 1 && tag === "DEAT") pending = "deathYear";
      else if (level === 1) pending = null;
      else if (level === 2 && tag === "DATE" && pending) {
        const y = val.match(/\d{4}/);
        if (y) cur[pending] = y[0];
        pending = null;
      }
    } else if (curType === "FAM") {
      if (level === 1 && tag === "HUSB") cur.husb = val;
      else if (level === 1 && tag === "WIFE") cur.wife = val;
      else if (level === 1 && tag === "CHIL") cur.chil.push(val);
      else if (level === 1 && tag === "DIV") cur.divorced = true;
    }
  }

  const idMap = {};
  const people = Object.values(indis).map((ind) => {
    const newId = uid();
    idMap[ind.id] = newId;
    return { id: newId, name: ind.name || "Unnamed", birthYear: ind.birthYear, deathYear: ind.deathYear, parents: [], partners: [] };
  });
  const byNew = Object.fromEntries(people.map((p) => [p.id, p]));

  Object.values(fams).forEach((f) => {
    const h = f.husb ? idMap[f.husb] : null;
    const w = f.wife ? idMap[f.wife] : null;
    const status = f.divorced ? "divorced" : "married";
    if (h && w && byNew[h] && byNew[w]) {
      byNew[h].partners.push({ id: w, status });
      byNew[w].partners.push({ id: h, status });
    }
    const parentIds = [h, w].filter(Boolean);
    f.chil.forEach((c) => {
      const cid = idMap[c];
      if (cid && byNew[cid]) byNew[cid].parents = parentIds;
    });
  });

  return people;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const STATUS_LABEL = { married: "Together", divorced: "Divorced", widowed: "Widowed" };

export default function KtreeApp() {
  const [people, setPeople] = useState([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [layoutTick, setLayoutTick] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [linkPartnerSel, setLinkPartnerSel] = useState("");

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef(new Map());
  const [connectors, setConnectors] = useState({ spouse: [], family: [] });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const gedomInputRef = useRef(null);
  const jsonInputRef = useRef(null);
  const panState = useRef(null);

  useEffect(() => {
    try {
      const rawPeople = localStorage.getItem("ktree_people");
      const rawTheme = localStorage.getItem("ktree_theme");
      setPeople(rawPeople ? normalizePeople(JSON.parse(rawPeople)) : []);
      setTheme(rawTheme || "light");
    } catch (e) {
      setPeople([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((next) => {
    try { localStorage.setItem("ktree_people", JSON.stringify(next)); } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem("ktree_theme", next); } catch (e) {}
  };

  const updatePeople = useCallback((updater) => {
    setPeople((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  const byId = useMemo(() => Object.fromEntries(people.map((p) => [p.id, p])), [people]);
  const gens = useMemo(() => relaxGenerations(people), [people]);
  const rows = useMemo(() => groupIntoRows(people, gens), [people, gens]);
  const units = useMemo(() => familyUnits(people), [people]);
  const childrenOf = useCallback((id) => people.filter((p) => (p.parents || []).includes(id)), [people]);

  // ---- layout / connectors ----
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cRect = canvas.getBoundingClientRect();
      const rectOf = (id) => {
        const el = cardRefs.current.get(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const s = zoom || 1;
        return {
          left: (r.left - cRect.left) / s, right: (r.right - cRect.left) / s,
          top: (r.top - cRect.top) / s, bottom: (r.bottom - cRect.top) / s,
          cx: (r.left - cRect.left) / s + (r.width / s) / 2, cy: (r.top - cRect.top) / s + (r.height / s) / 2,
        };
      };

      const spouseLines = [];
      const seen = new Set();
      people.forEach((p) => {
        (p.partners || []).forEach((pt) => {
          const key = [p.id, pt.id].sort().join("|");
          if (seen.has(key) || !byId[pt.id]) return;
          seen.add(key);
          if (gens[p.id] !== gens[pt.id]) return;
          const a = rectOf(p.id), b = rectOf(pt.id);
          if (!a || !b) return;
          const left = a.left < b.left ? a : b;
          const right = a.left < b.left ? b : a;
          const y = (left.cy + right.cy) / 2;
          spouseLines.push({ x1: left.right, y1: y, x2: right.left, y2: y, status: pt.status });
        });
      });

      const familyLines = [];
      units.forEach((u) => {
        const parentRects = u.parentIds.map(rectOf).filter(Boolean);
        const childRects = u.childIds.map((cid) => ({ id: cid, r: rectOf(cid) })).filter((x) => x.r);
        if (parentRects.length === 0 || childRects.length === 0) return;
        const dropX = parentRects.reduce((sum, r) => sum + r.cx, 0) / parentRects.length;
        const dropYStart = Math.max(...parentRects.map((r) => r.bottom));
        const childTop = Math.min(...childRects.map((c) => c.r.top));
        const busY = dropYStart + (childTop - dropYStart) * 0.55;
        familyLines.push({ x1: dropX, y1: dropYStart, x2: dropX, y2: busY });
        const childXs = childRects.map((c) => c.r.cx);
        const minX = Math.min(dropX, ...childXs), maxX = Math.max(dropX, ...childXs);
        familyLines.push({ x1: minX, y1: busY, x2: maxX, y2: busY });
        childRects.forEach((c) => familyLines.push({ x1: c.r.cx, y1: busY, x2: c.r.cx, y2: c.r.top }));
      });

      setConnectors({ spouse: spouseLines, family: familyLines });
      setNaturalSize({ w: canvas.scrollWidth, h: canvas.scrollHeight });
    });
    return () => cancelAnimationFrame(raf);
  }, [people, gens, units, byId, layoutTick, theme, zoom]);

  useEffect(() => {
    const onResize = () => setLayoutTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    let ro;
    if (canvasRef.current && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => setLayoutTick((t) => t + 1));
      ro.observe(canvasRef.current);
    }
    return () => { window.removeEventListener("resize", onResize); if (ro) ro.disconnect(); };
  }, []);

  // ---- pan (drag background to scroll) ----
  const onWrapMouseDown = (e) => {
    if (e.target.closest(".ktree-card")) return;
    const wrap = containerRef.current;
    panState.current = { startX: e.clientX, startY: e.clientY, scrollLeft: wrap.scrollLeft, scrollTop: wrap.scrollTop };
    wrap.classList.add("panning");
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!panState.current) return;
      const wrap = containerRef.current;
      wrap.scrollLeft = panState.current.scrollLeft - (e.clientX - panState.current.startX);
      wrap.scrollTop = panState.current.scrollTop - (e.clientY - panState.current.startY);
    };
    const onUp = () => {
      if (panState.current && containerRef.current) containerRef.current.classList.remove("panning");
      panState.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(2, Math.round((z + 0.15) * 100) / 100));
  const zoomOut = () => setZoom((z) => Math.max(0.4, Math.round((z - 0.15) * 100) / 100));
  const zoomReset = () => setZoom(1);

  // ---- form ----
  const openAdd = (prefill = {}) => {
    setForm({ mode: "add", values: { name: "", birthYear: "", deathYear: "", parent1: "", parent2: "", partnerId: "", photo: "", ...prefill } });
  };
  const openEdit = (person) => {
    setForm({
      mode: "edit", id: person.id,
      values: {
        name: person.name || "", birthYear: person.birthYear || "", deathYear: person.deathYear || "",
        parent1: (person.parents || [])[0] || "", parent2: (person.parents || [])[1] || "",
        partnerId: "", photo: person.photo || "",
      },
    });
  };
  const closeForm = () => setForm(null);

  const onPhotoChosen = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 128);
      setForm((f) => ({ ...f, values: { ...f.values, photo: dataUrl } }));
    } catch (e) {}
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!form) return;
    const v = form.values;
    const name = v.name.trim();
    if (!name) return;
    const parents = [v.parent1, v.parent2].filter(Boolean);
    const newPartner = v.partnerId || null;

    if (form.mode === "add") {
      const id = uid();
      const person = { id, name, birthYear: v.birthYear.trim(), deathYear: v.deathYear.trim(), photo: v.photo || "", parents, partners: [] };
      updatePeople((prev) => {
        let next = [...prev, person];
        if (newPartner) {
          next = next.map((p) => {
            if (p.id === id) return { ...p, partners: [{ id: newPartner, status: "married" }] };
            if (p.id === newPartner) return { ...p, partners: [...(p.partners || []), { id, status: "married" }] };
            return p;
          });
        }
        return next;
      });
      setSelectedId(id);
    } else {
      const id = form.id;
      updatePeople((prev) =>
        prev.map((p) => (p.id === id
          ? { ...p, name, birthYear: v.birthYear.trim(), deathYear: v.deathYear.trim(), photo: v.photo || "", parents }
          : p))
      );
    }
    closeForm();
  };

  const deletePerson = (id) => {
    updatePeople((prev) =>
      prev.filter((p) => p.id !== id).map((p) => ({
        ...p,
        parents: (p.parents || []).filter((x) => x !== id),
        partners: (p.partners || []).filter((x) => x.id !== id),
      }))
    );
    if (selectedId === id) setSelectedId(null);
  };

  const linkExistingPartner = (targetId, otherId) => {
    if (!otherId || otherId === targetId) return;
    updatePeople((prev) =>
      prev.map((p) => {
        if (p.id === targetId && !(p.partners || []).some((pt) => pt.id === otherId))
          return { ...p, partners: [...(p.partners || []), { id: otherId, status: "married" }] };
        if (p.id === otherId && !(p.partners || []).some((pt) => pt.id === targetId))
          return { ...p, partners: [...(p.partners || []), { id: targetId, status: "married" }] };
        return p;
      })
    );
  };
  const unlinkPartner = (personId, partnerId) => {
    updatePeople((prev) =>
      prev.map((p) => {
        if (p.id === personId) return { ...p, partners: (p.partners || []).filter((pt) => pt.id !== partnerId) };
        if (p.id === partnerId) return { ...p, partners: (p.partners || []).filter((pt) => pt.id !== personId) };
        return p;
      })
    );
  };
  const setPartnerStatus = (personId, partnerId, status) => {
    updatePeople((prev) =>
      prev.map((p) => {
        if (p.id === personId) return { ...p, partners: (p.partners || []).map((pt) => (pt.id === partnerId ? { ...pt, status } : pt)) };
        if (p.id === partnerId) return { ...p, partners: (p.partners || []).map((pt) => (pt.id === personId ? { ...pt, status } : pt)) };
        return p;
      })
    );
  };

  // ---- export / import ----
  const exportJSON = () => downloadFile("ktree-export.json", JSON.stringify(people, null, 2), "application/json");
  const onImportJSON = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = normalizePeople(JSON.parse(text));
      if (!Array.isArray(data)) throw new Error("bad format");
      const ok = window.confirm(`Import ${data.length} people? This replaces your current tree (export first if unsure).`);
      if (ok) updatePeople(data);
    } catch (e) {
      window.alert("That file couldn't be read as a Ktree JSON export.");
    }
  };
  const onImportGedcom = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseGedcom(text);
      if (imported.length === 0) { window.alert("No individuals found in that GEDCOM file."); return; }
      updatePeople((prev) => [...prev, ...imported]);
    } catch (e) {
      window.alert("That file couldn't be read as GEDCOM.");
    }
  };

  const selected = selectedId ? byId[selectedId] : null;
  const q = query.trim().toLowerCase();

  if (loading) {
    return (
      <div className="ktree-root" data-theme={theme}>
        <style>{STYLE}</style>
        <div className="ktree-loading">Opening Ktree…</div>
      </div>
    );
  }

  return (
    <div className="ktree-root" data-theme={theme}>
      <style>{STYLE}</style>

      <div className="ktree-header">
        <div>
          <div className="ktree-word ktree-serif">
            <span className="ktree-word-mark">K</span>
            <span className="ktree-word-rest">tree</span>
          </div>
          <div className="ktree-sub">Add relatives, connect them, and watch the generations line up.</div>
        </div>
        <div className="ktree-header-actions">
          <button className="ktree-icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      <div className="ktree-toolbar">
        <div className="ktree-search">
          <Search size={15} />
          <input placeholder="Find someone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="ktree-btn ktree-btn-primary" onClick={() => openAdd()}>
          <Plus size={15} /> Add person
        </button>
        <button className="ktree-btn ktree-btn-ghost" onClick={() => gedomInputRef.current?.click()}>
          <FileUp size={15} /> Import GEDCOM
        </button>
        <input ref={gedomInputRef} type="file" accept=".ged,.gedcom,text/plain" style={{ display: "none" }}
          onChange={(e) => { onImportGedcom(e.target.files?.[0]); e.target.value = ""; }} />
        {people.length > 0 && (
          <>
            <button className="ktree-btn ktree-btn-ghost" onClick={exportJSON}><Download size={15} /> Export</button>
            <button className="ktree-btn ktree-btn-ghost" onClick={() => jsonInputRef.current?.click()}><Upload size={15} /> Import JSON</button>
            <input ref={jsonInputRef} type="file" accept="application/json" style={{ display: "none" }}
              onChange={(e) => { onImportJSON(e.target.files?.[0]); e.target.value = ""; }} />
            <button className="ktree-btn ktree-btn-ghost" onClick={() => window.print()}>Print / PDF</button>
          </>
        )}
        {people.length > 0 && <span className="ktree-count">{people.length} {people.length === 1 ? "person" : "people"}</span>}
      </div>

      {people.length > 0 && (
        <>
          <div className="ktree-legend">
            <span><i style={{ borderColor: "var(--brass)" }} /> parent → child</span>
            <span><i style={{ borderColor: "var(--sage)" }} /> partners</span>
            <span><i className="dashed" style={{ borderColor: "var(--sage)" }} /> divorced</span>
          </div>
          <div className="ktree-zoom-bar">
            <button className="ktree-icon-btn" onClick={zoomOut} title="Zoom out"><ZoomOut size={15} /></button>
            <span className="ktree-zoom-pct">{Math.round(zoom * 100)}%</span>
            <button className="ktree-icon-btn" onClick={zoomIn} title="Zoom in"><ZoomIn size={15} /></button>
            <button className="ktree-icon-btn" onClick={zoomReset} title="Reset zoom"><Maximize2 size={14} /></button>
          </div>
        </>
      )}

      {people.length === 0 ? (
        <div className="ktree-empty">
          <h2 className="ktree-serif">Start with one person</h2>
          <p>Add yourself, a parent, or a grandparent — or import a GEDCOM file from another app.</p>
          <div className="ktree-empty-actions">
            <button className="ktree-btn ktree-btn-primary" onClick={() => openAdd()}><Plus size={15} /> Add the first person</button>
            <button className="ktree-btn ktree-btn-ghost" onClick={() => gedomInputRef.current?.click()}><FileUp size={15} /> Import GEDCOM</button>
          </div>
        </div>
      ) : (
        <div className="ktree-canvas-wrap" ref={containerRef} onMouseDown={onWrapMouseDown}>
          <div className="ktree-canvas-sizer" style={{ width: naturalSize.w * zoom, height: naturalSize.h * zoom }}>
            <div className="ktree-canvas" ref={canvasRef} style={{ transform: `scale(${zoom})`, transformOrigin: "0 0", width: naturalSize.w || "max-content" }}>
              <svg width={naturalSize.w} height={naturalSize.h} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible" }}>
                {connectors.family.map((l, i) => (
                  <line key={"f" + i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--brass)" strokeWidth="1.4" />
                ))}
                {connectors.spouse.map((l, i) => (
                  <line key={"s" + i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--sage)" strokeWidth="1.4"
                    strokeDasharray={l.status === "divorced" ? "4 3" : undefined} />
                ))}
              </svg>

              {rows.map((rowIds, i) => (
                <div className="ktree-row-wrap" key={i}>
                  <div className="ktree-gen-badge ktree-serif">{toRoman(i + 1)}</div>
                  <div className="ktree-row">
                    {rowIds.map((id) => {
                      const p = byId[id];
                      if (!p) return null;
                      const matches = q && p.name.toLowerCase().includes(q);
                      const dim = q && !matches;
                      const years = [p.birthYear, p.deathYear].filter(Boolean).join(" – ");
                      return (
                        <div key={id}
                          ref={(el) => { if (el) cardRefs.current.set(id, el); else cardRefs.current.delete(id); }}
                          className={"ktree-card" + (dim ? " dim" : "") + (matches ? " match" : "") + (selectedId === id ? " selected" : "")}
                          onClick={() => setSelectedId(id)}
                        >
                          {p.photo ? <img className="ktree-avatar" src={p.photo} alt="" /> : <div className="ktree-avatar">{initials(p.name)}</div>}
                          <div className="ktree-card-text">
                            <div className="ktree-card-name ktree-serif">{p.name}</div>
                            {years && <div className="ktree-card-years">{years}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected && !form && (
        <div className="ktree-overlay" onClick={() => setSelectedId(null)}>
          <div className="ktree-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ktree-panel-head">
              <div className="ktree-detail-avatar-row">
                {selected.photo ? <img className="ktree-detail-avatar" src={selected.photo} alt="" /> : <div className="ktree-detail-avatar">{initials(selected.name)}</div>}
                <div>
                  <h2 className="ktree-panel-title ktree-serif">{selected.name}</h2>
                  {(selected.birthYear || selected.deathYear) && (
                    <div className="ktree-sub">{[selected.birthYear, selected.deathYear].filter(Boolean).join(" – ")}</div>
                  )}
                </div>
              </div>
              <button className="ktree-close" onClick={() => setSelectedId(null)}><X size={18} /></button>
            </div>

            <div className="ktree-panel-actions">
              <button className="ktree-btn ktree-btn-ghost ktree-btn-sm" onClick={() => openEdit(selected)}><Pencil size={13} /> Edit</button>
              <button className="ktree-btn ktree-btn-danger ktree-btn-sm" onClick={() => deletePerson(selected.id)}><Trash2 size={13} /> Delete</button>
            </div>

            <div className="ktree-detail-section">
              <div className="ktree-detail-label">Parents</div>
              {(selected.parents || []).length > 0 ? (
                <div className="ktree-chip-row">
                  {selected.parents.map((pid) => byId[pid] && (
                    <span key={pid} className="ktree-chip-name ktree-chip" onClick={() => setSelectedId(pid)}>
                      {byId[pid].name} <ChevronRight size={12} />
                    </span>
                  ))}
                </div>
              ) : <div className="ktree-empty-note">No parents added yet.</div>}
              <div className="ktree-quick-actions">
                <button className="ktree-btn ktree-btn-ghost ktree-btn-sm" disabled={(selected.parents || []).length >= 2} onClick={() => openAdd({})}>
                  <Plus size={13} /> Add parent
                </button>
              </div>
            </div>

            <div className="ktree-detail-section">
              <div className="ktree-detail-label">Partners</div>
              {(selected.partners || []).length > 0 ? (
                <div className="ktree-chip-row">
                  {selected.partners.map((pt) => byId[pt.id] && (
                    <span key={pt.id} className="ktree-chip">
                      <span className="ktree-chip-name" onClick={() => setSelectedId(pt.id)}>{byId[pt.id].name}</span>
                      <select value={pt.status} onChange={(e) => setPartnerStatus(selected.id, pt.id, e.target.value)}>
                        <option value="married">Together</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                      <X size={12} style={{ cursor: "pointer" }} onClick={() => unlinkPartner(selected.id, pt.id)} />
                    </span>
                  ))}
                </div>
              ) : <div className="ktree-empty-note">No partners added yet.</div>}
              <div className="ktree-quick-actions">
                <button className="ktree-btn ktree-btn-ghost ktree-btn-sm" onClick={() => openAdd({ partnerId: selected.id })}>
                  <Plus size={13} /> Add new partner
                </button>
              </div>
              <div className="ktree-inline-link">
                <select value={linkPartnerSel} onChange={(e) => setLinkPartnerSel(e.target.value)}>
                  <option value="">Link an existing person…</option>
                  {people.filter((p) => p.id !== selected.id && !(selected.partners || []).some((pt) => pt.id === p.id)).map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button className="ktree-btn ktree-btn-ghost ktree-btn-sm" onClick={() => { linkExistingPartner(selected.id, linkPartnerSel); setLinkPartnerSel(""); }} disabled={!linkPartnerSel}>
                  Link
                </button>
              </div>
            </div>

            <div className="ktree-detail-section">
              <div className="ktree-detail-label">Children</div>
              {childrenOf(selected.id).length > 0 ? (
                <div className="ktree-chip-row">
                  {childrenOf(selected.id).map((c) => (
                    <span key={c.id} className="ktree-chip-name ktree-chip" onClick={() => setSelectedId(c.id)}>{c.name} <ChevronRight size={12} /></span>
                  ))}
                </div>
              ) : <div className="ktree-empty-note">No children added yet.</div>}
              <div className="ktree-quick-actions">
                <button className="ktree-btn ktree-btn-ghost ktree-btn-sm" onClick={() => openAdd({ parent1: selected.id, parent2: (selected.partners || [])[0]?.id || "" })}>
                  <Plus size={13} /> Add child
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {form && (
        <div className="ktree-overlay" onClick={closeForm}>
          <div className="ktree-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ktree-panel-head">
              <h2 className="ktree-panel-title ktree-serif">{form.mode === "add" ? "Add person" : "Edit person"}</h2>
              <button className="ktree-close" onClick={closeForm}><X size={18} /></button>
            </div>

            <form onSubmit={submitForm}>
              <div className="ktree-field">
                <label>Photo</label>
                <div className="ktree-photo-row">
                  {form.values.photo ? <img className="ktree-photo-preview" src={form.values.photo} alt="" /> : <div className="ktree-photo-preview" />}
                  <input type="file" accept="image/*" onChange={(e) => onPhotoChosen(e.target.files?.[0])} />
                </div>
              </div>

              <div className="ktree-field">
                <label>Name</label>
                <input autoFocus value={form.values.name} onChange={(e) => setForm({ ...form, values: { ...form.values, name: e.target.value } })} placeholder="Full name" required />
              </div>

              <div className="ktree-field-row">
                <div className="ktree-field">
                  <label>Birth year</label>
                  <input value={form.values.birthYear} onChange={(e) => setForm({ ...form, values: { ...form.values, birthYear: e.target.value } })} placeholder="e.g. 1958" />
                </div>
                <div className="ktree-field">
                  <label>Death year</label>
                  <input value={form.values.deathYear} onChange={(e) => setForm({ ...form, values: { ...form.values, deathYear: e.target.value } })} placeholder="Optional" />
                </div>
              </div>

              <div className="ktree-field">
                <label>Parent</label>
                <select value={form.values.parent1} onChange={(e) => setForm({ ...form, values: { ...form.values, parent1: e.target.value } })}>
                  <option value="">None</option>
                  {people.filter((p) => p.id !== form.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="ktree-field">
                <label>Second parent</label>
                <select value={form.values.parent2} onChange={(e) => setForm({ ...form, values: { ...form.values, parent2: e.target.value } })}>
                  <option value="">None</option>
                  {people.filter((p) => p.id !== form.id && p.id !== form.values.parent1).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {form.mode === "add" && (
                <div className="ktree-field">
                  <label>Partner</label>
                  <select value={form.values.partnerId} onChange={(e) => setForm({ ...form, values: { ...form.values, partnerId: e.target.value } })}>
                    <option value="">None</option>
                    {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              <div className="ktree-panel-actions">
                <button type="submit" className="ktree-btn ktree-btn-primary">{form.mode === "add" ? "Add to tree" : "Save changes"}</button>
                <button type="button" className="ktree-btn ktree-btn-ghost" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
