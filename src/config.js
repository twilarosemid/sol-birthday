// ✏️ Edit these
export const NAME = "Sol";
export const FROM = "Euno";
export const MESSAGE =
  "This day means a lot to me, as it's a special day for you. I would like to have the privilege of celebrating your birthday, just as we have celebrated mine. \n\nI have made this solely to wish you a happy birthday, and I hope that you'll cherish the memories you'll get to make today and in the days to come. \n\nI wish that every good thing makes its way to you. Never stop pursuing the things you love, even when the road gets bumpy. \n\n Chasing a love we never knew would begin, running after the sweet memories and possibilities we could've had, only for them to melt the longer we hold on. I hope that whatever hardships we've had will pass, just as the souls of the departed have found their rest. \n\nJust in case you're wondering, yes, still, a lot, and with all my soul. \n\nOnce again, Happy Birthday, Sol!";

// The question that unlocks the letter
export const BIRTHDAY = { day: 4, month: 11, year: 2006 };

// Where her reply goes. She gets two choices under the text box:
//  1) "Send to email"      -> delivered to REPLY_EMAIL
//  2) "Message on Instagram" -> her message is copied, then your IG chat opens (ig.me/m/REPLY_IG)
export const REPLY_EMAIL = "gulfericdonato7@gmail.com";
export const REPLY_IG = "euno.fxd";

// Email delivery:
// - USE_FORMSUBMIT = true  -> sends straight from the page via the free FormSubmit.co service (no mail app needed).
//     ONE-TIME SETUP: send yourself a test reply once, then click the "Activate" link FormSubmit emails to REPLY_EMAIL.
//     If the send ever fails, she is automatically handed to her mail app (mailto) instead.
// - USE_FORMSUBMIT = false -> always opens her mail app with the message addressed to you.
// - REPLY_ENDPOINT (optional) -> your own form service URL (Formspree, Getform...). Overrides FormSubmit if filled in.
export const USE_FORMSUBMIT = true;
export const REPLY_ENDPOINT = "";
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
  { src: "memories/01-roblox.jpg", date: "June 28 · 8:41 PM", title: "After School, Roblox edition",
    caption: "A convenience store aisle, just us two acting employees, zero regrets." },
  { src: "memories/02-discord-call.jpg", date: "Wed, July 8 · 12:13 PM", title: "The #General call",
    caption: "Meta Down? Still found ways to have time" },
  { src: "memories/03-video-call.jpg", title: "Presence Lingers",
    caption: "Filmed off my laptop screen, You being present on my busy days." },
  { src: "memories/04-squad.jpg", title: "Tara COD?", small: true,
    caption: "You and your ayas" },
  { src: "memories/05-egg.jpg", title: "Co-parenting",
    caption: "Eggs and childrens we planned to raise that we later abandoned kasi tinamad" },
  { src: "memories/06-cracked-phone.jpg", title: "Cracked phone, intact photo strips",
    caption: "The phone took the damage. The memories survived." },
  { src: "memories/07-three-phones.jpg", date: "Sun, May 24 · 8:48", title: "Three phones, one photo",
    caption: "Three screens, one photo strip, and the clock agrees on all of them." },
];
