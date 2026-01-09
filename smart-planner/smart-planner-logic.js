/**
 * SMART PLANNER LOGIC
 * Dependencies: Leaflet (L), CAMINO_DB (camino-master-data.js)
 */

// --- 1. UI CONFIGURATION (Visuals only) ---
// Maps the ID from CAMINO_DB to map start positions
const ROUTE_UI_CONFIG = {
    frances:  { center: [42.6, -4.0], zoom: 7 },
    norte:    { center: [43.4, -4.0], zoom: 7 },
    plata:    { center: [39.5, -6.0], zoom: 6 },
    lusitana: { center: [40.5, -8.5], zoom: 7 },
    // Fallbacks for routes without specific map centers
    default:  { center: [42.0, -5.0], zoom: 6 }
};

// --- 2. ICONS & ASSETS ---
const icons = {
    sun: '<svg class="w-8 h-8 icon-sun" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000 1.41.996.996 0 001.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z"/></svg>',
    partCloud: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z" fill="#E8E8E8"/><circle cx="8" cy="8" r="4" fill="#FDB813"/></svg>',
    cloud: '<svg class="w-8 h-8 icon-gray" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5Z" /></svg>',
    rain: '<svg class="w-8 h-8 icon-rain" viewBox="0 0 24 24" fill="currentColor"><path d="M4.13 12.04C3.47 12.59 3 13.43 3 14.4c0 1.99 1.61 3.6 3.6 3.6s3.6-1.61 3.6-3.6c0-.97-.47-1.81-1.13-2.36h-4.94zm9.33 0C12.8 12.59 12.33 13.43 12.33 14.4c0 1.99 1.61 3.6 3.6 3.6s3.6-1.61 3.6-3.6c0-.97-.47-1.81-1.13-2.36h-4.94zM19.36 6.04C18.67 2.59 15.64 0 12 0 9.11 0 6.6 1.64 5.35 4.04 2.34 4.36 0 6.91 0 10c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z"/></svg>',
    snow: '<svg class="w-8 h-8 icon-rain" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24q-.625 0-1.062-.438Q10.5 23.125 10.5 22.5q0-.625.438-1.062Q11.375 21 12 21t1.062.438Q13.5 21.875 13.5 22.5q0 .625-.438 1.062Q12.625 24 12 24Zm-4-4q-.625 0-1.062-.438Q6.5 19.125 6.5 18.5q0-.625.438-1.062Q7.375 17 8 17t1.062.438Q9.5 17.875 9.5 18.5q0 .625-.438 1.062Q8.625 20 8 20Zm8 0q-.625 0-1.062-.438Q14.5 19.125 14.5 18.5q0-.625.438-1.062Q15.375 17 16 17t1.062.438Q17.5 17.875 17.5 18.5q0 .625-.438 1.062Q16.625 20 16 20Zm-8-4q-.625 0-1.062-.438Q6.5 15.125 6.5 14.5q0-.625.438-1.062Q7.375 13 8 13t1.062.438Q9.5 13.875 9.5 14.5q0 .625-.438 1.062Q8.625 16 8 16Zm8 0q-.625 0-1.062-.438Q14.5 15.125 14.5 14.5q0-.625.438-1.062Q15.375 13 16 13t1.062.438Q17.5 13.875 17.5 14.5q0 .625-.438 1.062Q16.625 16 16 16ZM6 19q-2.075 0-3.537-1.463Q1 16.075 1 14q0-2.075 1.463-3.538Q3.925 9 6 9q.575 0 1.1.088t1.025.262q.725-2.225 2.65-3.725Q12.7 4.125 15.125 4.125q2.675 0 4.525 1.863Q21.5 7.85 21.5 10.525q0 .25-.025.488-.025.237-.075.462 2.025.575 3.287 2.263Q25.95 15.425 25.95 17.5q0 2.7-1.9 4.6Q22.15 24 19.45 24H6Z" transform="scale(0.8) translate(2,-4)"/></svg>',
    fog: '<svg class="w-8 h-8 icon-gray" viewBox="0 0 24 24" fill="currentColor"><path d="M1 16v-2h22v2H1Zm4 4v-2h14v2H5Zm-3-8q-2.075 0-3.537-1.463Q1 9.075 1 7q0-2.075 1.463-3.538Q3.925 2 6 2q.575 0 1.1.088t1.025.262q.725-2.225 2.65-3.725Q12.7-2.875 15.125-2.875q2.675 0 4.525 1.863Q21.5.85 21.5 3.525q0 .25-.025.488-.025.237-.075.462 2.025.575 3.287 2.263Q25.95 8.425 25.95 10.5q0 2.7-1.9 4.6Q22.15 17 19.45 17H6Z" transform="scale(0.8) translate(2,2)"/></svg>',
    hot: '<span class="text-xl">🌡️</span>',
    cold: '<span class="text-xl">❄️</span>',
    home: '<svg class="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10Zm-2 2V9l8-6 8 6v12h-7v-6h-2v6Zm8-8.75Z"/></svg>'
};

