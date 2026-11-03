import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MEMORIES, RECAP_SECONDS, NAME } from "./config";
import { asset } from "./asset";
import { Burst } from "./flowers";

/*
  Replay: a full-screen, story-style slideshow.
    - tap right / left side (or arrow keys) = next / back
    - press and hold (or the pause button) = pause
    - auto-advances; the last slide stays put with two buttons
  Slides = intro + one per memory (see MEMORIES in config.js) + outro.
*/
const INTRO_SECONDS = 4;
const isVideo = (src) => /\.(mp4|webm|m4v|mov)(\?|$)/i.test(src);
const SLIDES = [{ kind: "intro" }, ...MEMORIES.map((m) => ({ kind: "photo", video: isVideo(m.src), ...m })), { kind: "outro" }];
const FAN = MEMORIES.filter((m) => !isVideo(m.src)); // the closing photo fan only shows photos
const LAST = SLIDES.length - 1;

const Icon = ({ d, fill }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function Recap({ show, onClose }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0); // bumps on "watch again" so progress bars restart
  const [ever, setEver] = useState(false);
  const hold = useRef({ t: 0, held: false });
  const closeBtn = useRef(null);
  const vids = useRef({});            // slide index -> <video>
  const [dur, setDur] = useState({}); // slide index -> video length in seconds

  // start from the top every time it opens (and only load the photos once it's first opened).
  // Layout effect = runs before paint, so the last slide never flashes on re-open.
  useLayoutEffect(() => {
    if (!show) return;
    setEver(true); setI(0); setPaused(false); setRun((n) => n + 1);
  }, [show]);
  useEffect(() => { if (show) closeBtn.current?.focus({ preventScroll: true }); }, [show, ever]);

  // videos: restart when their slide comes up, play only while visible and not paused
  useEffect(() => {
    const v = vids.current[i];
    if (show && v) { try { v.currentTime = 0; } catch {} }
  }, [i, run, show]);
  useEffect(() => {
    SLIDES.forEach((_, n) => {
      const v = vids.current[n];
      if (!v) return;
      if (show && n === i && !paused) v.play().catch(() => {});
      else v.pause();
    });
  }, [show, i, paused, run, ever]);

  const next = useCallback(() => setI((n) => Math.min(n + 1, LAST)), []);
  const prev = useCallback(() => { setI((n) => Math.max(n - 1, 0)); setRun((n) => n + 1); }, []);

  useEffect(() => {
    if (!show) return;
    const key = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [show, next, prev, onClose]);

  // press-and-hold pauses; a quick tap navigates
  const down = () => {
    const h = hold.current;
    h.held = false;
    clearTimeout(h.t);
    h.t = setTimeout(() => { h.held = true; setPaused(true); }, 220);
  };
  const up = (e) => {
    const h = hold.current;
    clearTimeout(h.t);
    if (h.held) { h.held = false; setPaused(false); return; }
    if (e.clientX < innerWidth * 0.33) prev(); else next();
  };
  const cancel = () => { clearTimeout(hold.current.t); if (hold.current.held) { hold.current.held = false; setPaused(false); } };

  const again = () => { setI(0); setPaused(false); setRun((n) => n + 1); };

  if (!ever) return null;
  // a video slide lasts as long as the video (or its `seconds` in config.js)
  const seconds = (n) => {
    const s = SLIDES[n];
    if (s.kind === "intro") return INTRO_SECONDS;
    if (s.video) return s.seconds ?? (dur[n] ? dur[n] + 0.3 : RECAP_SECONDS);
    return RECAP_SECONDS;
  };

  return (
    <section className={`recap${show ? " show" : ""}${paused ? " paused" : ""}`} role="dialog" aria-label="Photo replay" aria-hidden={!show}>
      {SLIDES.map((s, n) => (
        <div key={n} className={`rs ${s.kind}${s.video ? " vid" : ""}${n === i ? " on" : ""}`} aria-hidden={n !== i}>
          {s.kind === "photo" && (
            <>
              {!s.video && <img className="rbg" src={asset(s.src)} alt="" aria-hidden="true" draggable={false} />}
              <div className="rbody">
                <figure className={`rframe${s.small ? " small" : ""}`} style={{ "--rot": `${n % 2 ? 2.2 : -2.2}deg` }}>
                  {s.video ? (
                    <video
                      ref={(el) => { vids.current[n] = el; }}
                      src={asset(s.src)}
                      muted={!s.sound}
                      playsInline
                      preload="metadata"
                      aria-label={`${s.title}. ${s.caption}`}
                      onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d)) setDur((o) => ({ ...o, [n]: d })); }}
                    />
                  ) : (
                    <img src={asset(s.src)} alt={`${s.title}. ${s.caption}`} draggable={false} />
                  )}
                </figure>
                <div className="rtext">
                  {s.date && <p className="rdate">{s.date}</p>}
                  <h2>{s.title}</h2>
                  <p className="rcap">{s.caption}</p>
                </div>
              </div>
            </>
          )}

          {s.kind === "intro" && (
            <div className="rbody center">
              <p className="rdate">A little rewind</p>
              <h2 className="big">Replay</h2>
              <p className="rcap">A few moments, what I've had left for all that's lost.</p>
              <p className="rhelp">Tap to go on · hold to pause</p>
            </div>
          )}

          {s.kind === "outro" && (
            <div className="rbody center">
              {n === i && <Burst key={run} origin={{ x: innerWidth / 2, y: innerHeight * 0.36 }} />}
              <div className="rfan" aria-hidden="true">
                {FAN.map((m, k) => (
                  <img key={k} src={asset(m.src)} alt="" draggable={false} style={{ "--k": k - (FAN.length - 1) / 2 }} />
                ))}
              </div>
              <h2 className="big">Happy birthday, {NAME}</h2>
              <p className="rcap">I sincerely thank you, for everything we've had.</p>
              <div className="btns">
                <button className="again solid" onClick={again}>Watch again</button>
                <button className="again" onClick={onClose}>Back to the letter</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* invisible layer that catches taps and holds; the buttons sit above it */}
      <div className="rtap" onPointerDown={down} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel} />

      <div className="rbars" aria-hidden="true">
        {SLIDES.map((_, n) => (
          <span key={`${n}-${n === i ? run : 0}`} className={`rseg${n < i || (n === i && n === LAST) ? " done" : n === i ? " act" : ""}`}>
            <i style={{ animationDuration: `${seconds(n)}s` }} onAnimationEnd={next} />
          </span>
        ))}
      </div>
      <div className="rctl">
        <button ref={closeBtn} className="rbtn" onClick={onClose} aria-label="Close the replay"><Icon d="M6 6l12 12M18 6L6 18" /></button>
        {i < LAST && (
          <button className="rbtn" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume" : "Pause"} aria-pressed={paused}>
            {paused ? <Icon d="M7 4l13 8-13 8z" fill /> : <Icon d="M8 5v14M16 5v14" />}
          </button>
        )}
      </div>
    </section>
  );
}