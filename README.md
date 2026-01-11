# T2P – Internship Schedule Viewer

**🔗 Live Site:** [https://gmc-mbnr.github.io/T2P/](https://gmc-mbnr.github.io/T2P/)

A modern, responsive Vue.js web application for viewing medical internship schedules at **Government General Hospital, Mahabubnagar**. Instantly check postings by roll number, group, department, or unified site — anytime, anywhere.

---

## 📌 Overview

T2P replaces messy spreadsheets with an intuitive Vue.js interface. Interns can check their postings with just a roll number (including R-prefixed ones like R5, R101) or group code, while faculty can look up who's posted where — fast and clearly.

The app:

* Built with Vue 3.5.26 and modern JavaScript
* Handles multiple schedule versions automatically
* Loads static JSON data for speed
* Remembers your last search with localStorage
* Supports both numeric and R-prefixed roll numbers

---

## ✅ Key Features

* **Student & Faculty Modes:** Toggle easily between intern and faculty views
* **Session Memory:** Remembers last-used mode and query with localStorage
* **Date Picker:** See schedules for any day with intuitive date selection
* **Dynamic Data:** Switches schedule versions automatically based on date (July 21, 2025 pivot)
* **Detailed Lookups:**
  * **Interns:** Search by roll number (141, R5, R101) or group code (A5, B12)
  * View department, posting site, daily tasks, colleagues, and random guidelines
  * **Faculty:** Lookup by department or unified site to view all posted interns
* **Mobile-First UI:** Fully responsive design with dark/light theme toggle
* **Modern Stack:** Vue 3.5.26, Vite, ES6+ with hot module replacement

---

## 🎨 UI/UX Enhancements

- **Modern Card Design**: Clean, elevated cards with hover effects
- **Improved Typography**: Better font hierarchy and readability
- **Enhanced Mobile Experience**: Responsive design with touch-friendly interactions
- **Smooth Animations**: Fade transitions and micro-interactions
- **Better Visual Feedback**: Loading states, error handling, and success indicators
- **Color Scheme**: Professional blue (#007bff) with clean grays
- **Spacing**: Consistent 8px grid system

---

## 🗂️ Project Structure

```
T2P/
├── index.html                 # Main entry point
├── src/
│   ├── App.vue               # Root Vue component
│   ├── main.js               # Vue app initialization
│   ├── style.css             # Global styles
│   ├── components/           # Vue components
│   │   ├── SearchCard.vue    # Search interface
│   │   ├── StudentResults.vue # Student lookup results
│   │   ├── FacultyResults.vue # Faculty lookup results
│   │   ├── Header.vue        # App header
│   │   ├── Footer.vue        # App footer
│   │   └── ErrorMessage.vue  # Error display
│   ├── composables/          # Vue composables
│   │   ├── useScheduleData.js # Data fetching & processing
│   │   └── useLocalStorage.js # Persistent storage
│   └── styles/
│       └── themes.css        # Theme definitions
├── public/
│   └── database/
│       └── json_data/        # Schedule data files
│           ├── group-*-schedule.json  # Weekly schedules
│           ├── group-data.json        # Roll → group mappings
│           ├── legend.json            # Posting codes
│           ├── regulations.json       # NMC rules, durations
│           ├── guidelines.json        # Daily guidelines
│           ├── schedule-data.json     # Department rotations
│           └── unified-sites.json     # Site definitions
├── package.json              # Dependencies & scripts
├── vite.config.js           # Vite configuration
└── vercel.json              # Deployment config
```

---

## ⚙️ Technical Stack

* **Frontend:** Vue 3.5.26, Vite, JavaScript ES6+
* **UI:** Responsive CSS with CSS custom properties
* **Icons:** Lucide Vue Next
* **State:** Vue Composition API with composables
* **Persistence:** localStorage for session memory
* **Data:** Static JSON files loaded dynamically
* **Development:** Vite with hot module replacement
* **Hosting:** GitHub Pages / Vercel

---

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/gmc-mbnr/T2P.git
   cd T2P
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Development Features
- Hot module replacement for instant updates
- Vue DevTools support
- Modern ES6+ JavaScript with Vite bundling
- Automatic dependency resolution
- Component-based architecture with reusable logic
- Better error handling and loading states

---

## 📦 Build & Deployment

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

The app builds to a `dist/` folder ready for any static hosting service:
* **GitHub Pages**
* **Vercel** 
* **Netlify**

---

## 🔧 Data Structure

The app dynamically loads schedule data from JSON files:
- Supports both old and new schedule formats
- Automatically switches based on pivot date (July 21, 2025)
- Handles R-prefixed roll numbers (R5, R101, R107, etc.)
- Groups are dynamically detected from data (A, B, C, D groups)

---

## 🤝 Contributing

* Found a bug? Data correction? Feature request?
  👉 **Open an issue** with clear details
* Pull requests welcome for improvements
* Follow Vue.js best practices and existing code style

---

## 📄 License

MIT License — free for educational use and contributions.