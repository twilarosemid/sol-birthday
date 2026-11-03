import { useCallback, useEffect, useRef, useState } from "react";
import * as cfg from "./config";
import { Garden, Burst } from "./flowers";
import { Sky, Butterflies } from "./ambient";
import { useMusic } from "./music";
import Recap from "./recap";

const { NAME, FROM, MESSAGE, BIRTHDAY } = cfg;
const REPLY_IG = cfg.REPLY_IG ?? "";
const IG_URL = REPLY_IG ? `https://ig.me/m/${REPLY_IG}` : "";

// Optional: add `export const PS = "..."` to config.js to change this
const PS = cfg.PS ?? "P.S. Please don’t make a wish out loud. It’s bad luck, and I’m not a genie.";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MAX = 70; // how far the envelope can be pulled from the center
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---------- the wit lives here: edit freely ----------
const HINTS = [
  "Something for you. Probably not a bill.",
  "Music starts on your first tap. Browsers insist.",
  "Tap the seal. It’s friendlier than it looks.",
  "Go on, drag a flower. They’re used to it.",
  "Pro tip: shake the envelope. See what happens.",
  "No pressure. The letter isn’t going anywhere.",
];
const GRAB = ["Hey. Hands off the petals.", "I just got here.", "Careful, I’m sensitive.", "Is this about the pollen?", "Pick me! …Not like that."];
const TOSS = ["Wheeee.", "I regret nothing.", "Tell my bees I loved them.", "Is this what flying feels like?"];
const BOUNCE = ["Boing.", "Ow. Wall.", "Screen edge: 1, flower: 0.", "Nailed the landing."];
const SHAKE = ["Easy. I’m an envelope, not a snow globe.", "Nothing rattles in here. It’s all feelings.", "Shake all you want. It’s not that kind of letter."];
const WRONG = [
  "Nope. Did you forget your own birthday?",
  "Still no. Bold of you to keep guessing.",
  "That’s three. Check your ID, I’ll wait.",
  "Hint: Scorpio season.",
  "Okay, I’m starting to doubt you’re the right person.",
];

