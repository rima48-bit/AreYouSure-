document.addEventListener("DOMContentLoaded", render);

// ── BLOCK COPY/PASTE ───────────────────────────────────────────
document.addEventListener("paste", (e) => {
  e.preventDefault();

  const active = document.activeElement;

  // funny feedback
  const msg = document.createElement("div");
  const lines = [
  "Nice try. Type it yourself.",
  "Ctrl+V denied.",
  "Your keyboard misses you.",
  "Manual labor builds character.",
  "Paste detected. Respect lost."
];

msg.textContent = lines[Math.floor(Math.random() * lines.length)];
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#111";
  msg.style.color = "#fff";
  msg.style.padding = "10px 16px";
  msg.style.borderRadius = "10px";
  msg.style.fontSize = "14px";
  msg.style.zIndex = "999999";
  msg.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);

  // optional shake effect
  if (active) {
    active.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 1000 }
    );
  }
});
const params = new URLSearchParams(location.search);
const DEST = params.get("dest") || "";
const VISITS = parseInt(params.get("visits")) || 1;
const KEY = params.get("key") || "";
const SITE = DEST ? new URL(decodeURIComponent(DEST)).hostname.replace("www.", "") : "that site";

function getSteps(v) {
  if (v === 1) return ["intro","captcha","typing","math","pledge","done"];
  if (v === 2) return ["intro","captcha2","typing","math","pledge","done"];
  if (v === 3) return ["intro","captcha2","typing","math","pledge","roast","done"];
  if (v === 4) return ["intro","captcha2","typing2","math","math2","pledge","roast","done"];
  return ["intro","captcha2","typing2","math","math2","pledge","roast","confirm","done"];
}

const STEPS = getSteps(VISITS);
let currentStep = 0;

function shame() {
  const pct = Math.min(95, 15 + (VISITS - 1) * 18);
  const color = pct < 40 ? "#FAC775" : pct < 65 ? "#EF9F27" : "#E24B4A";
  return { pct, color };
}

function shameHtml() {
  const s = shame();
  return `<div class="shame-row">
    <span>Disappointment</span>
    <div class="shame-bar"><div class="shame-fill" style="width:${s.pct}%;background:${s.color}"></div></div>
    <span>${s.pct}%</span>
  </div>`;
}

function progressHtml(active) {
  const total = STEPS.length - 1;
  return `<div class="progress-bar">${Array.from({length: total}, (_,i) =>
    `<div class="prog-dot ${i < active ? "done" : i === active ? "active" : ""}"></div>`
  ).join("")}</div>`;
}

function getMeme(page) {
  const memes = {
    intro: "icons/1.jpg",
    captcha: "icons/2.jpg",
    captcha2: "icons/2.jpg",
    typing: "icons/3.jpg",
    typing2: "icons/3.jpg",
    math: "icons/4.jpg",
    math2: "icons/4.jpg",
    pledge: "icons/5.jpg",
    roast: "icons/5.jpg",
    confirm: "icons/5.jpg",
    done: "icons/5.jpg"
  };

  return memes[page];
}

function setHTML(content) {
  document.getElementById("app").innerHTML = `
    <div class="title-bar">
      <div class="window-btn"></div>

      <div class="title-decoration"></div>

      <span class="title-text">AreYouSure?</span>

      <div class="title-decoration"></div>

      <div class="window-controls">
        <div class="window-btn"></div>
        <div class="window-btn"></div>
      </div>
    </div>

    <div class="window-content">
      ${content}
    </div>
  `;
}

function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

function goNext() { currentStep++; render(); }

function render() {
  const map = {
    intro: renderIntro, captcha: renderCaptcha, captcha2: renderCaptcha2,
    typing: renderTyping, typing2: renderTyping2,
    math: renderMath, math2: renderMath2,
    pledge: renderPledge, roast: renderRoast,
    confirm: renderConfirm, done: renderDone,
  };
  (map[STEPS[currentStep]] || renderDone)();
}

