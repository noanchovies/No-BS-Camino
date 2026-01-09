/**
 * NO-BS CAMINO WIDGET ENGINE (V4)
 * Deterministic Logic using CAMINO_DB
 */

// --- ICONS & ASSETS ---
const icons = {
    sun: '<svg class="w-8 h-8 icon-sun" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000 1.41.996.996 0 001.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z"/></svg>',
    partCloud: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z" fill="#E8E8E8"/><circle cx="8" cy="8" r="4" fill="#FDB813"/></svg>',
    cloud: '<svg class="w-8 h-8 icon-gray" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5Z" /></svg>'
};

const weatherCodes = {
    0: { label: 'Clear', icon: icons.sun }, 1: { label: 'Sunny', icon: icons.sun },
    2: { label: 'Partly Cloudy', icon: icons.partCloud }, 3: { label: 'Overcast', icon: icons.cloud },
    45: { label: 'Foggy', icon: icons.cloud }, 48: { label: 'Foggy', icon: icons.cloud },
    51: { label: 'Drizzle', icon: icons.partCloud }, 61: { label: 'Rain', icon: icons.partCloud },
    63: { label: 'Rain', icon: icons.partCloud }, 71: { label: 'Snow', icon: icons.partCloud },
    95: { label: 'Storm', icon: icons.partCloud }
};

// --- STATE MANAGEMENT ---
let map, markers = [], currentRouteId = 'frances', selectedStageIndex = 0, linesLayer = L.layerGroup();

document.addEventListener('DOMContentLoaded', () => {
    initWidget();
});

function initWidget() {
    const container = document.getElementById('camino-widget-container');
    container.innerHTML = `
        <div class="bg-white rounded-xl border border-gray-200 p-3 mb-6 shadow-sm relative">
            
            <div id="heroControls" class="absolute inset-0 z-[1000] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-xl text-center hidden">
                <button onclick="locateUser()" class="w-full bg-[#1967d2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-base shadow-lg transition-all flex justify-center items-center gap-2 mb-3 transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Locate Me
                </button>
                <button onclick="enableManualMode()" class="text-xs font-bold text-gray-400 hover:text-[#1967d2] underline decoration-dashed">
                    Select Manually
                </button>
            </div>

            <div id="activeControls" class="mb-3 hidden-transition">
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Route & Stage</label>
                <select id="routeSelect" onchange="changeRoute()" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-bold text-sm focus:outline-none focus:border-[#1967d2]">
                    <option value="frances">Camino Francés</option>
                    <option value="norte">Camino del Norte</option>
                    <option value="plata">Via de la Plata</option>
                    <option value="lusitana">Via Lusitana</option>
                    <option value="coastal">Portuguese Coastal</option>
                    <option value="primitivo">Camino Primitivo</option>
                    <option value="invierno">Camino de Invierno</option>
                </select>
            </div>
            
            <div class="relative rounded-xl overflow-hidden border border-gray-200 h-48">
                <div id="map"></div>
                <div id="mapOverlay" class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-600 shadow-sm z-[999] hidden-transition">
                    📍 <span id="currentStageName">Select a stage on map</span>
                </div>
            </div>
            
            <button id="scanBtn" onclick="getTacticalForecast()" class="w-full mt-3 bg-[#1967d2] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-md transition-all flex justify-center items-center gap-2 hidden-transition">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Scan Next 3 Days
            </button>
        </div>
        
        <div id="loading" class="hidden text-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1967d2] mx-auto"></div>
            <p class="text-xs text-gray-400 mt-3 font-medium">Checking safety risks...</p>
        </div>
        
        <div id="results" class="space-y-6 pb-20"></div>
    `;

    initMap();
}

