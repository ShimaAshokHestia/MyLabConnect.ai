import React, { useEffect, useRef, useCallback } from 'react';
import '../../Styles/Case/TeethDiagram.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface TeethDiagramProps {
  selectedTeeth: Set<number>;
  onToothToggle: (toothNum: number) => void;
}

interface ShapeGroove { x1: number; y1: number; x2: number; y2: number; lw?: number; }
interface ShapeHighlight { cx: number; cy: number; rx: number; ry: number; }
interface ShapeCusp { cx: number; cy: number; r: number; }
interface ToothShape {
  outer: string;
  fossa: string;
  grooves: ShapeGroove[];
  highlights: ShapeHighlight[];
  cusps: ShapeCusp[];
}

// ─────────────────────────────────────────────
// Shape generators
// ─────────────────────────────────────────────

function molarShape(w: number, h: number): ToothShape {
  const hw = w / 2, hh = h / 2;
  const outer =
    `M ${hw*0.1},${-hh} C ${-hw*0.12},${-hh*1.06} ${-hw*0.52},${-hh*0.96} ${-hw*0.78},${-hh*0.62} ` +
    `C ${-hw*1.06},${-hh*0.28} ${-hw*1.04},${hh*0.18} ${-hw*0.85},${hh*0.55} ` +
    `C ${-hw*0.62},${hh*0.92} ${-hw*0.18},${hh*1.04} ${hw*0.08},${hh} ` +
    `C ${hw*0.38},${hh*1.05} ${hw*0.72},${hh*0.9} ${hw*0.92},${hh*0.58} ` +
    `C ${hw*1.06},${hh*0.22} ${hw*1.04},${-hh*0.18} ${hw*0.82},${-hh*0.58} ` +
    `C ${hw*0.58},${-hh*0.94} ${hw*0.32},${-hh*1.06} ${hw*0.1},${-hh} Z`;
  const f=0.55, fw=hw*f, fh=hh*f;
  const fossa =
    `M ${fw*0.08},${-fh} C ${-fw*0.42},${-fh*0.95} ${-fw*0.88},${-fh*0.52} ${-fw*0.82},${fh*0.22} ` +
    `C ${-fw*0.75},${fh*0.78} ${-fw*0.18},${fh} ${fw*0.06},${fh} ` +
    `C ${fw*0.48},${fh*1.02} ${fw*0.88},${fh*0.62} ${fw*0.85},${fh*0.12} ` +
    `C ${fw*0.82},${-fh*0.42} ${fw*0.45},${-fh*0.96} ${fw*0.08},${-fh} Z`;
  return {
    outer, fossa,
    grooves: [
      { x1:-hw*0.48,y1:-hh*0.02,x2:hw*0.44,y2:hh*0.04,lw:1.0 },
      { x1:-hw*0.06,y1:-hh*0.56,x2:-hw*0.08,y2:-hh*0.04,lw:0.75 },
      { x1:hw*0.24,y1:hh*0.06,x2:hw*0.22,y2:hh*0.55,lw:0.75 },
    ],
    highlights: [
      { cx:hw*0.52,cy:-hh*0.62,rx:hw*0.2,ry:hh*0.15 },
      { cx:-hw*0.52,cy:-hh*0.58,rx:hw*0.18,ry:hh*0.13 },
    ],
    cusps: [
      { cx:-hw*0.58,cy:-hh*0.65,r:1.6 },
      { cx:hw*0.54,cy:-hh*0.62,r:1.8 },
      { cx:hw*0.56,cy:hh*0.58,r:1.6 },
      { cx:-hw*0.50,cy:hh*0.60,r:1.4 },
    ],
  };
}