// ── INTRO ──────────────────────────────────────────────────────
function renderIntro() {
  const msgs = [
    [
      "Really?",
      `It's a workday. You opened <strong>${SITE}</strong>.<br><br>
      You have things to do. Yet here we are.<br><br>
      Complete all ${STEPS.length - 1} verifications if you still insist.`
    ],
    ["Again.", `Visit #${VISITS}. The gauntlet is longer now. You did this.`],
    ["Oh, it's you.", `Visit #${VISITS}. You know the drill. It's worse now.`],
    ["...", `Visit #${VISITS}. The laptop has given up being surprised.`],
  ];
  const [title, sub] = msgs[Math.min(VISITS-1, msgs.length-1)];
  setHTML(`
    <div class="logo">whattt??</div>
    <div class="site-tag">${SITE}</div>
    <div class="disappointed">
    <img src="${getMeme('intro')}" alt="cat">
    </div>
    <h2>${title}</h2>
    <p class="subtitle">${sub}</p>
    ${progressHtml(0)}
    ${shameHtml()}
    <div class="card">
      <label><input type="checkbox" id="ack1"> I am aware my productivity today has been... questionable</label>
      <label><input type="checkbox" id="ack2"> I understand that opening this site will not magically improve my life.</label>
      <label><input type="checkbox" id="ack3"> I accept full responsibility for the next 47 minutes disappearing.</label>
    </div>
    <button class="btn-primary" id="btn-intro" disabled>Begin Verification</button>
    <button class="btn-ghost" id="btn-back">← Go back to work (recommended)</button>
  `);
  function checkAcks() {
    document.getElementById("btn-intro").disabled =
      !["ack1","ack2","ack3"].every(i => document.getElementById(i).checked);
  }
  on("ack1","change",checkAcks); on("ack2","change",checkAcks); on("ack3","change",checkAcks);
  on("btn-intro","click",goNext);
  on("btn-back","click",() => history.back());
}

// ── CAPTCHA HELPER ─────────────────────────────────────────────
function renderCaptchaScreen(tiles, label, nextBtnId, errId) {
  setHTML(`
    <div class="logo">AreYouSure?™ — Step ${currentStep} of ${STEPS.length-1}</div>
    <div class="disappointed">
    <img src="${getMeme('typing')}" alt="cat">
    </div>
    <h2>${label}</h2>
    <p class="subtitle">Click everything that applies.</p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="checkmark-grid" id="captcha-grid">
      ${tiles.map((t,i) =>
        `<div class="img-tile" data-i="${i}" data-correct="${t.c}">
          <div class="tile-icon">${t.e}</div>
          <div class="tile-label">${t.label || ""}</div>
        </div>`
      ).join("")}
    </div>
    <button class="btn-primary" id="${nextBtnId}" style="margin-top:8px">Verify Selection</button>
    <div class="error" id="${errId}"></div>
  `);
  document.querySelectorAll(".img-tile").forEach(t =>
    t.addEventListener("click", () => t.classList.toggle("selected"))
  );
  on(nextBtnId, "click", () => {
    const selected = document.querySelectorAll(".img-tile");
    let ok = true;
    selected.forEach(t => {
      if ((t.dataset.correct === "true") !== t.classList.contains("selected")) ok = false;
    });
    if (ok) { goNext(); return; }
    const err = document.getElementById(errId);
    err.textContent = "Incorrect. The laptop sighs audibly.";
    document.querySelectorAll(".img-tile").forEach(t => t.classList.remove("selected"));
    setTimeout(() => { if(err) err.textContent = ""; }, 2000);
  });
}

const TILES1 = [
  {e:"Pretend to be productive",label:"Sleep",c:true},{e:"📱",c:false},{e:"🏃",c:true},
  {e:"study?",c:false},{e:"📚",c:true},{e:"🍩",c:false},
  {e:"😴",c:false},{e:"💧",c:true},{e:"🎮",c:false}
];
const TILES2 = [
  {e:"📧",c:true,label:"reply emails"},{e:"🧘",c:true,label:"meditate"},
  {e:"🛒",c:false,label:"online shop"},{e:"📊",c:true,label:"finish report"},
  {e:"🐈",c:false,label:"cat videos"},{e:"🏋️",c:true,label:"work out"},
  {e:"💤",c:false,label:"nap"},{e:"📝",c:true,label:"take notes"},
  {e:"🎲",c:false,label:"play games"}
];

function renderCaptcha()  { renderCaptchaScreen(TILES1,"Choose what you should do before doomscrolling","btn-cap","cap-err"); }
function renderCaptcha2() { renderCaptchaScreen(TILES2,"Fine. Since you're determined to procrastinate, at least pretend to improve your life first. Pick all you should do instead of doomscrolling","btn-cap2","cap-err2"); }

