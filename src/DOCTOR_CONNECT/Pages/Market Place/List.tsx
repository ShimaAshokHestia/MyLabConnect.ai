import { useState } from "react";

// ── Tooth SVG Logo ────────────────────────────────────────────────────────
const ToothLogo = () => (
  <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="82">
    <defs>
      <linearGradient id="toothGrad" x1="0" y1="0" x2="120" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4a9fd4" />
        <stop offset="50%" stopColor="#1a6fa8" />
        <stop offset="100%" stopColor="#0d4f8a" />
      </linearGradient>
      <linearGradient id="swishGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7ec8f0" />
        <stop offset="100%" stopColor="#1a6fa8" />
      </linearGradient>
    </defs>
    <path
      d="M30 15 C20 15 10 25 10 40 C10 55 15 65 20 75 C25 85 28 100 35 100 C40 100 42 90 45 80 C48 70 52 65 60 65 C68 65 72 70 75 80 C78 90 80 100 85 100 C92 100 95 85 100 75 C105 65 110 55 110 40 C110 25 100 15 90 15 C80 15 75 20 60 20 C45 20 40 15 30 15 Z"
      fill="url(#toothGrad)"
    />
    <path
      d="M42 52 C42 42 50 35 60 35 C70 35 78 42 78 52"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M8 30 C25 5 55 2 80 12"
      stroke="url(#swishGrad)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M82 10 C100 18 115 30 112 50"
      stroke="url(#swishGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// ── Icons ─────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ToothIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2C8 2 5 5 5 9c0 4 1.5 7 3 10 .8 1.6 1.5 3 2 3s1.2-1.4 2-3c1.5-3 3-6 3-10 0-4-3-7-3-7z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SortArrow = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const LABS = [
  { id: 1, name: "ALS Dental Lab", location: "", restoration: "Ceramic,Fixed Restorati...", eta: "5-10 days", price: 12, rating: 5 },
  { id: 2, name: "CosTech MD Pilot", location: "DERING WAY,GRAVESEND", restoration: "", eta: "", price: 12, rating: 5 },
  { id: 3, name: "Dental Infinity Lab", location: "LOUGHTON", restoration: "Ceramic", eta: "5-10 days", price: 12, rating: 5 },
  { id: 4, name: "Dental Infinity", location: "", restoration: "", eta: "", price: 12, rating: 5 },
  { id: 5, name: "MLC LAB", location: "", restoration: "", eta: "", price: null, rating: 5 },
  { id: 6, name: "MLC LAB", location: "CHENNAI", restoration: "", eta: "", price: null, rating: 5 },
  { id: 7, name: "MLC LAB", location: "", restoration: "", eta: "", price: null, rating: 5 },
  { id: 8, name: "MLC LAB", location: "", restoration: "", eta: "", price: null, rating: 5 },
];

const SERVICE_OPTIONS = ["Digital", "Analog", "Hybrid"];
const NHS_OPTIONS = ["NHS", "Private", "Mixed"];
const PRODUCT_OPTIONS = ["Select Product...", "Crown", "Bridge", "Veneer", "Implant", "Denture"];