function premolarShape(w: number, h: number): ToothShape {
  const hw=w/2, hh=h/2;
  const outer =
    `M 0,${-hh} C ${hw*0.45},${-hh*1.05} ${hw*1.02},${-hh*0.52} ${hw*0.96},${hh*0.28} ` +
    `C ${hw*0.88},${hh*0.88} ${hw*0.28},${hh*1.04} ${-hw*0.28},${hh*1.04} ` +
    `C ${-hw*0.88},${hh*0.88} ${-hw*0.96},${hh*0.28} ${-hw*1.02},${-hh*0.52} ` +
    `C ${-hw*0.45},${-hh*1.05} 0,${-hh} 0,${-hh} Z`;
  const f=0.58, fw=hw*f, fh=hh*f;
  const fossa =
    `M 0,${-fh} C ${fw*0.82},${-fh*0.92} ${fw},${fh*0.18} ${fw*0.62},${fh} ` +
    `C ${-fw*0.62},${fh} ${-fw},${fh*0.18} ${-fw*0.82},${-fh*0.92} ` +
    `C ${-fw*0.18},${-fh*1.04} 0,${-fh} 0,${-fh} Z`;
  return {
    outer, fossa,
    grooves: [
      { x1:hw*0.04,y1:-hh*0.56,x2:hw*0.04,y2:hh*0.52,lw:0.95 },
      { x1:-hw*0.35,y1:-hh*0.06,x2:hw*0.38,y2:-hh*0.06,lw:0.7 },
    ],
    highlights: [{ cx:0,cy:-hh*0.75,rx:hw*0.28,ry:hh*0.14 }],
    cusps: [{ cx:0,cy:-hh*0.82,r:1.8 },{ cx:-hw*0.04,cy:hh*0.76,r:1.4 }],
  };
}

function canineShape(w: number, h: number): ToothShape {
  const hw=w/2, hh=h/2;
  const outer =
    `M 0,${-hh} C ${hw*0.65},${-hh*0.55} ${hw*1.02},${-hh*0.05} ${hw*0.88},${hh*0.35} ` +
    `C ${hw*0.68},${hh*0.88} ${hw*0.14},${hh*1.02} ${-hw*0.14},${hh*1.02} ` +
    `C ${-hw*0.68},${hh*0.88} ${-hw*0.88},${hh*0.35} ${-hw*1.02},${-hh*0.05} ` +
    `C ${-hw*0.65},${-hh*0.55} 0,${-hh} 0,${-hh} Z`;
  const f=0.55, fw=hw*f, fh=hh*f;
  const fossa =
    `M 0,${-fh*0.82} C ${fw*0.75},${-fh*0.42} ${fw*0.82},${fh*0.22} ${fw*0.55},${fh*0.82} ` +
    `C ${-fw*0.55},${fh*0.82} ${-fw*0.82},${fh*0.22} ${-fw*0.75},${-fh*0.42} ` +
    `C ${-fw*0.18},${-fh*1.04} 0,${-fh*0.82} 0,${-fh*0.82} Z`;
  return {
    outer, fossa,
    grooves: [{ x1:hw*0.02,y1:-hh*0.5,x2:hw*0.02,y2:hh*0.46,lw:0.8 }],
    highlights: [{ cx:0,cy:-hh*0.72,rx:hw*0.22,ry:hh*0.18 }],
    cusps: [{ cx:0,cy:-hh*0.82,r:2.2 }],
  };
}

function lateralShape(w: number, h: number): ToothShape {
  const hw=w/2, hh=h/2;
  const outer =
    `M ${-hw*0.58},${-hh} C ${hw*0.12},${-hh*1.06} ${hw*0.88},${-hh*0.72} ${hw*0.92},${-hh*0.18} ` +
    `C ${hw*0.90},${hh*0.38} ${hw*0.62},${hh*1.02} ${hw*0.08},${hh} ` +
    `L ${-hw*0.08},${hh} C ${-hw*0.62},${hh*1.02} ${-hw*0.90},${hh*0.38} ${-hw*0.92},${-hh*0.18} ` +
    `C ${-hw*0.88},${-hh*0.72} ${-hw*0.12},${-hh*1.06} ${-hw*0.58},${-hh} Z`;
  const f=0.52, fw=hw*f, fh=hh*f;
  const fossa =
    `M ${-fw*0.52},${-fh} C ${fw*0.52},${-fh} ${fw*0.86},${-fh*0.18} ${fw*0.82},${fh*0.42} ` +
    `C ${fw*0.58},${fh} ${-fw*0.58},${fh} ${-fw*0.82},${fh*0.42} ` +
    `C ${-fw*0.86},${-fh*0.18} ${-fw*0.52},${-fh} ${-fw*0.52},${-fh} Z`;
  return {
    outer, fossa,
    grooves: [{ x1:hw*0.02,y1:-hh*0.44,x2:hw*0.02,y2:hh*0.42,lw:0.7 }],
    highlights: [{ cx:0,cy:-hh*0.55,rx:hw*0.38,ry:hh*0.18 }],
    cusps: [],
  };
}

