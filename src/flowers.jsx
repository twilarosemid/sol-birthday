import { useEffect, useRef, useState } from "react";

// [tip, base] colors, navy to sky
const T = [["#ffffff","#b9dbf7"],["#eef8ff","#8fc4ee"],["#d2ebff","#5ea8e6"],["#aedafb","#3d7ed0"],["#84bcf0","#254f9b"],["#ffffff","#a3c6ee"]];
const P = [
  "M50 50C38 42 36 14 50 3C64 14 62 42 50 50Z",
  "M50 50C28 44 28 12 50 8C72 12 72 44 50 50Z",
  "M50 50C26 42 24 14 43 7L50 15L57 7C76 14 74 42 50 50Z",
];
export const rnd = (a, b) => a + Math.random() * (b - a);

// Each flower is drawn once as an SVG, then used as a plain image.
// Moving or animating an image is far cheaper than animating dozens of live SVG paths.
const cache = new Map();
const ring = (d, n, rot, sc, gi) =>
  Array.from({ length: n }, (_, i) =>
    `<g transform="rotate(${rot + (i * 360) / n} 50 50) translate(50 50) scale(${sc}) translate(-50 -50)"><path d="${d}" fill="url(#g${gi})" stroke="rgba(20,55,120,.22)" stroke-width=".7"/><path d="M50 46V16" stroke="rgba(30,70,150,.16)" stroke-width=".8" fill="none"/></g>`
  ).join("");

function flowerSrc(g, type) {
  const key = g + "-" + type;
  if (cache.has(key)) return cache.get(key);
  let body = "";
  if (type === 0) {
    body = ring(P[0], 16, 0, 1, g) + ring(P[0], 16, 11, 0.72, (g + 1) % 6) + `<circle cx="50" cy="50" r="9" fill="url(#ctr)"/>` +
      [0,1,2,3,4,5,6].map((i) => `<circle cx="${50 + 4.5 * Math.cos(i)}" cy="${50 + 4.5 * Math.sin(i * 2.1)}" r="1.1" fill="#b57a10"/>`).join("");
  } else if (type === 1) {
    body = ring(P[1], 8, 0, 1, g) + ring(P[1], 7, 20, 0.8, g) + ring(P[1], 6, 10, 0.58, (g + 2) % 6) + ring(P[1], 5, 30, 0.36, (g + 2) % 6) + `<circle cx="50" cy="50" r="3.5" fill="url(#ctr)"/>`;
  } else {
    body = ring(P[2], 5, 0, 1, g) + ring(P[2], 5, 36, 0.5, (g + 1) % 6) +
      [0,1,2,3,4,5,6,7].map((i) => {
        const x = 50 + 13 * Math.cos(i * 0.785), y = 50 + 13 * Math.sin(i * 0.785);
        return `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="#d9a02b" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.6" fill="#e3a82c"/>`;
      }).join("") + `<circle cx="50" cy="50" r="4" fill="url(#ctr)"/>`;
  }
  const defs = T.map((t, i) => `<radialGradient id="g${i}" cx=".5" cy="1" r="1"><stop offset="0" stop-color="${t[1]}"/><stop offset=".8" stop-color="${t[0]}"/></radialGradient>`).join("") +
    `<radialGradient id="ctr"><stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#e3a82c"/></radialGradient>` +
    `<filter id="sh" x="-20%" y="-20%" width="140%" height="145%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#030a28" flood-opacity=".35"/></filter>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 112 116"><defs>${defs}</defs><g filter="url(#sh)">${body}</g></svg>`;
  const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  cache.set(key, src);
  return src;
}

// type 0 = daisy, 1 = layered bloom, 2 = five-petal blossom
export function Flower({ size, g, type }) {
  return <img src={flowerSrc(g, type)} width={size} height={size} alt="" draggable={false} decoding="async" />;
}

let topZ = 5;

