# Modern Developer Portfolio Template

A clean, responsive, and data-driven developer portfolio website template built with pure HTML, CSS, and JavaScript.

## Features

- 💜 Purple-themed dark mode design (easily customizable)
- 📱 Fully responsive layout (mobile, tablet, desktop)
- 🧩 Modular CSS with clean separation of concerns (Layout, Components, Colors, Style)
- ⚡ No frameworks - pure HTML, CSS, and JavaScript
- 📄 **Data-Driven:** All content (profile info, about, resume, portfolio, honors, contact, navigation) is loaded dynamically from JSON files in the `/data` directory.
- 🚀 **Easy Templating:** Update your portfolio by simply editing the JSON files - no HTML changes needed!
- 🏗️ Structured for easy maintenance and future scaling

## Project Structure

```
portfolio/
├── index.html                # Main HTML structure (content loaded dynamically)
├── manifest.json             # PWA configuration
├── README.md                 # This file
├── /assets/                  # Optional: For non-placeholder assets (e.g., favicon)
│   └── fonts/                # (Optional) Web fonts if needed
├── /css/
│   ├── colors.css            # Theme variables and color palette
│   ├── layout.css            # Grid, flex, spacing, mobile menu
│   ├── components.css        # Cards, buttons, forms, specific element styling
│   └── style.css             # General styles & overrides
├── /js/
│   ├── main.js               # Core interactivity (menu toggle, tab logic)
│   ├── portfolio.js          # Portfolio filtering and rendering logic
│   └── data-loader.js        # Fetches and loads all JSON data into HTML
└── /data/                    # <<< ALL YOUR CONTENT GOES HERE >>>
    ├── profile.json          # Name, title, avatar, contact, social links, footer
    ├── navigation.json       # Defines the main navigation tabs
    ├── about.json            # "About Me" text and "What I Do" services
    ├── resume.json           # Experience, education, certifications, skills
    ├── portfolio.json        # Your project details and tags
    ├── honors.json           # Awards and recognitions
    └── contact.json          # Contact form fields and map settings
```

## Getting Started

1.  Clone or download this repository.
2.  Open `index.html` in your browser (or use a simple live server for best results with `fetch`).
3.  **Start editing the `.json` files in the `/data` directory to add your own content!**

## Customizing Your Portfolio (Easy!)

This template is designed for easy customization by editing the JSON files in the `/data` directory:

1.  **Profile & Sidebar/Header:** Edit `data/profile.json` to change your name, title, avatar URL, contact details (email, phone, location), social media links, and footer copyright.
2.  **Navigation Tabs:** Modify `data/navigation.json` to change the names, order, or target IDs of the main navigation tabs.
3.  **About Section:** Update `data/about.json` with your personal description and the services you offer.
4.  **Resume Section:** Fill `data/resume.json` with your work experience, education, certifications, technical skills, and soft skills.
5.  **Portfolio Projects:** Add/edit your projects in `data/portfolio.json`. The filter buttons will automatically update based on the unique `tags` you use across your projects.
6.  **Honors & Awards:** List your achievements in `data/honors.json`.
7.  **Contact Section:** Configure the contact form fields and the embedded map URL in `data/contact.json`.
8.  **Colors:** Edit the CSS variables in `css/colors.css` to easily change the theme.
9.  **(Optional) Favicon/Assets:** Replace `favicon.ico` and add any other necessary assets to the `/assets` folder if needed.

**That's it! No need to modify `index.html` or complex JavaScript files for content updates.**

## Browser Support

This project works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT

---

Made with ❤️ by Asad 