const weatherCodes = {
    0: { label: 'Clear', icon: icons.sun },
    1: { label: 'Sunny', icon: icons.sun },
    2: { label: 'Partly Cloudy', icon: icons.partCloud },
    3: { label: 'Overcast', icon: icons.cloud },
    45: { label: 'Foggy', icon: icons.fog }, 48: { label: 'Foggy', icon: icons.fog },
    51: { label: 'Drizzle', icon: icons.rain }, 61: { label: 'Rain', icon: icons.rain },
    63: { label: 'Rain', icon: icons.rain }, 71: { label: 'Snow', icon: icons.snow },
    95: { label: 'Storm', icon: icons.rain }
};

// --- 3. HELPER FUNCTIONS ---
function getRainVisual(mm) {
    let drops = 0;
    let label = "Dry";
    if(mm > 0.1 && mm < 2) { drops = 1; label = "Drizzle"; }
    else if(mm >= 2 && mm < 10) { drops = 2; label = "Rain"; }
    else if(mm >= 10) { drops = 3; label = "Heavy"; }
    
    let html = `<div class="flex flex-col items-center justify-center">`;
    html += `<div class="flex gap-0.5 mb-1">`;
    for(let i=0; i<3; i++) {
        html += i < drops 
            ? `<svg class="w-3 h-3 drop-filled" viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-9 0-9-9-9-9S3 13 3 13c0 4.97 4.03 9 9 9z"/></svg>`
            : `<svg class="w-3 h-3 drop-empty" viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-9 0-9-9-9-9S3 13 3 13c0 4.97 4.03 9 9 9z"/></svg>`;
    }
    html += `</div>`;
    html += `<span class="text-[9px] font-bold uppercase tracking-wide ${drops > 0 ? 'text-[#1967d2]' : 'text-gray-300'}">${label}</span>`;
    if(mm > 0) html += `<span class="text-[9px] text-blue-400 font-medium">${mm}mm</span>`;
    html += `</div>`;
    return html;
}