function initMap() {
    map = L.map('map', { zoomControl: false }).setView([42.6, -4.0], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    // Check PWA state
    const savedRoute = localStorage.getItem('camino_last_route');
    if(savedRoute && CAMINO_DB.routes[savedRoute]) {
        switchToActiveMode(savedRoute);
        const savedStage = localStorage.getItem('camino_last_stage');
        if(savedStage) {
            selectedStageIndex = parseInt(savedStage);
            setTimeout(() => { if(markers[selectedStageIndex]) markers[selectedStageIndex].fire('click'); }, 500);
        }
    } else {
        showHeroMap();
        document.getElementById('heroControls').classList.remove('hidden');
    }
}

function showHeroMap() {
    linesLayer.clearLayers();
    // Simplified path drawing for Hero mode
    const colors = { frances: '#dc2626', norte: '#16a34a', plata: '#eab308' };
    Object.keys(CAMINO_DB.routes).forEach(key => {
        const route = CAMINO_DB.routes[key];
        const points = route.map(s => [s.lat, s.lon]);
        L.polyline(points, { color: colors[key] || '#666', weight: 3, opacity: 0.6 }).addTo(linesLayer);
    });
    linesLayer.addTo(map);
}

function switchToActiveMode(routeId) {
    document.getElementById('heroControls').classList.add('hidden');
    document.getElementById('activeControls').classList.remove('hidden-transition');
    document.getElementById('mapOverlay').classList.remove('hidden-transition');
    document.getElementById('scanBtn').classList.remove('hidden-transition');
    
    linesLayer.clearLayers();
    document.getElementById('routeSelect').value = routeId;
    changeRoute();
}

function enableManualMode() {
    switchToActiveMode('frances');
}

function changeRoute() {
    const select = document.getElementById('routeSelect');
    currentRouteId = select.value;
    const routeData = CAMINO_DB.routes[currentRouteId];
    
    // Calculate center
    const latSum = routeData.reduce((sum, s) => sum + s.lat, 0);
    const lonSum = routeData.reduce((sum, s) => sum + s.lon, 0);
    map.setView([latSum / routeData.length, lonSum / routeData.length], 7);

    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    routeData.forEach((stage, index) => {
        const marker = L.marker([stage.lat, stage.lon]).addTo(map);
        marker.on('click', () => {
            selectedStageIndex = index;
            document.getElementById('currentStageName').innerText = `${stage.start} → ${stage.end}`;
            markers.forEach(m => { if (m._icon) m._icon.classList.remove('img-selected-pin'); });
            if (marker._icon) marker._icon.classList.add('img-selected-pin');
        });
        markers.push(marker);
    });

    if(markers.length > 0) {
        selectedStageIndex = 0;
        document.getElementById('currentStageName').innerText = `${routeData[0].start} → ${routeData[0].end}`;
    }
}

function locateUser() {
    if(!navigator.geolocation) { alert("GPS not supported"); return; }
    const btn = document.querySelector('#heroControls button');
    const oldText = btn.innerHTML;
    btn.innerHTML = "Locating...";
    
    navigator.geolocation.getCurrentPosition((pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        let nearestRoute = null, nearestStageIdx = 0, minGlobDist = Infinity;

        Object.keys(CAMINO_DB.routes).forEach(rKey => {
            CAMINO_DB.routes[rKey].forEach((stage, idx) => {
                const d = getDistanceFromLatLonInKm(userLat, userLon, stage.lat, stage.lon);
                if(d < minGlobDist) {
                    minGlobDist = d;
                    nearestRoute = rKey;
                    nearestStageIdx = idx;
                }
            });
        });

        if(minGlobDist > 100) {
            alert("You seem far from the Camino (>100km). Switching to manual mode.");
            enableManualMode();
        } else {
            currentRouteId = nearestRoute;
            selectedStageIndex = nearestStageIdx;
            switchToActiveMode(nearestRoute);
            setTimeout(() => {
                const st = CAMINO_DB.routes[nearestRoute][nearestStageIdx];
                map.flyTo([st.lat, st.lon], 10);
                if(markers[nearestStageIdx]) markers[nearestStageIdx].fire('click');
                getTacticalForecast(); 
            }, 500);
        }
    }, () => {
        alert("GPS permission denied. Please select manually.");
        btn.innerHTML = oldText;
        enableManualMode();
    });
}

// --- LOGIC HELPERS ---
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; var dLat = deg2rad(lat2-lat1); var dLon = deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
}
function deg2rad(deg) { return deg * (Math.PI/180) }
function formatAMPM(dateStr) {
    let [hours, mins] = dateStr.split(':'); hours = parseInt(hours);
    let ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12; hours = hours ? hours : 12; 
    return `${hours}:${mins} ${ampm}`;
}

