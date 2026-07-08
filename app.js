/* ===================== Understory — app.js ===================== */

const STORAGE_KEY = "understory-state-v1";

const TYPES = {
  strength: { label: "Strength", color: "var(--c-strength)", hex: null, icon: "⛰" },
  bike:     { label: "Bike",     color: "var(--c-bike)",     hex: null, icon: "◍" },
  run:      { label: "Run",      color: "var(--c-run)",      hex: null, icon: "◐" },
  climb:    { label: "Climb",    color: "var(--c-climb)",    hex: null, icon: "▲" },
  yoga:     { label: "Yoga",     color: "var(--c-yoga)",     hex: null, icon: "◉" },
  hike:     { label: "Hike",     color: "var(--c-hike)",     hex: null, icon: "◭" },
  surf:     { label: "Surf",     color: "var(--c-surf)",     hex: null, icon: "≈" },
  fredo:    { label: "Fredo Walk", color: "var(--c-fredo)",  hex: null, icon: "🐾" },
};

const THEMES = [
  { id: "foggy-pine", name: "Foggy Pine", desc: "Deep evergreen, dark", dots: ["#161D19","#7FA3AD","#B8A9D9"] },
  { id: "highland-mist", name: "Highland Mist", desc: "Soft sage, light", dots: ["#E7ECE3","#5F84A0","#8A76BF"] },
  { id: "dusk-ridge", name: "Dusk Ridge", desc: "Twilight, blue-forward", dots: ["#1B1E2B","#7C93D6","#A691D9"] },
];

const EQUIPMENT = ["Barbell", "Free weight", "Plate", "Kettle bell", "Body weight"];
const YOGA_STYLES = ["Vinyasa", "Hatha", "Ashtanga", "Yin", "Restorative"];
const BIKE_STARTS = ["Mountain", "Trail", "Road"];
const CLIMB_STARTS = ["Top rope", "Boulder"];
const BOULDER_GRADES = ["V1","V2","V3","V4","V5","V6","V7","V8","V9"];
const TOPROPE_GRADES = ["5.6","5.7","5.8","5.9","5.10a","5.10b","5.10c","5.10d","5.11a","5.11b","5.11c","5.11d","5.12a","5.12b","5.12c","5.12d"];

const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  strength: `<svg ${ICON_ATTRS}><rect x="1.5" y="9.5" width="3" height="5" rx="1"/><rect x="19.5" y="9.5" width="3" height="5" rx="1"/><rect x="4.5" y="7.5" width="2.5" height="9" rx="1"/><rect x="17" y="7.5" width="2.5" height="9" rx="1"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`,
  bike: `<svg ${ICON_ATTRS}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17 L9.5 9.5 L14.5 9.5 L18 17 M9.5 9.5 L12.5 17 M14.5 9.5 L12 6 L9 6"/></svg>`,
  run: `<svg ${ICON_ATTRS}><circle cx="14.5" cy="4.2" r="1.6"/><path d="M12 7.5 L15 10 L11.5 13 L15 15 L12.5 20"/><path d="M15 10 L19.5 8"/><path d="M11.5 13 L7 12.5"/><path d="M15 15 L18.5 18.5"/><path d="M12.5 20 L8.5 21"/></svg>`,
  climb: `<svg ${ICON_ATTRS}><path d="M2.5 19 L8.5 8 L12 13.5 L15.5 7.5 L21.5 19 Z"/><circle cx="15.5" cy="4.3" r="1.3"/></svg>`,
  yoga: `<svg ${ICON_ATTRS}><circle cx="12" cy="4.8" r="1.7"/><path d="M12 8 L12 12.5"/><path d="M12 9.7 L7.5 12.8 M12 9.7 L16.5 12.8"/><path d="M12 12.5 L7 17 M12 12.5 L17 17"/></svg>`,
  hike: `<svg ${ICON_ATTRS}><path d="M5 19 L5 10.5 Q5 8.5 7 8.5 L9.5 8.5 L9.5 12 L14.5 12 Q19 12 19 16.5 L19 19 Z"/><line x1="4" y1="19" x2="20" y2="19"/><line x1="7" y1="9.8" x2="7" y2="11.8"/></svg>`,
  surf: `<svg ${ICON_ATTRS}><path d="M1.5 15.5 Q5.5 11.5 9.5 15.5 Q13.5 19.5 17.5 15.5 Q19.5 13.5 22.5 15.5"/><path d="M1.5 19.5 Q5.5 16.5 9.5 19.5 Q13.5 22.5 17.5 19.5 Q19.5 18 22.5 19.5"/></svg>`,
  fredo: `<svg ${ICON_ATTRS}><ellipse cx="12" cy="17" rx="4.8" ry="3.8"/><ellipse cx="5.7" cy="10" rx="2" ry="2.6"/><ellipse cx="10.3" cy="6.3" rx="2" ry="2.6"/><ellipse cx="14.8" cy="6.5" rx="2" ry="2.6"/><ellipse cx="18.7" cy="9.8" rx="1.9" ry="2.5"/></svg>`,
};
function typeIcon(type) { return ICONS[type] || ""; }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

/* ---------------- State ---------------- */
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn("load failed", e); }
  return {
    theme: "foggy-pine",
    gyms: [], studios: [], spots: [],
    workouts: [], sessions: [], routines: [],
  };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------- Draft (resume-in-progress) persistence ---------------- */
function draftKey(workoutId) { return `understory-draft-${workoutId}`; }
function saveDraft(workout, date, data) {
  try {
    localStorage.setItem(draftKey(workout.id), JSON.stringify({ date, data, savedAt: Date.now() }));
  } catch (e) { console.warn("draft save failed", e); }
}
function loadDraft(workoutId) {
  try {
    const raw = localStorage.getItem(draftKey(workoutId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function clearDraft(workoutId) {
  localStorage.removeItem(draftKey(workoutId));
}

/* ---------------- Notifications ---------------- */
function updateNotifStatus() {
  const el = document.getElementById("notifStatus");
  const btn = document.getElementById("enableNotifBtn");
  if (!el || !btn) return;
  if (!("Notification" in window)) {
    el.textContent = "This browser doesn't support notifications.";
    btn.style.display = "none";
    return;
  }
  if (Notification.permission === "granted") {
    el.textContent = "Notifications are on — you'll get a ping when a rest timer finishes.";
    btn.textContent = "Enabled";
    btn.disabled = true;
  } else {
    el.textContent = "Get notified when a rest timer finishes, even if your screen is off.";
    btn.textContent = "Enable notifications";
    btn.disabled = false;
  }
}
async function requestNotifPermission() {
  if (!("Notification" in window)) return;
  await Notification.requestPermission();
  updateNotifStatus();
}
function scheduleRestNotification(seconds, exerciseName) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  setTimeout(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification("Rest complete", {
          body: exerciseName ? `Back to it — ${exerciseName}` : "Time to get back to your set.",
          icon: "icons/icon-192.png",
          vibrate: [200, 100, 200],
          tag: "rest-timer",
        });
      }).catch(() => {});
    } else if (Notification.permission === "granted") {
      new Notification("Rest complete", { body: "Time to get back to your set." });
    }
  }, seconds * 1000);
}

/* ---------------- Navigation ---------------- */
const screens = ["home", "workouts", "routines", "settings"];
function showScreen(name) {
  screens.forEach((s) => {
    document.getElementById("screen-" + s).classList.toggle("hidden", s !== name);
  });
  document.querySelectorAll(".nav-btn[data-screen]").forEach((b) => {
    b.classList.toggle("active", b.dataset.screen === name);
  });
  if (name === "workouts") renderWorkoutList();
  if (name === "routines") renderRoutineList();
  if (name === "settings") renderSettings();
  if (name === "home") { renderCalendar(); renderSummary(); }
}

document.querySelectorAll(".nav-btn[data-screen]").forEach((b) => {
  b.addEventListener("click", () => showScreen(b.dataset.screen));
});
document.getElementById("fabLog").addEventListener("click", openTypeMatrix);
document.getElementById("settingsBtn").addEventListener("click", () => showScreen("settings"));
document.getElementById("newWorkoutBtn").addEventListener("click", openTypeMatrix);
document.getElementById("newRoutineBtn").addEventListener("click", openRoutineBuilder);

/* ---------------- Sheet helpers ---------------- */
const sheetBackdrop = document.getElementById("sheetBackdrop");
const sheetEl = document.getElementById("sheet");
function openSheet(html) {
  sheetEl.innerHTML = '<div class="sheet-handle"></div>' + html;
  sheetBackdrop.classList.remove("hidden");
}
function closeSheet() {
  sheetBackdrop.classList.add("hidden");
  sheetEl.innerHTML = "";
}
sheetBackdrop.addEventListener("click", (e) => { if (e.target === sheetBackdrop) closeSheet(); });

/* ===================== CALENDAR ===================== */
let calCursor = new Date();
calCursor.setDate(1);

