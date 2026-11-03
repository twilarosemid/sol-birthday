import { useCallback, useEffect, useRef, useState } from "react";
import { MUSIC_URL } from "./config";
import { asset } from "./asset";

const LOW = 0.3;  // background level on the envelope screen
const HIGH = 0.7; // swells to this when the letter opens

/**
 * Background song.
 *  - Browsers block autoplay, so it starts on the first tap anywhere (hint text says so).
 *  - birthday() swells the volume when the letter opens.
 *  - toggle() mutes / unmutes. If she mutes it, it stays muted.
 *  - It pauses while the tab is hidden.
 */
export function useMusic() {
  const au = useRef(null);
  const fade = useRef(0);
  const want = useRef(false); // does she want music right now?
  const lvl = useRef(LOW);    // current target volume (so a late fade-in can't undo the swell)
  const [on, setOn] = useState(false);

  const ramp = useCallback((to, ms = 1200) => {
    const a = au.current;
    if (!a) return;
    clearInterval(fade.current);
    const from = a.volume, t0 = performance.now();
    fade.current = setInterval(() => {
      const k = Math.min((performance.now() - t0) / ms, 1);
      a.volume = from + (to - from) * k;
      if (k >= 1) clearInterval(fade.current);
    }, 40);
  }, []);

  const play = useCallback(() => {
    const a = au.current;
    if (!a) return;
    want.current = true;
    a.volume = 0;
    a.play().then(() => { setOn(true); ramp(lvl.current, 1800); }).catch(() => { want.current = false; setOn(false); });
  }, [ramp]);

  useEffect(() => {
    const a = new Audio(asset(MUSIC_URL));
    a.loop = true;
    a.preload = "auto";
    au.current = a;

    // first tap anywhere (except the mute button itself) starts the song
    const first = (e) => {
      if (e.target.closest?.(".mbtn")) return;
      removeEventListener("pointerdown", first, true);
      removeEventListener("keydown", first, true);
      play();
    };
    addEventListener("pointerdown", first, true);
    addEventListener("keydown", first, true);

    const vis = () => {
      if (document.hidden) a.pause();
      else if (want.current) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", vis);

    return () => {
      removeEventListener("pointerdown", first, true);
      removeEventListener("keydown", first, true);
      document.removeEventListener("visibilitychange", vis);
      clearInterval(fade.current);
      a.pause();
      au.current = null;
    };
  }, [play]);

  const toggle = useCallback(() => {
    const a = au.current;
    if (!a) return;
    if (want.current && !a.paused) {
      want.current = false;
      ramp(0, 400);
      setTimeout(() => { if (!want.current) a.pause(); }, 420);
      setOn(false);
    } else {
      play();
    }
  }, [play, ramp]);

  const birthday = useCallback(() => {
    const a = au.current;
    if (!a) return;
    lvl.current = HIGH;
    if (want.current && !a.paused) ramp(HIGH, 2500);
    else if (!want.current && !a.currentTime) play(); // never started (autoplay was blocked): start now
    // if she muted it on purpose (currentTime > 0), leave it muted
  }, [play, ramp]);

  return { on, toggle, birthday };
}