function centralShape(w: number, h: number): ToothShape {
  const hw=w/2, hh=h/2;
  const outer =
    `M ${-hw*0.72},${-hh} C ${hw*0.05},${-hh*1.08} ${hw*0.88},${-hh*0.68} ${hw*0.95},${-hh*0.12} ` +
    `C ${hw*0.90},${hh*0.48} ${hw*0.65},${hh*1.02} ${hw*0.18},${hh} ` +
    `L ${-hw*0.18},${hh} C ${-hw*0.65},${hh*1.02} ${-hw*0.90},${hh*0.48} ${-hw*0.95},${-hh*0.12} ` +
    `C ${-hw*0.88},${-hh*0.68} ${-hw*0.05},${-hh*1.08} ${-hw*0.72},${-hh} Z`;
  const f=0.52, fw=hw*f, fh=hh*f;
  const fossa =
    `M ${-fw*0.68},${-fh} C ${fw*0.68},${-fh} ${fw*0.90},${-fh*0.12} ${fw*0.86},${fh*0.5} ` +
    `C ${fw*0.62},${fh} ${-fw*0.62},${fh} ${-fw*0.86},${fh*0.5} ` +
    `C ${-fw*0.90},${-fh*0.12} ${-fw*0.68},${-fh} ${-fw*0.68},${-fh} Z`;
  return {
    outer, fossa,
    grooves: [{ x1:hw*0.02,y1:-hh*0.4,x2:hw*0.02,y2:hh*0.4,lw:0.7 }],
    highlights: [{ cx:0,cy:-hh*0.52,rx:hw*0.48,ry:hh*0.2 }],
    cusps: [],
  };
}

// ─────────────────────────────────────────────
// Tooth layout table [num, cx, cy, w, h, fn, rot, lx, ly]
// ─────────────────────────────────────────────

type ShapeFn = (w: number, h: number) => ToothShape;

