// Turns "/song.mp3" or "memories/01.jpg" into a URL that works at "/" or in a sub-folder
// (GitHub Pages, Netlify sub-paths...). Full http(s) URLs are left alone.
export const asset = (p) =>
  /^(https?:)?\/\//.test(p) ? p : import.meta.env.BASE_URL + p.replace(/^\/+/, "");
