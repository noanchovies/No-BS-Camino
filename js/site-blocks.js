/**
 * NO BS SITE BLOCK ENGINE (Restored Fidelity)
 * Dependencies: CAMINO_DB (camino-master-data.js), Leaflet
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CAMINO_DB === 'undefined') { console.error("CRITICAL: CAMINO_DB not loaded."); return; }
    const config = CAMINO_DB.config;

    renderHeader(config);
    renderHero(config);
    renderInstallBanner();
    renderRoutesSection();
    renderPlannerPreview(config.featured_route_id);
    renderFAQ();
    renderCosts(config.year);
    renderLinks();
    renderFooter(config);
    
    setTimeout(initRouteMaps, 500);
});

// --- 1. ICON LIBRARY ---
function getIcon(name, colorClass) {
    const paths = {
        mountain: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>',
        user: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
        plane: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>',
        sun: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>',
        flat: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
        chart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>',
        eye: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
        cloud: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>',
        check: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
    };
    const colors = { orange: "text-orange-500", blue: "text-blue-500", green: "text-green-500", red: "text-red-500" };
    return `<svg class="w-4 h-4 ${colors[colorClass] || 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${paths[name] || ''}</svg>`;
}

// --- 2. RENDERERS ---

function renderHeader(config) {
    document.getElementById('block-header').innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center justify-between w-full md:w-auto">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.scrollTo(0,0)">
                <svg class="w-6 h-6 text-[#1967d2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span class="font-bold text-gray-700 text-lg tracking-tight">${config.site_name}</span>
            </div>
        </div>
        <nav class="flex gap-2 overflow-x-auto no-scrollbar">
            <a href="smart-planner/smart-planner-index.html" class="nav-pill px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-[#1967d2] whitespace-nowrap flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                Weather Planner
            </a>
            <a href="#block-faq" class="nav-pill px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">Fact Checks</a>
            <a href="#block-routes" class="nav-pill px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">Routes</a>
            <a href="#block-costs" class="nav-pill px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">Costs</a>
        </nav>
    </div>`;
}

function renderHero(config) {
    document.getElementById('block-hero').innerHTML = `
    <h1 class="text-3xl md:text-4xl font-bold google-gradient tracking-tight leading-tight mb-6">${config.hero.title}</h1>
    <h2 class="text-sm md:text-base font-medium text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
         <span class="text-black font-bold">${config.hero.subtitle}</span>
    </h2>`;
}

function renderInstallBanner() {
    document.getElementById('block-install').innerHTML = `
    <div id="installBanner" class="hidden bg-[#1967d2] text-white px-4 py-3 shadow-md flex justify-between items-center sticky top-0 z-[60]">
        <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></div>
            <div><p class="text-sm font-bold">Get the App</p><p class="text-xs text-blue-100">Better experience, works offline.</p></div>
        </div>
        <button id="installBtn" class="bg-white text-[#1967d2] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">Install</button>
    </div>`;
}

function renderRoutesSection() {
    const routesMeta = CAMINO_DB.routes_meta;
    let cardsHtml = Object.keys(routesMeta).map(key => {
        const route = routesMeta[key];
        let statsHtml = route.stats.map(stat => `<div class="flex items-center gap-2">${getIcon(stat.icon, stat.color)} ${stat.text}</div>`).join('');

        return `
        <a href="${route.link}" class="snap-center shrink-0 w-[85vw] md:w-[300px] card-flight overflow-hidden group cursor-pointer block">
            <div class="h-40 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                <div id="map-${key}" class="w-full h-full z-0 mix-blend-multiply opacity-90"></div>
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-gray-100 z-10">${route.tag}</div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-baseline mb-1">
                    <h4 class="text-lg font-bold text-gray-900 group-hover:text-[#1967d2] transition-colors">${route.name}</h4>
                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">${route.dist_label}</span>
                </div>
                <p class="text-xs text-gray-400 mb-4 uppercase tracking-wide">${route.desc}</p>
                <div class="grid grid-cols-2 gap-3 text-xs text-gray-600 font-medium">${statsHtml}</div>
            </div>
        </a>`;
    }).join('');

    document.getElementById('block-routes').innerHTML = `
    <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            Routes
        </h3>
        <div class="flex gap-2">
            <button onclick="document.getElementById('routes-carousel').scrollBy({left: -320, behavior: 'smooth'})" class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button onclick="document.getElementById('routes-carousel').scrollBy({left: 320, behavior: 'smooth'})" class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </div>
    </div>
    <div id="routes-carousel" class="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">${cardsHtml}</div>`;
}

function renderPlannerPreview(featuredRouteId) {
    document.getElementById('block-planner-preview').innerHTML = `
    <div class="flex justify-between items-end mb-4"> 
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
            Smart Weather Planner
        </h3>
        <a href="smart-planner/smart-planner-index.html" class="text-sm font-bold text-[#1967d2] hover:underline">Try it live →</a>
    </div>
    <div class="relative group cursor-pointer" onclick="window.location.href='smart-planner/smart-planner-index.html'">
        <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 md:p-6 relative overflow-hidden">
            <div id="preview-map" class="h-32 md:h-48 w-full bg-blue-100 rounded-xl mb-3 md:mb-6 relative overflow-hidden border border-blue-200 z-0"></div>
             <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-4 z-20 rounded-b-2xl pointer-events-none">
                <span class="bg-[#1967d2] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform group-hover:scale-105 flex items-center gap-2 pointer-events-auto">Plan Your Specific Dates</span>
            </div>
        </div>
    </div>`;
    
    setTimeout(() => {
         if(document.getElementById('preview-map') && CAMINO_DB.routes[featuredRouteId]) {
            const data = CAMINO_DB.routes[featuredRouteId];
            const startNode = data[0], endNode = data[data.length-1];
            const midLat = (startNode.lat + endNode.lat) / 2, midLon = (startNode.lon + endNode.lon) / 2;
            var pMap = L.map('preview-map', { zoomControl: false, dragging: false, scrollWheelZoom: false, attributionControl: false }).setView([midLat, midLon], 6); 
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(pMap);
            const path = data.map(s => [s.lat, s.lon]);
            L.polyline(path, { color: '#dc2626', weight: 3, opacity: 0.6 }).addTo(pMap);
         }
    }, 500);
}

function renderFAQ() {
    const faqs = CAMINO_DB.faqs;
    let faqHtml = faqs.map(f => `
        <div class="snap-center shrink-0 w-[85vw] md:w-[350px] card-flight p-6 flex flex-col h-full">
            <div class="flex justify-between items-start mb-4">
                <div class="text-xs font-bold text-[#1967d2] bg-blue-50 px-2 py-1 rounded uppercase">${f.cat}</div>
                ${f.tag ? `<span class="text-[10px] text-red-400 font-bold border border-red-100 px-2 py-1 rounded bg-red-50">${f.tag}</span>` : ''}
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-4">${f.title}</h4>
            <div class="reality-box mb-4 flex-grow">
                <h5 class="text-xs font-bold text-[#1967d2] uppercase mb-1">The Reality</h5>
                <p class="text-sm text-gray-700">${f.text}</p>
            </div>
            <div class="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                <span class="text-xs text-gray-400 font-medium">Source: ${f.source}</span>
                <a href="${f.url}" class="text-sm font-bold text-[#1967d2] hover:underline">Read Full Breakdown →</a>
            </div>
        </div>
    `).join('');

    document.getElementById('block-faq').innerHTML = `
    <div class="flex items-center justify-between mb-6">
        <div><h3 class="text-xl font-bold text-gray-800">Rapid Fire FAQ</h3><span class="text-xs text-gray-400 font-medium">Common Myths Debunked</span></div>
        <div class="flex gap-2">
             <button onclick="document.getElementById('faq-carousel').scrollBy({left: -320, behavior: 'smooth'})" class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button onclick="document.getElementById('faq-carousel').scrollBy({left: 320, behavior: 'smooth'})" class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </div>
    </div>
    <div id="faq-carousel" class="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">${faqHtml}</div>
    <div class="text-center mt-10">
        <a href="myths.html" class="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#1967d2] transition-colors border-b border-gray-300 hover:border-[#1967d2] pb-1">
            See full list of common myths debunked
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
    </div>`;
}

function renderCosts(year) {
    const data = CAMINO_DB.costs;
    let rowsHtml = data.rows.map(row => `
        <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">${row.item}</td>
            <td class="px-6 py-4 text-gray-500">${row.myth}</td>
            <td class="px-6 py-4 font-bold text-gray-800 bg-blue-50/30">${row.reality}</td>
        </tr>
    `).join('');

    document.getElementById('block-costs').innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Real Cost (${year})
    </h3>
    <div class="card-flight overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr><th class="px-6 py-4 font-medium">Category</th><th class="px-6 py-4 font-medium text-red-500">Bloggers*</th><th class="px-6 py-4 font-bold text-blue-600 bg-blue-50/50">Reality</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${rowsHtml}
                    <tr class="hover:bg-gray-50/50 transition-colors bg-gray-50">
                        <td class="px-6 py-4 font-bold text-gray-900">${data.total.label}</td>
                        <td class="px-6 py-4 text-gray-400 line-through decoration-red-400 decoration-2">${data.total.myth}</td>
                        <td class="px-6 py-4 font-black text-[#1967d2] bg-blue-50/30">${data.total.reality}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 text-[10px] text-gray-500 border-t border-gray-100 leading-tight">
            <span class="font-bold text-red-500">* The Misconception:</span> ${data.disclaimer}
        </div>
    </div>`;
}

function renderLinks() {
    document.getElementById('block-links').innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-6">Direct Links</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="https://www.gronze.com/" target="_blank" class="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:border-[#1967d2] hover:bg-blue-50 transition-colors group bg-white">
            <span class="font-bold text-gray-700 group-hover:text-[#1967d2]">Gronze (Best Maps/Albergues)</span>
            <svg class="w-4 h-4 text-gray-300 group-hover:text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
        <a href="https://wise.com/" target="_blank" class="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:border-[#1967d2] hover:bg-blue-50 transition-colors group bg-white">
            <span class="font-bold text-gray-700 group-hover:text-[#1967d2]">Wise (Best Travel Card)</span>
            <svg class="w-4 h-4 text-gray-300 group-hover:text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
    </div>`;
}

function renderFooter(config) {
    document.getElementById('block-footer').innerHTML = `
    <div class="mb-6">
        <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-600 hover:border-yellow-400 hover:text-yellow-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Buy me a coffee
        </a>
    </div>
    <p class="text-sm text-gray-400">© ${config.year} ${config.site_name}. Built for utility.</p>`;
}

function initRouteMaps() {
    const mapOptions = { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, attributionControl: false, zoomSnap: 0.1 };
    const redLineStyle = { color: '#dc2626', weight: 4, opacity: 0.8, smoothFactor: 1 };

    const routes = CAMINO_DB.routes_meta;
    Object.keys(routes).forEach(key => {
        const mapId = `map-${key}`;
        if(document.getElementById(mapId)) {
            const routeData = CAMINO_DB.routes[key];
            if(routeData) {
                const map = L.map(mapId, mapOptions);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png').addTo(map);
                const points = routeData.map(s => [s.lat, s.lon]);
                const line = L.polyline(points, redLineStyle).addTo(map);
                map.fitBounds(line.getBounds(), {padding: [20, 20]});
            }
        }
    });
}