// ── Dropdown sub-component ────────────────────────────────────────────────
function Dropdown({ value, options, onChange, wide = false }: {
  value: string; options: string[]; onChange: (v: string) => void; wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isPlaceholder = value === "Select Product...";
  return (
    <div
      className={`mp-dropdown${wide ? " mp-dropdown--wide" : ""}`}
      onClick={() => setOpen(p => !p)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <span className={`mp-dropdown-val${isPlaceholder ? " mp-dropdown-val--ph" : ""}`}>{value}</span>
      <span className={`mp-chevron${open ? " open" : ""}`}><ChevronDown /></span>
      {open && (
        <div className="mp-dropdown-menu">
          {options.map(o => (
            <div
              key={o}
              className={`mp-dropdown-item${value === o ? " active" : ""}`}
              onMouseDown={() => { onChange(o); setOpen(false); }}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Marketplace() {
  const [service, setService] = useState("Digital");
  const [nhs, setNhs] = useState("NHS");
  const [product, setProduct] = useState("Select Product...");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());

  const handleAdd = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filtered = LABS.filter(l =>
    !searchVal ||
    l.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    (l.location || "").toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="mp-root">
      <style>{CSS}</style>

      {/* ── Top Bar ── */}
      <div className="mp-topbar">
        <h1 className="mp-title">Market Place</h1>

        <div className="mp-filters">
          <Dropdown value={service} options={SERVICE_OPTIONS} onChange={setService} />
          <Dropdown value={nhs} options={NHS_OPTIONS} onChange={setNhs} />
          <Dropdown value={product} options={PRODUCT_OPTIONS} onChange={setProduct} wide />

          <button className="mp-sort-btn">PRICE <SortArrow /></button>
          <button className="mp-sort-btn">RATING <SortArrow /></button>
          <button className="mp-sort-btn">ETA <SortArrow /></button>

          <div className={`mp-search-box${searchOpen ? " mp-search-box--open" : ""}`}>
            <button
              className="mp-search-trigger"
              onClick={() => setSearchOpen(p => !p)}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            {searchOpen && (
              <input
                autoFocus
                className="mp-search-input"
                placeholder="Search labs…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onBlur={() => { if (!searchVal) setSearchOpen(false); }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div className="mp-grid">
        {filtered.map((lab, idx) => (
          <div className="mp-card" key={`${lab.id}-${idx}`}>

            {/* ── Image section ── */}
            <div className="mp-card-img">
              <button
                className={`mp-add-btn${added.has(lab.id) ? " mp-add-btn--added" : ""}`}
                onClick={e => handleAdd(lab.id, e)}
              >
                {added.has(lab.id) ? "Added" : "Add"}
              </button>

              <div className="mp-card-stars">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{lab.rating}</span>
              </div>

              <div className="mp-card-logo-wrap">
                <ToothLogo />
              </div>
            </div>

            {/* ── Info section ── */}
            <div className="mp-card-body">
              <p className="mp-card-name">{lab.name}</p>

              <div className="mp-info-row">
                <LocationIcon />
                <span>{lab.location}</span>
              </div>

              <div className="mp-info-row">
                <ToothIcon />
                <span>Restoration:{lab.restoration ? ` ${lab.restoration}` : ""}</span>
              </div>

              <div className="mp-info-row">
                <ClockIcon />
                <span>ETA:{lab.eta ? ` ${lab.eta}` : ""}</span>
              </div>

              {lab.price != null && (
                <div className="mp-info-row mp-info-row--price">
                  <span>£ : {lab.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const CSS = `
  .mp-root {
    background: var(--theme-bg, #ddeef5);
    min-height: 100vh;
    padding: 18px 18px 48px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--theme-text-primary, #0f172a);
    box-sizing: border-box;
  }
  *, *::before, *::after { box-sizing: inherit; }

  /* ── Top bar ── */
  .mp-topbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .mp-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--theme-text-primary, #0f172a);
    margin: 0;
    margin-right: auto;
    white-space: nowrap;
  }
  .mp-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* ── Dropdown ── */
  .mp-dropdown {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    min-width: 110px;
    padding: 0 10px;
    background: var(--theme-bg-paper, #ffffff);
    border: 1.5px solid var(--theme-border, #e2e8f0);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .mp-dropdown--wide { min-width: 155px; }
  .mp-dropdown:focus,
  .mp-dropdown:hover {
    border-color: var(--theme-primary, #ef0d50);
    box-shadow: 0 0 0 3px rgba(239,13,80,0.08);
  }
  .mp-dropdown-val {
    flex: 1;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--theme-text-primary, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mp-dropdown-val--ph { color: var(--theme-text-disabled, #94a3b8); font-weight: 400; }
  .mp-chevron { color: var(--theme-text-disabled, #94a3b8); display: flex; flex-shrink: 0; transition: transform 0.15s; }
  .mp-chevron.open { transform: rotate(180deg); }

  .mp-dropdown-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    min-width: 100%;
    background: var(--theme-bg-paper, #ffffff);
    border: 1.5px solid var(--theme-border, #e2e8f0);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    z-index: 100;
    overflow: hidden;
    padding: 3px 0;
  }
  .mp-dropdown-item {
    padding: 8px 12px;
    font-size: 0.81rem;
    color: var(--theme-text-primary, #0f172a);
    cursor: pointer;
    transition: background 0.1s;
  }
  .mp-dropdown-item:hover { background: var(--theme-bg-hover, #d4ecf2); }
  .mp-dropdown-item.active { color: var(--theme-primary, #ef0d50); font-weight: 600; background: rgba(239,13,80,0.05); }

  /* ── Sort buttons ── */
  .mp-sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 36px;
    padding: 0 14px;
    background: var(--theme-bg-paper, #ffffff);
    border: 1.5px solid var(--theme-border, #e2e8f0);
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.35px;
    color: var(--theme-text-primary, #0f172a);
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .mp-sort-btn svg { color: var(--theme-text-disabled, #94a3b8); }
  .mp-sort-btn:hover {
    border-color: var(--theme-primary, #ef0d50);
    color: var(--theme-primary, #ef0d50);
    box-shadow: 0 0 0 3px rgba(239,13,80,0.08);
  }
  .mp-sort-btn:hover svg { color: var(--theme-primary, #ef0d50); }

  /* ── Search ── */
  .mp-search-box {
    display: flex;
    align-items: center;
    height: 36px;
    background: var(--theme-bg-paper, #ffffff);
    border: 1.5px solid var(--theme-border, #e2e8f0);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .mp-search-box--open {
    border-color: var(--theme-primary, #ef0d50);
    box-shadow: 0 0 0 3px rgba(239,13,80,0.08);
  }
  .mp-search-trigger {
    width: 36px;
    height: 34px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--theme-text-secondary, #64748b);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mp-search-trigger:hover { color: var(--theme-primary, #ef0d50); }
  .mp-search-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.82rem;
    font-family: inherit;
    color: var(--theme-text-primary, #0f172a);
    width: 155px;
    padding: 0 10px 0 0;
  }
  .mp-search-input::placeholder { color: var(--theme-text-disabled, #94a3b8); }

  /* ── Grid ── */
  .mp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  /* ── Card ── */
  .mp-card {
    background: var(--theme-bg-paper, #ffffff);
    border-radius: 12px;
    border: 1px solid var(--theme-border, #e2e8f0);
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.18s;
    cursor: pointer;
  }
  .mp-card:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.11);
    transform: translateY(-3px);
  }

  /* Image area — grey gradient matching the screenshot */
  .mp-card-img {
    position: relative;
    height: 172px;
    background: linear-gradient(150deg, #dde6ef 0%, #ccd7e4 35%, #c0cedf 65%, #b8c8db 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  /* Subtle inner highlight at bottom */
  .mp-card-img::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(255,255,255,0.3), transparent);
    pointer-events: none;
  }

  /* Add pill — top-left green */
  .mp-add-btn {
    position: absolute;
    top: 9px;
    left: 9px;
    z-index: 3;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.76rem;
    font-weight: 700;
    padding: 4px 13px;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.1px;
    transition: background 0.14s, transform 0.1s;
    box-shadow: 0 1px 6px rgba(34,197,94,0.35);
  }
  .mp-add-btn:hover { background: #16a34a; transform: scale(1.05); }
  .mp-add-btn:active { transform: scale(0.97); }
  .mp-add-btn--added { background: #3b82f6 !important; box-shadow: 0 1px 6px rgba(59,130,246,0.35) !important; }

  /* Rating pill — top-right */
  .mp-card-stars {
    position: absolute;
    top: 9px;
    right: 9px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.88);
    border-radius: 20px;
    padding: 3px 9px 3px 7px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--theme-text-primary, #0f172a);
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    backdrop-filter: blur(4px);
  }

  /* Tooth logo wrapper */
  .mp-card-logo-wrap {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 3px 10px rgba(26,111,168,0.3));
  }

  /* Info section */
  .mp-card-body {
    padding: 11px 13px 13px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .mp-card-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #2563eb;
    margin: 0 0 3px;
    line-height: 1.3;
  }
  .mp-info-row {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    color: var(--theme-text-secondary, #64748b);
    font-size: 0.77rem;
    line-height: 1.45;
    min-height: 18px;
  }
  .mp-info-row svg { flex-shrink: 0; margin-top: 2px; }
  .mp-info-row span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mp-info-row--price {
    padding-left: 1px;
    font-size: 0.77rem;
    color: var(--theme-text-secondary, #64748b);
  }

  /* ── Dark theme ── */
  [data-theme="dark"] .mp-card-img {
    background: linear-gradient(150deg, #1c2736 0%, #182130 35%, #141c2b 65%, #111827 100%);
  }
  [data-theme="dark"] .mp-card-stars {
    background: rgba(26,31,38,0.9);
    color: #f1f5f9;
  }
  [data-theme="dark"] .mp-card-name { color: #60a5fa; }

  /* ── Responsive ── */
  @media (max-width: 1200px) { .mp-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 860px)  { .mp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  {
    .mp-grid { grid-template-columns: 1fr; }
    .mp-topbar { flex-direction: column; align-items: flex-start; }
    .mp-title { margin-right: 0; }
  }
`;