// A flower you can pick up, move around, and throw: it keeps gliding after you let go
function DraggableFlower({ f, on }) {
  const el = useRef(null);
  const s = useRef({ on: false, ox: 0, oy: 0, sx: 0, sy: 0, trail: [], raf: 0 });
  const [held, setHeld] = useState(false);
  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);
  const center = () => { const r = el.current.getBoundingClientRect(); return [r.left + r.width / 2, r.top]; };
  const place = () => { el.current.style.translate = `${s.current.ox}px ${s.current.oy}px`; };

  const down = (e) => {
    const k = s.current;
    cancelAnimationFrame(k.raf); // catch a flower that is still sliding
    k.on = true; k.sx = e.clientX - k.ox; k.sy = e.clientY - k.oy; k.trail = [];
    e.currentTarget.setPointerCapture(e.pointerId);
    el.current.style.zIndex = ++topZ;
    setHeld(true);
    on?.grab(...center());
  };
  const move = (e) => {
    const k = s.current;
    if (!k.on) return;
    k.ox = e.clientX - k.sx; k.oy = e.clientY - k.sy;
    const now = performance.now();
    k.trail.push({ x: k.ox, y: k.oy, t: now });
    while (k.trail.length > 2 && now - k.trail[0].t > 100) k.trail.shift(); // keep ~100ms of motion
    place();
  };
  const up = () => {
    const k = s.current;
    if (!k.on) return;
    k.on = false; setHeld(false);
    // release speed = how fast the pointer was moving just before letting go
    const now = performance.now(), a = k.trail[0], b = k.trail[k.trail.length - 1];
    let vx = 0, vy = 0;
    if (a && b && b.t > a.t && now - b.t < 80) {
      vx = (b.x - a.x) / (b.t - a.t); vy = (b.y - a.y) / (b.t - a.t);
      const sp = Math.hypot(vx, vy), cap = 3.5;
      if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
    }
    if (Math.hypot(vx, vy) < 0.05) return;
    if (Math.hypot(vx, vy) > 1.6) on?.toss(...center());
    let last = now, bounced = false;
    const hit = () => { if (!bounced) { bounced = true; on?.bounce(...center()); } };
    const step = (t) => {
      const dt = Math.min(t - last, 32); last = t;
      k.ox += vx * dt; k.oy += vy * dt;
      // bounce softly off the screen edges
      const r = el.current.getBoundingClientRect();
      if ((r.left < 0 && vx < 0) || (r.right > innerWidth && vx > 0)) { vx = -vx * 0.6; hit(); }
      if ((r.top < 0 && vy < 0) || (r.bottom > innerHeight && vy > 0)) { vy = -vy * 0.6; hit(); }
      const friction = Math.exp(-dt * 0.003); // lower number = longer glide
      vx *= friction; vy *= friction;
      place();
      if (Math.hypot(vx, vy) > 0.02) k.raf = requestAnimationFrame(step);
    };
    k.raf = requestAnimationFrame(step);
  };

  return (
    <div
      ref={el}
      className={`f${held ? " held" : ""}`}
      style={f.style}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <Flower size={f.size} g={f.g} type={f.type} />
    </div>
  );
}

function makeGarden() {
  const flowers = Array.from({ length: 30 }, (_, i) => ({
    size: rnd(40, 110), g: i % 6, type: i % 3,
    style: {
      left: `${rnd(-3, 95)}%`, top: `${rnd(-2, 90)}%`,
      "--o": rnd(0.6, 1).toFixed(2), "--r": `${rnd(-40, 40) | 0}deg`,
      "--d": `${rnd(3, 7).toFixed(1)}s`, "--b": `${(i * 0.09).toFixed(2)}s`,
    },
  }));
  const petals = Array.from({ length: 8 }, (_, i) => ({
    size: rnd(16, 26), g: i % 4, type: i % 3,
    style: {
      left: `${rnd(0, 100)}%`, "--x": `${rnd(-80, 80) | 0}px`,
      "--t": `${rnd(9, 16).toFixed(1)}s`, "--b": `${(-rnd(0, 14)).toFixed(1)}s`,
    },
  }));
  return { flowers, petals };
}

export function Garden({ on }) {
  const [{ flowers, petals }] = useState(makeGarden);
  return (
    <div id="garden" aria-hidden="true">
      {flowers.map((f, i) => <DraggableFlower key={i} f={f} on={on} />)}
      {petals.map((p, i) => (
        <div key={i} className="p" style={p.style}><Flower size={p.size} g={p.g} type={p.type} /></div>
      ))}
    </div>
  );
}

// Flowers that fly out of the seal when the letter opens
export function Burst({ origin }) {
  const [items] = useState(() =>
    Array.from({ length: 24 }, (_, i) => {
      const a = rnd(0, 6.28), k = rnd(120, Math.max(innerWidth, innerHeight) * 0.6);
      return { size: rnd(24, 60), g: i % 6, type: i % 3,
        style: { "--tx": `${Math.cos(a) * k}px`, "--ty": `${Math.sin(a) * k}px`, "--tr": `${rnd(-300, 300) | 0}deg` } };
    })
  );
  return (
    <div id="burst" aria-hidden="true">
      {items.map((b, i) => (
        <div key={i} className="b" style={{ left: origin.x, top: origin.y, ...b.style }}>
          <Flower size={b.size} g={b.g} type={b.type} />
        </div>
      ))}
    </div>
  );
}
