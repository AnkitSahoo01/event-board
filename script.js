// ============================================================
// CS445 Lab 6 - Event Board (IIIT Vadodara)
// Linked in index.html with <script src="script.js" defer>, so the
// DOM is fully parsed before any of this code runs.
// ============================================================

// ---------- A2: variables (const by default, let only if it changes) ----------
const SITE_NAME = "Event Board - IIIT Vadodara"; // string
const LOW_SEATS_LIMIT = 5;                        // number
const DATA_URL = "events.json";                   // string (file loaded in B7)
let isLoading = true;                             // boolean, changes -> let
let searchTerm = "";                              // string, changes -> let

// ---------- A3: the events array is the single source of truth ----------
// An array of objects: { id, title, date, category, seats, online }.
// It is filled from events.json by loadEvents() (B7).
let allEvents = [];

// ---------- B1: select elements (each stored in a const) ----------
const menuToggle   = document.querySelector(".menu-toggle");          // querySelector
const navLinks     = document.querySelector(".nav-links");
const cardsBox     = document.getElementById("event-cards");          // the one getElementById
const tableBody    = document.querySelector("#event-table tbody");
const statusBox    = document.querySelector("#status");
const searchBox    = document.querySelector("#search");
const form         = document.querySelector("#event-form");
const nameInput    = document.querySelector("#person-name");
const formMessage  = document.querySelector("#form-message");
const formFields   = document.querySelectorAll("#event-form input, #event-form textarea"); // querySelectorAll

console.log(`${SITE_NAME} - script loaded`);                         // B9
console.log("Form fields found:", formFields.length);

// ---------- A4: control flow (if / else if / else) ----------
function getAvailability(seats) {
  if (seats === 0) {
    return "Full";
  } else if (seats < LOW_SEATS_LIMIT) {
    return "Few left";
  } else {
    return "Open";
  }
}