document.getElementById("calPrev").addEventListener("click", () => {
  calCursor.setMonth(calCursor.getMonth() - 1); renderCalendar();
});
document.getElementById("calNext").addEventListener("click", () => {
  calCursor.setMonth(calCursor.getMonth() + 1); renderCalendar();
});

function sessionsByDate() {
  const map = {};
  state.sessions.forEach((s) => {
    (map[s.date] = map[s.date] || []).push(s);
  });
  return map;
}

function renderCalendar() {
  const label = calCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  document.getElementById("calMonthLabel").textContent = label;

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";
  ["S","M","T","W","T","F","S"].forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-dow"; el.textContent = d;
    grid.appendChild(el);
  });

  const year = calCursor.getFullYear(), month = calCursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDate = sessionsByDate();
  const todayStr = todayISO();

  for (let i = 0; i < firstDow; i++) {
    const el = document.createElement("div");
    el.className = "cal-day empty";
    grid.appendChild(el);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const el = document.createElement("div");
    el.className = "cal-day" + (iso === todayStr ? " today" : "");
    const num = document.createElement("div");
    num.textContent = day;
    el.appendChild(num);

    const daySessions = byDate[iso] || [];
    if (daySessions.length) {
      const dotsWrap = document.createElement("div");
      dotsWrap.className = "cal-day-dots";
      daySessions.forEach((s) => {
        const dot = document.createElement("span");
        dot.className = "cal-dot";
        dot.style.background = TYPES[s.type].color;
        dotsWrap.appendChild(dot);
      });
      el.appendChild(dotsWrap);
    }
    el.addEventListener("click", () => selectDay(iso));
    grid.appendChild(el);
  }

  renderLegend();
}

function renderLegend() {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";
  Object.entries(TYPES).forEach(([key, t]) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-icon" style="color:${t.color}">${typeIcon(key)}</span>${t.label}`;
    legend.appendChild(item);
  });
}

function selectDay(iso) {
  const detail = document.getElementById("dayDetail");
  const daySessions = state.sessions.filter((s) => s.date === iso);
  if (!daySessions.length) {
    detail.className = "empty-state";
    detail.textContent = `Nothing logged on ${fmtDate(iso)} yet.`;
    return;
  }
  detail.className = "";
  detail.innerHTML = daySessions.map((s) => sessionCardHTML(s)).join("");
  detail.querySelectorAll("[data-view-session]").forEach((card) => {
    card.addEventListener("click", () => openSessionDetail(card.dataset.viewSession));
  });
}

function sessionCardHTML(s) {
  const t = TYPES[s.type];
  return `
    <div class="card" data-view-session="${s.id}" style="cursor:pointer;">
      <div class="card-row">
        <div>
          <div class="card-title">${escapeHTML(s.workoutName)}</div>
          <div class="card-sub">${fmtDate(s.date)} · ${sessionSummaryLine(s)}</div>
        </div>
        <span class="type-badge" style="background:${t.color}"><span class="badge-icon">${typeIcon(s.type)}</span>${t.label}</span>
      </div>
    </div>`;
}

function sessionSummaryLine(s) {
  switch (s.type) {
    case "strength": return `${(s.exercises||[]).length} exercise${(s.exercises||[]).length===1?"":"s"}`;
    case "bike": case "run": case "hike":
      return [s.start, s.duration ? `${s.duration}` : null, s.distance ? `${s.distance} mi` : null].filter(Boolean).join(" · ");
    case "climb": return `${(s.routes||[]).length} route${(s.routes||[]).length===1?"":"s"} · ${s.start||""}`;
    case "yoga": return [s.style, s.duration].filter(Boolean).join(" · ");
    case "surf": return [s.spot, s.duration].filter(Boolean).join(" · ");
    case "fredo": return [s.duration, s.distance ? `${s.distance} mi` : null].filter(Boolean).join(" · ");
    default: return "";
  }
}

function sessionDetailBodyHTML(s) {
  if (s.type === "strength") {
    const order = computeSupersetOrder(s.exercises||[]);
    const exCard = (ex) => `
      <div class="exercise-card">
        <div class="exercise-name"><span>${escapeHTML(ex.name)}</span><span class="card-sub">${formatDuration(ex.durationSec||0)}</span></div>
        ${(ex.sets||[]).map((set,i) => `
          <div class="detail-row"><span>Set ${i+1} · ${escapeHTML(set.equipment||"")}</span><span>${escapeHTML(set.weight||"–")} lb × ${escapeHTML(set.reps||"–")}${set.repsMode==="each_side"?" (each side)":""}</span></div>
          ${set.notes ? `<div class="card-sub" style="padding-bottom:6px;">${escapeHTML(set.notes)}</div>` : ""}
        `).join("")}
      </div>`;
    return order.length ? order.map((item) => {
      if (item.type === "solo") return exCard(s.exercises[item.index]);
      return `<div class="superset-block"><div class="superset-label">Superset ${item.number}</div>${item.indices.map((i) => exCard(s.exercises[i])).join("")}</div>`;
    }).join("") : `<p class="card-sub">No exercises recorded.</p>`;
  } else if (s.type === "bike" || s.type === "run" || s.type === "hike") {
    return `
      <div class="card">
        ${s.start ? `<div class="detail-row"><span>Start</span><span>${escapeHTML(s.start)}</span></div>` : ""}
        <div class="detail-row"><span>Duration</span><span>${escapeHTML(s.duration||"–")}</span></div>
        <div class="detail-row"><span>Elevation gain</span><span>${escapeHTML(String(s.elevation||"–"))}</span></div>
        <div class="detail-row"><span>Distance</span><span>${escapeHTML(String(s.distance||"–"))} mi</span></div>
      </div>`;
  } else if (s.type === "climb") {
    return `
      <div class="card">
        <div class="detail-row"><span>Start</span><span>${escapeHTML(s.start||"–")}</span></div>
        <div class="detail-row"><span>Gym</span><span>${escapeHTML(s.gym||"–")}</span></div>
      </div>
      ${(s.routes||[]).map((r,i) => `
        <div class="route-card">
          <div class="detail-row"><span>Route ${i+1}</span><span>${escapeHTML(r.rating||"–")}</span></div>
          <div class="detail-row"><span>Status</span><span>${r.completed ? "Completed" : "Not completed"}</span></div>
        </div>`).join("")}
    `;
  } else if (s.type === "yoga") {
    return `
      <div class="card">
        <div class="detail-row"><span>Style</span><span>${escapeHTML(s.style||"–")}</span></div>
        <div class="detail-row"><span>Class</span><span>${escapeHTML(s.className||"–")}</span></div>
        <div class="detail-row"><span>Duration</span><span>${escapeHTML(s.duration||"–")}</span></div>
        <div class="detail-row"><span>Studio</span><span>${escapeHTML(s.studio||"–")}</span></div>
      </div>`;
  } else if (s.type === "surf") {
    return `
      <div class="card">
        <div class="detail-row"><span>Board</span><span>${escapeHTML(s.board||"–")}</span></div>
        <div class="detail-row"><span>Wave size</span><span>${escapeHTML(String(s.waveSize||"–"))} ft</span></div>
        <div class="detail-row"><span>Duration</span><span>${escapeHTML(s.duration||"–")}</span></div>
        <div class="detail-row"><span>Spot</span><span>${escapeHTML(s.spot||"–")}</span></div>
      </div>`;
  } else if (s.type === "fredo") {
    return `
      <div class="card">
        <div class="detail-row"><span>Duration</span><span>${escapeHTML(s.duration||"–")}</span></div>
        <div class="detail-row"><span>Distance</span><span>${escapeHTML(String(s.distance||"–"))} mi</span></div>
      </div>`;
  }
  return "";
}

function openSessionDetail(sessionId) {
  const s = state.sessions.find((x) => x.id === sessionId);
  if (!s) return;
  const t = TYPES[s.type];
  const html = `
    <div class="sheet-topline"><span></span></div>
    <h3 style="margin-bottom:2px;">${escapeHTML(s.workoutName)}</h3>
    <p class="card-sub" style="margin-bottom:16px;">${t.label} · ${fmtDate(s.date)}</p>
    ${sessionDetailBodyHTML(s)}
    <button class="btn danger" id="deleteSessionBtn" style="margin-top:16px;">Delete this entry</button>
  `;
  openSheet(html);
  sheetEl.querySelector("#deleteSessionBtn").addEventListener("click", () => {
    if (!confirm("Delete this logged entry?")) return;
    state.sessions = state.sessions.filter((x) => x.id !== sessionId);
    saveState();
    closeSheet();
    renderCalendar();
    selectDay(s.date);
  });
}

function escapeHTML(str) {
  return (str||"").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

/* ===================== TYPE MATRIX → BUILD/LOG ===================== */
function openTypeMatrix() {
  const html = `
    <h3 style="margin-bottom:14px;">What are you logging?</h3>
    <div class="matrix">
      ${Object.entries(TYPES).map(([key,t]) => `
        <div class="matrix-btn" data-type="${key}">
          <span class="matrix-icon" style="color:${t.color}">${typeIcon(key)}</span>
          <span>${t.label}</span>
        </div>`).join("")}
    </div>`;
  openSheet(html);
  sheetEl.querySelectorAll(".matrix-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.type === "fredo") openFredoLog();
      else openTemplatePicker(btn.dataset.type);
    });
  });
}

