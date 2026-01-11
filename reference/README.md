# T2P – Internship Schedule Viewer

**🔗 Live Site:** [https://gmc-mbnr.github.io/T2P/](https://gmc-mbnr.github.io/T2P/)

A simple, responsive web app for viewing medical internship schedules at **Government General Hospital, Mahabubnagar**. Instantly check postings by roll number, group, department, or unified site — anytime, anywhere.

---

## 📌 Overview

T2P replaces messy spreadsheets with an easy-to-use interface. Interns can check their postings with just a roll number or group code, while faculty can look up who’s posted where — fast and clearly.

The app:

* Handles multiple schedule versions automatically.
* Loads static JSON data for speed.
* Remembers your last search, so returning users get instant results.

---

## ✅ Key Features

* **Student & Faculty Modes:** Toggle easily.
* **Session Memory:** Remembers last-used mode and query with `localStorage`.
* **Date Picker:** See schedules for any day.
* **Dynamic Data:** Switches schedule versions automatically based on the date (`21 July 2025` and later).
* **Detailed Lookups:**

  * **Interns:** Search by *roll number* or *group code* (e.g., `141`, `A5`).
  * View *department*, *posting site*, *daily tasks*, *colleagues*, and a *random guideline*.
  * **Faculty:** Lookup by *department* or *unified site* to view all interns posted there.
* **Mobile-First UI:** Fully responsive, with dark mode for comfortable viewing.
* **Zero Dependencies:** Pure HTML, CSS, and modern ES6+ JavaScript.

---

## 🗂️ Project Structure

```
T2P/
├── index.html             # Main page
├── css/
│   └── styles.css         # Styling
├── js/
│   └── main.js            # Core logic
├── database/
│   └── json_data/
│       ├── group-*-schedule.json  # Weekly schedules
│       ├── group-data.json        # Roll number → group mappings
│       ├── legend.json            # Posting codes
│       ├── regulations.json       # NMC rules, durations
│       ├── guidelines.json        # Daily guidelines
│       ├── schedule-data.json     # Department rotation overview
│       └── unified-sites.json     # Site definitions (ICU, OT Complex, etc.)
└── README.md
```

---

## ⚙️ Technical Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **State Persistence:** `localStorage`
* **Data:** Static JSON files, loaded dynamically
* **Development:** Visual Studio Code + Gemini Code Assist
* **Hosting:** GitHub Pages (or any static site host)

---

## 🚀 Local Development

1. **Clone the repo**

   ```bash
   git clone https://github.com/gmc-mbnr/T2P.git
   ```

2. **Serve locally**

   * With VS Code’s **Live Server** extension **OR**
   * Using Python:

     ```bash
     python -m http.server
     ```
   * Or:

     ```bash
     npx serve .
     ```

3. **Open `http://localhost:PORT`** in your browser.

---

## 📦 Deployment

Just push to `main` (or `gh-pages` branch if used). It’s 100% static, so any static host works:

* **GitHub Pages**
* **Vercel**
* **Netlify**

---

## 🤝 Contributing

* Found a bug? Data correction? Suggestion?
  👉 **Open an issue** with clear steps.
* Pull requests are welcome!

---

## 📄 License

MIT — free for educational use and contributions.
