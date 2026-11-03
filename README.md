# Birthday greeting (React + Vite)

    npm install
    npm run dev      # develop
    npm run build    # production build in dist/ (works at a domain root or in a sub-folder)

## Edit in `src/config.js`
- `NAME`, `FROM`, `MESSAGE`, `BIRTHDAY` (the unlock question), `REPLY_EMAIL`, `REPLY_IG`, `USE_FORMSUBMIT` (see "Replies" below)
- `MEMORIES` and `RECAP_SECONDS`: the photo **Replay** (see below)

The birthday answer lives in client-side code, so it is a playful lock, not real security.

## Static files go in `/public` (project root)
- `public/song.mp3`: background music (starts on her first tap, browsers don't allow earlier)
- `public/memories/*.jpg`: the replay photos

Vite only serves static files from `public/` at the project root. A `public` folder inside `src/` is ignored.

## The Replay
On the letter there's a **Replay our memories** button. It opens a full-screen, story-style slideshow:
tap right/left (or arrow keys) to move, press and hold to pause, Esc to close. It ends with a flower burst.

To change it, edit the `MEMORIES` list in `src/config.js`: reorder, delete, or add entries
(`src`, `title`, `caption`, optional `date`, optional `small: true` for low-resolution photos).
Drop new photos into `public/memories/`. ~1200px on the long side is plenty.

## Replies
Under the letter she can write a message and choose how to send it:
- **Send to email** goes to `REPLY_EMAIL`. With `USE_FORMSUBMIT = true` it sends straight from the page through FormSubmit.co.
  **One-time setup:** after you deploy, send yourself a test reply, then click the *Activate* link FormSubmit emails to that address.
  Until it's activated, replies don't arrive. If sending fails, she's handed to her mail app instead.
- **Message on Instagram** copies her message and opens your chat at `ig.me/m/<REPLY_IG>` so she can paste it.