function openFredoLog() {
  let w = state.workouts.find((x) => x.type === "fredo");
  if (!w) {
    w = { id: uid(), type: "fredo", name: "Fredo Walk", repeatable: true, createdAt: Date.now() };
    state.workouts.push(w);
    saveState();
  }
  openLogForm(w);
}

function openTemplatePicker(type) {
  const existing = state.workouts.filter((w) => w.type === type);
  const html = `
    <div class="sheet-topline">
      <button class="back-link" id="backToMatrix">‹ Back</button>
    </div>
    <h3 style="margin-bottom:4px;">${TYPES[type].label} workout</h3>
    <p class="card-sub" style="margin-bottom:14px;">Pick a saved workout to log again, or build a new one.</p>
    ${existing.map((w) => {
      const hasDraft = !!loadDraft(w.id);
      return `<div class="card" data-pick="${w.id}" style="cursor:pointer;">
        <div class="card-row">
          <div class="card-title">${escapeHTML(w.name)}</div>
          <span class="card-sub">${hasDraft ? "Resume ›" : "›"}</span>
        </div>
      </div>`;
    }).join("")}
    <div class="field" style="margin-top:14px;">
      <label>Name a new ${TYPES[type].label.toLowerCase()} workout</label>
      <input type="text" id="newWorkoutName" placeholder="e.g. Push Day A" />
    </div>
    <button class="btn" id="createWorkoutBtn">Build & start logging</button>
  `;
  openSheet(html);
  sheetEl.querySelector("#backToMatrix").addEventListener("click", openTypeMatrix);
  sheetEl.querySelectorAll("[data-pick]").forEach((card) => {
    card.addEventListener("click", () => {
      const w = state.workouts.find((x) => x.id === card.dataset.pick);
      openLogForm(w);
    });
  });
  sheetEl.querySelector("#createWorkoutBtn").addEventListener("click", () => {
    const nameInput = sheetEl.querySelector("#newWorkoutName");
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); return; }
    const w = { id: uid(), type, name, repeatable: true, createdAt: Date.now() };
    state.workouts.push(w);
    saveState();
    openLogForm(w);
  });
}

/* ===================== LOG FORM (per type) ===================== */
function lastSessionDataFor(workout) {
  const sessions = state.sessions.filter((s) => s.workoutId === workout.id)
    .sort((a,b) => (a.date+a.createdAt).localeCompare(b.date+b.createdAt));
  const last = sessions[sessions.length - 1];
  if (!last) return null;
  const type = workout.type;
  if (type === "strength") {
    return { exercises: (last.exercises||[]).map((ex) => ({
      name: ex.name, durationSec: 0, supersetGroup: ex.supersetGroup || null,
      sets: (ex.sets||[]).map((s) => ({ ...s })),
    })) };
  } else if (type === "bike" || type === "run" || type === "hike") {
    return { start: last.start, duration: last.duration, flat: last.elevation === "Flat", elevation: last.elevation, distance: last.distance };
  } else if (type === "climb") {
    return { start: last.start, gym: last.gym, routes: (last.routes||[]).map((r) => ({ ...r })) };
  } else if (type === "yoga") {
    return { style: last.style, className: last.className, duration: last.duration, studio: last.studio };
  } else if (type === "surf") {
    return { board: last.board, waveSize: last.waveSize, duration: last.duration, spot: last.spot };
  } else if (type === "fredo") {
    return { duration: last.duration, distance: last.distance };
  }
  return null;
}

function openLogForm(workout, opts) {
  opts = opts || {};
  const type = workout.type;
  const draft = !opts.forceFresh ? loadDraft(workout.id) : null;

  if (draft && !opts.resumed) {
    const html = `
      <div class="sheet-topline">
        <button class="back-link" id="backToPicker">‹ Back</button>
      </div>
      <h3 style="margin-bottom:2px;">${escapeHTML(workout.name)}</h3>
      <p class="card-sub" style="margin-bottom:16px;">${TYPES[type].label}</p>
      <div class="resume-banner">
        <p>You have an unfinished entry from ${fmtDate(draft.date)}. Resume where you left off, or start a fresh entry.</p>
        <div class="btn-row">
          <button class="btn" id="resumeBtn">Resume</button>
          <button class="btn secondary" id="freshBtn">Start fresh</button>
        </div>
      </div>
    `;
    openSheet(html);
    sheetEl.querySelector("#backToPicker").addEventListener("click", () => openTemplatePicker(type));
    sheetEl.querySelector("#resumeBtn").addEventListener("click", () => openLogForm(workout, { resumed: true }));
    sheetEl.querySelector("#freshBtn").addEventListener("click", () => { clearDraft(workout.id); openLogForm(workout, { forceFresh: true }); });
    return;
  }

  const initialData = draft ? draft.data : lastSessionDataFor(workout);
  const dateVal = (draft && draft.date) || todayISO();
  let bodyHTML = "";

  if (type === "strength") bodyHTML = strengthFormHTML(initialData);
  else if (type === "bike") bodyHTML = cardioFormHTML(true, initialData);
  else if (type === "run") bodyHTML = cardioFormHTML(false, initialData);
  else if (type === "hike") bodyHTML = cardioFormHTML(false, initialData);
  else if (type === "climb") bodyHTML = climbFormHTML(initialData);
  else if (type === "yoga") bodyHTML = yogaFormHTML(initialData);
  else if (type === "surf") bodyHTML = surfFormHTML(initialData);
  else if (type === "fredo") bodyHTML = fredoFormHTML(initialData);

  const html = `
    <div class="sheet-topline">
      <button class="back-link" id="backToPicker">‹ Back</button>
    </div>
    <h3 style="margin-bottom:2px;">${escapeHTML(workout.name)}</h3>
    <p class="card-sub" style="margin-bottom:16px;">${TYPES[type].label} · logging a session${!draft && initialData ? " · pre-filled from your last entry" : ""}</p>
    <div class="field"><label>Date</label><input type="date" id="logDate" value="${dateVal}" /></div>
    ${bodyHTML}
    <button class="btn" id="saveSessionBtn" style="margin-top:6px;">Finish workout</button>
  `;
  openSheet(html);
  sheetEl.querySelector("#backToPicker").addEventListener("click", () => {
    if (confirm("Your progress is saved as a draft — you can resume later. Go back?")) openTemplatePicker(type);
  });
  wireLogFormEvents(type, workout, initialData);
  sheetEl.querySelector("#logDate").addEventListener("change", () => persistCurrentDraft(workout, type));
  sheetEl.querySelector("#saveSessionBtn").addEventListener("click", () => saveSession(workout));
}

function persistCurrentDraft(workout, type) {
  const date = sheetEl.querySelector("#logDate").value || todayISO();
  let data = null;
  if (type === "strength") {
    data = { exercises: strengthExercises.map((ex) => ({ name: ex.name, durationSec: ex.durationSec, supersetGroup: ex.supersetGroup || null, sets: ex.sets })) };
  } else if (type === "bike" || type === "run" || type === "hike") {
    const flatChip = sheetEl.querySelector("#flatChip");
    data = {
      start: cardioSelStart,
      duration: sheetEl.querySelector("#cDuration").value,
      flat: flatChip ? flatChip.classList.contains("selected") : false,
      elevation: sheetEl.querySelector("#cElevation").value,
      distance: sheetEl.querySelector("#cDistance").value,
    };
  } else if (type === "climb") {
    data = { start: climbSelStart, gym: climbGym, routes: climbRoutes };
  } else if (type === "yoga") {
    data = {
      style: yogaSelStyle,
      className: sheetEl.querySelector("#yogaClassName").value,
      duration: sheetEl.querySelector("#yogaDuration").value,
      studio: sheetEl.querySelector("#yogaStudio").value,
    };
  } else if (type === "surf") {
    data = {
      board: sheetEl.querySelector("#surfBoard").value,
      waveSize: sheetEl.querySelector("#surfWaveSize").value,
      duration: sheetEl.querySelector("#surfDuration").value,
      spot: sheetEl.querySelector("#surfSpot").value,
    };
  } else if (type === "fredo") {
    data = {
      duration: sheetEl.querySelector("#fredoDuration").value,
      distance: sheetEl.querySelector("#fredoDistance").value,
    };
  }
  if (data) saveDraft(workout, date, data);
}

/* ---- Strength ---- */
let strengthExercises = [];

function getKnownExerciseNames() {
  const names = new Set();
  state.sessions.forEach((s) => { if (s.type === "strength") (s.exercises||[]).forEach((ex) => { if (ex.name) names.add(ex.name); }); });
  return [...names].sort((a,b) => a.localeCompare(b));
}