const TOOTH_DATA: [number, number, number, number, number, ShapeFn, number, number, number][] = [
  [1,  42.1,160.9,16,19,molarShape,    182.5, 18.0,160.0],
  [2,  46.2,137.0,18,21,molarShape,    197.0, 20.0,128.0],
  [3,  56.4,114.3,20,22,molarShape,    210.9, 31.0, 99.0],
  [4,  72.1, 93.7,14,18,premolarShape, 223.6, 53.0, 76.0],
  [5,  92.8, 76.0,13,17,premolarShape, 235.2, 78.0, 55.0],
  [6, 117.5, 62.1,11,18,canineShape,   245.9,105.0, 38.0],
  [7, 145.2, 52.5,10,14,lateralShape,  255.8,138.0, 29.0],
  [8, 174.9, 47.6,11,13,centralShape,  265.3,172.0, 24.0],
  [9, 205.1, 47.6,11,13,centralShape,  -85.3,208.0, 24.0],
  [10,234.8, 52.5,10,14,lateralShape,  -75.8,242.0, 29.0],
  [11,262.5, 62.1,11,18,canineShape,   -65.9,275.0, 38.0],
  [12,287.2, 76.0,13,17,premolarShape, -55.2,302.0, 55.0],
  [13,307.9, 93.7,14,18,premolarShape, -43.6,327.0, 76.0],
  [14,323.6,114.3,20,22,molarShape,    -30.9,349.0, 99.0],
  [15,333.8,137.0,18,21,molarShape,    -17.0,360.0,128.0],
  [16,337.9,160.9,16,19,molarShape,     -2.5,362.0,160.0],
  [32, 42.1,199.1,16,19,molarShape,     -2.5, 18.0,200.0],
  [31, 46.2,223.0,18,21,molarShape,    -17.0, 20.0,232.0],
  [30, 56.4,245.7,20,22,molarShape,    -30.9, 31.0,261.0],
  [29, 72.1,266.3,14,18,premolarShape, -43.6, 53.0,284.0],
  [28, 92.8,284.0,13,17,premolarShape, -55.2, 78.0,305.0],
  [27,117.5,297.9,11,18,canineShape,   -65.9,105.0,322.0],
  [26,145.2,307.5,10,14,lateralShape,  -75.8,138.0,331.0],
  [25,174.9,312.4,10,13,centralShape,  -85.3,172.0,336.0],
  [24,205.1,312.4,10,13,centralShape,  -94.7,208.0,336.0],
  [23,234.8,307.5,10,14,lateralShape, -104.2,242.0,331.0],
  [22,262.5,297.9,11,18,canineShape,  -114.1,275.0,322.0],
  [21,287.2,284.0,13,17,premolarShape,-124.8,302.0,305.0],
  [20,307.9,266.3,14,18,premolarShape,-136.4,327.0,284.0],
  [19,323.6,245.7,20,22,molarShape,   -149.1,349.0,261.0],
  [18,333.8,223.0,18,21,molarShape,   -163.0,360.0,232.0],
  [17,337.9,199.1,16,19,molarShape,   -177.5,362.0,200.0],
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const TeethDiagram: React.FC<TeethDiagramProps> = ({ selectedTeeth, onToothToggle }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  /* Keep SVG selection state in sync */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGGElement>('.td-tooth').forEach(g => {
      const num = parseInt(g.dataset.tooth ?? '0', 10);
      g.classList.toggle('td-tooth--selected', selectedTeeth.has(num));
    });
  }, [selectedTeeth]);

  const buildSVG = useCallback((svg: SVGSVGElement) => {
    if (!svg || svg.dataset.built) return;
    svg.dataset.built = '1';

    const ns = 'http://www.w3.org/2000/svg';
    const mk = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };

    /* Defs */
    const defs = mk('defs', {});
    const mkFilter = (id: string, color: string, dev: string) => {
      const f = mk('filter', { id, x: '-40%', y: '-40%', width: '180%', height: '180%' });
      const fe = mk('feDropShadow', { dx: '0', dy: '0', stdDeviation: dev, 'flood-color': color });
      f.appendChild(fe); defs.appendChild(f);
    };
    mkFilter('td-shadow', 'rgba(0,0,0,0.25)', '2');
    mkFilter('td-glow', 'rgba(59,130,246,0.85)', '4');

    const mkRG = (id: string, stops: [string, string][]) => {
      const g = mk('radialGradient', { id, cx: '35%', cy: '28%', r: '70%', gradientUnits: 'objectBoundingBox' });
      stops.forEach(([off, col]) => { const s = mk('stop', { offset: off, 'stop-color': col }); g.appendChild(s); });
      defs.appendChild(g);
    };
    mkRG('td-fill',  [['0','#fffff8'],['0.45','#f5efdc'],['1','#d8cca8']]);
    mkRG('td-hover', [['0','#ffffff'],['0.45','#f0eaff'],['1','#c8b8f8']]);
    mkRG('td-sel',   [['0','#e8f4ff'],['0.45','#bfdbfe'],['1','#7fb3f8']]);
    mkRG('td-fossa', [['0','#ece0b8'],['0.6','#d8c890'],['1','#c4b478']]);
    svg.appendChild(defs);

    /* Midline */
    svg.appendChild(mk('line', { x1:'190',y1:'12',x2:'190',y2:'350',stroke:'rgba(148,163,184,0.2)','stroke-width':'1','stroke-dasharray':'5,7' }));

    /* Arch labels */
    [['UPPER','190','8'],['LOWER','190','358']].forEach(([t,x,y]) => {
      const txt = mk('text', { x, y, 'text-anchor':'middle','font-size':'7.5',fill:'rgba(100,116,139,0.5)','font-family':'Outfit,sans-serif','font-weight':'700','letter-spacing':'2','pointer-events':'none' });
      txt.textContent = t; svg.appendChild(txt);
    });

    /* Teeth */
    TOOTH_DATA.forEach(([num, cx, cy, w, h, shapeFn, rot, lx, ly]) => {
      const shape = shapeFn(w, h);
      const tf = `translate(${cx},${cy}) rotate(${rot})`;
      const g = mk('g', { class: 'td-tooth', 'data-tooth': String(num), tabindex: '0', role: 'button', 'aria-label': `Tooth ${num}` }) as SVGGElement;

      g.appendChild(Object.assign(mk('path', { d:shape.outer, transform:tf, fill:'url(#td-fill)', stroke:'#c0af88', 'stroke-width':'0.95', 'stroke-linejoin':'round', class:'td-outer' }), {}));
      g.appendChild(mk('path', { d:shape.fossa, transform:tf, fill:'url(#td-fossa)', stroke:'#b8a870', 'stroke-width':'0.45' }));

      shape.highlights.forEach(hl => {
        g.appendChild(mk('ellipse', { cx:String(hl.cx), cy:String(hl.cy), rx:String(hl.rx), ry:String(hl.ry), fill:'rgba(255,255,255,0.55)', transform:tf }));
      });
      shape.grooves.forEach(gr => {
        g.appendChild(mk('line', { x1:String(gr.x1), y1:String(gr.y1), x2:String(gr.x2), y2:String(gr.y2), stroke:'#b0a070', 'stroke-width':String(gr.lw??0.85), 'stroke-linecap':'round', transform:tf }));
      });
      shape.cusps.forEach(cu => {
        g.appendChild(mk('circle', { cx:String(cu.cx), cy:String(cu.cy), r:String(cu.r), fill:'rgba(168,148,95,0.42)', transform:tf }));
      });
      g.appendChild(mk('path', { d:shape.outer, transform:tf, fill:'none', stroke:'rgba(255,255,255,0.45)', 'stroke-width':'0.8', 'stroke-dasharray':`${w*1.4} ${w*10}`, 'stroke-linecap':'round' }));

      const txt = mk('text', { x:String(lx), y:String(ly), 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':'8.5', 'font-weight':'600', fill:'rgba(71,85,105,0.75)', 'font-family':'DM Mono,monospace', 'pointer-events':'none' });
      txt.textContent = String(num);
      g.appendChild(txt);

      g.addEventListener('click', () => onToothToggle(num));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToothToggle(num); } });
      svg.appendChild(g);
    });

    /* Scoped CSS */
    const style = mk('style', {});
    style.textContent = `
      .td-tooth{cursor:pointer;outline:none;}
      .td-tooth .td-outer{transition:fill 0.18s,stroke 0.18s,stroke-width 0.18s;}
      .td-tooth:focus-visible .td-outer{stroke:#6366f1!important;stroke-width:1.5px;}
      .td-tooth:hover .td-outer{fill:url(#td-hover)!important;stroke:#93c5fd!important;stroke-width:1.2px;}
      .td-tooth--selected .td-outer{fill:url(#td-sel)!important;stroke:#2563eb!important;stroke-width:1.5px;filter:drop-shadow(0 0 5px rgba(59,130,246,0.7));}
    `;
    svg.appendChild(style);
  }, [onToothToggle]);

  const svgCallback = useCallback((node: SVGSVGElement | null) => {
    if (node) { svgRef.current = node; buildSVG(node); }
  }, [buildSVG]);

  const sortedSelected = Array.from(selectedTeeth).sort((a, b) => a - b);

  return (
    <div className="td-container">
      <div className="td-header">
        <span className="td-title">Select Teeth</span>
        <div className="td-legend">
          <div className="td-legend-item"><span className="td-legend-dot td-legend-dot--normal" /><span>Available</span></div>
          <div className="td-legend-item"><span className="td-legend-dot td-legend-dot--selected" /><span>Selected</span></div>
        </div>
      </div>

      <div className="td-svg-wrap">
        <svg
          ref={svgCallback as any}
          viewBox="0 0 380 362"
          className="td-svg"
          aria-label="Dental chart — click a tooth to select"
          role="img"
        />
      </div>

      <div className="td-selected-section">
        <span className="td-selected-label">Selected Teeth</span>
        <div className="td-selected-list">
          {sortedSelected.length === 0 ? (
            <span className="td-none">None selected</span>
          ) : (
            sortedSelected.map(n => (
              <button key={n} className="td-badge" onClick={() => onToothToggle(n)} aria-label={`Deselect tooth ${n}`} title="Click to deselect">
                {n}
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeethDiagram;