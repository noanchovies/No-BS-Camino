// This function runs ONLY after section-loader.js has finished injecting HTML
window.initCaminoLanding = function() {
    console.log("HTML Injected. Initializing Maps & Interactivity...");

    // --- 1. PWA Install Logic (From Banner) ---
    const installBanner = document.getElementById('installBanner');
    const installBtn = document.getElementById('installBtn');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBanner) installBanner.classList.remove('hidden');
    });

    if(installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installBanner.classList.add('hidden');
                }
                deferredPrompt = null;
            }
        });
    }

    // --- 2. Carousel Scroll Logic ---
    window.scrollRoutes = function(direction) {
        const container = document.getElementById('routes-carousel');
        if(container) container.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    window.scrollFaq = function(direction) {
        const container = document.getElementById('faq-carousel');
        if(container) container.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    // --- 3. Map Initialization ---
    // Safety check: only run if Leaflet is loaded and map containers exist
    if (typeof L === 'undefined') return;

    const redLineStyle = { color: '#dc2626', weight: 4, opacity: 0.8 };
    const mapOptions = { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, attributionControl: false, zoomSnap: 0.1 };

    // Weather Preview Map
    if(document.getElementById('preview-map')) {
        var previewMap = L.map('preview-map', mapOptions).setView([42.8, -2.5], 7);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(previewMap);
        
        // Add markers (simplified for brevity - keep your full list from the original file)
        const stages = [[43.163, -1.235], [43.009, -1.319], [42.880, -8.544]]; // ...etc
        var blueIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        stages.forEach(coord => L.marker(coord, {icon: blueIcon}).addTo(previewMap));
    }

    // Route Maps (Francés, Portugués, etc.)
    // Helper to init mini-maps
    const initMiniMap = (id, coords) => {
        if(document.getElementById(id)) {
            const m = L.map(id, mapOptions);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png').addTo(m);
            const line = L.polyline(coords, redLineStyle).addTo(m);
            m.fitBounds(line.getBounds(), {padding: [20, 20]});
        }
    };

    // Data from your original file
    initMiniMap('map-frances', [[43.16, -1.23], [42.81, -1.64], [42.46, -2.44], [42.34, -3.69], [42.60, -5.56], [42.54, -6.59], [42.88, -8.54]]);
    initMiniMap('map-portugues', [[38.72, -9.14], [39.23, -8.68], [40.20, -8.41], [41.15, -8.62], [41.69, -8.83], [42.88, -8.54]]);
    initMiniMap('map-coastal', [[41.15, -8.62], [41.35, -8.75], [41.69, -8.83], [42.11, -8.82], [42.88, -8.54]]);
    initMiniMap('map-primitivo', [[43.36, -5.85], [43.40, -6.15], [43.18, -6.55], [43.01, -7.55], [42.88, -8.54]]);
    initMiniMap('map-invierno', [[42.54, -6.59], [42.42, -6.90], [42.52, -7.51], [42.63, -8.12], [42.88, -8.54]]);
    initMiniMap('map-norte', [[43.33, -1.78], [43.31, -1.98], [43.26, -2.93], [43.46, -3.80], [43.53, -5.66], [43.55, -7.04], [42.88, -8.54]]);
    initMiniMap('map-plata', [[37.38, -5.98], [38.91, -6.34], [40.96, -5.66], [42.02, -5.66], [42.45, -6.05], [42.88, -8.54]]);
};