// ── TYPING HELPER ──────────────────────────────────────────────
function renderTypingScreen(target, seconds, minAcc) {
  setHTML(`
    <div class="logo">AreYouSure? — Step ${currentStep} of ${STEPS.length-1}</div>
    <div class="disappointed">
    <img src="${getMeme('typing')}" alt="cat">
    </div>
    <h2>Typing verification</h2>
    <p class="subtitle">Type the passage in ${seconds}s with ≥${minAcc}% accuracy.</p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="timer" id="typ-timer">${seconds}</div>
    <div class="typing-target" id="typ-target">${target}</div>
    <textarea id="typ-input" rows="4" placeholder="Start typing to begin the timer..."></textarea>
    <div style="display:flex;justify-content:space-between;font-size:12px;color:#888;margin-top:6px">
      <span id="typ-acc">Accuracy: —</span><span id="typ-wpm">WPM: —</span>
    </div>
    <button class="btn-primary" id="btn-typ" disabled style="margin-top:12px">Continue</button>
  `);

  let secs = seconds, started = false, iv = null;
  const inp = document.getElementById("typ-input");

  inp.addEventListener("input", function startOnce() {
    if (started) return;
    started = true;
    iv = setInterval(() => {
      secs--;
      const el = document.getElementById("typ-timer");
      if (!el) { clearInterval(iv); return; }
      el.textContent = secs;
      if (secs <= 0) {
        clearInterval(iv);
        inp.disabled = true;
        setTimeout(() => {
          if (!document.getElementById("typ-input")) return;
          inp.disabled = false; inp.value = "";
          secs = seconds; started = false;
          document.getElementById("typ-timer").textContent = seconds;
          document.getElementById("typ-acc").textContent = "Time's up — try again";
          document.getElementById("btn-typ").disabled = true;
        }, 3000);
      }
    }, 3000);
  });

  inp.addEventListener("input", () => {
    const typed = inp.value;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 0;
    const elapsed = Math.max(1, seconds - secs);
    const wpm = Math.round((typed.split(" ").length / elapsed) * 60);
    document.getElementById("typ-acc").textContent = `Accuracy: ${acc}%`;
    document.getElementById("typ-wpm").textContent = `WPM: ${wpm}`;
    if (typed.length >= target.length * 0.95 && acc >= minAcc) {
      clearInterval(iv);
      document.getElementById("btn-typ").disabled = false;
      document.getElementById("typ-acc").textContent = `✓ Verified — ${acc}% accuracy`;
    }
  });

  on("btn-typ","click",goNext);
}

const T1 = "The time I spend scrolling could be used to learn a new skill, finish my work, or simply rest with intention. I am making a conscious choice right now.";
const T2 = "I acknowledge that my time is finite, my tasks are real, and doomscrolling is a choice I make consciously and must now pay for with this typing test.";

function renderTyping()  { renderTypingScreen(T1, 45, 85); }
function renderTyping2() { renderTypingScreen(T2, 30, 90); }

// ── MATH HELPER ────────────────────────────────────────────────
function renderMathScreen(questions, title) {
  let idx = 0;
  setHTML(`
    <div class="logo">AreYouSure? — Step ${currentStep} of ${STEPS.length-1}</div>
    <div class="disappointed">
    <img src="${getMeme('math')}" alt="cat">
    </div>
    <h2>${title}</h2>
    <p class="subtitle">Prove your brain works. No calculator.</p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="card">
      <p style="font-size:12px;color:#888;margin-bottom:4px" id="q-label">Question 1 of ${questions.length}</p>
      <div class="math-q" id="math-q">${questions[0].q}</div>
      <input type="text" id="math-ans" placeholder="Answer" style="text-align:center;font-size:18px">
      <div class="error" id="math-fb" style="min-height:20px"></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:6px">
      ${questions.map((_,i) => `<div class="q-dot" id="qd${i}"></div>`).join("")}
    </div>
    <button class="btn-primary" id="btn-math" disabled style="margin-top:12px">Continue</button>
  `);
  const ans = document.getElementById("math-ans");
  ans.addEventListener("input", () => {
    const val = ans.value.trim();
    const q = questions[idx];
    const fb = document.getElementById("math-fb");
    if (val === q.a) {
      fb.textContent = "✓ Correct"; fb.style.color = "#1D9E75";
      document.getElementById("qd"+idx).style.background = "#1D9E75";
      idx++;
      setTimeout(() => {
        if (!document.getElementById("math-ans")) return;
        if (idx < questions.length) {
          document.getElementById("q-label").textContent = `Question ${idx+1} of ${questions.length}`;
          document.getElementById("math-q").textContent = questions[idx].q;
          ans.value = ""; fb.textContent = "";
        } else {
          document.getElementById("btn-math").disabled = false;
          fb.textContent = "✓ Fine. You can do math."; fb.style.color = "#1D9E75";
        }
      }, 500);
    } else if (val.length >= q.a.length) {
      fb.textContent = "✗ Wrong. The laptop shakes its head."; fb.style.color = "#E24B4A";
    }
  });
  on("btn-math","click",goNext);
}

