# AgriNova — Complete Tech Stack & Language Breakdown

> App Name: **AgriNova / AgriAI Pioneers**  
> App ID: `com.agriai.app`  
> Platform: Android (+ PWA capable)

---

## 🗂️ Overview: Languages Used

| # | Language / Tech | Where Used |
|---|----------------|------------|
| 1 | **HTML5** | App structure (all screens/pages) |
| 2 | **CSS3 (Vanilla)** | All styling, animations, dark mode, layouts |
| 3 | **JavaScript (Vanilla ES6+)** | All app logic, AI calls, navigation |
| 4 | **JSON** | Config files, PWA manifest, data storage |
| 5 | **Node.js (JavaScript)** | Backend OTP server |
| 6 | **SQL (SQLite)** | OTP & user database on backend |
| 7 | **Groovy (Gradle DSL)** | Android build system config |
| 8 | **Shell / Bash** | Gradle wrapper scripts (gradlew) |
| 9 | **Batch Script (.bat)** | Gradle wrapper for Windows (gradlew.bat) |

---

## 📱 Feature-by-Feature Language Breakdown

### 1. 🏠 App Structure & Pages
| Task | Language | File |
|------|----------|------|
| All page layouts (Home, Scan, AI, Market, Profile, Settings) | **HTML5** | `www/index.html` |
| Page navigation & animations | **JavaScript** | `www/index.html` (inline `<script>`) |
| Page transitions (fadeUp animation) | **CSS3** | `www/index.html` (`<style>`) |

---

### 2. 🎨 Styling & UI Design
| Task | Language | Details |
|------|----------|---------|
| Color system (CSS variables) | **CSS3** | `--primary`, `--secondary`, `--accent`, etc. |
| Dark mode theming | **CSS3 + JavaScript** | `.dark-mode` class toggled via JS, saved via `localStorage` |
| Responsive mobile layouts | **CSS3** | Flexbox & Grid |
| Glassmorphism / card shadows | **CSS3** | `box-shadow`, `backdrop-filter` |
| Splash screen animation | **CSS3 Keyframes** | `@keyframes smoothFadeUp`, `smoothRise`, `logoFloat` |
| FAB button pulse animation | **CSS3 Keyframes** | `@keyframes fabPulse` |
| Google Fonts (Inter, Poppins) | **HTML** (external link) | `fonts.googleapis.com` |

---

### 3. 🔐 Login / OTP Authentication
| Task | Language | File |
|------|----------|------|
| OTP input UI | **HTML5** | `www/index.html` |
| Phone number validation | **JavaScript** | `sendOTP()` function |
| OTP generation & storage | **JavaScript + SQLite** | `server.js` + `app_database.sqlite` |
| OTP verification logic | **JavaScript + SQL** | `verifyOTP()` + backend SQL query |
| Session storage after login | **JavaScript** | `localStorage.setItem('agriLoginDone', '1')` |
| Backend REST API for OTP | **Node.js (Express)** | `server.js` |
| Database table creation | **SQL** | `CREATE TABLE IF NOT EXISTS otps / users` |

---

### 4. 🌤️ Weather Feature
| Task | Language | Details |
|------|----------|---------|
| GPS location fetch | **JavaScript** | `navigator.geolocation.getCurrentPosition()` |
| Weather data fetch | **JavaScript (async/await)** | `fetch()` → Open-Meteo API |
| City geocoding | **JavaScript** | `fetch()` → Open-Meteo Geocoding API |
| Weather card UI | **HTML + CSS** | `weather-card` class |
| Location modal | **HTML + CSS + JS** | Dropdown select + modal logic |
| Weather saved to session | **JavaScript** | `localStorage` |

**External APIs Used:**
- `api.open-meteo.com` — Weather data (Free, no key needed)
- `geocoding-api.open-meteo.com` — City name → lat/lon

---

