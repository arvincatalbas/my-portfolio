# Developer Portfolio Application

A premium, modern cross-platform portfolio application built using **React Native**, **Expo Router (File-based Routing)**, and **TypeScript**. Optimized for both mobile devices (iOS/Android) and Web deployment (React Native Web).

---

## 🌟 Key Features

* **🏠 Home / Hero Screen:** A premium developer landing card showcasing professional profile, bio, responsive social links (Facebook, Instagram, LinkedIn, GitHub, Twitter), live stats (certifications, technical skills, IT projects), and CTA redirects.
* **✨ Interactive 3D Avatar (`Avatar3D`):** A custom, responsive profile avatar featuring distinct experiences per platform:
  - **Web:** Parallax cursor-tracking 3D rotation with depth rendering. Features a glowing hexagon container wrapped in dual-orbiting rings (dashed and solid) rotating in opposite directions. Surrounded by floating 3D tech badge icons (Linux terminal, network path, database server, React) that float independently, complete with a hover-activated scanline hologram overlay sweep.
  - **Mobile:** Rendered in a clean circular design with a dual-layered pulsing shadow/opacity boundary.
* **🌐 Dynamic Network Backdrop (`NetworkBackground`):** An interactive, canvas-driven network constellation background (for Web) with floating nodes connected by proximity-based lines. Nodes dynamically repel away from the user's cursor on hover, adapting colors and line opacity based on the active dark/light mode.
* **ℹ️ About Screen:** A dedicated bio screen showcasing the premium `Avatar3D` component, a detailed professional story, and core qualification cards.
* **💼 Services Screen:** Displays specialized services (Networking & IT Infrastructure, Front-End Development, System Administration & OS Support, Hardware & Electrical Maintenance) in custom cards, featuring itemized deliverables and quick-action inquiries.
* **📂 Portfolio Screen (Projects & Certificates):**
  - **Dynamic Portfolio Management:** Supports adding, editing, and deleting projects or certificates in real-time.
  - **Image & PDF Uploads:** Features a local file picker that converts image screenshots and credential PDFs into Base64 format for self-contained persistence.
  - **Interactive Previews:** Gallery with image previews, tech stack badges, GitHub/Live demo links, and a full-screen image zoom viewer modal for certificates with direct PDF credential links.
  - **Visual Upgrades:** Outfitted with specialized 3D-glow transitions for the edit/delete floating control triggers.
* **⚙️ Settings & Theme Customization:**
  - Accessible via the responsive Web Header or Mobile Navigation.
  - **Persistent Theme Switcher:** Toggles between Light and Dark mode globally, saving preference in `localStorage` to prevent style flicker on reload.
  - **Data Reset:** Lets users wipe all custom modifications and restore the original portfolio template defaults.
* **🔔 Premium Web Alerts:** Integrates `SweetAlert2` on browsers for modern, visually polished delete confirmations and success notifications.
* **🎨 Micro-Animations & 3D Interactive Hover Effects:** Responsive, CSS-driven interactions applied across web controls:
  - Navigation links feature sliding underline indicators with text-shadow glow.
  - Primary call-to-action buttons feature scale-lifts, shadow expansion, and custom light-sweep reflective sheen effects.
  - Social media links feature hover expansion, border glow, and rotational icon offsets.

---

## 🛠️ Tech Stack & Dependencies

The application relies on the following key dependencies:

* **Core Platform:** React Native `~0.85.3`, Expo `~56.0.12`, React `19.2.3`
* **Routing:** `expo-router` `~56.2.11` (Static and dynamic file-based routing)
* **Web Integration:** `react-native-web` `~0.21.0` (Ensures compilation and rendering on web browsers)
* **Web UI Interactions:** `sweetalert2` `^11.26.25` (For premium popup confirmations and alerts)
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
│   │   ├── about.tsx              # About Me Screen with 3D Visuals
│   │   ├── services.tsx           # Services Screen
│   │   ├── portfolio.tsx          # Interactive Portfolio Management Screen
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
│   │   ├── Avatar3D.tsx           # Premium 3D profile avatar with cursor-tracking and orbit rings
│   │   ├── DeleteConfirmation.ts  # Native delete alert confirmation
│   │   ├── DeleteConfirmation.web.ts # SweetAlert2 web confirmation
│   │   ├── NetworkBackground.tsx  # Interactive HTML5 Canvas particle network backdrop
│   │   ├── SettingsModal.tsx      # Theme and data reset modal
│   │   ├── Themed.tsx             # Theme-aware Views & Text components
│   │   ├── WebHeader.tsx          # Responsive Web Header Navigation
│   │   ├── useColorScheme.ts      # Theme status manager (localStorage synced)
│   │   ├── useColorScheme.web.ts  # SSR-safe Web theme manager
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
   
2. **In-App Management (Web/Mobile):**
   * Use the **Upload Work** form directly in the app's Portfolio section to add new projects and certificates.
   * Hover or tap on items in the Portfolio section to display the edit/delete options.
   * Settings (Theme preferences and Data reset) can be configured via the gear icon in the header.

3. **Upload custom assets manually:**
   Drop your custom images (e.g. `.png` or `.jpg`) inside `assets/images/` and update the `require(...)` statements inside `src/constants/portfolioData.ts`.

4. **Upload Certificate PDFs:**
   Place your actual certificate PDFs inside `assets/pdfs/` and link them. For absolute cross-platform reliability on mobile, host the PDFs online (e.g., Google Drive, Cloudinary) and reference the URL in the `pdfUrl` field.