// Groups exercises into a display order: superset blocks (sequentially numbered
// by first appearance) interleaved with standalone exercises.
function computeSupersetOrder(exercises) {
  const order = [];
  const seen = new Map();
  exercises.forEach((ex, i) => {
    if (ex.supersetGroup) {
      if (!seen.has(ex.supersetGroup)) {
        const number = seen.size + 1;
        seen.set(ex.supersetGroup, number);
        order.push({ type: "group", key: ex.supersetGroup, number, indices: [i] });
      } else {
        const number = seen.get(ex.supersetGroup);
        const block = order.find((o) => o.type === "group" && o.key === ex.supersetGroup);
        block.indices.push(i);
      }
    } else {
      order.push({ type: "solo", index: i });
    }
  });
  return order;
}

function strengthFormHTML(draftData) {
  strengthExercises = draftData && draftData.exercises
    ? draftData.exercises.map((ex) => ({ name: ex.name, durationSec: ex.durationSec || 0, supersetGroup: ex.supersetGroup || null, sets: ex.sets, timerRunning: false, timerStart: null }))
    : [];
  const knownNames = getKnownExerciseNames();
  return `
    <div class="section-title" style="margin-top:0;">Exercises</div>
    <div id="exerciseList"></div>
    <div class="dropdown-add" style="margin-bottom:14px;">
      <input type="text" id="newExerciseName" list="exerciseNamesList" placeholder="Exercise name, e.g. Bench Press" />
      <datalist id="exerciseNamesList">
        ${knownNames.map((n) => `<option value="${escapeHTML(n)}"></option>`).join("")}
      </datalist>
      <button id="addExerciseBtn" type="button">Add</button>
    </div>
  `;
}
function wireStrength(workout) {
  const listEl = document.getElementById("exerciseList");
  function render() {
    const order = computeSupersetOrder(strengthExercises);
    listEl.innerHTML = order.map((item) => {
      if (item.type === "solo") {
        return exerciseCardHTML(strengthExercises[item.index], item.index, strengthExercises.length);
      }
      const cards = item.indices.map((i) => exerciseCardHTML(strengthExercises[i], i, strengthExercises.length)).join("");
      return `<div class="superset-block">
        <div class="superset-label">Superset ${item.number}</div>
        ${cards}
      </div>`;
    }).join("");

    listEl.querySelectorAll("[data-add-set]").forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.addSet;
      const sets = strengthExercises[i].sets;
      const prev = sets[sets.length - 1];
      sets.push(prev ? { ...prev } : { reps: "", weight: "", equipment: EQUIPMENT[0], notes: "", repsMode: "total" });
      render(); persistCurrentDraft(workout, "strength");
    }));
    listEl.querySelectorAll("[data-remove-ex]").forEach((b) => b.addEventListener("click", () => {
      strengthExercises.splice(+b.dataset.removeEx, 1); render(); persistCurrentDraft(workout, "strength");
    }));
    listEl.querySelectorAll("[data-remove-set]").forEach((b) => b.addEventListener("click", () => {
      const [ei, si] = b.dataset.removeSet.split("-").map(Number);
      strengthExercises[ei].sets.splice(si, 1); render(); persistCurrentDraft(workout, "strength");
    }));
    listEl.querySelectorAll(".set-row input, .set-row select").forEach((inp) => {
      inp.addEventListener("input", () => {
        const [ei, si] = inp.dataset.set.split("-").map(Number);
        strengthExercises[ei].sets[si][inp.dataset.field] = inp.value;
        persistCurrentDraft(workout, "strength");
      });
    });
    listEl.querySelectorAll("[data-repsmode]").forEach((b) => b.addEventListener("click", () => {
      const [ei, si] = b.dataset.repsmode.split("-").map(Number);
      strengthExercises[ei].sets[si].repsMode = b.dataset.mode;
      render(); persistCurrentDraft(workout, "strength");
    }));
    listEl.querySelectorAll("[data-timer]").forEach((b) => b.addEventListener("click", () => { toggleExerciseTimer(+b.dataset.timer, render); persistCurrentDraft(workout, "strength"); }));
    listEl.querySelectorAll("[data-rest]").forEach((b) => b.addEventListener("click", () => startRestTimer(b)));
    listEl.querySelectorAll("[data-superset-join]").forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.supersetJoin;
      const prevEx = strengthExercises[i - 1];
      strengthExercises[i].supersetGroup = prevEx.supersetGroup || uid();
      prevEx.supersetGroup = strengthExercises[i].supersetGroup;
      render(); persistCurrentDraft(workout, "strength");
    }));
    listEl.querySelectorAll("[data-superset-leave]").forEach((b) => b.addEventListener("click", () => {
      strengthExercises[+b.dataset.supersetLeave].supersetGroup = null;
      render(); persistCurrentDraft(workout, "strength");
    }));
  }
  document.getElementById("addExerciseBtn").addEventListener("click", () => {
    const inp = document.getElementById("newExerciseName");
    const name = inp.value.trim();
    if (!name) { inp.focus(); return; }
    strengthExercises.push({ name, sets: [{ reps:"", weight:"", equipment: EQUIPMENT[0], notes:"", repsMode: "total" }], durationSec: 0, supersetGroup: null, timerRunning: false, timerStart: null });
    inp.value = "";
    render(); persistCurrentDraft(workout, "strength");
  });
  render();
}
function exerciseCardHTML(ex, i, total) {
  return `
    <div class="exercise-card">
      <div class="exercise-name">
        <span>${escapeHTML(ex.name)}</span>
        <button class="remove-x" data-remove-ex="${i}">✕</button>
      </div>
      <div style="margin-bottom:10px;">
        ${ex.supersetGroup
          ? `<button class="back-link" data-superset-leave="${i}">Remove from superset</button>`
          : (i > 0 ? `<button class="back-link" data-superset-join="${i}">+ Superset with previous exercise</button>` : "")}
      </div>
      <div class="timer-box">
        <div class="timer-display" id="exTimerDisplay-${i}">${formatDuration(ex.durationSec)}</div>
        <button class="btn secondary" data-timer="${i}">${ex.timerRunning ? "Stop" : "Start"} exercise timer</button>
        <div class="rest-row">
          <div class="chip" data-rest="30" data-exname="${escapeHTML(ex.name)}">Rest 0.5m</div>
          <div class="chip" data-rest="60" data-exname="${escapeHTML(ex.name)}">Rest 1m</div>
          <div class="chip" data-rest="90" data-exname="${escapeHTML(ex.name)}">Rest 1.5m</div>
        </div>
      </div>
      ${ex.sets.map((s, si) => `
        <div class="set-row">
          <span class="set-idx">${si+1}</span>
          <select data-set="${i}-${si}" data-field="equipment">
            ${EQUIPMENT.map((eq) => `<option ${s.equipment===eq?"selected":""}>${eq}</option>`).join("")}
          </select>
          <input type="number" placeholder="lbs" data-set="${i}-${si}" data-field="weight" value="${s.weight}" />
          <input type="number" placeholder="reps" data-set="${i}-${si}" data-field="reps" value="${s.reps}" />
        </div>
        <div class="chip-group" style="margin:-2px 0 8px 34px;">
          <div class="chip small ${(!s.repsMode || s.repsMode==='total')?'selected':''}" data-repsmode="${i}-${si}" data-mode="total">Total</div>
          <div class="chip small ${s.repsMode==='each_side'?'selected':''}" data-repsmode="${i}-${si}" data-mode="each_side">Each side</div>
        </div>
        <div class="set-row" style="grid-template-columns: 26px 1fr 26px;">
          <span></span>
          <input type="text" placeholder="notes" data-set="${i}-${si}" data-field="notes" value="${escapeHTML(s.notes)}" />
          <button class="remove-x" data-remove-set="${i}-${si}">✕</button>
        </div>
      `).join("")}
      <button class="btn ghost" data-add-set="${i}" style="margin-top:6px;">+ Add set</button>
    </div>
  `;
}
let exerciseTimers = {};
function toggleExerciseTimer(i, render) {
  const ex = strengthExercises[i];
  if (ex.timerRunning) {
    clearInterval(exerciseTimers[i]);
    ex.durationSec += Math.floor((Date.now() - ex.timerStart) / 1000);
    ex.timerRunning = false;
    render();
  } else {
    ex.timerRunning = true;
    ex.timerStart = Date.now();
    render();
    exerciseTimers[i] = setInterval(() => {
      const el = document.getElementById(`exTimerDisplay-${i}`);
      if (el) el.textContent = formatDuration(ex.durationSec + Math.floor((Date.now()-ex.timerStart)/1000));
    }, 1000);
  }
}
function formatDuration(sec) {
  const m = Math.floor(sec/60), s = sec%60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
let restInterval = null;
function startRestTimer(btn) {
  const seconds = +btn.dataset.rest;
  if (restInterval) clearInterval(restInterval);
  let remaining = seconds;
  const original = btn.textContent;
  btn.classList.add("selected");
  btn.textContent = formatDuration(remaining);
  scheduleRestNotification(seconds, btn.dataset.exname || "");
  restInterval = setInterval(() => {
    remaining--;
    btn.textContent = formatDuration(Math.max(remaining,0));
    if (remaining <= 0) {
      clearInterval(restInterval);
      btn.textContent = original;
      btn.classList.remove("selected");
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }, 1000);
}

/* ---- Bike / Run / Hike ---- */
let cardioSelStart = null;
function cardioFormHTML(hasStart, draftData) {
  cardioSelStart = (draftData && draftData.start) || null;
  const d = draftData || {};
  return `
    ${hasStart ? `
    <div class="field">
      <label>Start</label>
      <div class="chip-group" id="startChips">
        ${BIKE_STARTS.map((s) => `<div class="chip ${cardioSelStart===s?"selected":""}" data-start="${s}">${s}</div>`).join("")}
      </div>
    </div>` : ""}
    <div class="field"><label>Duration</label><input type="text" id="cDuration" placeholder="hh:mm" value="${d.duration||""}" /></div>
    <div class="field">
      <label>Elevation gain</label>
      <div class="chip-group" style="margin-bottom:8px;">
        <div class="chip ${d.flat?"selected":""}" id="flatChip">Flat</div>
      </div>
      <input type="number" id="cElevation" placeholder="feet of gain" value="${d.flat?"":(d.elevation||"")}" ${d.flat?"disabled":""} />
    </div>
    <div class="field"><label>Distance (mi)</label><input type="number" id="cDistance" placeholder="0.0" step="0.1" value="${d.distance||""}" /></div>
  `;
}
function wireCardio(workout, type) {
  const startChips = document.getElementById("startChips");
  if (startChips) {
    startChips.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
      startChips.querySelectorAll(".chip").forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected"); cardioSelStart = c.dataset.start;
      persistCurrentDraft(workout, type);
    }));
  }
  const flatChip = document.getElementById("flatChip");
  const elevInput = document.getElementById("cElevation");
  flatChip.addEventListener("click", () => {
    flatChip.classList.toggle("selected");
    elevInput.disabled = flatChip.classList.contains("selected");
    if (elevInput.disabled) elevInput.value = "";
    persistCurrentDraft(workout, type);
  });
  ["cDuration","cElevation","cDistance"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => persistCurrentDraft(workout, type));
  });
}