function formatAMPM(dateStr) {
    if(!dateStr) return "--:--";
    let [hours, mins] = dateStr.split(':');
    hours = parseInt(hours);
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${mins} ${ampm}`;
}

function parseTime(timeStr) {
    if(!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function formatTimeFromMins(minutes) {
    if(!minutes) return "--:--";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// --- 4. STATE & INITIALIZATION ---
let map;
let markers = [];
let currentRouteId = 'frances';
let selectedStageIndex = 0;

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    // Set Default Date to Today
    document.getElementById('startDate').valueAsDate = new Date();
    
    // Init Map
    map = L.map('map', { zoomControl: false }).setView([42.6, -4.0], 7);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    // Initial Load of Routes from CAMINO_DB
    changeRoute();
    
    // Register Service Worker if available
    if ('serviceWorker' in navigator) { 
        navigator.serviceWorker.register('../sw.js'); // Points to root sw.js
    }
});

// --- 5. LOGIC FUNCTIONS ---

function changeRoute() {
    const select = document.getElementById('routeSelect');
    currentRouteId = select.value;
    
    // 1. Get Data from Master DB
    const routeStages = CAMINO_DB.routes[currentRouteId];
    if(!routeStages) { console.error("Route not found in CAMINO_DB:", currentRouteId); return; }

    // 2. Get UI Config (Center/Zoom)
    const uiConfig = ROUTE_UI_CONFIG[currentRouteId] || ROUTE_UI_CONFIG.default;
    map.flyTo(uiConfig.center, uiConfig.zoom);

    // 3. Clear & Redraw Markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    routeStages.forEach((stage, index) => {
        // Fallback for coordinates if missing (safety check)
        if(!stage.lat || !stage.lon) return;

        const marker = L.marker([stage.lat, stage.lon]).addTo(map);
        
        // Add click event
        marker.on('click', () => {
            selectedStageIndex = index;
            document.getElementById('selectedLocationText').innerText = stage.start;
            
            // Highlight styling
            markers.forEach(m => { if (m._icon) m._icon.classList.remove('img-selected-pin'); });
            if (marker._icon) marker._icon.classList.add('img-selected-pin');
        });
        
        markers.push(marker);
    });
    
    // Default select first stage
    if(markers.length > 0) {
        selectedStageIndex = 0;
        document.getElementById('selectedLocationText').innerText = routeStages[0].start;
    }
}

// Simple Cache for Weather API
async function fetchWithCache(url) {
    const cacheKey = `weather_cache_${btoa(url)}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        // Cache valid for 3 hours
        if (Date.now() - timestamp < 10800000) {
            return data;
        }
    }

    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data }));
    return data;
}