function renderMath()  {
  renderMathScreen([
    {q:"17 × 8 = ?",a:"136"},{q:"What is 15% of 240?",a:"36"},{q:"√144 = ?",a:"12"}
  ], "Cognitive check");
}
function renderMath2() {
  renderMathScreen([
    {q:"2³ + 5² = ?",a:"33"},{q:"(12 × 4) ÷ 8 = ?",a:"6"},
    {q:"20% of 350 = ?",a:"70"},{q:"144 ÷ 12 = ?",a:"12"}
  ], "Advanced cognitive check");
}

// ── PLEDGE ─────────────────────────────────────────────────────
const PLEDGE = ["I","will","close","this","tab","in","five","minutes"];

function renderPledge() {
  const shuffled = [...PLEDGE].sort(() => Math.random()-0.5);
  setHTML(`
    <div class="logo">AreYouSure? — Step ${currentStep} of ${STEPS.length-1}</div>
    <div class="disappointed">
    <img src="${getMeme('pledge')}" alt="cat">
    </div>
    <h2>Verbal commitment</h2>
    <p class="subtitle">Arrange: <em>"I will close this tab in five minutes"</em><br>
    <span style="font-size:12px;color:#888">Drag words into the box. Click a word in the box to return it.</span></p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="card">
      <div class="drop-zone" id="drop-zone"></div>
      <div id="word-bank" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:10px">
        ${shuffled.map(w => `<span class="drag-word" data-word="${w}">${w}</span>`).join("")}
      </div>
    </div>
    <div style="font-size:13px;text-align:center;margin:8px 0;min-height:20px;color:#666" id="pledge-fb"></div>
    <button class="btn-primary" id="btn-pledge" disabled>I Solemnly Swear</button>
  `);

  let dragging = null;

  function makeBankWord(word) {
    const span = document.createElement("span");
    span.className = "drag-word";
    span.dataset.word = word;
    span.textContent = word;
    span.draggable = true;
    span.addEventListener("dragstart", () => { dragging = word; });
    return span;
  }

  function makeZoneWord(word) {
    const span = document.createElement("span");
    span.className = "drag-word";
    span.dataset.word = word;
    span.textContent = word;
    span.style.cursor = "pointer";
    span.title = "Click to return";
    span.addEventListener("click", () => {
      span.remove();
      document.getElementById("word-bank").appendChild(makeBankWord(word));
      checkPledgeState();
    });
    return span;
  }

  // wire up bank words
  document.querySelectorAll("#word-bank .drag-word").forEach(el => {
    el.draggable = true;
    el.addEventListener("dragstart", () => { dragging = el.dataset.word; });
  });

  const zone = document.getElementById("drop-zone");
  zone.addEventListener("dragover", e => e.preventDefault());
  zone.addEventListener("dragenter", () => zone.classList.add("over"));
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("over");
    if (!dragging) return;
    // remove from bank
    const bankEl = document.querySelector(`#word-bank [data-word="${dragging}"]`);
    if (bankEl) bankEl.remove();
    zone.appendChild(makeZoneWord(dragging));
    dragging = null;
    checkPledgeState();
  });

  on("btn-pledge","click",goNext);
}

function checkPledgeState() {
  const words = Array.from(document.querySelectorAll("#drop-zone .drag-word")).map(e => e.textContent);
  const fb = document.getElementById("pledge-fb");
  if (!fb) return;
  if (words.join(" ") === PLEDGE.join(" ")) {
    fb.textContent = "✓ Pledge accepted. Barely."; fb.style.color = "#1D9E75";
    document.getElementById("btn-pledge").disabled = false;
  } else if (words.length === PLEDGE.length) {
    fb.textContent = "✗ Wrong order. Like your priorities."; fb.style.color = "#E24B4A";
    document.getElementById("btn-pledge").disabled = true;
  } else {
    fb.textContent = ""; document.getElementById("btn-pledge").disabled = true;
  }
}

