# Developer Portfolio Application

A premium, modern cross-platform portfolio application built using **React Native**, **Expo Router (File-based Routing)**, and **TypeScript**. Optimized for both mobile devices (iOS/Android) and Web deployment (React Native Web).

---

## 🌟 Key Features

* **🏠 Home / Hero Screen:** A premium developer landing card showcasing professional profile, bio, responsive social links, live stats (years of experience, completed projects), and CTA redirects.
* **💼 Services Screen:** Displays specialized services (Mobile, Web, Design, consulting) in custom cards, featuring itemized deliverables and quick-action inquiries.
* **📂 Portfolio Screen (Projects & Certificates):**
  * **Projects:** Gallery with image previews, project summaries, tech stack badges, and links to GitHub and Live Demos.
  * **Certificates:** Showcases certifications with a full-screen image zoom viewer modal and a direct PDF credential link (using `expo-web-browser` for native browser integrations).
* **✉️ Contact Screen:** Dynamic contact information cards and a fully validated interactive form (Name, Email, Subject, Message) supporting route-parameter pre-filling from Services and animated success confirmations.
* **🌓 Theme Support:** Built-in Light and Dark Mode options conforming to system colors.

---

## 🛠️ Tech Stack & Dependencies

The application relies on the following key dependencies:

* **Core Platform:** React Native `~0.85.3`, Expo `~56.0.12`, React `19.2.3`
* **Routing:** `expo-router` `~56.2.11` (Static and dynamic file-based routing)
* **Web Integration:** `react-native-web` `~0.21.0` (Ensures compilation and rendering on web browsers)
* **Interactions & Icons:** `@expo/vector-icons` (Ionicons for cross-platform visual consistency), `expo-web-browser` (for PDF/links navigation)
* **Language System:** TypeScript `~6.0.3` for type safety

---

## 📂 Project Folder Structure

This project adopts a clean, modular architecture separating routes from business and visual logic:
* The **`app/`** directory manages file-based routing.
* The **`src/`** directory houses components, constants, types, and logic.

```
my-portfolio/
├── app/                           # Expo Router File-based Routing
│   ├── (tabs)/                    # Tab Navigator Group
│   │   ├── _layout.tsx            # Bottom Tabs Navigator & Icon Setup
│   │   ├── index.tsx              # Home / Hero Screen
│   │   ├── services.tsx           # Services Screen
│   │   ├── portfolio.tsx          # Portfolio (Projects & Certificates) Screen
│   │   └── contacts.tsx           # Contacts Screen with Form & Validation
│   ├── +html.tsx                  # Web template layout config
│   ├── +not-found.tsx             # 404 Route Screen
│   ├── _layout.tsx                # Root Stack Navigator & Font Loader
│   └── modal.tsx                  # Modal Overlay Router
├── assets/                        # Static Assets
│   ├── fonts/                     # Typography files
│   ├── images/                    # Project screenshots, certificates, avatar
│   └── pdfs/                      # Local PDF credentials placeholders
├── src/                           # Logic & Reusable Elements
│   ├── components/                # UI Components & Context Hooks
│   │   ├── Themed.tsx             # Theme-aware Views & Text components
│   │   ├── useColorScheme.ts      # Device theme configuration hook
│   │   └── ...
│   ├── constants/                 # Central data & theme styling
│   │   ├── Colors.ts              # Curated light and dark mode colors
│   │   └── portfolioData.ts       # Structured portfolio data (projects, certs)
├── package.json                   # Dependency listings & start scripts
├── tsconfig.json                  # TypeScript compiler settings & path alias (@/*)
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Installation
Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### 3. Running the Application

* **Web (Browser):**
  ```bash
  npm run web
  ```
  This opens the portfolio inside your default web browser on `http://localhost:8081`.

* **iOS Simulator / Android Emulator:**
  Ensure you have Xcode or Android Studio installed, then run:
  ```bash
  npm run ios
  # OR
  npm run android
  ```

---

## ✏️ Customizing Your Portfolio

To update the website with your own profile, projects, and certificates:

1. **Update Portfolio Data:**
   Open `src/constants/portfolioData.ts` and modify the text, social links, stats, services, and list details.
   
2. **Replace Project and Certificate Images:**
   Drop your custom images (e.g. `.png` or `.jpg`) inside `assets/images/` and update the `require(...)` statements inside `src/constants/portfolioData.ts`.
   
3. **Upload Certificate PDFs:**
   Place your actual certificate PDFs inside `assets/pdfs/` and link them. For absolute cross-platform reliability on mobile, host the PDFs online (e.g., Google Drive, Cloudinary) and reference the URL in the `pdfUrl` field.