// The envelope: drag it, it stretches like elastic, tilts by where you hold it, and springs back
function Envelope({ open, onSeal, sealRef, onShake }) {
  const el = useRef(null);
  const s = useRef({ flips: [] });
  const down = (e) => {
    const r = el.current.getBoundingClientRect();
    Object.assign(s.current, {
      dr: true, moved: false, dt: e.target, sx: e.clientX, sy: e.clientY, lx: e.clientX, sign: 0, flips: [],
      side: (e.clientX - (r.left + r.width / 2)) / (r.width / 2),
    });
    el.current.setPointerCapture(e.pointerId);
    el.current.style.transition = "none";
  };
  const move = (e) => {
    const k = s.current;
    if (!k.dr) return;
    const dx = e.clientX - k.sx, dy = e.clientY - k.sy, d = Math.hypot(dx, dy) || 1;
    if (d > 6) k.moved = true;
    const f = (MAX * Math.tanh(d / MAX)) / d;
    el.current.style.translate = `${dx * f}px ${dy * f}px`;
    el.current.style.rotate = `${dx * 0.05 + k.side * dy * 0.07}deg`;
    // shake detection: lots of quick left/right reversals
    const step = e.clientX - k.lx;
    if (Math.abs(step) > 3) {
      k.lx = e.clientX;
      const sign = Math.sign(step), now = performance.now();
      if (k.sign && sign !== k.sign) {
        k.flips.push(now);
        k.flips = k.flips.filter((t) => now - t < 1200);
        if (k.flips.length >= 5) {
          k.flips = [];
          const r = el.current.getBoundingClientRect();
          onShake(r.left + r.width / 2, r.top);
        }
      }
      k.sign = sign;
    }
  };
  const up = (e) => {
    const k = s.current;
    if (!k.dr) return;
    k.dr = false;
    const spring = "translate .8s cubic-bezier(.3,1.8,.5,1), rotate .8s cubic-bezier(.3,1.8,.5,1)";
    Object.assign(el.current.style, { transition: spring, translate: "0 0", rotate: "0deg" });
    if (e.type === "pointerup" && !k.moved && k.dt?.closest(".seal")) onSeal();
  };
  return (
    <div ref={el} className={`env${open ? " open" : ""}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="back" />
      <div className="letter" />
      <div className="pocket"><i /><i /><i /></div>
      <div className="flap" />
      <button ref={sealRef} className="seal" aria-label="Open the letter" onClick={onSeal}>OPEN</button>
    </div>
  );
}

// The question that unlocks the letter
function Gate({ show, onUnlock, onCancel }) {
  const [day, setDay] = useState(""), [month, setMonth] = useState(""), [year, setYear] = useState("");
  const [err, setErr] = useState(""), [shake, setShake] = useState(false), [tries, setTries] = useState(0);
  const dayRef = useRef(null);
  useEffect(() => { if (show) dayRef.current?.focus(); }, [show]);
  const submit = (e) => {
    e.preventDefault();
    const d = +day, m = +month, y = +year;
    const dm = d === BIRTHDAY.day && m === BIRTHDAY.month;
    if (dm && y === BIRTHDAY.year) { setErr(""); onUnlock(); return; }
    const n = tries + 1;
    setTries(n);
    setShake(true);
    setErr(
      dm ? "Right day and month, wrong year. Time travel isn’t supported yet."
        : y === BIRTHDAY.year ? "Right year, wrong day. So close, yet so far."
        : WRONG[Math.min(n - 1, WRONG.length - 1)]
    );
  };
  return (
    <section className={`card${show ? " show" : ""}`} role="dialog" aria-label="Unlock the letter">
      <div className={`paper${shake ? " shake" : ""}`} onAnimationEnd={() => setShake(false)}>
        <h1 style={{ fontSize: "clamp(1.7rem,6vw,2.2rem)" }}>Hold on. Security check.</h1>
        <p className="msg" style={{ minHeight: 0, textAlign: "center", marginTop: 14 }}>Prove you’re the birthday person. When’s your birthday?</p>
        <form onSubmit={submit}>
          <div className="row">
            <input ref={dayRef} type="number" min="1" max="31" placeholder="Day" inputMode="numeric" required aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)} />
            <select required aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Month</option>
              {MONTHS.map((n, i) => <option key={n} value={i + 1}>{n}</option>)}
            </select>
            <input type="number" min="1900" max="2100" placeholder="Year" inputMode="numeric" required aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <p className="err" role="alert">{err}</p>
          <div className="btns">
            <button type="submit" className="again solid">Unlock</button>
            <button type="button" className="again" onClick={onCancel}>Never mind</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [gate, setGate] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [recap, setRecap] = useState(false);
  const [replying, setReplying] = useState(false);
  const [typed, setTyped] = useState("");
  const [burst, setBurst] = useState(null);
  const [hi, setHi] = useState(0);
  const [bubble, setBubble] = useState(null);
  const [harassed, setHarassed] = useState(0);
  const sealRef = useRef(null);
  const bt = useRef(0);
  const music = useMusic();

  // little speech bubbles
  const say = useCallback((text, x, y) => {
    clearTimeout(bt.current);
    setBubble({ text, x, y, k: Date.now() });
    bt.current = setTimeout(() => setBubble(null), 2200);
  }, []);
  const on = useRef({
    grab: (x, y) => { setHarassed((n) => n + 1); if (Math.random() < 0.3) say(pick(GRAB), x, y); },
    toss: (x, y) => { if (Math.random() < 0.6) say(pick(TOSS), x, y); },
    bounce: (x, y) => { if (Math.random() < 0.5) say(pick(BOUNCE), x, y); },
  }).current;

  // rotating hint under the envelope
  useEffect(() => {
    if (open || gate) return;
    const t = setInterval(() => setHi((i) => (i + 1) % HINTS.length), 5200);
    return () => clearInterval(t);
  }, [open, gate]);

  const openLetter = () => {
    const r = sealRef.current.getBoundingClientRect();
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2, k: Date.now() });
    setOpen(true);
    music.birthday();
    setTimeout(() => setShowCard(true), 1900);
  };
  const ask = () => {
    if (open) return;
    if (unlocked) return openLetter();
    setGate(true);
  };
  const unlock = () => { setUnlocked(true); setGate(false); setTimeout(openLetter, 450); };

  // pause the background motion while the question or letter is on screen
  useEffect(() => {
    document.documentElement.classList.toggle("calm", showCard || gate || recap);
  }, [showCard, gate, recap]);

  // typewriter
  useEffect(() => {
    if (!showCard) return;
    let i = 0;
    setTyped("");
    const t = setInterval(() => { i++; setTyped(MESSAGE.slice(0, i)); if (i >= MESSAGE.length) clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [showCard]);

  // paper tucks in first, then the flap closes (see CSS delays)
  const closeCard = () => {
    setShowCard(false);
    setTimeout(() => { setReplying(false); setOpen(false); }, 600);
  };

  const bx = bubble ? Math.min(Math.max(bubble.x, 100), innerWidth - 100) : 0;
  const by = bubble ? Math.max(bubble.y, 56) : 0;

  return (
    <>
      <Sky />
      <Garden on={on} />
      <Butterflies />
      {burst && <Burst key={burst.k} origin={burst} />}
      <main className="stage">
        <Envelope open={open} onSeal={ask} sealRef={sealRef} onShake={(x, y) => say(pick(SHAKE), x, y)} />
        <p className="hint" style={{ opacity: open ? 0 : 1 }}><span key={hi}>{HINTS[hi]}</span></p>
      </main>

      {bubble && <div key={bubble.k} className="bubble" style={{ left: bx, top: by }}>{bubble.text}</div>}
      <p className="chip">
        Flowers harassed: {harassed}
        {harassed >= 30 ? " (they’ve unionized)" : harassed >= 10 ? " (HR has been notified)" : ""}
      </p>

      <button className="mbtn" onClick={music.toggle} aria-label={music.on ? "Mute music" : "Play music"} aria-pressed={music.on}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          {music.on ? <><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" /></> : <path d="M17 9l5 6M22 9l-5 6" />}
        </svg>
      </button>

      <Gate show={gate} onUnlock={unlock} onCancel={() => setGate(false)} />

      <section className={`card${showCard ? " show" : ""}`} role="dialog" aria-label="Birthday message">
        <div className={`paper${replying ? " replying" : ""}`}>
          <h1>Happy Birthday, {NAME}</h1>
          <p className="msg">{typed}</p>
          <p className="sign">— {FROM}</p>
          {typed.length >= MESSAGE.length && <p className="ps">{PS}</p>}
          <div className="btns pre">
            <button className="again solid" onClick={() => setRecap(true)}>Replay our memories</button>
            <button className="again" onClick={() => setReplying(true)}>Fold it back up</button>
          </div>
          <div id="reply">
            <p className="msg ask" style={{ minHeight: 0, textAlign: "center" }}>Before you go, want to say something back? Come find me on Instagram.</p>
            <div className="btns opts">
              {IG_URL && <a className="again solid" href={IG_URL} target="_blank" rel="noopener noreferrer">Message me on Instagram</a>}
              <button className="again" onClick={closeCard}>Close</button>
            </div>
          </div>
        </div>
      </section>

      <Recap show={recap} onClose={() => setRecap(false)} />
    </>
  );
}