// script.js

// 1. Initialize App from Config
document.getElementById('app-title').textContent = SITE_CONFIG.title;
document.getElementById('coffee-btn').href = SITE_CONFIG.coffeeLink;

// 2. Initialize Map
const map = L.map('map').setView(SITE_CONFIG.mapCenter, SITE_CONFIG.zoomLevel);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CartoDB'
}).addTo(map);

// 3. Fetch Weather (NO Rate Limits logic, just simple request)
async function fetchWeather() {
    const container = document.getElementById('weather-container');
    container.innerHTML = '<p style="text-align:center">Loading forecast...</p>';

    // Build API Query
    const lats = SITE_CONFIG.checkpoints.map(c => c.lat).join(',');
    const lons = SITE_CONFIG.checkpoints.map(c => c.lon).join(',');
    
    // Construct params dynamically based on config
    const params = SITE_CONFIG.weatherParams.join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=${params}&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderData(data);
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; color:red">Error loading weather. Please refresh.</p>';
        console.error(error);
    }
}

// 4. Render Data
function renderData(data) {
    const container = document.getElementById('weather-container');
    container.innerHTML = ''; // Clear loading text
    
    // Handle single point vs multiple points API structure
    const isSingle = !Array.isArray(data);
    const results = isSingle ? [data] : data;

    results.forEach((location, index) => {
        const pointInfo = SITE_CONFIG.checkpoints[index];
        const current = location.current;
        
        // Create Map Marker
        const marker = L.marker([pointInfo.lat, pointInfo.lon]).addTo(map);
        marker.bindPopup(`<b>${pointInfo.name}</b><br>${current.temperature_2m}°C`);

        // Create List Card
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.id = `card-${index}`;
        
        // Determine Weather Icon (Simplified logic)
        let icon = '☀️';
        if (current.precipitation_probability > 50) icon = '🌧️';
        else if (current.cloudcover > 50) icon = '☁️';
        
        card.innerHTML = `
            <div class="card-left">
                <h3>${pointInfo.name}</h3>
                <p>Rain: ${current.precipitation_probability}% | Wind: ${current.windspeed_10m} km/h</p>
                <p style="font-size:0.75rem; margin-top:4px">Gusts: ${current.windgusts_10m || 0} km/h | UV: ${current.uv_index || 0}</p>
            </div>
            <div class="card-right">
                <span class="temp">${current.temperature_2m}°C</span>
                <span class="condition">${icon}</span>
            </div>
        `;

        // Interaction: Click Card -> Pan Map
        card.addEventListener('click', () => {
            map.flyTo([pointInfo.lat, pointInfo.lon], 10);
            document.querySelectorAll('.weather-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });

        // Interaction: Click Marker -> Scroll to Card
        marker.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.querySelectorAll('.weather-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });

        container.appendChild(card);
    });
}

// 5. Print Functionality
document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
});

// 6. PWA Install Logic
let deferredPrompt;
const installBanner = document.getElementById('pwa-install-banner');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.remove('hidden');
});

document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBanner.classList.add('hidden');
        }
        deferredPrompt = null;
    }
});

document.getElementById('close-install').addEventListener('click', () => {
    installBanner.classList.add('hidden');
});

// Start
fetchWeather();