// ── ROAST ──────────────────────────────────────────────────────
const ROASTS = [
  "Your to-do list opened this page and it's crying.",
  "Your future self is writing a strongly-worded letter to your present self.",
  "The tasks you're avoiding have feelings. They're hurt.",
  "You've spent more time on verification than the actual task would have taken.",
  "A study shows you'll feel guilty about this in exactly 7 minutes. The study is you, right now.",
];

function renderRoast() {
  const roast = ROASTS[Math.floor(Math.random()*ROASTS.length)];
  setHTML(`
    <div class="logo">AreYouSure? — Step ${currentStep} of ${STEPS.length-1}</div>
    <div class="disappointed">
      <img src="${getMeme('roast')}" alt="cat">
    </div>
    <h2>A moment of reflection</h2>
    <p class="subtitle">Before you continue, sit with this:</p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="card" style="text-align:center;padding:1.5rem">
      <p style="font-size:16px;line-height:1.7;color:#333;font-style:italic">"${roast}"</p>
    </div>
    <div class="timer" id="roast-timer">5</div>
    <p style="font-size:12px;color:#888;text-align:center;margin-bottom:12px">Sit with that for a moment.</p>
    <button class="btn-primary" id="btn-roast" disabled>I have reflected sufficiently</button>
  `);
  let secs = 5;
  const iv = setInterval(() => {
    secs--;
    const el = document.getElementById("roast-timer");
    if (!el) { clearInterval(iv); return; }
    el.textContent = secs;
    if (secs <= 0) {
      clearInterval(iv); el.textContent = "";
      const btn = document.getElementById("btn-roast");
      if (btn) btn.disabled = false;
    }
  }, 1000);
  on("btn-roast","click",goNext);
}

// ── CONFIRM (visit 5+) ─────────────────────────────────────────
function renderConfirm() {
  const required = `I choose ${SITE} over my goals`;
  setHTML(`
    <div class="logo">AreYouSure? — Final Step</div>
    <div class="disappointed">💀</div>
    <h2>Last chance</h2>
    <p class="subtitle">Type exactly: <strong>"${required}"</strong></p>
    ${progressHtml(currentStep)}
    ${shameHtml()}
    <div class="card">
      <input type="text" id="confirm-input" placeholder="Type the phrase exactly...">
      <div class="error" id="confirm-err"></div>
    </div>
    <button class="btn-primary" id="btn-confirm" disabled>Confirm</button>
  `);
  const inp = document.getElementById("confirm-input");
  inp.addEventListener("input", () => {
    document.getElementById("btn-confirm").disabled = inp.value !== required;
  });
  on("btn-confirm","click",goNext);
}


// ── DONE ───────────────────────────────────────────────────────
function renderDone() {
  chrome.storage.local.set({ [KEY+"_unlockedUntil"]: Date.now() + 5*60*1000 });
  const nextMsgs = ["a haiku about your to-do list.","pushups (webcam next).","everything, timed.","everything. forever."];
  let secs = 300;
  setHTML(`
    <div style="text-align:center;padding:1rem 0">
      <div class="logo">AreYouSure?</div>
      <div style="font-size:48px;margin:1rem 0">🎉</div>
      <h2>Access granted.</h2>
      <p class="subtitle" style="margin:0.5rem 0 1.5rem">You have <strong>5 minutes</strong>. Next attempt adds: <em>${nextMsgs[Math.min(VISITS-1,nextMsgs.length-1)]}</em></p>
      <div class="card" style="text-align:center">
        <div class="access-timer" id="access-timer">5:00</div>
        <p style="font-size:12px;color:#888">before judgment resumes</p>
      </div>
      <button class="btn-primary" id="btn-go" style="margin-top:1.5rem">Go to ${SITE} →</button>
    </div>
  `);
  const iv = setInterval(() => {
    secs--;
    const el = document.getElementById("access-timer");
    if (!el) { clearInterval(iv); return; }
    el.textContent = `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
    if (secs <= 0) clearInterval(iv);
  }, 1000);
  on("btn-go","click",() => { window.location.href = decodeURIComponent(DEST); });
}