/**
 * SHARED ROUTE LOGIC
 * Dependencies: Leaflet, CAMINO_DB
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify which route page we are on
    const routeId = document.body.getAttribute('data-route');
    if (!routeId || !CAMINO_DB.routes[routeId]) return;

    console.log(`Initializing Route: ${routeId}`);

    // 2. Initialize Map
    initRouteMap(routeId);

    // 3. Generate Smart Start Logistics (Dynamic!)
    generateSmartStarts(routeId);
    
    // 4. Initialize Mode Toggles (Summer/Winter)
    initModeToggles();
});

function initRouteMap(routeId) {
    const mapId = `map-detail-${routeId}`;
    if (!document.getElementById(mapId)) return;

    const map = L.map(mapId, {
        zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, attributionControl: false
    });
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png').addTo(map);

    // Get Data
    const routeData = CAMINO_DB.routes[routeId];
    const path = routeData.map(stage => [stage.lat, stage.lon]);

    // Draw Line
    const colorMap = { frances: '#dc2626', norte: '#16a34a', plata: '#ca8a04', lusitana: '#2563eb', coastal: '#0891b2' };
    L.polyline(path, { 
        color: colorMap[routeId] || '#dc2626', 
        weight: 4, 
        opacity: 0.8 
    }).addTo(map);

    // Fit Bounds
    map.fitBounds(path, { padding: [40, 40] });
}

function generateSmartStarts(routeId) {
    const container = document.getElementById('smart-starts-grid');
    if (!container || !CAMINO_DB.start_locations[routeId]) return;

    const starts = CAMINO_DB.start_locations[routeId];
    let html = '';

    // Color mapping for tags
    const tags = ["Most Popular", "Halfway", "Last 100km", "Alternative"];
    const colors = ["green", "orange", "blue", "purple"];

    starts.forEach((start, index) => {
        const color = colors[index % colors.length];
        const tag = tags[index % tags.length]; // Fallback tags if DB doesn't have them
        
        html += `
        <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
                <span class="bg-${color}-100 text-${color}-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">${tag}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">${start.city}</h3>
            <p class="text-xs text-gray-500 mb-4">${start.dist} to Santiago</p>
            <div class="space-y-2 text-xs">
                 <div class="flex items-center gap-2">
                    <span class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">✈️ ${start.airport || 'Train'}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600 font-medium">
                     <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     Commute: ${start.commute}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

function initModeToggles() {
    window.setMode = function(mode) {
        const table = document.getElementById('stages-table');
        const btnSummer = document.getElementById('btn-summer');
        const btnWinter = document.getElementById('btn-winter');

        if (mode === 'summer') {
            table.classList.remove('mode-winter');
            btnSummer.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
            btnSummer.classList.remove('text-gray-500');
            btnWinter.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
            btnWinter.classList.add('text-gray-500');
        } else {
            table.classList.add('mode-winter');
            btnWinter.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
            btnWinter.classList.remove('text-gray-500');
            btnSummer.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
            btnSummer.classList.add('text-gray-500');
        }
    };
}