### 5. 🤖 AI Chat (AgriAI Bot)
| Task | Language | Details |
|------|----------|---------|
| Chat UI (messages, input, send btn) | **HTML + CSS** | `.msg.bot`, `.msg.user` styles |
| Send message / receive response | **JavaScript (async/await)** | `sendMessage()` function |
| Gemini API call | **JavaScript (fetch + JSON)** | `GEMINI_URL` with `systemInstruction` + `contents` |
| Chat history management | **JavaScript** | `savedChats` array + `localStorage` |
| Typing indicator animation | **HTML + CSS** | `.dot-typing` class |
| Voice input (microphone) | **JavaScript** | `SpeechRecognition` API / Capacitor plugin |
| Offline fallback responses | **JavaScript** | `getLocalFarmingAnswer()` — keyword-based matching |
| Multi-language greeting | **JavaScript** | `T` object with `en`, `hi`, `mr` keys |
| Quick action chips | **HTML + JavaScript** | `quickAsk()` function |

**External APIs Used:**
- `generativelanguage.googleapis.com` — **Google Gemini 2.0 Flash** (AI responses)

---

### 6. 📷 Plant Doctor (Scan Tab)
| Task | Language | Details |
|------|----------|---------|
| Camera / gallery input UI | **HTML5** | `<input type="file" capture="environment">` |
| Image preview | **HTML + JavaScript** | `FileReader` → base64 conversion |
| Image analysis (AI vision) | **JavaScript (async/await)** | `analyzePlantImage()` → Gemini Vision API |
| Gemini vision prompt | **JavaScript (string)** | Plant detection + disease diagnosis prompt |
| Non-plant rejection | **JavaScript** | Checks if AI response starts with `❌` |
| Error state (API unavailable) | **HTML + JavaScript** | "Retry" button UI shown |
| Result display | **HTML + JavaScript** | `displayResult()` formats bold/newlines |
| Retake / reset scan | **JavaScript** | `resetScan()` function |

**External APIs Used:**
- `generativelanguage.googleapis.com` — **Google Gemini 2.0 Flash Vision** (image analysis)

---

### 7. 📊 Market Intelligence
| Task | Language | Details |
|------|----------|---------|
| Market page UI | **HTML + CSS** | Crop cards with sparkline graphs |
| Crop filter tabs | **JavaScript** | `setMarketTab()`, `filterCrops()` |
| Search crops | **JavaScript** | Filter by `name.toLowerCase().includes(q)` |
| SVG sparkline charts | **JavaScript (SVG)** | `profitSparkline()`, `lossSparkline()` |
| Crop economics modal | **JavaScript (async/await)** | `openCropEco()` → Gemini API for live ROI |
| Fallback crop data | **JavaScript (object)** | `CROP_FALLBACK_DATA` — 12 crops hardcoded |

**External APIs Used:**
- **Google Gemini API** — Real-time crop price & ROI analysis

---

### 8. 👤 Profile Page
| Task | Language | Details |
|------|----------|---------|
| Profile view/edit UI | **HTML + CSS** | View mode & edit mode divs |
| Save profile data | **JavaScript** | `saveProfile()` → `localStorage` |
| Load profile on app start | **JavaScript** | `updateGreeting()` on `DOMContentLoaded` |
| Avatar initial letter | **JavaScript** | `name.charAt(0).toUpperCase()` |
| Time-based greeting | **JavaScript** | `getGreetingByTime()` — Morning/Afternoon/Evening |

---

### 9. ⚙️ Settings Page
| Task | Language | Details |
|------|----------|---------|
| Dark mode toggle | **JavaScript + CSS** | `toggleDarkMode()` saves to `localStorage` |
| Language selector | **HTML (select) + JS** | 22 Indian languages listed |
| Apply language translation | **JavaScript** | `doTranslate()` → Google Translate widget |
| Clear cache | **JavaScript** | `showToast()` |
| Logout & clear data | **JavaScript** | `localStorage.clear()` + `window.location.reload()` |

**External APIs Used:**
- `translate.google.com` — **Google Translate** widget (auto-translate whole app)

---

