// Configuration: Which sections go where?
const sections = [
    { file: 'index-sections/banner.html',  target: 'inject-banner' },
    { file: 'index-sections/header.html',  target: 'inject-header' },
    { file: 'index-sections/hero.html',    target: 'inject-hero' },
    { file: 'index-sections/routes.html',  target: 'inject-routes' },
    { file: 'index-sections/weather.html', target: 'inject-weather' },
    { file: 'index-sections/faq.html',     target: 'inject-faq' },
    { file: 'index-sections/costs.html',   target: 'inject-costs' },
    { file: 'index-sections/links.html',   target: 'inject-links' },
    { file: 'index-sections/footer.html',  target: 'inject-footer' }
];

async function loadPage() {
    // 1. Fetch and Inject all HTML fragments
    const promises = sections.map(async (section) => {
        try {
            const response = await fetch(section.file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const container = document.getElementById(section.target);
            if (container) container.innerHTML = html;
        } catch (error) {
            console.error(`Error loading ${section.file}:`, error);
        }
    });

    // Wait for ALL HTML to be injected
    await Promise.all(promises);

    // 2. Initialize Functionality (Maps, Carousel Buttons, Banner)
    // We check if the global initialization function exists (loaded from map-init.js)
    if (typeof window.initCaminoLanding === 'function') {
        window.initCaminoLanding(); 
    }
}

// Start the engine
document.addEventListener('DOMContentLoaded', loadPage);
