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
  - **Dynamic Portfolio Management:** Add, edit, archive, and delete projects or certificates in real-time.
  - **Hybrid Database Sync:** Automatically stores data in **Supabase Cloud Database & Storage** (if configured) or gracefully falls back to local **IndexedDB** & `localStorage` on browsers.
  - **Asset & PDF Hosting:** Converts uploaded local image screenshots and credential PDFs into Base64 format, saving them securely to the database (local IndexedDB) or uploading them directly to **Supabase Storage buckets**.
  - **Interactive Previews:** Gallery with image previews, tech stack badges, GitHub/Live demo links, and a full-screen image zoom viewer modal for certificates with direct PDF credential links.
  - **Visual Upgrades:** Outfitted with specialized 3D-glow transitions for the edit, delete, and archive control triggers.
* **⚙️ Settings & Theme Customization:**
  - Accessible via the responsive Web Header or Mobile Navigation.
  - **Persistent Theme Switcher:** Toggles between Light and Dark mode globally, saving preference in `localStorage` to prevent style flicker on reload.
  - **Data Archive Management:** Restore or permanently delete archived items directly from the Settings Modal.
  - **Data Reset:** Lets users wipe all custom modifications and restore the original portfolio template defaults (both locally and on Supabase).
* **🔔 Premium Web Alerts & Loaders:** Integrates custom `SweetAlert2` workflows with matching dark/light themes, blur-backdrop overlays, asynchronous activity loaders (e.g. deleting, archiving), and verification alerts.
* **🔄 Real-time Tab Synchronization:** Employs window-level event dispatching (`portfolio-data-updated`) on the Web so updates made in settings or forms sync immediately across all open headers, views, and tabs without a reload.
* **🎨 Micro-Animations & 3D Interactive Hover Effects:** Responsive, CSS-driven interactions applied across web controls:
  - Navigation links feature sliding underline indicators with text-shadow glow.
  - Primary call-to-action buttons feature scale-lifts, shadow expansion, and custom light-sweep reflective sheen effects.
  - Social media links feature hover expansion, border glow, and rotational icon offsets.

---

## 🛠️ Tech Stack & Dependencies

The application relies on the following key dependencies:

* **Core Platform:** React Native `~0.85.3`, Expo `~56.0.12`, React `19.2.3`
* **Routing:** `expo-router` `~56.2.11` (Static and dynamic file-based routing)
* **Cloud Persistence:** `@supabase/supabase-js` `^2.108.2` (Provides cloud database synchronization and media storage)
* **Web Integration:** `react-native-web` `~0.21.0` (Ensures compilation and rendering on web browsers)
* **Web UI Interactions:** `sweetalert2` `^11.26.25` (For premium popup confirmations, async loaders, and alerts)
* **Interactions & Icons:** `@expo/vector-icons` (Ionicons for cross-platform visual consistency), `expo-web-browser` (for PDF/links navigation)
* **Native Media Support:** `react-native-svg` and `react-native-webview` (for rendering custom SVGs and WebViews on mobile devices)
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
│   │   ├── DeleteConfirmation.web.ts # SweetAlert2 web confirmation and async loaders
│   │   ├── NetworkBackground.tsx  # Interactive HTML5 Canvas particle network backdrop
│   │   ├── SettingsModal.tsx      # Theme, archive management, and data reset modal
│   │   ├── Themed.tsx             # Theme-aware Views & Text components
│   │   ├── WebHeader.tsx          # Responsive Web Header Navigation
│   │   ├── useColorScheme.ts      # Theme status manager (localStorage synced)
│   │   ├── useColorScheme.web.ts  # SSR-safe Web theme manager
│   │   └── ...
│   ├── constants/                 # Central data & theme styling
│   │   ├── Colors.ts              # Curated light and dark mode colors
│   │   └── portfolioData.ts       # Structured portfolio data (projects, certs)
│   └── utils/                     # Utility Functions & Database Helpers
│       ├── image.ts               # Base64 helper for local file picking
│       ├── storage.ts             # IndexedDB & LocalStorage fallback store
│       └── supabase.ts            # Supabase database & storage CRUD helpers
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

### 4. Supabase Setup & Cloud Integration (Optional)

To enable cross-device cloud persistence and server-side asset storage, configure a Supabase backend:

1. **Create a Supabase Project:**
   Sign up on [Supabase](https://supabase.com/) and create a new project.

2. **Configure Environment Variables:**
   Duplicate the `.env.example` file to `.env` in the root folder, and fill in your Project URL and Anonymous API Key:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Set Up Database Tables:**
   Execute the following SQL queries in the Supabase **SQL Editor** to create the necessary tables:

   ```sql
   -- Create Projects Table
   create table portfolio_projects (
     id text primary key,
     title text not null,
     description text not null,
     tech_stack text[] not null,
     image_url text,
     github_url text not null,
     live_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Create Certificates Table
   create table portfolio_certificates (
     id text primary key,
     title text not null,
     issuer text not null,
     issue_date text not null,
     image_url text,
     pdf_url text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Create Resumes Table
   create table portfolio_resumes (
     id text primary key default 'latest',
     url text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

4. **Set Up Storage Bucket:**
   - Go to **Storage** in your Supabase dashboard.
   - Create a new bucket named **`portfolio-assets`**.
   - Make the bucket **Public** (so that image and PDF links are public).
   - Ensure you configure your storage policies to allow uploads, updates, and deletes for the bucket (or disable RLS temporarily on the bucket for development testing).
---

## ✏️ Customizing Your Portfolio

To update the website with your own profile, projects, and certificates:

1. **Configure Persistence Mode:**
   * **Local Mode (Default):** If no `.env` file is present or if Supabase keys are not set, all portfolio adjustments (adds, edits, deletes, archives) are stored locally in the browser's IndexedDB (with `localStorage` backup).
   * **Cloud Mode:** Once Supabase keys are defined in your `.env` file, the app automatically uploads screenshots and PDFs to the `portfolio-assets` storage bucket and saves structured data to database tables, enabling persistent cloud synchronization across any client.

2. **Update Main Profile Data:**
   Open `src/constants/portfolioData.ts` and modify the text, bio, social links, stats, and services definitions.

3. **In-App Content Management (Web/Mobile):**
   * **Upload Items:** Click **Upload Work** directly on the Portfolio screen to add new projects or certificates.
   * **Edit/Delete/Archive:** Hover or tap on items in the Portfolio gallery to reveal the quick-action panel:
     - **Edit (Pencil Icon):** Modify the title, issuer/tech stack, links, or media files.
     - **Archive (Box Icon):** Temporarily archive an item. You can view, restore, or delete archived items permanently from the Settings panel.
     - **Delete (Trash Icon):** Remove the item permanently.
   * **Settings (Gear Icon):** Toggle Light/Dark mode, manage archived items, or run a **Data Reset** to clear custom modifications and seed back default template data.

4. **Manual Static Assets (Alternative):**
   * Put custom images inside `assets/images/` and reference them using `require(...)` inside `src/constants/portfolioData.ts`.
   * For certificates, place the files in `assets/pdfs/`. For maximum reliability across mobile environments, hosting PDFs on cloud storage services (like Google Drive, Cloudinary, or Supabase Storage) is highly recommended.