/* ---- Climb ---- */
let climbSelStart = null;
let climbGym = "";
let climbRoutes = [];
function gradesForStart(start) { return start === "Boulder" ? BOULDER_GRADES : TOPROPE_GRADES; }
function climbFormHTML(draftData) {
  if (draftData) {
    climbSelStart = draftData.start || null;
    climbGym = draftData.gym || (state.gyms[0] || "");
    climbRoutes = draftData.routes && draftData.routes.length ? draftData.routes : [{ rating: null, completed: true }];
  } else {
    climbSelStart = null;
    climbGym = state.gyms[0] || "";
    climbRoutes = [{ rating: null, completed: true }];
  }
  return `
    <div class="field">
      <label>Start</label>
      <div class="chip-group" id="climbStartChips">
        ${CLIMB_STARTS.map((s) => `<div class="chip ${climbSelStart===s?"selected":""}" data-start="${s}">${s}</div>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Gym</label>
      <select id="climbGymSelect">
        <option value="">Select gym…</option>
        ${state.gyms.map((g) => `<option ${climbGym===g?"selected":""}>${g}</option>`).join("")}
      </select>
      <div class="dropdown-add">
        <input type="text" id="newClimbGym" placeholder="Add a new gym" />
        <button type="button" id="addClimbGymBtn">Add</button>
      </div>
    </div>
    <div class="section-title" style="margin-top:6px;">Routes</div>
    <div id="routeList"></div>
    <button class="btn ghost" id="addRouteBtn" type="button">+ Add a route</button>
  `;
}
function wireClimb(workout) {
  const startChips = document.getElementById("climbStartChips");
  const routeList = document.getElementById("routeList");

  function renderRoutes() {
    const grades = climbSelStart ? gradesForStart(climbSelStart) : [];
    routeList.innerHTML = climbRoutes.map((r, i) => `
      <div class="route-card">
        <div class="route-head">
          <span>Route ${i+1}</span>
          <button class="remove-x" data-remove-route="${i}">✕</button>
        </div>
        <div class="field" style="margin-bottom:8px;">
          <label>Rating${!climbSelStart ? " — pick a start type above first" : ""}</label>
          ${climbSelStart ? `<div class="chip-group">
            ${grades.map((g) => `<div class="chip ${r.rating===g?"selected":""}" data-rate="${i}::${g}">${g}</div>`).join("")}
          </div>` : ""}
        </div>
        <div class="field" style="margin-bottom:0;">
          <div class="chip-group">
            <div class="chip ${r.completed?"selected":""}" data-complete="${i}-1">Completed</div>
            <div class="chip ${!r.completed?"selected":""}" data-complete="${i}-0">Not completed</div>
          </div>
        </div>
      </div>
    `).join("");
    routeList.querySelectorAll("[data-remove-route]").forEach((b) => b.addEventListener("click", () => {
      climbRoutes.splice(+b.dataset.removeRoute,1); renderRoutes(); persistCurrentDraft(workout, "climb");
    }));
    routeList.querySelectorAll("[data-rate]").forEach((b) => b.addEventListener("click", () => {
      const [i,g] = b.dataset.rate.split("::");
      climbRoutes[+i].rating = g; renderRoutes(); persistCurrentDraft(workout, "climb");
    }));
    routeList.querySelectorAll("[data-complete]").forEach((b) => b.addEventListener("click", () => {
      const [i,v] = b.dataset.complete.split("-").map(Number);
      climbRoutes[i].completed = !!v; renderRoutes(); persistCurrentDraft(workout, "climb");
    }));
  }

  startChips.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
    startChips.querySelectorAll(".chip").forEach((x) => x.classList.remove("selected"));
    c.classList.add("selected"); climbSelStart = c.dataset.start;
    climbRoutes.forEach((r) => { r.rating = null; });
    renderRoutes(); persistCurrentDraft(workout, "climb");
  }));

  const gymSelect = document.getElementById("climbGymSelect");
  gymSelect.addEventListener("change", () => { climbGym = gymSelect.value; persistCurrentDraft(workout, "climb"); });
  document.getElementById("addClimbGymBtn").addEventListener("click", () => {
    const input = document.getElementById("newClimbGym");
    const val = input.value.trim();
    if (!val) return;
    if (!state.gyms.includes(val)) { state.gyms.push(val); saveState(); }
    climbGym = val;
    gymSelect.innerHTML = `<option value="">Select gym…</option>` + state.gyms.map((g) => `<option ${g===val?"selected":""}>${g}</option>`).join("");
    input.value = "";
    persistCurrentDraft(workout, "climb");
  });

  document.getElementById("addRouteBtn").addEventListener("click", () => {
    climbRoutes.push({ rating: null, completed: true });
    renderRoutes(); persistCurrentDraft(workout, "climb");
  });
  renderRoutes();
}

/* ---- Yoga ---- */
let yogaSelStyle = null;
function yogaFormHTML(draftData) {
  yogaSelStyle = (draftData && draftData.style) || null;
  const d = draftData || {};
  return `
    <div class="field">
      <label>Style</label>
      <div class="chip-group" id="yogaStyleChips">
        ${YOGA_STYLES.map((s) => `<div class="chip ${yogaSelStyle===s?"selected":""}" data-style="${s}">${s}</div>`).join("")}
      </div>
    </div>
    <div class="field"><label>Class name</label><input type="text" id="yogaClassName" placeholder="e.g. Sunrise Flow" value="${escapeHTML(d.className||"")}" /></div>
    <div class="field"><label>Duration</label><input type="text" id="yogaDuration" placeholder="hh:mm" value="${escapeHTML(d.duration||"")}" /></div>
    <div class="field">
      <label>Studio</label>
      <select id="yogaStudio">
        <option value="">Select studio…</option>
        ${state.studios.map((s) => `<option ${d.studio===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <div class="dropdown-add">
        <input type="text" id="newStudio" placeholder="Add a new studio" />
        <button type="button" id="addStudioBtn">Add</button>
      </div>
    </div>
  `;
}
function wireYoga(workout) {
  const chips = document.getElementById("yogaStyleChips");
  chips.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
    chips.querySelectorAll(".chip").forEach((x) => x.classList.remove("selected"));
    c.classList.add("selected"); yogaSelStyle = c.dataset.style;
    persistCurrentDraft(workout, "yoga");
  }));
  document.getElementById("addStudioBtn").addEventListener("click", () => {
    const input = document.getElementById("newStudio");
    const val = input.value.trim();
    if (!val) return;
    if (!state.studios.includes(val)) { state.studios.push(val); saveState(); }
    const sel = document.getElementById("yogaStudio");
    sel.innerHTML = `<option value="">Select studio…</option>` + state.studios.map((s) => `<option ${s===val?"selected":""}>${s}</option>`).join("");
    input.value = "";
    persistCurrentDraft(workout, "yoga");
  });
  ["yogaClassName","yogaDuration","yogaStudio"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => persistCurrentDraft(workout, "yoga"));
    document.getElementById(id).addEventListener("change", () => persistCurrentDraft(workout, "yoga"));
  });
}

