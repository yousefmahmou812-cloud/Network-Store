# Network Store - Premium Networking Solutions

Welcome to the **Network Store**, a modern, feature-rich, and interactive e-commerce web application dedicated to premium enterprise-grade networking equipment. Built with a stunning glassmorphism design, vibrant color gradients, and dynamic interactive elements, this application serves as a complete showcase for routers, switches, firewalls, and more.

##  Key Features

*   * Interactive Product Catalog & Dynamic Cart**
    *   Dynamic catalog loading directly from a JSON database.
    *   Advanced sorting (price low-to-high, high-to-low, name A-Z) and filtering by category (Routers, Switches, Firewalls, Cables, Access Points, Racks, UPS, etc.).
    *   Detailed product configuration modal with model-specific specifications, pricing, and image updates.
    *   Full-featured shopping cart (Add, update quantity, remove, and simulated checkout) connected to a backend JSON database.
*   ** Real-time Network Speed Tester**
    *   A built-in utility that runs an accurate connection speed test.
    *   Downloads a live 5MB test file to calculate real-world download speed (in Mbps).
    *   Features a dynamic progress bar and automated network analysis.
*   ** Interactive Flash Sales**
    *   Engaging flash sale modals featuring rotating enterprise deals (Cisco, Fortinet, Ubiquiti, Meraki) at up to 50% off.
*   ** Mock Live Chat Support**
    *   Fully functional mock chat interface with automated assistance to simulate real-time customer support.
*    Immersive User Experience (UX)**
       Custom canvas-based network particle background.
      Interactive scroll-based company timeline journey.
      Animated numerical count-ups for business statistics.
      Glassmorphism UI elements, micro-animations, and toast notifications.
       Contact & Newsletter Signups**
       Validation-enabled newsletter subscriptions.
    *   Dynamic contact form that saves client messages directly to the server.

---

## 🛠️ Technology Stack

*   **Frontend:** HTML5, CSS3 (Vanilla CSS with CSS variables, Flexbox/Grid, transitions), JavaScript (ES6+).
*   **Animations:** Canvas API (Particle network), Intersection Observer API (Scroll animations), CSS Keyframes.
*   **Mock Backend:** JSON Server (REST API for managing cart, newsletter, and contact requests).
*   **Fonts:** Inter (via Google Fonts).

---

   Project Structure

```text
├── Index.html           # Home page with hero section, speed test, and featured products
├── products.html        # Catalog page with search, sort, filter, and detailed view modals
├── about.html           # About page featuring mission, stats, interactive timeline, and team cards
├── Contact.html         # Contact form page with input validation
├── cart.html            # Shopping cart overview and checkout simulator
├── style.css            # Central stylesheet implementing the glassmorphism design system
├── script.js            # Main JavaScript controller handling app logic, speed test, and APIs
├── products.Json        # Structured catalog database of networking equipment and models
├── dB.json              # Mock database storage for json-server (cart, contacts, subscriptions)
├── images/              # Local image assets for products and background graphics
└── README.md            # Project documentation and guide
```

---

##  Getting Started

Follow these steps to run the application locally with full functionality:

### 1. Clone the Repository
```bash
git clone https://github.com/yousefmahmou812-cloud/Network-Store.git
cd Network-Store
```

### 2. Run the Mock Backend (Optional but Recommended)
The shopping cart, contact form, and newsletter features require a local API server. We use `json-server` to mock this.

Install `json-server` globally if you haven't already:
```bash
npm install -g json-server
```

Start the JSON server using `dB.json` on port 3001:
```bash
json-server --watch dB.json --port 3001
```

### 3. Open the Frontend
Since this is a client-side app, you can simply open `Index.html` directly in any web browser, or use a local development server like Live Server in VS Code.

*Ensure the JSON server is running on port `3001` so that addition to cart and contact messages save successfully!*

---

 License

This project is open-source and available under the [MIT License](LICENSE).
