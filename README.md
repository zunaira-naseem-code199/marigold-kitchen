# Marigold Kitchen

A complete restaurant website with online table booking and a staff admin panel.
Built with the MERN stack (MongoDB, Express, React, Node).

This is a sample project. "Marigold Kitchen" is a fictional restaurant in Leeds, UK. The same code is meant to be re-skinned for a real restaurant: change the name, photos, menu, hours and colours and it is ready for a new client.

---

## Live Demo

- **Website (frontend):** https://marigold-kitchen-beige.vercel.app
- **API (backend):** https://marigold-kitchen-production.up.railway.app
- **API health check:** https://marigold-kitchen-production.up.railway.app/api/health

---

## Contents

1. [What the site does](#1-what-the-site-does)
2. [Tech stack](#2-tech-stack)
3. [Run it on your computer](#3-run-it-on-your-computer)
4. [Environment variables](#4-environment-variables)
5. [Setting up email (Gmail)](#5-setting-up-email-gmail)
6. [API reference](#6-api-reference)
7. [Booking rules](#7-booking-rules)
8. [Customising for a real client](#8-customising-for-a-real-client)
9. [Troubleshooting](#9-troubleshooting)
10. [Known limits](#10-known-limits)

---

## 1. What the site does

### Public website (for guests)

| Page | Address | What it does |
|---|---|---|
| Home | `/` | Hero, three featured dishes (from the database), chef story, tasting menu and brunch, guest reviews (from the database), photo grid |
| Menu | `/menu` | Five categories (Starters, Mains, Tandoor & Grill, Desserts, Drinks), dietary filters (Vegetarian, Vegan, Gluten free), price, diet tags and spice level on every dish. Dishes switched off in admin disappear from here immediately |
| Reservations | `/reservations` | Pick a date and party size (1 to 8), see the free time slots, enter name, phone, email and notes, get a booking reference such as `MK-PBBKN` |
| Private Dining | `/private-dining` | Details of the private room, three set menus, and an enquiry form for parties |
| Gallery | `/gallery` | Photo grid. Click a photo to open it larger. Arrow keys and Escape work |
| About & Contact | `/about` | Chef story, opening hours, address, phone, email, directions and parking, map |
| 404 | any other address | Friendly "page not found" |

Also: works on phones, a "Reserve" button stays at the bottom on mobile, keyboard friendly, per-page titles and descriptions, Restaurant structured data for Google, `sitemap.xml` and `robots.txt`.

### Booking system

- Time slots every 30 minutes.
- Last seating is 90 minutes before closing.
- Closed on Mondays (no slots shown).
- Each slot has a capacity (`MAX_COVERS_PER_SLOT`). A full slot cannot be booked.
- If two people try to take the last table at once, the second one gets a clear message and the slots refresh.
- Online bookings are for 1 to 8 guests. Bigger groups use the private dining enquiry.
- Bookings up to 90 days ahead. Dates are handled in UK time (Europe/London).
- Special dates can be closed in `.env` with `BLOCKED_DATES` (for example Christmas Day).
- Forms are checked in the browser and again on the server.

### Emails

| When | Who gets it |
|---|---|
| Guest makes a booking | Guest: "We've received your booking request". Restaurant: "New booking" alert |
| Staff confirms a booking | Guest: "Your table is confirmed" |
| Staff cancels a booking | Guest: "Your booking was cancelled" |
| Private dining enquiry sent | Guest: thank-you. Restaurant: "New private dining enquiry" |

If no email settings are filled in, emails are printed in the server terminal instead of being sent, and the booking page does not claim an email was sent. A failed email never blocks a booking.

### Admin panel (for staff) at `/admin`

Sign in with email and password. Three sections:

1. **Bookings**
   - Four numbers at the top: bookings today, covers today, awaiting confirmation, new enquiries.
   - Pick any date to see its bookings. Filter by status (Pending, Confirmed, Cancelled).
   - **Confirm** or **Cancel** a booking. The guest is emailed automatically.
2. **Menu**
   - Add, edit and delete dishes.
   - Name, description, price, category, diet tags, spice level, image URL, sort order.
   - On/off switch for availability and a "Featured on home page" option.
   - Search and category filter.
3. **Enquiries**: all private dining enquiries in one list.

Note: the dashboard opens on today's date. A booking for another day is found by changing the date.

---

## 2. Tech stack

| Part | Tools |
|---|---|
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS 3 |
| Backend | Node.js 18+, Express 4, Mongoose 8 |
| Database | MongoDB (MongoDB Atlas in production) |
| Login | JWT tokens, passwords hashed with bcryptjs |
| Validation | Zod |
| Email | Nodemailer |
| Safety | helmet, CORS allow-list, rate limiting on forms and login |
| Fonts | Fraunces (headings) and Instrument Sans (body) |

---

## 3. Run it on your computer

You need Node.js 18 or newer, and a MongoDB database (a free MongoDB Atlas cluster is the easiest).

### Step 1: Install

```bash
cd server
npm install
cd ../client
npm install
```

### Step 2: Server settings

```bash
cd server
copy .env.example .env      # Windows
# cp .env.example .env      # Mac / Linux
```

Open `server/.env` and fill in at least `MONGODB_URI` and `JWT_SECRET` (see [section 4](#4-environment-variables)).

Make a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Step 3: Fill the database with demo data

```bash
cd server
npm run seed
```

This creates 29 dishes, reviews, 3 sample bookings for today, 1 enquiry, and the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> **Warning:** `npm run seed` first **deletes** all dishes, reviews, bookings and enquiries, then adds the demo data. Never run it on a live site that has real bookings.

### Step 4: Start both

Open two terminals.

```bash
# Terminal 1
cd server
npm run dev       # API on http://localhost:5000
```

```bash
# Terminal 2
cd client
npm run dev       # Website on http://localhost:5173
```

Open http://localhost:5173. Admin: http://localhost:5173/admin.

### Using two copies of the project at once

Two servers cannot share a port. For the second copy, change `PORT` in `server/.env` (for example `5001`), change the proxy `target` in `client/vite.config.js` to the same port, start the client with `npm run dev -- --port 5174`, and set `CLIENT_URL=http://localhost:5174` in `server/.env`.

---

## 4. Environment variables

### Server (`server/.env`)

| Name | Required | What it is |
|---|---|---|
| `PORT` | no | Port for the API. Default 5000. Hosting services set it for you |
| `NODE_ENV` | no | `development` locally, `production` when live |
| `CLIENT_URL` | yes | Address of the website, used for CORS and the sitemap. Several allowed, separated by commas. No trailing `/` |
| `MONGODB_URI` | yes | MongoDB connection string. Put the database name before the `?`, e.g. `...mongodb.net/marigold-kitchen?retryWrites=true` |
| `JWT_SECRET` | yes | Long random string used to sign admin logins |
| `JWT_EXPIRES_IN` | no | How long a login lasts. Default `8h` |
| `ADMIN_EMAIL` | for seed | Admin login email |
| `ADMIN_PASSWORD` | for seed | Admin login password |
| `SMTP_HOST` | for email | Mail server, e.g. `smtp.gmail.com` |
| `SMTP_PORT` | for email | `587` |
| `SMTP_SECURE` | for email | `false` for port 587 |
| `SMTP_USER` | for email | Mail login (your Gmail address) |
| `SMTP_PASS` | for email | Mail password (a Gmail app password) |
| `MAIL_FROM` | for email | Sender shown to guests, e.g. `"Marigold Kitchen <you@gmail.com>"` |
| `RESTAURANT_EMAIL` | for email | Where "new booking" alerts go |
| `MAX_COVERS_PER_SLOT` | no | Guests allowed in one 30-minute slot. Default 40 |
| `BLOCKED_DATES` | no | Closed dates, `YYYY-MM-DD` separated by commas |

### Client (`client/.env`, only needed when live)

| Name | What it is |
|---|---|
| `VITE_API_URL` | Address of the deployed API, e.g. `https://your-api.up.railway.app` (no trailing `/`). Leave empty on your computer |
| `VITE_SITE_URL` | Public address of the website, used for canonical and share tags |

Never put `.env` files on GitHub. The `.gitignore` already blocks them.

---

## 5. Setting up email (Gmail)

1. Turn on **2-Step Verification** for the Gmail account: https://myaccount.google.com/security
2. Create an **app password**: https://myaccount.google.com/apppasswords. Name it `Marigold` and copy the 16 letters.
3. In `server/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourname@gmail.com
SMTP_PASS=the16letterapppassword
MAIL_FROM="Marigold Kitchen <yourname@gmail.com>"
RESTAURANT_EMAIL=yourname@gmail.com
```

`SMTP_USER` and the address in `MAIL_FROM` must be the same Gmail account. Write the app password with no spaces.

4. Restart the server (`.env` is only read at start). Make a booking with your own email. Two emails should arrive (check Spam).

For a real client, use an address on their own domain with a proper email service (Brevo, Resend, Postmark), so emails do not land in spam.

---

## 6. API reference

All paths start with `/api`.

### Public

| Method | Path | What it does |
|---|---|---|
| GET | `/config` | Restaurant details, opening hours, booking rules |
| GET | `/menu` | Available dishes. Optional `?category=`, `?tags=V,GF` and `?featured=true` |
| GET | `/reservations/availability?date=YYYY-MM-DD` | Free time slots for a date |
| POST | `/reservations` | Create a booking |
| POST | `/enquiries` | Send a private dining enquiry |
| GET | `/reviews` | Reviews. Optional `?featured=true` |
| GET | `/health` | Returns `{ ok: true }`. Use it to check the server is up |

### Auth

| Method | Path | What it does |
|---|---|---|
| POST | `/auth/login` | Admin login, returns a token (limited to 10 tries per 15 minutes) |
| GET | `/auth/me` | Who am I (needs token) |

### Admin (all need `Authorization: Bearer <token>`)

| Method | Path | What it does |
|---|---|---|
| GET | `/admin/stats` | Numbers for the dashboard |
| GET | `/admin/menu` | All dishes, including switched-off ones |
| POST | `/admin/menu` | Add a dish |
| PUT | `/admin/menu/:id` | Replace a dish |
| PATCH | `/admin/menu/:id` | Change part of a dish (e.g. availability) |
| DELETE | `/admin/menu/:id` | Delete a dish |
| GET | `/admin/reservations?date=` | Bookings for a date |
| PATCH | `/admin/reservations/:id/status` | Confirm or cancel (emails the guest) |
| GET | `/admin/enquiries` | All enquiries |
| PATCH | `/admin/enquiries/:id` | Update an enquiry |

Outside `/api`: `GET /sitemap.xml` and `GET /robots.txt` are also served by the API.

---

## 7. Booking rules

All of these live in `server/src/config/restaurant.js`.

- Opening hours per weekday (Monday empty means closed). Saturday has brunch and dinner.
- `slotMinutes`: 30
- `lastSeatingBeforeClose`: 90 minutes
- `maxPartySizeOnline`: 8
- `maxAdvanceDays`: 90
- Capacity per slot: `MAX_COVERS_PER_SLOT` in `.env`
- Closed dates: `BLOCKED_DATES` in `.env`

Opening hours also appear on the About page and in the footer. Those texts are in `client/src/data/site.js`. Change both places together.

---

## 8. Customising for a real client

| To change | Edit |
|---|---|
| Name, address, phone, email, geo location | `server/src/config/restaurant.js` and `client/src/data/site.js` |
| Opening hours | `server/src/config/restaurant.js` (logic) and `client/src/data/site.js` (displayed text) |
| Colours and fonts | `client/tailwind.config.js` (and the font link in `client/index.html`) |
| Photos | Put files in `client/public/photos/` and list them in `client/src/data/photos.js`. Dish photos: Admin, Menu, Edit, Image URL |
| Menu, reviews, demo bookings | `server/src/seed.js`, then `npm run seed` (**only before going live**). After that use the admin panel |
| Page text (story, set menus, tasting menu) | The files in `client/src/pages/` |
| Domain in sitemap and robots | `client/public/sitemap.xml`, `client/public/robots.txt`, and `VITE_SITE_URL` |
| Admin login | `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run the seed once on a fresh database |

Free photos: pexels.com and unsplash.com. For a real client, download the files into `client/public/photos/` and use `/photos/name.jpg` in `photos.js`, so the site does not depend on another website.

---

## 9. Troubleshooting

| Problem | Cause and fix |
|---|---|
| Blank white page, console says `destroy is not a function` | A `useEffect` returns a value by accident. Use braces: `useEffect(() => { doThing(); }, [])` |
| `Error: listen EADDRINUSE ... port 5000` | Another server is already using that port. Stop it, or change `PORT` |
| Vite shows `http proxy error ... ECONNREFUSED` | The API is not running, or the proxy `target` in `vite.config.js` has a different port than the server |
| Booking page says "Something went wrong. Please pick another date" | The site cannot reach the API. Check the server terminal and the proxy port |
| MongoDB error `certificate is not yet valid` | Your computer's date and time is wrong. Turn on "Set time automatically" and sync |
| MongoDB "could not connect to any servers" | Atlas **Network Access** is missing your IP. Add `0.0.0.0/0` |
| Email error `535 Username and Password not accepted` | Wrong Gmail or app password. `SMTP_USER` must be the Gmail that made the app password. Write the password without spaces. Make a new one if unsure |
| Terminal prints `[email:dev] To: ...` | `SMTP_HOST` is empty or the server was not restarted after editing `.env` |
| Email sent but not in the inbox | Look in Spam |
| Admin login always fails | Admin user is created by `npm run seed`. Run it, and use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from that `.env` |

**If a secret leaked** (shown in a screenshot, pasted in chat, or committed to Git): change the Atlas database user password (and update `MONGODB_URI`), create a new `JWT_SECRET`, and create a new Gmail app password. Then update the values in your `.env`.

---

## 10. Known limits

- Photos are free stock images used as placeholders. A real client needs their own.
- Reviews are added by the seed script, not by guests. There is no review form.
- Opening hours, reviews and set menus are edited in code, not in the admin panel.
- The admin panel has no image upload (paste an image address instead) and no "change password" screen.
- There are no online payments or deposits.
- A booking is not blocked for a specific table, only counted against slot capacity.
- Automated tests are not included.