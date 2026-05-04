# The Mental Compass
### **Business Professionals of America (BPA) | National Leadership Conference**
**Event:** (435) Website Design Team  
**Project Focus:** Mental Health Awareness & Digital Well-being

---

## 🌟 Executive Summary
**The Mental Compass** is a comprehensive web-based platform designed to provide accessible, high-quality mental health resources and education. Developed as a competitive entry for the Business Professionals of America (BPA) National Leadership Conference, this project demonstrates excellence in UI/UX design, frontend engineering, and digital accessibility.

Our platform serves as a "compass" for users navigating the complexities of mental health, offering a clean, calming, and responsive interface that prioritizes user experience during sensitive information-seeking tasks.

---

## 🎨 Design & UX Philosophy
The design process followed a rigorous industry-standard workflow to ensure the final product met both aesthetic and functional requirements.

* **Prototyping:** A high-fidelity interactive prototype was developed in **Figma** before a single line of code was written. This allowed for rapid iteration on user flow and visual hierarchy.
* **Visual Language:** We utilized a palette of soothing tones to reduce user anxiety, paired with modern sans-serif typography (optimized for readability) to ensure information is easily digestible.
* **Accessibility (WCAG):** The site was built with accessibility as a core requirement, focusing on high color contrast, semantic HTML, and screen-reader compatibility.
* **Responsive Design:** Using a mobile-first philosophy, the site provides a seamless experience across smartphones, tablets, and desktop computers.

---

## 🛠 Technical Stack
This project leverages modern frontend tooling to ensure high performance, security, and maintainability.

| Technology | Purpose |
| :--- | :--- |
| **TypeScript** | Ensures type safety and reduces runtime errors for a more robust codebase. |
| **Vite** | Used as the build tool and development server for industry-leading performance. |
| **CSS3** | Custom-architected styles using Flexbox and CSS Grid for a pixel-perfect layout. |
| **HTML5** | Semantic structure used to maximize SEO and accessibility. |
| **NPM** | Package management for maintaining project dependencies. |

---

## 📂 Project Structure & Architecture
The repository is organized following the **Separation of Concerns** principle to ensure the code is scalable and easy for judges to audit.

```text
the-mental-compass/
├── src/                    # Main application source code
│   ├── assets/             # Optimized images, icons, and global media
│   ├── styles/             # Modular CSS files for layout and components
│   └── main.ts             # Application entry point & TypeScript logic
├── index.html              # Main DOM entry point
├── vite.config.ts          # Advanced build configurations
├── package.json            # Project metadata, scripts, and dependencies
├── .npmrc                  # Environment-specific configuration
└── README.md               # Technical documentation (this file)
```

---

## 🚀 Installation & Deployment
To run the production build or development server locally, follow the steps below.

### **Prerequisites**
* Node.js (Latest LTS version recommended)
* NPM (Installed automatically with Node.js)

### **Setup Instructions**
1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/joshmzamora/the-mental-compass.git](https://github.com/joshmzamora/the-mental-compass.git)
    cd the-mental-compass
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *Access the site at: `http://localhost:5173`*

4.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## ✨ Key Features
* **Resource Library:** Categorized modules for different mental health topics (Anxiety, Depression, Wellness).
* **Performance Metrics:** Fast load times achieved through Vite’s optimized bundling.
* **Semantic Navigation:** Intuitive, standardized navigation bar designed for high usability.
* **Interactive Elements:** Responsive UI components that react to user input via TypeScript.

---

## BPA Presentation Tools

### Hidden Waiting Screen
Open `/presentation` directly for the ambient judges-room screen. It is intentionally hidden from the main navigation.

### Desktop-To-Mobile Demo Sync
For a simple competition demo, the site can sync one desktop browser window with a second mobile-sized browser window on the same computer.

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open the desktop controller window:
   ```text
   http://localhost:5173/?sync=host
   ```
3. Open a second browser window and turn on mobile device mode in DevTools.
4. In that mobile-sized window, open:
   ```text
   http://localhost:5173/?sync=follow
   ```
5. Navigate, scroll, click, and type in the desktop controller window. The mobile-sized window follows automatically.

Notes:
* This uses the browser `BroadcastChannel` API, so it is meant for two windows/tabs on the same computer and same browser profile.
* Scroll syncing uses page percentage instead of exact pixels so desktop and mobile layouts stay aligned even when their page heights differ.
* Basic links, buttons, tabs, selects, checkboxes, radio buttons, text inputs, textareas, clickable cards, and scrollable dialog/panel areas are mirrored. Password fields are intentionally not mirrored.
* Custom interactions that do not use normal clickable or form elements may need their own URL state or a small `data-sync-target` marker.
* To stop sync in a window, open the site with `?sync=off`.

---

## 👥 Competition Credits
This project was developed by the **Website Design Team** for the Business Professionals of America competition.

* **Team Member:** Josh Zamora ([@joshmzamora](https://github.com/joshmzamora))
* **Role:** Lead Frontend Developer & UI Designer
* **Organization:** Business Professionals of America (BPA)

---

## 📬 Contact Information
For questions regarding the development, design documentation, or technical implementation of **The Mental Compass**:

* **GitHub:** [@joshmzamora](https://github.com/joshmzamora)
* **Project Link:** [https://github.com/joshmzamora/the-mental-compass](https://github.com/joshmzamora/the-mental-compass)

---
*Created with ❤️ for the BPA National Leadership Conference.*
```
