# event-board

A campus event page for IIIT Vadodara. It shows upcoming college events as cards and a table, lets students search them, RSVP to an event, and submit a new event through a validated form.

The events are not written in the HTML. They are stored in `events.json`, loaded with `fetch()`, and displayed by `script.js`.

## Features

- Event cards and a table built from data (`events.json`)
- Availability label for each event: **Open**, **Few left** (fewer than 5 seats) or **Full** (0 seats)
- Live search by event title or category; press **Esc** to clear
- RSVP button on each card that reduces the seats left (demo only, not saved)
- Full events are dimmed and their button is disabled
- Loading, success and error messages while the data is fetched
- Hamburger menu that shows and hides the navigation links on small screens
- Event submission form with built-in checks (`required`, `type="email"`, `pattern`) and a custom rule (name must be at least 2 characters) using `setCustomValidity`
- Responsive layout built with CSS Grid and Flexbox

## Project structure

```
event-board/
├── index.html      page structure
├── style.css       styles and responsive layout
├── script.js       logic, DOM updates, fetch and form validation
├── events.json     event data
├── IIITV_LOGO.png  college logo
├── NOTES.pdf       answers to the lab questions and code appendix
└── README.md
```

## How to run

`fetch()` does not work when `index.html` is opened by double-clicking it, so use a local server.

**VS Code:** install the Live Server extension, right-click `index.html` and choose **Open with Live Server**.

**Terminal:**

```
python -m http.server
```

Then open `http://localhost:8000` in your browser.

## Event data format

Each event in `events.json` is an object:

```json
{ "id": 2, "title": "E-Sports", "date": "2026-11-10", "category": "Gaming", "seats": 3, "online": true }
```

| Field      | Type    | Meaning                         |
|------------|---------|---------------------------------|
| `id`       | number  | unique id used by the RSVP button |
| `title`    | string  | event name                      |
| `date`     | string  | date in `YYYY-MM-DD` format     |
| `category` | string  | shown as a badge                |
| `seats`    | number  | seats left                      |
| `online`   | boolean | `true` for an online event      |

To add an event, add another object to the array. No HTML change is needed.

## Form validation

| Field       | Rule                                                   |
|-------------|--------------------------------------------------------|
| Your name   | required, at least 2 characters (custom rule)          |
| Date        | required                                               |
| Email       | required, must be a valid email                        |
| Location    | required, 3 to 60 letters, numbers, spaces, commas, dots or hyphens |
| Description | optional, up to 200 characters                         |

If a field is invalid, the submit is blocked and the first error message is shown. The server must still validate the data again in a real application, because browser checks can be bypassed.

## Technologies

HTML5, CSS3 (custom properties, Grid, Flexbox, media queries), JavaScript (ES6+: `const`/`let`, arrow functions, `async`/`await`, DOM and event handling, Fetch API).

## Team

| Role        | Roll number | Name          |
|-------------|-------------|---------------|
| Team Leader | 20261651014 | Ankit Sahoo   |
| Member 1    | 20261651095 | Vikas Gupta   |
| Member 2    | 20261651064 | Prakash Rai   |
| Member 3    | 20261651070 | Ram Ranjan    |
| Member 4    | 20261651090 | Sukant Sharma |

Course: CS445 - Basics of Web Programming (Lab Assignment 6)