### 10. 📋 Task Manager (Home Page)
| Task | Language | Details |
|------|----------|---------|
| Task list UI | **HTML + JavaScript** | `renderTasks()` |
| Add new task | **JavaScript** | `addNewTask()` — uses browser `prompt()` |
| Complete/delete task | **JavaScript** | `completeTask()` filters task array |
| Task persistence | **JavaScript** | `localStorage.setItem('farmerTasks', ...)` |

---

### 11. 🔔 PWA & Offline Support
| Task | Language | File |
|------|----------|------|
| PWA manifest | **JSON** | `www/manifest.json` |
| Service Worker (cache assets) | **JavaScript** | `www/sw.js` |
| Offline banner | **HTML + JavaScript** | `window.addEventListener('offline', ...)` |
| Register service worker | **JavaScript** | `navigator.serviceWorker.register('./sw.js')` |

---

### 12. 📱 Android Native Wrapper
| Task | Language | File |
|------|----------|------|
| Android project config | **Groovy (Gradle DSL)** | `android/build.gradle`, `variables.gradle` |
| Build settings | **Properties (INI-like)** | `android/gradle.properties`, `local.properties` |
| Capacitor bridge (web → native) | **JavaScript** | `window.Capacitor.Plugins.*` |
| Back button handling | **JavaScript** | `App.addListener('backButton', ...)` |
| Speech recognition (native mic) | **JavaScript** | `Capacitor.Plugins.SpeechRecognition` |
| App exit | **JavaScript** | `Capacitor.Plugins.App.exitApp()` |
| Gradle wrapper scripts | **Shell / Batch** | `gradlew`, `gradlew.bat` |

---

### 13. 🔌 Backend Server (OTP System)
| Task | Language | File |
|------|----------|------|
| HTTP server setup | **Node.js (Express)** | `server.js` |
| CORS handling | **Node.js** | `cors` npm package |
| OTP generation & storage | **JavaScript + SQL** | `server.js` + SQLite |
| REST API endpoints | **JavaScript** | `POST /api/send-otp`, `POST /api/verify-otp` |
| Database (users & OTPs) | **SQLite (SQL)** | `app_database.sqlite` |

---

### 14. 🔧 Developer / Build Tools
| Task | Tool / Language | File |
|------|----------------|------|
| Android packaging | **Capacitor (Node.js CLI)** | `npx cap copy android` |
| Icon generation | **Node.js scripts** | `update_icons.js`, `apply_new_logo.js` |
| Feature injection | **Node.js** | `inject_features.js` |
| API testing | **Node.js** | `test_api.js`, `test_gemini.js` |
| Dependency management | **JSON** | `package.json` |

---

## 🌐 All External APIs & Services

| Service | Used For | Cost |
|---------|----------|------|
| **Google Gemini 2.0 Flash** | AI Chat + Plant Doctor Vision + Market ROI | Free tier |
| **Google Translate Widget** | Full app translation (22 Indian languages) | Free |
| **Open-Meteo Weather API** | Real-time weather data | Free, no key |
| **Open-Meteo Geocoding API** | City name → coordinates | Free, no key |

---

## 📦 npm Packages Used

| Package | Purpose |
|---------|---------|
| `@capacitor/core` | Bridge between web app and Android native |
| `@capacitor/android` | Android platform support |
| `@capacitor/cli` | CLI tools (`npx cap copy`) |
| `@capacitor-community/speech-recognition` | Native microphone / voice input |
| `@capacitor/assets` | Icon and splash screen generation |
| `express` | Backend HTTP server |
| `cors` | Allow cross-origin requests to backend |
| `sqlite3` | SQLite database driver for Node.js |

---

## 🗃️ localStorage Keys (Persistent Data)

| Key | Stores |
|-----|--------|
| `agriLoginDone` | Login session flag |
| `farmerName` | User's name |
| `farmerPhone` | User's phone number |
| `farmerEmail` | User's email |
| `farmerLoc` | User's location |
| `farmerLang` | Selected language code |
| `darkMode` | `'1'` or `'0'` for theme |
| `agriBotHistory` | Chat history (JSON array) |
| `farmerTasks` | Task list (JSON array) |
| `fabLeft` / `fabTop` | Floating AI button position |
