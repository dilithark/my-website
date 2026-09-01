3dify.printz — High-Precision Additive Manufacturing & Engineering Studio
A production-grade, interactive web application and automated fabrication quoting engine built for 3dify.printz, an advanced 3D printing and digital fabrication studio based in Colombo, Sri Lanka.

Features
Interactive Hero 3D Viewport: Powered by Three.js, rendering live CAD-grade mesh models and particle effects directly in the browser.

Client-Side STL Geometry Parser: Integrated STLLoader to parse binary and ASCII .stl files in real time, calculating exact volumetric metrics, bounding boxes, and surface areas client-side.

Automated Fabrication Quote Engine: Dynamic pricing calculator incorporating multi-file management, material selection (PLA, PETG, ABS, TPU, SLA Resin), infill density adjustments, and priority rush dispatch options.

Omnichannel Order Dispatch: Direct integration for submitting verified orders and technical specification sheets via WhatsApp or Email.

Modern Glassmorphism UI: High-end engineering aesthetic with dark-mode styling, responsive CSS grids, custom badges, magnetic buttons, and animated status pulses.

Tech Stack
Markup & Styling: HTML5, CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism effects)

Client-Side Libraries:

Three.js (r128) & STLLoader for 3D viewport rendering and mesh parsing

GSAP (GreenSock Animation Platform) & ScrollTrigger for smooth UI animations

Typography: Google Fonts (Inter, JetBrains Mono, Space Grotesk)

Project Structure
Plaintext
├── index.html       # Main landing page & quote engine markup
├── style.css        # Comprehensive styling, grid layouts, and theme definitions
└── script.js        # Three.js viewport logic, STL parser, pricing algorithms, and UI state controllers
Getting Started
To run or deploy the web application locally:

Clone or download the repository containing index.html, style.css, and script.js.

Ensure you have a modern web browser with WebGL enabled.

Open index.html directly in your browser, or serve it using a local development server (e.g., Live Server in VS Code):

Bash
npx serve .
Contact & Studio Information
Location: Colombo, Sri Lanka

Direct Contact: +94 76 489 2775

Services: FDM & SLA Resin Fabrication, Rapid Prototyping, Functional Engineering Parts, Custom Enclosures, and Small Batch Production.

© 2026 3DIFY.PRINTZ LABS. All rights reserved.