/* ---- Surf ---- */
function surfFormHTML(draftData) {
  const d = draftData || {};
  return `
    <div class="field"><label>Board</label><input type="text" id="surfBoard" placeholder="e.g. 6'2 Fish" value="${escapeHTML(d.board||"")}" /></div>
    <div class="field"><label>Wave size (ft)</label><input type="number" id="surfWaveSize" placeholder="0" value="${d.waveSize||""}" /></div>
    <div class="field"><label>Duration</label><input type="text" id="surfDuration" placeholder="hh:mm" value="${escapeHTML(d.duration||"")}" /></div>
    <div class="field">
      <label>Surf spot</label>
      <select id="surfSpot">
        <option value="">Select spot…</option>
        ${state.spots.map((s) => `<option ${d.spot===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <div class="dropdown-add">
        <input type="text" id="newSpot" placeholder="Add a new spot" />
        <button type="button" id="addSpotBtn">Add</button>
      </div>
    </div>
  `;
}
function wireSurf(workout) {
  document.getElementById("addSpotBtn").addEventListener("click", () => {
    const input = document.getElementById("newSpot");
    const val = input.value.trim();
    if (!val) return;
    if (!state.spots.includes(val)) { state.spots.push(val); saveState(); }
    const sel = document.getElementById("surfSpot");
    sel.innerHTML = `<option value="">Select spot…</option>` + state.spots.map((s) => `<option ${s===val?"selected":""}>${s}</option>`).join("");
    input.value = "";
    persistCurrentDraft(workout, "surf");
  });
  ["surfBoard","surfWaveSize","surfDuration","surfSpot"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => persistCurrentDraft(workout, "surf"));
    document.getElementById(id).addEventListener("change", () => persistCurrentDraft(workout, "surf"));
  });
}

/* ---- Fredo Walk ---- */
function fredoFormHTML(draftData) {
  const d = draftData || {};
  return `
    <div class="field"><label>Duration</label><input type="text" id="fredoDuration" placeholder="hh:mm" value="${escapeHTML(d.duration||"")}" /></div>
    <div class="field"><label>Distance (mi)</label><input type="number" id="fredoDistance" placeholder="0.0" step="0.1" value="${d.distance||""}" /></div>
  `;
}
function wireFredo(workout) {
  ["fredoDuration","fredoDistance"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => persistCurrentDraft(workout, "fredo"));
  });
}

function wireLogFormEvents(type, workout, draftData) {
  if (type === "strength") wireStrength(workout);
  else if (type === "bike" || type === "run" || type === "hike") wireCardio(workout, type);
  else if (type === "climb") wireClimb(workout);
  else if (type === "yoga") wireYoga(workout);
  else if (type === "surf") wireSurf(workout);
  else if (type === "fredo") wireFredo(workout);
}

/* ---- Save session ---- */
function saveSession(workout) {
  const type = workout.type;
  const date = sheetEl.querySelector("#logDate").value || todayISO();
  const base = { id: uid(), workoutId: workout.id, workoutName: workout.name, type, date, createdAt: Date.now() };
  let session = null;

  if (type === "strength") {
    strengthExercises.forEach((ex) => { if (ex.timerRunning) { ex.durationSec += Math.floor((Date.now()-ex.timerStart)/1000); ex.timerRunning=false; } });
    session = { ...base, exercises: strengthExercises.map((ex) => ({ name: ex.name, durationSec: ex.durationSec, supersetGroup: ex.supersetGroup || null, sets: ex.sets })) };
  } else if (type === "bike" || type === "run" || type === "hike") {
    const duration = sheetEl.querySelector("#cDuration").value;
    const flat = sheetEl.querySelector("#flatChip").classList.contains("selected");
    const elevation = flat ? "Flat" : sheetEl.querySelector("#cElevation").value;
    const distance = sheetEl.querySelector("#cDistance").value;
    session = { ...base, start: cardioSelStart, duration, elevation, distance };
  } else if (type === "climb") {
    session = { ...base, start: climbSelStart, gym: climbGym, routes: climbRoutes };
  } else if (type === "yoga") {
    session = { ...base,
      style: yogaSelStyle,
      className: sheetEl.querySelector("#yogaClassName").value,
      duration: sheetEl.querySelector("#yogaDuration").value,
      studio: sheetEl.querySelector("#yogaStudio").value,
    };
  } else if (type === "surf") {
    session = { ...base,
      board: sheetEl.querySelector("#surfBoard").value,
      waveSize: sheetEl.querySelector("#surfWaveSize").value,
      duration: sheetEl.querySelector("#surfDuration").value,
      spot: sheetEl.querySelector("#surfSpot").value,
    };
  } else if (type === "fredo") {
    session = { ...base,
      duration: sheetEl.querySelector("#fredoDuration").value,
      distance: sheetEl.querySelector("#fredoDistance").value,
    };
  }

  state.sessions.push(session);
  saveState();
  clearDraft(workout.id);
  closeSheet();
  showScreen("home");
  calCursor = new Date(date + "T00:00:00"); calCursor.setDate(1);
  renderCalendar();
  selectDay(date);
}

/* ===================== WORKOUTS LIST (grouped by type) ===================== */
function renderWorkoutList() {
  const el = document.getElementById("workoutList");
  if (!state.workouts.length) {
    el.innerHTML = `<div class="empty-state">No workouts built yet. Tap below to create your first one.</div>`;
    return;
  }
  const byType = {};
  state.workouts.forEach((w) => { (byType[w.type] = byType[w.type] || []).push(w); });

  el.innerHTML = Object.keys(TYPES).filter((type) => byType[type] && byType[type].length).map((type) => {
    const t = TYPES[type];
    const cards = byType[type].map((w) => {
      const count = state.sessions.filter((s) => s.workoutId === w.id).length;
      const hasDraft = !!loadDraft(w.id);
      return `
        <div class="card">
          <div class="card-row" data-view-workout="${w.id}" style="cursor:pointer;">
            <div>
              <div class="card-title">${escapeHTML(w.name)}</div>
              <div class="card-sub">${count} session${count===1?"":"s"} logged${hasDraft ? " · unfinished entry" : ""}</div>
            </div>
            <span class="card-sub">›</span>
          </div>
          <div class="btn-row" style="margin-top:12px;">
            <button class="btn secondary" data-log="${w.id}">${hasDraft ? "Resume" : "Log session"}</button>
            <button class="btn danger" data-del="${w.id}">Delete</button>
          </div>
        </div>`;
    }).join("");
    return `
      <div class="group-header"><span class="summary-type-icon" style="color:${t.color}">${typeIcon(type)}</span><span class="label">${t.label}</span></div>
      ${cards}
    `;
  }).join("");

  el.querySelectorAll("[data-view-workout]").forEach((row) => row.addEventListener("click", () => {
    openWorkoutSummary(row.dataset.viewWorkout);
  }));
  el.querySelectorAll("[data-log]").forEach((b) => b.addEventListener("click", () => {
    openLogForm(state.workouts.find((w) => w.id === b.dataset.log));
  }));
  el.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
    if (!confirm("Delete this workout? Logged sessions stay in your history.")) return;
    clearDraft(b.dataset.del);
    state.workouts = state.workouts.filter((w) => w.id !== b.dataset.del);
    saveState(); renderWorkoutList();
  }));
}

function openWorkoutSummary(workoutId) {
  const w = state.workouts.find((x) => x.id === workoutId);
  if (!w) return;
  const t = TYPES[w.type];
  const sessions = state.sessions.filter((s) => s.workoutId === workoutId)
    .sort((a,b) => (a.date+a.createdAt).localeCompare(b.date+b.createdAt));
  const last = sessions[sessions.length - 1];

  let progressionHTML = "";
  if (w.type === "strength" && sessions.length) {
    const progression = {};
    sessions.forEach((s) => {
      (s.exercises||[]).forEach((ex) => {
        const weights = (ex.sets||[]).map((st) => parseFloat(st.weight)).filter((n) => !isNaN(n));
        if (!weights.length) return;
        const top = Math.max(...weights);
        if (!progression[ex.name]) progression[ex.name] = { first: top, last: top };
        else progression[ex.name].last = top;
      });
    });
    const rows = Object.entries(progression).map(([name,p]) => {
      const delta = p.last - p.first; const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
      return summaryRow(name, `${p.first} → ${p.last} lbs ${arrow}`);
    }).join("");
    progressionHTML = `
      <div class="section-title">All-time progression</div>
      <div class="card">${rows || summaryEmpty("No weight data logged yet.")}</div>`;
  }

  const html = `
    <div class="sheet-topline"><span></span></div>
    <h3 style="margin-bottom:2px;">${escapeHTML(w.name)}</h3>
    <p class="card-sub" style="margin-bottom:16px;">${t.label}</p>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-num">${sessions.length}</div><div class="stat-label">Sessions logged</div></div>
      <div class="stat-box"><div class="stat-num">${last ? fmtDate(last.date) : "–"}</div><div class="stat-label">Most recent</div></div>
    </div>
    ${last ? `<div class="section-title">Most recently logged</div>${sessionDetailBodyHTML(last)}` : `<p class="empty-state">Nothing logged for this workout yet.</p>`}
    ${progressionHTML}
  `;
  openSheet(html);
}

/* ===================== SUMMARY ===================== */
const SUMMARY_PERIODS = [
  { id: "week", label: "Week", range: () => rollingRange(6) },
  { id: "month", label: "Month", range: () => rollingRange(29) },
  { id: "3month", label: "3 Month", range: () => rollingRange(89) },
  { id: "6month", label: "6 Month", range: () => rollingRange(181) },
  { id: "lastyear", label: "Last Year", range: () => lastYearRange() },
  { id: "ytd", label: "Year to Date", range: () => ytdRange() },
];
let summaryPeriod = "week";

function isoOf(d) { return d.toISOString().slice(0, 10); }
function rollingRange(daysBack) {
  const end = new Date(); end.setHours(0,0,0,0);
  const start = new Date(end); start.setDate(start.getDate() - daysBack);
  return [isoOf(start), isoOf(end)];
}
function lastYearRange() {
  const y = new Date().getFullYear() - 1;
  return [`${y}-01-01`, `${y}-12-31`];
}
function ytdRange() {
  const y = new Date().getFullYear();
  return [`${y}-01-01`, todayISO()];
}
function parseDurationMinutes(str) {
  if (!str) return 0;
  const s = String(str).trim();
  const m = s.match(/^(\d+):(\d{1,2})$/);
  if (m) return parseInt(m[1],10) * 60 + parseInt(m[2],10);
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}
function formatMinutes(mins) {
  mins = Math.round(mins);
  const h = Math.floor(mins/60), m = mins%60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function summaryRow(label, value) { return `<div class="summary-row"><span>${escapeHTML(String(label))}</span><span>${escapeHTML(String(value))}</span></div>`; }
function summaryEmpty(text) { return `<p class="card-sub" style="padding:4px 0;">${text}</p>`; }
function summaryBlock(type, rowsHTML) {
  const t = TYPES[type];
  return `<div class="summary-block">
    <div class="summary-block-head"><span class="summary-type-icon" style="color:${t.color}">${typeIcon(type)}</span><span class="summary-block-title">${t.label}</span></div>
    <div class="card">${rowsHTML}</div>
  </div>`;
}

function renderSummary() {
  const chipsEl = document.getElementById("summaryPeriodChips");
  chipsEl.innerHTML = SUMMARY_PERIODS.map((p) => `<div class="chip ${summaryPeriod===p.id?"selected":""}" data-period="${p.id}">${p.label}</div>`).join("");
  chipsEl.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { summaryPeriod = c.dataset.period; renderSummary(); }));

  const period = SUMMARY_PERIODS.find((p) => p.id === summaryPeriod);
  const [start, end] = period.range();
  const sessions = state.sessions.filter((s) => s.date >= start && s.date <= end);
  const blocks = [];

  // Strength — weight progression per exercise
  const strengthSessions = sessions.filter((s) => s.type === "strength").sort((a,b) => a.date.localeCompare(b.date));
  const progression = {};
  strengthSessions.forEach((s) => {
    (s.exercises||[]).forEach((ex) => {
      const weights = (ex.sets||[]).map((st) => parseFloat(st.weight)).filter((n) => !isNaN(n));
      if (!weights.length) return;
      const top = Math.max(...weights);
      if (!progression[ex.name]) progression[ex.name] = { first: top, last: top };
      else progression[ex.name].last = top;
    });
  });
  blocks.push(summaryBlock("strength", Object.keys(progression).length
    ? Object.entries(progression).map(([name,p]) => {
        const delta = p.last - p.first; const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
        return summaryRow(name, `${p.first} → ${p.last} lbs ${arrow}`);
      }).join("")
    : summaryEmpty("No strength sessions in this period.")));

  // Bike / Run / Hike — total miles, duration, elevation gain
  ["bike","run","hike"].forEach((type) => {
    const list = sessions.filter((s) => s.type === type);
    const totalDist = list.reduce((sum,s) => sum + (parseFloat(s.distance)||0), 0);
    const totalDur = list.reduce((sum,s) => sum + parseDurationMinutes(s.duration), 0);
    const totalElev = list.reduce((sum,s) => sum + (s.elevation === "Flat" ? 0 : (parseFloat(s.elevation)||0)), 0);
    blocks.push(summaryBlock(type, list.length
      ? [summaryRow("Sessions", list.length), summaryRow("Total distance", `${totalDist.toFixed(1)} mi`), summaryRow("Total duration", formatMinutes(totalDur)), summaryRow("Total elevation gain", `${Math.round(totalElev)} ft`)].join("")
      : summaryEmpty(`No ${TYPES[type].label.toLowerCase()} sessions in this period.`)));
  });

  // Fredo Walk — total distance & duration
  {
    const list = sessions.filter((s) => s.type === "fredo");
    const totalDist = list.reduce((sum,s) => sum + (parseFloat(s.distance)||0), 0);
    const totalDur = list.reduce((sum,s) => sum + parseDurationMinutes(s.duration), 0);
    blocks.push(summaryBlock("fredo", list.length
      ? [summaryRow("Walks", list.length), summaryRow("Total distance", `${totalDist.toFixed(1)} mi`), summaryRow("Total duration", formatMinutes(totalDur))].join("")
      : summaryEmpty("No Fredo Walks in this period.")));
  }

  // Yoga — duration per style
  {
    const list = sessions.filter((s) => s.type === "yoga");
    const byStyle = {};
    list.forEach((s) => { const key = s.style || "Unspecified"; byStyle[key] = (byStyle[key]||0) + parseDurationMinutes(s.duration); });
    blocks.push(summaryBlock("yoga", Object.keys(byStyle).length
      ? Object.entries(byStyle).map(([style,mins]) => summaryRow(style, formatMinutes(mins))).join("")
      : summaryEmpty("No yoga sessions in this period.")));
  }

  // Climb — completed routes, per rating per climbing type
  {
    const list = sessions.filter((s) => s.type === "climb");
    const counts = {};
    list.forEach((s) => {
      (s.routes||[]).forEach((r) => {
        if (!r.completed || !r.rating) return;
        const key = `${s.start||"Unspecified"} ${r.rating}`;
        counts[key] = (counts[key]||0) + 1;
      });
    });
    blocks.push(summaryBlock("climb", Object.keys(counts).length
      ? Object.entries(counts).sort(([a],[b]) => a.localeCompare(b)).map(([k,c]) => summaryRow(k, `${c} completed`)).join("")
      : summaryEmpty("No completed climbs in this period.")));
  }

  // Surf — time in the water, per wave size
  {
    const list = sessions.filter((s) => s.type === "surf");
    const byWave = {};
    list.forEach((s) => { const key = s.waveSize ? `${s.waveSize} ft waves` : "Unspecified wave size"; byWave[key] = (byWave[key]||0) + parseDurationMinutes(s.duration); });
    blocks.push(summaryBlock("surf", Object.keys(byWave).length
      ? Object.entries(byWave).map(([k,mins]) => summaryRow(k, formatMinutes(mins))).join("")
      : summaryEmpty("No surf sessions in this period.")));
  }

  document.getElementById("summaryContent").innerHTML = blocks.join("");
}

/* ===================== ROUTINES ===================== */
function openRoutineBuilder() {
  const html = `
    <h3 style="margin-bottom:14px;">Build a weekly routine</h3>
    <div class="field"><label>Routine name</label><input type="text" id="routineName" placeholder="e.g. Summer Strength Block" /></div>
    <div class="field"><label>Duration (weeks)</label><input type="number" id="routineWeeks" value="6" min="1" /></div>
    <div class="field"><label>Start date</label><input type="date" id="routineStart" value="${todayISO()}" /></div>
    <div class="field">
      <label>Workouts in this routine</label>
      <div class="chip-group" id="routineWorkoutChips">
        ${state.workouts.length ? state.workouts.map((w) => `<div class="chip" data-w="${w.id}">${escapeHTML(w.name)}</div>`).join("")
          : `<span class="card-sub">Build a workout first, then come back here.</span>`}
      </div>
      <p class="card-sub" style="margin-top:8px;">This is a flexible pool — you can log any of these workouts any day during the routine, and update the pool anytime.</p>
    </div>
    <button class="btn" id="saveRoutineBtn">Create routine</button>
  `;
  openSheet(html);
  const picked = new Set();
  sheetEl.querySelectorAll("#routineWorkoutChips .chip").forEach((c) => c.addEventListener("click", () => {
    c.classList.toggle("selected");
    if (c.classList.contains("selected")) picked.add(c.dataset.w); else picked.delete(c.dataset.w);
  }));
  sheetEl.querySelector("#saveRoutineBtn").addEventListener("click", () => {
    const name = sheetEl.querySelector("#routineName").value.trim();
    const weeks = +sheetEl.querySelector("#routineWeeks").value || 1;
    const start = sheetEl.querySelector("#routineStart").value || todayISO();
    if (!name) return;
    const startDate = new Date(start + "T00:00:00");
    const endDate = new Date(startDate); endDate.setDate(endDate.getDate() + weeks*7);
    const routine = {
      id: uid(), name, durationWeeks: weeks,
      startDate: start, endDate: endDate.toISOString().slice(0,10),
      workoutIds: [...picked], summary: null, createdAt: Date.now(),
    };
    state.routines.push(routine); saveState(); closeSheet(); showScreen("routines");
  });
}

function renderRoutineList() {
  const el = document.getElementById("routineList");
  if (!state.routines.length) {
    el.innerHTML = `<div class="empty-state">No routines yet. Group workouts into a routine and set a duration to track progress toward a goal.</div>`;
    return;
  }
  const today = todayISO();
  el.innerHTML = state.routines.slice().reverse().map((r) => {
    const isDone = today >= r.endDate;
    const sessionsInRoutine = state.sessions.filter((s) => r.workoutIds.includes(s.workoutId) && s.date >= r.startDate && s.date <= r.endDate);
    return `
      <div class="card">
        <div class="card-row">
          <div>
            <div class="card-title">${escapeHTML(r.name)}</div>
            <div class="card-sub">${r.durationWeeks} weeks · ${fmtDate(r.startDate)} → ${fmtDate(r.endDate)}</div>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-box"><div class="stat-num">${sessionsInRoutine.length}</div><div class="stat-label">Sessions logged</div></div>
          <div class="stat-box"><div class="stat-num">${r.workoutIds.length}</div><div class="stat-label">Workouts in pool</div></div>
        </div>
        <div class="btn-row">
          <button class="btn secondary" data-edit-pool="${r.id}">Edit pool</button>
          ${isDone
            ? (r.summary ? `<button class="btn ghost" data-view-summary="${r.id}">View summary</button>` : `<button class="btn" data-gen-summary="${r.id}">Generate summary</button>`)
            : `<button class="btn ghost" disabled style="opacity:0.5;">In progress</button>`}
        </div>
      </div>`;
  }).join("");

  el.querySelectorAll("[data-gen-summary]").forEach((b) => b.addEventListener("click", () => generateSummary(b.dataset.genSummary)));
  el.querySelectorAll("[data-view-summary]").forEach((b) => b.addEventListener("click", () => viewSummary(b.dataset.viewSummary)));
  el.querySelectorAll("[data-edit-pool]").forEach((b) => b.addEventListener("click", () => editPool(b.dataset.editPool)));
}

function editPool(routineId) {
  const r = state.routines.find((x) => x.id === routineId);
  const html = `
    <h3 style="margin-bottom:14px;">Edit workout pool</h3>
    <div class="chip-group" id="editPoolChips">
      ${state.workouts.map((w) => `<div class="chip ${r.workoutIds.includes(w.id)?"selected":""}" data-w="${w.id}">${escapeHTML(w.name)}</div>`).join("")}
    </div>
    <button class="btn" id="savePoolBtn" style="margin-top:16px;">Save</button>
  `;
  openSheet(html);
  const picked = new Set(r.workoutIds);
  sheetEl.querySelectorAll("#editPoolChips .chip").forEach((c) => c.addEventListener("click", () => {
    c.classList.toggle("selected");
    if (c.classList.contains("selected")) picked.add(c.dataset.w); else picked.delete(c.dataset.w);
  }));
  sheetEl.querySelector("#savePoolBtn").addEventListener("click", () => {
    r.workoutIds = [...picked]; saveState(); closeSheet(); renderRoutineList();
  });
}

function generateSummary(routineId) {
  const r = state.routines.find((x) => x.id === routineId);
  const sessions = state.sessions.filter((s) => r.workoutIds.includes(s.workoutId) && s.date >= r.startDate && s.date <= r.endDate)
    .sort((a,b) => a.date.localeCompare(b.date));

  const perWorkout = {};
  r.workoutIds.forEach((id) => { const w = state.workouts.find((x)=>x.id===id); if (w) perWorkout[id] = { name: w.name, count: 0 }; });
  sessions.forEach((s) => { if (perWorkout[s.workoutId]) perWorkout[s.workoutId].count++; });

  // strength progression: compare first vs last logged top weight per exercise name
  const progression = {};
  sessions.filter((s) => s.type === "strength").forEach((s) => {
    (s.exercises||[]).forEach((ex) => {
      const weights = (ex.sets||[]).map((st) => parseFloat(st.weight)).filter((n) => !isNaN(n));
      if (!weights.length) return;
      const top = Math.max(...weights);
      if (!progression[ex.name]) progression[ex.name] = { first: top, last: top, firstDate: s.date, lastDate: s.date };
      else { progression[ex.name].last = top; progression[ex.name].lastDate = s.date; }
    });
  });

  const totalWeeks = r.durationWeeks;
  const summary = {
    generatedAt: Date.now(),
    totalSessions: sessions.length,
    expectedRate: (sessions.length / totalWeeks).toFixed(1),
    perWorkout: Object.values(perWorkout),
    progression,
  };
  r.summary = summary;
  saveState();
  viewSummary(routineId);
}

function viewSummary(routineId) {
  const r = state.routines.find((x) => x.id === routineId);
  const s = r.summary;
  const progRows = Object.entries(s.progression).map(([name, p]) => {
    const delta = p.last - p.first;
    const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
    return `<div class="card-row" style="padding:8px 0;border-top:1px solid var(--border);">
      <span>${escapeHTML(name)}</span><span>${p.first} → ${p.last} lbs ${arrow}</span>
    </div>`;
  }).join("") || `<p class="card-sub">No strength data logged in this window.</p>`;

  const perWorkoutRows = s.perWorkout.map((w) => `
    <div class="card-row" style="padding:8px 0;border-top:1px solid var(--border);">
      <span>${escapeHTML(w.name)}</span><span>${w.count}×</span>
    </div>`).join("");

  const html = `
    <h3 style="margin-bottom:2px;">${escapeHTML(r.name)} — Summary</h3>
    <p class="card-sub" style="margin-bottom:14px;">${fmtDate(r.startDate)} → ${fmtDate(r.endDate)}</p>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-num">${s.totalSessions}</div><div class="stat-label">Total sessions</div></div>
      <div class="stat-box"><div class="stat-num">${s.expectedRate}</div><div class="stat-label">Avg / week</div></div>
    </div>
    <div class="section-title">By workout</div>
    <div class="card">${perWorkoutRows || '<p class="card-sub">Nothing logged.</p>'}</div>
    <div class="section-title">Strength progression (top set weight)</div>
    <div class="card">${progRows}</div>
  `;
  openSheet(html);
}

/* ===================== SETTINGS ===================== */
function renderSettings() {
  const grid = document.getElementById("themeGrid");
  grid.innerHTML = THEMES.map((t) => `
    <div class="theme-swatch ${state.theme===t.id?"active":""}" data-theme-pick="${t.id}" style="background:${t.dots[0]}22;">
      <div class="swatch-dots">${t.dots.map((d)=>`<span style="background:${d}"></span>`).join("")}</div>
      <div style="color:var(--text)">${t.name}</div>
      <div class="card-sub">${t.desc}</div>
    </div>`).join("");
  grid.querySelectorAll("[data-theme-pick]").forEach((el) => el.addEventListener("click", () => {
    state.theme = el.dataset.themePick; saveState(); applyTheme(); renderSettings();
  }));

  renderChipList("gymChips", state.gyms, (v) => { state.gyms = state.gyms.filter(g=>g!==v); saveState(); renderSettings(); });
  renderChipList("studioChips", state.studios, (v) => { state.studios = state.studios.filter(g=>g!==v); saveState(); renderSettings(); });
  renderChipList("spotChips", state.spots, (v) => { state.spots = state.spots.filter(g=>g!==v); saveState(); renderSettings(); });

  updateNotifStatus();
  const notifBtn = document.getElementById("enableNotifBtn");
  if (notifBtn) notifBtn.onclick = requestNotifPermission;
}
function renderChipList(elId, list, onRemove) {
  const el = document.getElementById(elId);
  if (!list.length) { el.innerHTML = `<span class="card-sub">None added yet — add one from its log form.</span>`; return; }
  el.innerHTML = list.map((v) => `<div class="chip" data-v="${escapeHTML(v)}">${escapeHTML(v)} ✕</div>`).join("");
  el.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => onRemove(c.dataset.v)));
}
function applyTheme() {
  document.body.setAttribute("data-theme", state.theme);
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `understory-backup-${todayISO()}.json`;
  a.click(); URL.revokeObjectURL(url);
});
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!confirm("This will replace your current data with the imported backup. Continue?")) return;
      state = Object.assign({ theme:"foggy-pine", gyms:[], studios:[], spots:[], workouts:[], sessions:[], routines:[] }, data);
      saveState(); applyTheme(); showScreen("home");
    } catch (err) { alert("Couldn't read that file — is it a valid backup?"); }
  };
  reader.readAsText(file);
});

/* ===================== INIT ===================== */
applyTheme();
renderCalendar();
renderSummary();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
