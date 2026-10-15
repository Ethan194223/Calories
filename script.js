/* ============================================================
   EMBER — MOTIVATION ENGINE (shared across all pages)
   A rotating "quest log" of encouragement + a floating status bar
   ============================================================ */
(function () {
  "use strict";

  var QUOTES = [
    "One day at a time. Your calorie bar refills every morning — spend it like a pro.",
    "Progress isn't a straight line. It's a zigzag that trends upward.",
    "You don't have to be perfect. You just have to log the next meal.",
    "A 500 kcal deficit today is a kilogram you won't be carrying in a month.",
    "Consistency beats intensity. Show up for the boring days too.",
    "The scale is data, not a judge. Watch the trend, not the number.",
    "Protein, fibre, water, sleep — the four buffs stack every single day.",
    "One 'bad' meal? Fine. The next one counts. Keep going.",
    "Small choices compound. This snack, this walk, this weigh-in — they add up.",
    "Your body isn't a puzzle to solve. It's a system to feed well.",
    "Rest is part of the grind. Recovery is where the gains land.",
    "Future you is watching. Give them something to thank you for."
  ];

  function pick() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  function spriteEl(src, cls, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.className = "sprite" + (cls ? " " + cls : "");
    img.alt = alt || "pixel art icon";
    img.loading = "lazy";
    return img;
  }

  /* ---------- Floating status bar (every page) ---------- */
  function mountStatusbar() {
    if (document.querySelector(".statusbar")) return;
    var bar = document.createElement("div");
    bar.className = "statusbar";

    var ico = spriteEl("img/heart.svg", "ico", "motivation icon");
    ico.title = "Click for more motivation";
    ico.addEventListener("click", refresh);

    var msg = document.createElement("p");
    msg.className = "msg";
    msg.appendChild(document.createTextNode(pick()));
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    msg.appendChild(cursor);

    var dismiss = document.createElement("button");
    dismiss.className = "dismiss";
    dismiss.setAttribute("aria-label", "Dismiss motivation");
    dismiss.textContent = "✕";
    dismiss.addEventListener("click", function () {
      bar.remove();
    });

    bar.appendChild(ico);
    bar.appendChild(msg);
    bar.appendChild(dismiss);
    document.body.appendChild(bar);

    function refresh() {
      msg.childNodes[0].nodeValue = pick();
    }

    // rotate the quote every 9 seconds
    var timer = setInterval(refresh, 9000);
    // stop the timer if the bar is removed
    var observer = new MutationObserver(function () {
      if (!document.body.contains(bar)) {
        clearInterval(timer);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  /* ---------- Home "DAILY QUEST" panel (index.html only) ---------- */
  function mountQuest() {
    var quoteEl = document.getElementById("dailyQuote");
    if (!quoteEl) return;
    var set = function () {
      quoteEl.textContent = "\u201C" + pick() + "\u201D";
    };
    set();
    var btn = document.getElementById("newQuote");
    if (btn) {
      btn.addEventListener("click", set);
    }
    var ico = document.querySelector(".quest-ico");
    if (ico) {
      ico.title = "Click for a new quest";
      ico.addEventListener("click", set);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountStatusbar();
      mountQuest();
    });
  } else {
    mountStatusbar();
    mountQuest();
  }

  window.EmberMotivation = { quotes: QUOTES, pick: pick };
})();