// ---------- A6: function with a parameter and a return value ----------
function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);                         // const lives only inside this function (A8)
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const rest = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${weekday}, ${rest}`;
}

function formatEvent(ev) {
  const label = getAvailability(ev.seats);
  const mode = ev.online ? "Online" : "On campus";
  return `${ev.title} - ${formatDate(ev.date)} - ${label} (${mode})`;
}

// ---------- A7: arrow functions with array methods ----------
// filter(): keep only events that still have seats
const getOpenEvents = (events) => events.filter(ev => ev.seats > 0);
// map(): transform the list of objects into a list of titles
const getTitles = (events) => events.map(ev => ev.title);

// ---------- B3: show status messages (textContent, classList, hidden) ----------
function setStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
  statusBox.hidden = message === "";
}

function updateSummary() {
  const openCount = getOpenEvents(allEvents).length;
  setStatus(`${openCount} of ${allEvents.length} events still have seats.`, "success");
}

// ---------- B2: render the cards (and table) from data ----------
function renderEvents(list) {
  cardsBox.textContent = "";   // clear old cards
  tableBody.textContent = "";

  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty-message");
    empty.textContent = "No events match your search.";
    cardsBox.appendChild(empty);
    return;
  }

  // A5: for...of loop - visits every event exactly once
  for (const ev of list) {
    const label = getAvailability(ev.seats);              // A8: block-scoped, one per iteration
    const slug = label.toLowerCase().replace(" ", "-");   // "few-left"

    // --- card ---
    const card = document.createElement("article");
    card.classList.add("card");
    card.setAttribute("aria-label", formatEvent(ev));     // B3: setAttribute (uses A6 result)
    card.dataset.id = ev.id;

    const title = document.createElement("h3");
    title.textContent = ev.title;

    const day = document.createElement("p");
    day.textContent = `Day: ${formatDate(ev.date)}`;

    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = ev.category;

    const mode = document.createElement("p");
    mode.textContent = ev.online ? "Online event" : "On campus";

    const availability = document.createElement("p");
    availability.classList.add("availability", `avail-${slug}`);
    availability.textContent = `${label} - ${ev.seats} seats`;

    const rsvp = document.createElement("button");
    rsvp.type = "button";
    rsvp.classList.add("rsvp");
    rsvp.dataset.id = ev.id;
    rsvp.textContent = "RSVP";

    // B3: reflect state - a full event gets a .full class, a new label and a disabled button
    if (ev.seats === 0) {
      card.classList.add("full");
      rsvp.textContent = "Full";
      rsvp.disabled = true;
      rsvp.style.cursor = "not-allowed";
    }

    card.append(title, day, badge, mode, availability, rsvp);
    cardsBox.appendChild(card);

    // --- table row ---
    const row = document.createElement("tr");
    for (const text of [ev.title, formatDate(ev.date), String(ev.seats), label]) {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
}

// ---------- B6: filter by search text ----------
function applyFilter() {
  const term = searchTerm.trim().toLowerCase();
  const visible = allEvents.filter(ev =>                      // arrow function + filter
    ev.title.toLowerCase().includes(term) ||
    ev.category.toLowerCase().includes(term)
  );
  renderEvents(visible);
}

searchBox.addEventListener("input", (event) => {              // fires on every keystroke
  searchTerm = event.target.value;
  applyFilter();
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {                               // Escape clears the search
    searchBox.value = "";
    searchTerm = "";
    applyFilter();
  }
});

// ---------- B4: hamburger button toggles the nav links ----------
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// ---------- B5: event object + bubbling (one listener for all RSVP buttons) ----------
cardsBox.addEventListener("click", (event) => {
  const clicked = event.target;                               // the exact element clicked
  console.log("clicked:", clicked, "| listener is on:", event.currentTarget);

  if (!clicked.classList.contains("rsvp")) return;            // ignore clicks on other parts of a card

  const ev = allEvents.find(item => item.id === Number(clicked.dataset.id));
  if (ev && ev.seats > 0) {
    ev.seats -= 1;                                            // demo only: not saved anywhere
    console.log(`RSVP for "${ev.title}" - seats left: ${ev.seats}`);
    applyFilter();
    updateSummary();
  }
});

// ---------- B7: fetch the data with async / await (3 states) ----------
async function loadEvents() {
  isLoading = true;
  setStatus("Loading events...", "loading");                  // state 1: loading
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    allEvents = await response.json();
    console.log("Loaded events:", allEvents);
    console.log("Titles:", getTitles(allEvents));
    applyFilter();                                            // state 2: success -> render
    updateSummary();
  } catch (error) {
    console.error("Could not load events:", error);
    setStatus("Sorry, we could not load the events right now. Please try again later.", "error"); // state 3: failure
  } finally {
    isLoading = false;
  }
}

// ---------- B8: form validation ----------
// Custom rule: the name must have at least 2 characters (after trimming spaces).
function checkName() {
  if (nameInput.value.trim().length < 2) {
    nameInput.setCustomValidity("Name must be at least 2 characters long.");
  } else {
    nameInput.setCustomValidity("");                          // empty string = valid
  }
}

nameInput.addEventListener("input", checkName);

form.addEventListener("submit", (event) => {
  checkName();
  form.classList.add("was-submitted");                        // lets CSS highlight :invalid fields

  if (!form.checkValidity()) {
    event.preventDefault();                                   // block the submit
    const firstInvalid = form.querySelector(":invalid");
    formMessage.textContent = firstInvalid.validationMessage;
    formMessage.className = "form-message error";
    firstInvalid.focus();
    return;
  }

  event.preventDefault();                                     // valid, but there is no server in this lab
  formMessage.textContent = `Thanks, ${nameInput.value.trim()}! Your event was submitted.`;
  formMessage.className = "form-message success";
  form.reset();
  form.classList.remove("was-submitted");
});

// ---------- start ----------
loadEvents();
