import { useState } from "react";
import { Flower } from "./flowers";

/*
  A hand-tied bouquet that blooms in under the letter.
  Heads reuse the same flowers as the garden (g = color 0-5, type 0 daisy / 1 layered / 2 blossom).
  Tap it and the blooms pop. Edit HEADS to rearrange: cx, cy = center of the bloom in a 240 x 260 box.
*/
const W = 240, H = 260;
const ANCHOR = [120, 214]; // where all the stems meet, inside the paper cone

const HEADS = [
  { cx: 120, cy: 56,  size: 90, g: 2, type: 1 },
  { cx: 62,  cy: 92,  size: 74, g: 3, type: 0 },
  { cx: 178, cy: 92,  size: 74, g: 1, type: 2 },
  { cx: 28,  cy: 140, size: 56, g: 4, type: 2 },
  { cx: 212, cy: 140, size: 56, g: 0, type: 0 },
  { cx: 90,  cy: 132, size: 62, g: 5, type: 1 },
  { cx: 150, cy: 132, size: 62, g: 3, type: 1 },
];

// small leaves tucked between the stems: [x, y, rotation, scale]
const LEAVES = [
  [84, 168, -52, 1], [156, 168, 52, 1], [58, 150, -72, .8], [182, 150, 72, .8], [120, 150, 0, .9],
];

const leaf = "M0 0C-9 -10 -8 -26 0 -38C8 -26 9 -10 0 0Z";

export default function Bouquet({ note }) {
  const [pop, setPop] = useState(0);
  return (
    <figure className="bouquet" aria-label="A bouquet of flowers for you">
      <button
        type="button"
        className={`bq${pop ? " pop" : ""}`}
        key={pop}
        style={{ width: W, height: H }}
        onClick={() => setPop((n) => n + 1)}
        aria-label="Bouquet. Tap to make the flowers bounce."
      >
        <svg className="bq-art" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
          <defs>
            <linearGradient id="bqPaper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#b9dbf7" />
            </linearGradient>
            <linearGradient id="bqPaperIn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8fc4ee" />
              <stop offset="1" stopColor="#3d7ed0" />
            </linearGradient>
            <linearGradient id="bqLeaf" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#2f7d78" />
              <stop offset="1" stopColor="#6cc3ad" />
            </linearGradient>
            <filter id="bqShadow" x="-20%" y="-10%" width="140%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#030a28" floodOpacity=".35" />
            </filter>
          </defs>

          {/* stems fan out from one point to every bloom */}
          {HEADS.map((h, i) => (
            <path
              key={i}
              d={`M${ANCHOR[0]} ${ANCHOR[1]}Q${(ANCHOR[0] + h.cx) / 2} ${(ANCHOR[1] + h.cy) / 2 + 22} ${h.cx} ${h.cy}`}
              fill="none" stroke="#3f9488" strokeWidth="3" strokeLinecap="round"
            />
          ))}
          {LEAVES.map(([x, y, r, s], i) => (
            <path key={i} d={leaf} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
              fill="url(#bqLeaf)" stroke="rgba(10,50,60,.35)" strokeWidth=".8" />
          ))}

          {/* paper cone: back sheet, front sheet, fold line */}
          <g filter="url(#bqShadow)">
            <path d="M120 252L40 158Q120 138 200 158Z" fill="url(#bqPaperIn)" />
            <path d="M120 252L56 164Q104 152 150 160Q176 164 200 158Z" fill="url(#bqPaper)" stroke="rgba(20,55,120,.22)" strokeWidth=".8" />
            <path d="M120 252L96 160M120 252L150 160" stroke="rgba(20,55,120,.14)" strokeWidth="1" fill="none" />
          </g>

          {/* ribbon bow, same red as the wax seal */}
          <g transform="translate(120 205)">
            <path d="M0 0C-14 -16 -34 -12 -30 0C-28 12 -10 10 0 0Z" fill="#d92b3a" stroke="rgba(120,10,25,.45)" strokeWidth=".8" />
            <path d="M0 0C14 -16 34 -12 30 0C28 12 10 10 0 0Z" fill="#e8434f" stroke="rgba(120,10,25,.45)" strokeWidth=".8" />
            <path d="M-3 3L-14 30L-6 26L-1 32ZM3 3L14 30L6 26L1 32Z" fill="#b81e2c" />
            <circle r="5.5" fill="#ff6a76" stroke="rgba(120,10,25,.5)" strokeWidth=".8" />
          </g>
        </svg>

        {HEADS.map((h, i) => (
          <span
            key={i}
            className="bq-head"
            style={{ left: h.cx - h.size / 2, top: h.cy - h.size / 2, "--i": i, "--s": `${(i % 2 ? -1 : 1) * (3 + (i % 3))}deg` }}
          >
            <Flower size={h.size} g={h.g} type={h.type} />
          </span>
        ))}
      </button>
      {note && <figcaption>{note}</figcaption>}
    </figure>
  );
}
