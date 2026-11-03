// ✏️ Edit these
export const NAME = "Syd";
export const FROM = "Euno";
export const MESSAGE =
  "This day means a lot to me, as it's a special day for you. I would like to have the privilege of celebrating your birthday, just as we have celebrated mine. \n\nI have made this solely to wish you a happy birthday, and I hope that you'll cherish the memories you'll get to make today and in the days to come. \n\nI wish that every good thing makes its way to you. Never stop pursuing the things you love, even when the road gets bumpy. \n\n Chasing a love we never knew would begin, running after the sweet memories and possibilities we could've had, only for them to melt the longer we hold on. I hope that whatever hardships we've had will pass, just as the souls of the departed have found their rest. \n\n Out of all the things this life could offer me, I'd still choose the chance to find out what we could be if we ever learned to love one another exactly as we both deeply desire. \n\nJust in case you're wondering, yes, still, a lot, and with all my soul. \n\nOnce again, Happy Birthday, Sol!";

// The question that unlocks the letter
export const BIRTHDAY = { day: 4, month: 11, year: 2006 };

// The reply button at the end of the letter opens your Instagram chat (ig.me/m/REPLY_IG).
export const REPLY_IG = "euno.fxd";
export const MUSIC_URL = "/song.mp3";

// ---------- The replay (photo recap) ----------
// Files live in /public/memories. Edit, reorder, add or delete entries freely.
//   src      path inside /public
//   date     small stamp above the title (optional)
//   title    the headline
//   caption  one line underneath
//   small    true for low-resolution photos, so they aren't blown up (optional)
export const RECAP_SECONDS = 5.5; // time each memory stays on screen
export const MEMORIES = [
  { src: "memories/01-roblox.jpg", date: "June 28 · 8:41 PM", title: "Roblox ayas, random games",
    caption: "Gakuran, just us two acting employees, feeling each other's presence despite the distance" },
  { src: "memories/02-discord-call.jpg", date: "Wed, July 8 · 12:13 PM", title: "dc calls, bebetimes",
    caption: "Meta Down? Still found ways to have time" },
  { src: "memories/03-video-call.jpg", title: "Presence Lingers",
    caption: "Filmed off my laptop screen, You being present on my busy days" },
  { src: "memories/04-squad.jpg", title: "Tara COD?", small: true,
    caption: "You and your ayas" },
  { src: "memories/05-egg.jpg", title: "Co-parenting",
    caption: "Eggs and childrens we planned to raise that we later abandoned kasi tinamad" },
  { src: "memories/06-cracked-phone.jpg", title: "First meeting, first photo, first day",
    caption: "Photos we first took on our first meeting" },
  { src: "memories/07-three-phones.jpg", date: "Sunday, May 24 · 8:48", title: "Three phones, one photo",
    caption: "two down, last man standing" },
  { src: "memories/08-first-date.jpg", date: "Saturday, March 20 · ", title: "Our backs against the burden of the world",
    caption: "You and I, until the end of dawn" },
  { src: "memories/09-last-date.mp4", date: "Sunday, June 27 · ", title: "Who knew this would be our last?",
    caption: "One night we shared filled with memories so precious I can't ever forget" },
  { src: "memories/10-flowers.mp4", title: "Flowers that don't wither",
    caption: "Real flowers fade. These stay." },
];