// MAIN FORECAST GENERATOR
async function getForecast() {
    const btn = document.getElementById('getForecastBtn');
    const resultsDiv = document.getElementById('results');
    const loading = document.getElementById('loading');
    const summaryBox = document.getElementById('summaryBox');
    const startDateStr = document.getElementById('startDate').value;
    const addRestDays = document.getElementById('addRestDays').checked;

    // Reset UI
    btn.disabled = true;
    resultsDiv.innerHTML = '';
    summaryBox.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // 1. Build Itinerary
        const routeStages = CAMINO_DB.routes[currentRouteId];
        let rawStages = routeStages.slice(selectedStageIndex, selectedStageIndex + 10);
        let itinerary = [];
        let dayOffset = 0;
        let kmSinceRest = 0;

        for (let i = 0; i < rawStages.length; i++) {
            if (itinerary.length >= 10) break;
            
            // Normalize distance (DB has numbers, ensure calculation safety)
            let stageDistVal = typeof rawStages[i].dist === 'number' ? rawStages[i].dist : parseFloat(rawStages[i].dist);
            
            itinerary.push({ type: 'walk', stage: rawStages[i], dayOffset: dayOffset++ });
            kmSinceRest += stageDistVal;
            
            // "Smart Rest Day" Logic: Trigger after ~135km, but not on the very last step of array
            if (addRestDays && kmSinceRest > 135 && i < rawStages.length - 1) {
                itinerary.push({ type: 'rest', stage: rawStages[i], dayOffset: dayOffset++ });
                kmSinceRest = 0;
            }
        }

        // 2. Check for "Historical" Mode (Are we planning for 2026/future?)
        const startObj = new Date(startDateStr);
        // If date is more than 10 days in future, we might want to use historical data (2025) as proxy?
        // Open-Meteo Forecast is only 14 days. 
        // Logic: If date > 14 days from now, use "Archive" API with same dates but 2025.
        const diffDays = Math.ceil((startObj - new Date()) / (1000 * 60 * 60 * 24));
        const useHistorical = diffDays > 10; 

        // 3. Stats Containers
        let rainDayIndices = [], hotDayIndices = [], coldDayIndices = [];
        let totalSunriseMins = 0, totalSunsetMins = 0;
        let sunriseTemps = [], sunsetTemps = [], totalDaylightHrs = 0;

        // 4. Fetch Loop
        for (let [idx, item] of itinerary.entries()) {
            const current = new Date(startDateStr);
            current.setDate(current.getDate() + item.dayOffset);
            
            let dateQuery = current.toISOString().split('T')[0];
            
            // If using historical proxy, shift year to 2025
            if (useHistorical) {
                const h = new Date(current); 
                h.setFullYear(2025); 
                dateQuery = h.toISOString().split('T')[0];
            }

            const baseUrl = useHistorical ? 'https://archive-api.open-meteo.com/v1/archive' : 'https://api.open-meteo.com/v1/forecast';
            const url = `${baseUrl}?latitude=${item.stage.lat}&longitude=${item.stage.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,daylight_duration&hourly=temperature_2m&timezone=auto&start_date=${dateQuery}&end_date=${dateQuery}`;
            
            const json = await fetchWithCache(url);
            
            if (json.daily) {
                const d = json.daily;
                const rain = d.precipitation_sum[0];
                const max = Math.round(d.temperature_2m_max[0]);
                const min = Math.round(d.temperature_2m_min[0]);
                
                // --- HOLIDAY CHECK ---
                // We check the ACTUAL date the user selected (not the historical proxy date)
                let actualDateStr = current.toISOString().split('T')[0];
                const isHoliday = isCaminoHoliday(actualDateStr, currentRouteId, item.stage.id);
                
                let holidayBadge = "";
                if (isHoliday) {
                    holidayBadge = `<span class="ml-2 text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 px-1.5 py-0.5 rounded">⚠️ HOLIDAY</span>`;
                }
                // ---------------------

                // Stats Accumulation
                if(rain > 1.0) rainDayIndices.push(idx + 1);
                if(max >= 30) hotDayIndices.push(idx + 1);
                if(min <= 0) coldDayIndices.push(idx + 1);
                
                const dlSeconds = d.daylight_duration[0];
                totalDaylightHrs += dlSeconds / 3600;
                totalSunriseMins += parseTime(d.sunrise[0].split('T')[1]);
                totalSunsetMins += parseTime(d.sunset[0].split('T')[1]);

                // Render Card
                const rainVisual = getRainVisual(rain);
                let hazardIcon = '';
                if(max >= 30) hazardIcon = icons.hot;
                else if(min <= 0) hazardIcon = icons.cold;

                let html = '';

                if (item.type === 'rest') {
                    html = `
                    <div class="flex gap-4 items-stretch h-24">
                        <div class="flex flex-col items-center justify-center w-8 flex-shrink-0">
                            <div class="day-pill text-green-300">${idx + 1}</div>
                            <div class="timeline-line bg-green-100"></div>
                        </div>
                        <div class="flex-1 card-rest p-4 flex flex-row items-center justify-between gap-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-[10px] font-bold text-green-600 bg-white border border-green-200 px-2 py-0.5 rounded uppercase tracking-wide">
                                        ${current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    ${holidayBadge}
                                </div>
                                <h4 class="font-bold text-green-800 text-lg">Rest Day in ${item.stage.end}</h4>
                                <p class="text-[10px] text-green-600 font-medium">Recharge your batteries.</p>
                            </div>
                            <div class="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-green-200 shadow-sm">
                                ${icons.home}
                            </div>
                        </div>
                    </div>`;
                } else {
                    const sunriseTime = formatAMPM(d.sunrise[0].split('T')[1].slice(0,5));
                    const sunsetTime = formatAMPM(d.sunset[0].split('T')[1].slice(0,5));
                    const dlHours = Math.floor(dlSeconds / 3600);
                    const dlMins = Math.round((dlSeconds % 3600) / 60);
                    const wInfo = weatherCodes[d.weathercode[0]] || { label: 'Unknown', icon: icons.cloud };

                    html = `
                    <div class="flex gap-4 items-stretch h-32">
                        <div class="flex flex-col items-center justify-center w-8 flex-shrink-0">
                            <div class="day-pill">${idx + 1}</div>
                            <div class="timeline-line"></div>
                        </div>
                        <div class="flex-1 card-flight p-4 flex flex-row items-center justify-between gap-4">
                            <div class="flex-1 min-w-0 flex flex-col justify-center h-full">
                                <div class="mb-1 flex items-center">
                                    <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wide">
                                        ${current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    ${holidayBadge}
                                </div>
                                <h4 class="font-bold text-gray-900 text-lg truncate mb-1">
                                    ${item.stage.start} <span class="text-gray-300">→</span> ${item.stage.end}
                                </h4>
                                <div class="flex items-center gap-3 text-[10px] text-gray-500 font-medium mt-1">
                                    <span class="font-bold text-gray-700 bg-gray-50 px-1.5 rounded border border-gray-100">${item.stage.dist} km</span>
                                    <span class="flex items-center gap-1"><svg class="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> ${sunriseTime}</span>
                                    <span class="flex items-center gap-1"><svg class="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> ${sunsetTime}</span>
                                    <span>${dlHours}h ${dlMins}m Light</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 border-l border-gray-100 pl-4">
                                ${hazardIcon}
                                <div class="w-10 h-10 flex items-center justify-center">${wInfo.icon}</div>
                                <div class="text-right w-12">
                                    <div class="text-xl font-bold text-gray-900 leading-none">${max}°</div>
                                    <div class="text-[11px] font-bold text-blue-500 mt-1">${min}°</div>
                                </div>
                                <div class="w-14">${rainVisual}</div>
                            </div>
                        </div>
                    </div>`;
                }
                resultsDiv.innerHTML += html;
            }
        }

        // 5. Update Summary Box
        const totalDays = itinerary.length;
        const avgRise = formatTimeFromMins(totalSunriseMins / totalDays);
        const avgSet = formatTimeFromMins(totalSunsetMins / totalDays);
        const avgDL = Math.round(totalDaylightHrs / totalDays);

        document.getElementById('sumRainCount').innerText = `${rainDayIndices.length}/${totalDays}`;
        document.getElementById('sumRainDays').innerText = rainDayIndices.length === 0 ? "None" : `Days: ${rainDayIndices.join(', ')}`;
        document.getElementById('sumRainDays').className = rainDayIndices.length === 0 ? "text-[10px] text-green-600 font-bold mt-0.5" : "text-[10px] text-blue-600 font-bold mt-0.5";

        document.getElementById('sumAvgDaylight').innerText = avgDL;
        document.getElementById('sumSunrise').innerText = avgRise;
        document.getElementById('sumSunset').innerText = avgSet;

        // Recommendations
        let recsHTML = '';
        if(rainDayIndices.length > 3) recsHTML += `<div class="flex items-center gap-2"><span class="text-blue-500 font-bold">Rainy:</span> Bring a poncho. Wet week ahead.</div>`;
        else if(rainDayIndices.length > 0) recsHTML += `<div class="flex items-center gap-2"><span class="text-blue-400 font-bold">Showers:</span> Light shell recommended.</div>`;
        
        if(hotDayIndices.length > 0) recsHTML += `<div class="flex items-center gap-2"><span class="text-red-500 font-bold">Heat Alert:</span> Days ${hotDayIndices.join(', ')} above 30°C. Hydrate.</div>`;
        if(coldDayIndices.length > 0) recsHTML += `<div class="flex items-center gap-2"><span class="text-blue-600 font-bold">Cold Alert:</span> Days ${coldDayIndices.join(', ')} freezing.</div>`;
        
        if(recsHTML === '') recsHTML = `<div class="flex items-center gap-2 text-green-600 font-bold">Conditions look great! Enjoy the walk.</div>`;
        document.getElementById('sumRecs').innerHTML = recsHTML;
        
        summaryBox.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (e) {
        console.error(e);
        resultsDiv.innerHTML = `<div class="text-red-500 text-center font-bold py-10">Error loading weather data. Check connection.</div>`;
    } finally {
        loading.classList.add('hidden');
        btn.disabled = false;
    }
}
