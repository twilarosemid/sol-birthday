import { useState } from "react";
import { rnd } from "./flowers";

/* ---------- Night sky: twinkling stars, soft glowing orbs, an occasional shooting star ---------- */
export function Sky() {
  const [{ stars, orbs }] = useState(() => ({
    stars: Array.from({ length: 46 }, (_, i) => {
      const big = i % 6 === 0;
      const s = big ? rnd(10, 16) : rnd(1.5, 3.5);
      return { big, style: { left: `${rnd(0, 100)}%`, top: `${rnd(0, 72)}%`, width: s, height: s, "--t": `${rnd(1.8, 4.5).toFixed(1)}s`, animationDelay: `${(-rnd(0, 5)).toFixed(1)}s` } };
    }),
    orbs: Array.from({ length: 7 }, () => {
      const s = rnd(220, 440);
      return { style: { left: `${rnd(-10, 95)}%`, top: `${rnd(-10, 90)}%`, width: s, height: s, "--dx": `${rnd(-60, 60) | 0}px`, "--dy": `${rnd(-50, 50) | 0}px`, "--t": `${rnd(16, 30).toFixed(0)}s`, animationDelay: `${(-rnd(0, 20)).toFixed(0)}s` } };
    }),
  }));
  return (
    <div className="amb sky" aria-hidden="true">
      {orbs.map((o, i) => <i key={i} className="orb" style={o.style} />)}
      {stars.map((s, i) => <i key={i} className={`star${s.big ? " big" : ""}`} style={s.style} />)}
      <i className="shoot" />
    </div>
  );
}

/* ---------- Butterflies: two wing images that flap, drifting along looping paths ---------- */
const PAL = [["#ffffff", "#9fd3f7", "#3f7fd0"], ["#eef8ff", "#6fb4ee", "#17408f"], ["#ffffff", "#c4e5fb", "#5aa6e8"]];
const wings = new Map();
function wingSrc(k) {
  if (wings.has(k)) return wings.get(k);
  const p = PAL[k];
  const stroke = `fill="url(#w)" stroke="rgba(10,26,63,.35)" stroke-width=".8"`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60"><defs><radialGradient id="w" cx="0" cy=".5" r="1"><stop offset="0" stop-color="${p[2]}"/><stop offset=".55" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[0]}"/></radialGradient></defs><path d="M0 28C6 -4 44 -6 48 14C50 26 28 32 0 30Z" ${stroke}/><path d="M0 31C24 32 42 36 38 50C34 62 10 58 0 36Z" ${stroke}/><circle cx="30" cy="14" r="3.2" fill="#fff" opacity=".8"/><circle cx="24" cy="46" r="2.4" fill="#fff" opacity=".7"/></svg>`;
  const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  wings.set(k, src);
  return src;
}

export function Butterflies() {
  const [list] = useState(() =>
    Array.from({ length: 5 }, (_, i) => {
      const style = { "--t": `${rnd(34, 52).toFixed(0)}s`, animationDelay: `${(-rnd(0, 40)).toFixed(0)}s` };
      for (let n = 0; n < 4; n++) { style[`--x${n}`] = `${rnd(2, 90).toFixed(0)}vw`; style[`--y${n}`] = `${rnd(6, 84).toFixed(0)}vh`; }
      return { k: i % 3, s: rnd(38, 62), style };
    })
  );
  return (
    <div className="amb bflies" aria-hidden="true">
      {list.map((b, i) => (
        <div key={i} className="bf" style={b.style}>
          <div className="bfi" style={{ width: b.s, height: b.s * 0.6 }}>
            <span className="wg wl"><img src={wingSrc(b.k)} alt="" draggable={false} /></span>
            <b className="bd" />
            <span className="wg wr"><img src={wingSrc(b.k)} alt="" draggable={false} /></span>
          </div>
        </div>
      ))}
    </div>
  );
}
