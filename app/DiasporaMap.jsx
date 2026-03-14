'use client';
import { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

const DOMAIN_COLORS = {
  "Innovation & Tech": "#818cf8", "Banque & Finance": "#fbbf24",
  "Commerce & Entrepreneuriat": "#34d399", "Communication & Médias": "#f472b6",
  "Arts & Culture": "#a78bfa", "Médecine & Santé": "#f87171",
  "Droit & Justice": "#94a3b8", "Ingénierie & BTP": "#fb923c",
  "Politique & Gouvernance": "#38bdf8", "Éducation & Formation": "#a3e635",
  "Relations internationales": "#22d3ee", "Énergie & Environnement": "#4ade80",
  "Recherche & Sciences": "#c084fc", "Sport & Performance": "#fb7185",
  "Agriculture & Agroalimentaire": "#a8a29e", "Tourisme & Hôtellerie": "#2dd4bf",
  "Autre": "#64748b",
};

const STATUT_ICON = { "Entrepreneur": "🚀", "Étudiant": "🎓", "Profession libérale": "⚖️", "Salarié": "💼" };
const ALL_STATUTS = ["Salarié", "Entrepreneur", "Étudiant", "Profession libérale"];
const COUNTRY_IDS = { "24": "Benin", "250": "France", "826": "United Kingdom", "756": "Switzerland", "694": "Sierra Leone" };

function getColor(domaines) {
  if (!domaines) return "#64748b";
  const primary = domaines.split(",")[0].trim();
  return DOMAIN_COLORS[primary] || "#64748b";
}

// ── TALENT CARD ───────────────────────────────────────────────────────────────
function TalentCard({ t, onClick, compact = false }) {
  const color = getColor(t.domaines);
  return (
    <div onClick={onClick} style={{
      background: "#0d1525", border: "1px solid #1c2840", borderRadius: 10,
      padding: compact ? "10px 12px" : "14px 16px", cursor: onClick ? "pointer" : "default",
      transition: "border-color 0.15s", marginBottom: compact ? 8 : 10,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {STATUT_ICON[t.statut] || "💼"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c8daf0", lineHeight: 1.3, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t.poste || "—"}
          </div>
          {t.entreprise && <div style={{ fontSize: 11, color: "#3a7ab8", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.entreprise}</div>}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, background: "#0f2040", color: "#5a9acf", borderRadius: 3, padding: "1px 6px" }}>{t.pays}</span>
            {t.statut && <span style={{ fontSize: 9, background: "#0d1a28", color: "#4a6a80", borderRadius: 3, padding: "1px 6px" }}>{t.statut}</span>}
            {t.domaines && t.domaines.split(",").slice(0, 2).map(d => (
              <span key={d} style={{ fontSize: 9, background: getColor(d) + "20", color: getColor(d), borderRadius: 3, padding: "1px 6px" }}>{d.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL SHEET ──────────────────────────────────────────────────────────────
function TalentDetail({ t, onClose }) {
  const color = getColor(t.domaines);
  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
          {STATUT_ICON[t.statut] || "💼"}
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "#0d1a2a", border: "1px solid #1c2840", color: "#4a6080", cursor: "pointer", fontSize: 16, padding: "4px 10px", borderRadius: 6 }}>✕</button>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#c8daf0", lineHeight: 1.4, marginBottom: 4 }}>{t.poste || "—"}</div>
      {t.entreprise && <div style={{ fontSize: 13, color: "#3a7ab8", marginBottom: 12 }}>{t.entreprise}</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        <span style={{ background: "#0f2040", color: "#5a9acf", borderRadius: 4, padding: "3px 9px", fontSize: 11, border: "1px solid #1a3060" }}>{t.pays}</span>
        {t.statut && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "3px 9px", fontSize: 11, border: "1px solid #141e30" }}>{t.statut}</span>}
        {t.age && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "3px 9px", fontSize: 11, border: "1px solid #141e30" }}>{t.age} ans</span>}
        {t.niveau && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "3px 9px", fontSize: 11, border: "1px solid #141e30" }}>{t.niveau}</span>}
      </div>
      {t.domaines && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#2a4060", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>Domaines</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {t.domaines.split(",").map(d => {
              const c = getColor(d.trim());
              return <span key={d} style={{ background: c + "18", color: c, border: `1px solid ${c}35`, borderRadius: 4, padding: "3px 8px", fontSize: 11 }}>{d.trim()}</span>;
            })}
          </div>
        </div>
      )}
      {t.ecoles && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#2a4060", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>Formation</div>
          <div style={{ fontSize: 12, color: "#5a7090", lineHeight: 1.5 }}>{t.ecoles}</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DiasporaMap() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState("map");
  const [geoData, setGeoData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [projection, setProjection] = useState(null);
  const [size, setSize] = useState({ w: 800, h: 500 });

  // Zoom CSS : scale + translate gérés en state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const lastPinchDist = useRef(null);

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [filterDomain, setFilterDomain] = useState("Tous");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterPays, setFilterPays] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  // Fetch talents
  useEffect(() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '') + '/api/talents';
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => { setTalents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Measure container
  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        if (width > 0 && height > 0) setSize({ w: width, h: height });
      }
    };
    update();
    requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Centrage initial quand la taille est connue
  useEffect(() => {
    if (!size.w || !size.h) return;
    // Zoom initial x3.5, centré sur Bénin/Europe
    const s = 3.5;
    const beninX = size.w * 0.506;
    const beninY = size.h * 0.42;
    setZoom(s);
    setPan({ x: size.w / 2 - s * beninX, y: size.h / 2 - s * beninY });
  }, [size.w, size.h]);

  // Load GeoJSON
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json()).then(setGeoData).catch(() => {});
  }, []);

  // Projection — sans zoom (le zoom est géré par CSS transform)
  useEffect(() => {
    if (!size.w) return;
    const proj = d3.geoNaturalEarth1().scale(size.w / 6.5).translate([size.w / 2, size.h / 2]);
    setProjection(() => proj);
  }, [size]);

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Load countries
  useEffect(() => {
    if (!geoData || !pathGen) return;
    const load = () => {
      if (window.topojson) setCountries(window.topojson.feature(geoData, geoData.objects.countries).features);
    };
    if (window.topojson) { load(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
    s.onload = load;
    document.head.appendChild(s);
  }, [geoData, pathGen]);

  // ── Zoom handlers (scroll + pinch) ──────────────────────────────────────────
  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setZoom(z => {
      const nz = Math.min(Math.max(z * factor, 0.5), 20);
      setPan(p => ({
        x: mx - (mx - p.x) * (nz / z),
        y: my - (my - p.y) * (nz / z),
      }));
      return nz;
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning.current) return;
    setPan({
      x: panStart.current.px + e.clientX - panStart.current.x,
      y: panStart.current.py + e.clientY - panStart.current.y,
    });
  };

  const handleMouseUp = () => { isPanning.current = false; };

  // Touch pinch + pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      isPanning.current = true;
      panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: pan.x, py: pan.y };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist.current) {
        const factor = dist / lastPinchDist.current;
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - containerRef.current.getBoundingClientRect().left;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - containerRef.current.getBoundingClientRect().top;
        setZoom(z => {
          const nz = Math.min(Math.max(z * factor, 0.5), 20);
          setPan(p => ({ x: mx - (mx - p.x) * (nz / z), y: my - (my - p.y) * (nz / z) }));
          return nz;
        });
      }
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && isPanning.current) {
      setPan({
        x: panStart.current.px + e.touches[0].clientX - panStart.current.x,
        y: panStart.current.py + e.touches[0].clientY - panStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => { isPanning.current = false; lastPinchDist.current = null; };

  // Wheel non-passive pour pouvoir appeler preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [pan, zoom]);

  const handleZoomBtn = (factor) => {
    const cx = size.w / 2, cy = size.h / 2;
    setZoom(z => {
      const nz = Math.min(Math.max(z * factor, 0.5), 20);
      setPan(p => ({ x: cx - (cx - p.x) * (nz / z), y: cy - (cy - p.y) * (nz / z) }));
      return nz;
    });
  };

  const handleZoomReset = () => {
    const s = 3.5;
    setZoom(s);
    setPan({ x: size.w / 2 - s * size.w * 0.506, y: size.h / 2 - s * size.h * 0.42 });
  };

  // ── Données ──────────────────────────────────────────────────────────────────
  const ALL_PAYS = useMemo(() => [...new Set(talents.map(t => t.pays).filter(Boolean))].sort(), [talents]);

  const filtered = useMemo(() => talents.filter(t => {
    const d = filterDomain === "Tous" || (t.domaines && t.domaines.includes(filterDomain));
    const s = filterStatut === "Tous" || t.statut === filterStatut;
    const p = filterPays === "Tous" || t.pays === filterPays;
    return d && s && p;
  }), [talents, filterDomain, filterStatut, filterPays]);

  const countsByCountry = useMemo(() => {
    const c = {}; ALL_PAYS.forEach(p => c[p] = 0);
    filtered.forEach(t => { if (c[t.pays] !== undefined) c[t.pays]++; });
    return c;
  }, [filtered, ALL_PAYS]);

  const countsByDomain = useMemo(() => {
    const c = {};
    filtered.forEach(t => {
      if (!t.domaines) return;
      t.domaines.split(",").forEach(d => { const k = d.trim(); c[k] = (c[k] || 0) + 1; });
    });
    return c;
  }, [filtered]);

  // Dots projetés (sans transform — le transform CSS s'en charge)
  const dots = useMemo(() => {
    if (!projection) return [];
    return filtered.map((t, i) => {
      const pt = projection([t.lng, t.lat]);
      if (!pt) return null;
      return { ...t, x: pt[0], y: pt[1], i };
    }).filter(Boolean);
  }, [filtered, projection]);

  const arcPaths = useMemo(() => {
    if (!projection) return [];
    const bc = projection([2.315, 9.307]);
    if (!bc) return [];
    return ALL_PAYS
      .filter(pays => pays !== "Bénin" && countsByCountry[pays] > 0)
      .map(pays => {
        const talentsDuPays = filtered.filter(t => t.pays === pays);
        if (!talentsDuPays.length) return null;
        const avgLng = talentsDuPays.reduce((s, t) => s + t.lng, 0) / talentsDuPays.length;
        const avgLat = talentsDuPays.reduce((s, t) => s + t.lat, 0) / talentsDuPays.length;
        const pt = projection([avgLng, avgLat]);
        if (!pt) return null;
        const mx = (bc[0] + pt[0]) / 2, my = Math.min(bc[1], pt[1]) - 60;
        return { pays, d: `M ${bc[0]} ${bc[1]} Q ${mx} ${my} ${pt[0]} ${pt[1]}`, count: countsByCountry[pays] };
      }).filter(Boolean);
  }, [projection, countsByCountry, ALL_PAYS, filtered]);

  const handleDotClick = (t) => { setSelected(t); if (isMobile) setShowSheet(true); };
  const activeFiltersCount = [filterDomain, filterStatut, filterPays].filter(f => f !== "Tous").length;

  // ── FILTER PANEL ─────────────────────────────────────────────────────────────
  const FilterPanel = () => (
    <div style={{ padding: isMobile ? "16px" : "14px 12px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a5070", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>PAYS</div>
        {["Tous", ...ALL_PAYS].map(p => (
          <button key={p} onClick={() => setFilterPays(p)} style={{
            display: "flex", justifyContent: "space-between", width: "100%", padding: isMobile ? "8px 10px" : "5px 8px", marginBottom: 3,
            background: filterPays === p ? "#0f2040" : "transparent", color: filterPays === p ? "#7eb8f7" : "#4a6080",
            border: filterPays === p ? "1px solid #1a4080" : "1px solid transparent",
            borderRadius: 6, cursor: "pointer", fontSize: isMobile ? 13 : 11, fontFamily: "inherit", textAlign: "left"
          }}>
            <span>{p === "Tous" ? "Tous les pays" : p}</span>
            <span style={{ color: "#2a4060" }}>{p === "Tous" ? filtered.length : countsByCountry[p] || 0}</span>
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a5070", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>STATUT</div>
        {["Tous", ...ALL_STATUTS].map(s => (
          <button key={s} onClick={() => setFilterStatut(s)} style={{
            display: "flex", justifyContent: "space-between", width: "100%", padding: isMobile ? "8px 10px" : "5px 8px", marginBottom: 3,
            background: filterStatut === s ? "#0f2040" : "transparent", color: filterStatut === s ? "#7eb8f7" : "#4a6080",
            border: filterStatut === s ? "1px solid #1a4080" : "1px solid transparent",
            borderRadius: 6, cursor: "pointer", fontSize: isMobile ? 13 : 11, fontFamily: "inherit", textAlign: "left"
          }}>
            <span>{s === "Tous" ? "Tous" : `${STATUT_ICON[s]} ${s}`}</span>
            <span style={{ color: "#2a4060" }}>{s === "Tous" ? filtered.length : filtered.filter(t => t.statut === s).length}</span>
          </button>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a5070", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>DOMAINE</div>
        <button onClick={() => setFilterDomain("Tous")} style={{
          display: "flex", justifyContent: "space-between", width: "100%", padding: isMobile ? "8px 10px" : "5px 8px", marginBottom: 3,
          background: filterDomain === "Tous" ? "#0f2040" : "transparent", color: filterDomain === "Tous" ? "#7eb8f7" : "#4a6080",
          border: filterDomain === "Tous" ? "1px solid #1a4080" : "1px solid transparent",
          borderRadius: 6, cursor: "pointer", fontSize: isMobile ? 13 : 11, fontFamily: "inherit", textAlign: "left"
        }}>
          <span>Tous</span><span style={{ color: "#2a4060" }}>{filtered.length}</span>
        </button>
        {Object.entries(countsByDomain).sort((a, b) => b[1] - a[1]).map(([d, c]) => (
          <button key={d} onClick={() => setFilterDomain(d)} style={{
            display: "flex", alignItems: "center", gap: 6, width: "100%", padding: isMobile ? "8px 10px" : "5px 8px", marginBottom: 3,
            background: filterDomain === d ? "#0f2040" : "transparent", color: filterDomain === d ? "#a8c8ff" : "#4a6080",
            border: filterDomain === d ? "1px solid #1a4080" : "1px solid transparent",
            borderRadius: 6, cursor: "pointer", fontSize: isMobile ? 12 : 10, fontFamily: "inherit", textAlign: "left"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] || "#64748b", flexShrink: 0 }}></span>
            <span style={{ flex: 1 }}>{d}</span>
            <span style={{ color: "#2a4060" }}>{c}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ background: "#080c14", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#5a7090", fontFamily: "Georgia, serif" }}>
      <div style={{ fontSize: 32 }}>🇧🇯</div>
      <div style={{ fontSize: 13, letterSpacing: 1 }}>Chargement des talents…</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#080c14", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden", color: "#dde4f0" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#0d1525", borderBottom: "1px solid #1c2840", padding: isMobile ? "10px 14px" : "12px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🇧🇯</span>
            <div>
              <div style={{ fontSize: isMobile ? 14 : 17, fontWeight: 700, color: "#f0e6c8", lineHeight: 1.2 }}>Diaspora Béninoise</div>
              <div style={{ fontSize: 10, color: "#5a7090", fontStyle: "italic" }}>{filtered.length} talents · {Object.values(countsByCountry).filter(c => c > 0).length} pays</div>
            </div>
          </div>
          {isMobile ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowFilters(!showFilters)} style={{
                background: activeFiltersCount > 0 ? "#1e3a5f" : "#0d1a2a", border: `1px solid ${activeFiltersCount > 0 ? "#2a5a9f" : "#1c2840"}`,
                color: activeFiltersCount > 0 ? "#7eb8f7" : "#5a7090", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5
              }}>
                ⚙ Filtres {activeFiltersCount > 0 && <span style={{ background: "#2a5a9f", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{activeFiltersCount}</span>}
              </button>
              <div style={{ display: "flex", background: "#0d1a2a", border: "1px solid #1c2840", borderRadius: 8, overflow: "hidden" }}>
                {["map", "list"].map(v => (
                  <button key={v} onClick={() => setMobileView(v)} style={{
                    padding: "6px 12px", background: mobileView === v ? "#1e3a5f" : "transparent",
                    color: mobileView === v ? "#7eb8f7" : "#4a6080", border: "none", cursor: "pointer", fontSize: 16
                  }}>{v === "map" ? "🗺" : "☰"}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
              {Object.entries(countsByDomain).sort((a, b) => b[1] - a[1]).map(([d, c]) => {
                const color = DOMAIN_COLORS[d] || "#64748b";
                const isActive = filterDomain === d;
                return (
                  <div key={d} onClick={() => setFilterDomain(isActive ? "Tous" : d)} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: isActive ? color + "22" : "#0d1525",
                    border: `1px solid ${isActive ? color + "88" : "#1c2840"}`,
                    borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer",
                    color: isActive ? color : "#607090"
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: isActive ? `0 0 5px ${color}` : "none" }} />
                    <span>{d}</span>
                    <strong style={{ color: isActive ? color : "#3a5070", fontFamily: "monospace" }}>{c}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {isMobile && showFilters && (
          <div style={{ marginTop: 10, maxHeight: "50vh", overflowY: "auto", borderTop: "1px solid #1c2840", paddingTop: 10 }}>
            <FilterPanel />
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {!isMobile && (
          <div style={{ width: 200, background: "#0a0f1a", borderRight: "1px solid #141e30", overflowY: "auto", flexShrink: 0 }}>
            <FilterPanel />
          </div>
        )}

        {/* ── MAP ── */}
        <div
          ref={containerRef}
          style={{ flex: 1, position: "relative", background: "#060a10", overflow: "hidden", display: isMobile && mobileView === "list" ? "none" : "block", cursor: isPanning.current ? "grabbing" : "grab", userSelect: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* SVG avec CSS transform */}
          <svg
            ref={svgRef}
            width={size.w}
            height={size.h}
            style={{ display: "block", position: "absolute", top: 0, left: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", willChange: "transform" }}
          >
            <defs>
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a1525" /><stop offset="100%" stopColor="#060a10" />
              </radialGradient>
              <filter id="softglow">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width={size.w} height={size.h} fill="url(#oceanGrad)" />

            {/* Pays */}
            {pathGen && countries.map((f, i) => {
              const id = f.id; const name = COUNTRY_IDS[id]; const isBenin = name === "Benin"; const isHL = !!name;
              return <path key={f.id ?? i} d={pathGen(f)}
                fill={isBenin ? "#2a3d1a" : isHL ? "#1a2a40" : "#0f1a28"}
                stroke={isBenin ? "#f5c842" : isHL ? "#2a4060" : "#0d1620"}
                strokeWidth={isBenin ? 0.8 : isHL ? 0.5 : 0.3}
                opacity={isHL ? 1 : 0.7} />;
            })}

            {/* Graticule */}
            {pathGen && <path d={pathGen(d3.geoGraticule()())} fill="none" stroke="#0e1a28" strokeWidth={0.3} />}

            {/* Arcs */}
            {arcPaths.map(({ pays, d, count }) => (
              <path key={pays} d={d} fill="none" stroke="rgba(245,200,70,0.15)"
                strokeWidth={Math.min(count * 0.3 + 0.5, 2)}
                strokeDasharray="4,3" />
            ))}

            {/* Points */}
            {dots.map(t => {
              const color = getColor(t.domaines);
              const isHov = hovered === t.i;
              const isSel = selected && selected.i === t.i;
              const r = isSel ? 7 : isHov ? 6 : isMobile ? 6 : 4;
              return (
                <g key={t.i} style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => { setHovered(t.i); setTooltip({ t, x: e.clientX, y: e.clientY }); }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                  onClick={(e) => { e.stopPropagation(); handleDotClick(isSel && !isMobile ? null : t); }}>
                  {(isHov || isSel) && <circle cx={t.x} cy={t.y} r={r * 2.8} fill={color} opacity={0.15} />}
                  <circle cx={t.x} cy={t.y} r={r} fill={color}
                    stroke={isSel ? "#fff" : isHov ? color : "rgba(0,0,0,0.4)"}
                    strokeWidth={isSel ? 1.5 : 0.8}
                    filter={isHov || isSel ? "url(#softglow)" : undefined} opacity={0.9} />
                </g>
              );
            })}

            {/* Labels pays */}
            {projection && ALL_PAYS.map(name => {
              const talentsDuPays = filtered.filter(t => t.pays === name);
              if (!talentsDuPays.length) return null;
              const avgLng = talentsDuPays.reduce((s, t) => s + t.lng, 0) / talentsDuPays.length;
              const avgLat = talentsDuPays.reduce((s, t) => s + t.lat, 0) / talentsDuPays.length;
              const pt = projection([avgLng, avgLat]); if (!pt) return null;
              const count = countsByCountry[name] || 0; if (!count) return null;
              const accent = name === "Bénin";
              return (
                <g key={name}>
                  <text x={pt[0]} y={pt[1] - 14} textAnchor="middle" fontSize={accent ? 11 : 9}
                    fill={accent ? "#f5c842" : "#5a8ab8"} fontWeight="600" style={{ pointerEvents: "none", fontFamily: "Georgia, serif" }}>{name}</text>
                  <text x={pt[0]} y={pt[1] - 5} textAnchor="middle" fontSize={accent ? 9 : 7}
                    fill={accent ? "#a08030" : "#2a5070"} style={{ pointerEvents: "none", fontFamily: "monospace" }}>
                    {count} talent{count > 1 ? "s" : ""}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Zoom buttons */}
          <div style={{ position: "absolute", bottom: isMobile ? 80 : 20, right: 12, display: "flex", flexDirection: "column", gap: 4, zIndex: 10 }}>
            {[
              { label: "+", action: () => handleZoomBtn(1.5) },
              { label: "−", action: () => handleZoomBtn(0.67) },
              { label: "⌂", action: handleZoomReset },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} style={{
                width: isMobile ? 40 : 32, height: isMobile ? 40 : 32, background: "#0d1a2a",
                border: "1px solid #1c2840", color: "#5a8ab8", borderRadius: 6, cursor: "pointer",
                fontSize: label === "⌂" ? 14 : 20, display: "flex", alignItems: "center", justifyContent: "center"
              }}>{label}</button>
            ))}
          </div>

          {/* Tooltip desktop */}
          {tooltip && !selected && !isMobile && (
            <div style={{
              position: "fixed", left: tooltip.x + 14, top: tooltip.y - 30,
              background: "#0d1a2a", border: "1px solid #1c3050", borderRadius: 6,
              padding: "8px 12px", pointerEvents: "none", maxWidth: 220, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#d0e4f8", marginBottom: 2 }}>{tooltip.t.poste || "—"}</div>
              {tooltip.t.entreprise && <div style={{ fontSize: 11, color: "#4a8ab8" }}>{tooltip.t.entreprise}</div>}
              <div style={{ fontSize: 10, color: "#2a5070", marginTop: 4 }}>{tooltip.t.pays} · {tooltip.t.statut}</div>
            </div>
          )}
        </div>

        {/* Mobile list view */}
        {isMobile && mobileView === "list" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", background: "#080c14" }}>
            <div style={{ fontSize: 11, color: "#3a5070", marginBottom: 10, fontFamily: "monospace" }}>{filtered.length} TALENTS</div>
            {filtered.map((t, i) => (
              <TalentCard key={i} t={t} compact onClick={() => { setSelected(t); setShowSheet(true); }} />
            ))}
          </div>
        )}

        {/* Desktop right panel */}
        {!isMobile && selected && (
          <div style={{ width: 270, background: "#0a0f1a", borderLeft: "1px solid #141e30", overflowY: "auto", flexShrink: 0 }}>
            <TalentDetail t={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && showSheet && selected && (
        <>
          <div onClick={() => { setShowSheet(false); setSelected(null); }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
            background: "#0d1525", borderTop: "2px solid #1c2840",
            borderRadius: "18px 18px 0 0", maxHeight: "80dvh", overflowY: "auto",
            animation: "slideUp 0.25s ease-out"
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#2a3a50" }} />
            </div>
            <TalentDetail t={selected} onClose={() => { setShowSheet(false); setSelected(null); }} />
          </div>
        </>
      )}

      {/* Desktop legend */}
      {!isMobile && (
        <div style={{ background: "#080c14", borderTop: "1px solid #0e1828", padding: "5px 20px", display: "flex", gap: 14, alignItems: "center", flexShrink: 0, overflowX: "auto" }}>
          {Object.entries(countsByDomain).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d, c]) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d], boxShadow: `0 0 5px ${DOMAIN_COLORS[d]}` }}></span>
              <span style={{ fontSize: 10, color: "#3a5070" }}>{d}</span>
              <span style={{ fontSize: 10, color: "#1a3050", fontFamily: "monospace" }}>{c}</span>
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#1a2a40", flexShrink: 0, fontFamily: "monospace" }}>scroll pour zoomer · clic pour sélectionner</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #1c2840; border-radius: 2px; }
      `}</style>
    </div>
  );
}