function generateChart(hourlyData) {
    const hours = [], temps = [], rains = [];
    for(let h=6; h<=18; h++) { hours.push(h); temps.push(Math.round(hourlyData.temperature_2m[h])); rains.push(hourlyData.precipitation[h]); }
    const w = 400, h = 100, colW = w / 13;
    const maxTemp = Math.max(...temps) + 2; const minTemp = Math.min(...temps) - 2; const range = maxTemp - minTemp || 1;
    let pathD = `M ${colW/2} ${h - ((temps[0] - minTemp)/range * 60 + 20)}`;
    const points = temps.map((t, i) => { const x = (i * colW) + (colW/2); const y = h - ((t - minTemp)/range * 60 + 20); return {x, y, t}; });
    points.forEach((p, i) => { if (i !== 0) pathD += ` L ${p.x} ${p.y}`; });
    let svg = `<svg viewBox="0 0 ${w} ${h}" class="w-full h-full overflow-visible">`;
    rains.forEach((r, i) => { if(r > 0) {
        const barH = Math.min(r * 10, 40); const x = (i * colW) + (colW/2) - 4; const y = h - barH;
        svg += `<rect x="${x}" y="${y}" width="8" height="${barH}" fill="#8ab4f8" rx="2" />`;
        if(r > 1.0) svg += `<text x="${x+4}" y="${y-4}" class="chart-label" style="fill:#1967d2">${r.toFixed(1)}</text>`;
    }});
    svg += `<path d="${pathD}" fill="none" stroke="#fdb813" stroke-width="3" stroke-linecap="round" />`;
    points.forEach((p, i) => {
        svg += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="white" stroke="#fdb813" stroke-width="2" />`;
        svg += `<text x="${p.x}" y="${p.y - 8}" class="temp-label">${p.t}°</text>`;
        if ((hours[i]) % 3 === 0) svg += `<text x="${p.x}" y="${h + 12}" class="chart-label">${hours[i]}:00</text>`;
    });
    return svg + `</svg>`;
}

// --- DETERMINISTIC FORECAST LOGIC ---
async function getTacticalForecast() {
    const resultsDiv = document.getElementById('results');
    const loading = document.getElementById('loading');
    resultsDiv.innerHTML = ''; loading.classList.remove('hidden');
    localStorage.setItem('camino_last_route', currentRouteId);
    localStorage.setItem('camino_last_stage', selectedStageIndex);

    try {
        const routeData = CAMINO_DB.routes[currentRouteId];
        let itinerary = [];
        for(let i=0; i<3; i++) { if (selectedStageIndex + i < routeData.length) itinerary.push(routeData[selectedStageIndex + i]); }
        
        const nowHour = new Date().getHours();
        const startDayOffset = (nowHour >= 17) ? 1 : 0; 
        const monthIndex = new Date().getMonth(); // 0-11 for array index

        for (let i = 0; i < 3; i++) {
            if (i >= itinerary.length) break; 
            const stage = itinerary[i];
            const current = new Date(); current.setDate(current.getDate() + startDayOffset + i); 
            
            let dateQuery = current.toISOString().split('T')[0];

// --- NEW: HOLIDAY CHECK ---
            // We check if this specific date, on this specific route/stage, is a holiday
            let holidayBadge = "";
            const isHoliday = isCaminoHoliday(dateQuery, currentRouteId, stage.id);
            
            if (isHoliday) {
                holidayBadge = `
                    <div class="mt-2 bg-yellow-50 text-yellow-800 border border-yellow-200 p-2 rounded-lg text-xs flex items-center gap-2 shadow-sm">
                        <span class="text-lg">🏪</span>
                        <div>
                            <span class="font-bold block">Public Holiday</span>
                            <span class="opacity-75">Shops/Pharmacies likely closed.</span>
                        </div>
                    </div>`;
            }
            // ---------------------------

            
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${stage.lat}&longitude=${stage.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,daylight_duration&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,uv_index&timezone=auto&start_date=${dateQuery}&end_date=${dateQuery}`;
            
            const res = await fetch(url);
            const json = await res.json();

            if(json.hourly) {
                // Calculate Daily Stats
                let maxWind = 0, maxRealFeel = -100;
                for(let h=6; h<=15; h++) {
                    if(json.hourly.windspeed_10m[h] > maxWind) maxWind = json.hourly.windspeed_10m[h];
                    const rf = json.hourly.apparent_temperature[h];
                    if(rf > maxRealFeel) maxRealFeel = rf;
                }

                // --- 1. SEASONALITY CONTEXT ---
                // Default to first stage context if route level missing, but structure is Route -> Month
                let seasonData = CAMINO_DB.seasonality[currentRouteId] ? CAMINO_DB.seasonality[currentRouteId][monthIndex] : {vibe: "Unknown", risk: "None"};
                let vibeTag = seasonData.vibe;
                let seasonalRisk = seasonData.risk;

                // --- 2. LOGIC DECISION TREE ---
                let badgeClass = "bg-gray-50 text-gray-700 border-gray-100";
                let icon = "☁️"; 
                let message = "Normal Conditions.";
                let subMessage = `Typical ${vibeTag} vibe.`;

                // CRITICAL OVERRIDES
                if (seasonData.status === "Closed" || seasonData.status === "Danger") {
                    badgeClass = "bg-red-900 text-white border-red-900"; icon = "⛔";
                    message = `ROUTE WARNING: ${seasonData.status}`;
                    subMessage = `${seasonalRisk}. Check local alerts.`;
                }
                // SAFETY: Bailouts & Weather
                else if (stage.bailout === "Zero" && (json.daily.precipitation_sum[0] > 10 || maxWind > 45)) {
                    badgeClass = "bg-red-50 text-red-800 border-red-100"; icon = "⚠️";
                    message = "DANGEROUS STAGE.";
                    subMessage = "No bailout points & bad weather. Do not attempt.";
                }
                // SAFETY: Water & Heat
                else if (stage.water_gap > 10 && maxRealFeel > 28) {
                    badgeClass = "bg-orange-50 text-orange-800 border-orange-100"; icon = "💧";
                    message = "CRITICAL HYDRATION.";
                    subMessage = `${stage.water_gap}km without water in heat. Carry 3L.`;
                }
                // WEATHER: Wind
                else if (maxWind > 50) {
                    badgeClass = "bg-red-50 text-red-700 border-red-100"; icon = "🌬️";
                    message = "Gale Force Winds.";
                    subMessage = "Avoid exposed ridges.";
                }
                // WEATHER: Perfect
                else if (json.daily.precipitation_sum[0] < 0.5 && maxRealFeel < 25 && maxRealFeel > 10) {
                    badgeClass = "bg-green-50 text-green-700 border-green-100"; icon = "✅";
                    message = "Perfect Walking Conditions.";
                    // Only show seasonal risk if it's NOT just generic rain
                    subMessage = seasonalRisk.includes("Rain") ? "Enjoy the trail." : `Note: ${seasonalRisk}`;
                }
                // DEFAULT WEATHER
                else if (json.daily.precipitation_sum[0] > 2) {
                    badgeClass = "bg-blue-50 text-blue-700 border-blue-100"; icon = "🌧️";
                    message = "Rain Expected.";
                    subMessage = "Poncho day.";
                }

                // Render
                const d = json.daily;
                const sunrise = formatAMPM(d.sunrise[0].split('T')[1].slice(0,5));
                const dlHrs = Math.floor(d.daylight_duration[0] / 3600);
                const chartSVG = generateChart(json.hourly);
                const wInfo = weatherCodes[d.weathercode[0]] || { label: 'Unknown', icon: icons.cloud };

                const html = `
                    <div class="card-tactical p-4 mb-4">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                            ${holidayBadge}
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-[10px] font-bold bg-[#1967d2] text-white px-2 py-0.5 rounded uppercase">${current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
                                    <span class="text-[10px] text-gray-400 uppercase tracking-wide truncate max-w-[120px]">${stage.start} → ${stage.end}</span>
                                </div>
                                <div class="flex items-center gap-3 text-[10px] text-gray-500 font-bold mt-1 mb-2">
                                    <span class="bg-gray-100 px-1.5 rounded text-gray-700">${stage.dist} km</span>
                                    <span class="flex items-center gap-1"><svg class="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> ${sunrise}</span>
                                    <span>${dlHrs}h Light</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="flex justify-end mb-1">${wInfo.icon}</div>
                                <div class="text-2xl font-bold text-gray-800">${Math.round(d.temperature_2m_max[0])}°</div>
                                <div class="text-xs text-blue-500 font-bold">${Math.round(d.temperature_2m_min[0])}°</div>
                            </div>
                        </div>
                        <div class="${badgeClass} p-3 rounded-lg text-xs border flex items-start gap-3 shadow-sm mb-3">
                            <div class="text-xl pt-0.5">${icon}</div>
                            <div>
                                <div class="font-bold text-base leading-tight">${message}</div>
                                <div class="opacity-90 font-medium mt-0.5">${subMessage}</div>
                            </div>
                        </div>
                        <div class="chart-container">${chartSVG}</div>
                    </div>
                `;
                resultsDiv.innerHTML += html;
            }
        }
    } catch (e) { console.error(e); resultsDiv.innerHTML = `<div class="text-red-400 text-center font-bold py-10">Error. Check connection.</div>`; } 
    finally { loading.classList.add('hidden'); }
}
