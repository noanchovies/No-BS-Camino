/**
 * NO BS SITE BLOCK ENGINE
 * Generates the landing page dynamically.
 * Edit this file to change content, links, and route cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderHero();
    renderInstallBanner();
    renderRoutesSection();
    renderPlannerPreview();
    renderFAQ();
    renderCosts();
    renderLinks();
    renderFooter();
    
    // Initialize Maps after DOM is ready
    setTimeout(initRouteMaps, 500);
});

// --- 1. CONFIGURATION DATA ---

const SITE_CONFIG = {
    name: "No BS Camino",
    year: "2026",
    heroTitle: "Easy Camino Planning",
    heroSubtitle: "All your information in a simple page. No Affiliate Scams or AI Slop.",
    navLinks: [
        { label: "Weather Planner", href: "smart-planner/smart-planner-index.html", primary: true },
        { label: "Fact Checks", href: "#block-faq" },
        { label: "Routes", href: "#block-routes" },
        { label: "Costs", href: "#block-costs" }
    ]
};

const ROUTES_DATA = [
    {
        id: "frances",
        name: "French Way (Francés)",
        link: "routes/route-frances.html",
        tag: "The Classic",
        dist: "790km",
        desc: "St. Jean → Santiago",
        stats: [
            { icon: "mountain", text: "Varied Terrain", color: "orange" },
            { icon: "user", text: "High Traffic", color: "orange" },
            { icon: "plane", text: "Fly: Biarritz", color: "blue" },
            { icon: "sun", text: "May - Oct", color: "blue" }
        ],
        mapCoords: [[43.16, -1.23], [42.81, -1.64], [42.46, -2.44], [42.34, -3.69], [42.60, -5.56], [42.54, -6.59], [42.88, -8.54]]
    },
    {
        id: "portugues",
        name: "Portuguese Central",
        link: "routes/route-portugues.html",
        tag: "#2 Most Traveled",
        dist: "620km",
        desc: "Lisbon → Santiago",
        stats: [
            { icon: "flat", text: "Flat / Easy", color: "green" },
            { icon: "user", text: "Med Traffic", color: "green" },
            { icon: "plane", text: "Fly: Lisbon", color: "blue" },
            { icon: "sun", text: "All Year", color: "blue" }
        ],
        mapCoords: [[38.72, -9.14], [39.23, -8.68], [40.20, -8.41], [41.15, -8.62], [41.69, -8.83], [42.88, -8.54]]
    },
    {
        id: "coastal",
        name: "Portuguese Coastal",
        link: "routes/route-coastal.html",
        tag: "Scenic & Beachfront",
        dist: "280km",
        desc: "Porto → Santiago",
        stats: [
            { icon: "flat", text: "Boardwalks", color: "green" },
            { icon: "user", text: "Med Traffic", color: "orange" },
            { icon: "plane", text: "Fly: Porto", color: "blue" },
            { icon: "sun", text: "Apr - Oct", color: "blue" }
        ],
        mapCoords: [[41.15, -8.62], [41.35, -8.75], [41.69, -8.83], [42.11, -8.82], [42.88, -8.54]]
    },
    {
        id: "norte",
        name: "Norte",
        link: "routes/route-norte.html",
        tag: "Stunning Rugged",
        dist: "820km",
        desc: "Irún → Santiago",
        stats: [
            { icon: "mountain", text: "Very Hilly", color: "red" },
            { icon: "user", text: "Low Traffic", color: "green" },
            { icon: "plane", text: "Fly: San Seb.", color: "blue" },
            { icon: "sun", text: "Summer Only", color: "blue" }
        ],
        mapCoords: [[43.33, -1.78], [43.31, -1.98], [43.26, -2.93], [43.46, -3.80], [43.53, -5.66], [43.55, -7.04], [42.88, -8.54]]
    },
    {
        id: "primitivo",
        name: "Primitivo",
        link: "routes/route-primitivo.html",
        tag: "The Original",
        dist: "320km",
        desc: "Oviedo → Santiago",
        stats: [
            { icon: "mountain", text: "Mountains", color: "red" },
            { icon: "chart", text: "Hardest", color: "red" },
            { icon: "plane", text: "Fly: Asturias", color: "blue" },
            { icon: "sun", text: "May - Sep", color: "blue" }
        ],
        mapCoords: [[43.36, -5.85], [43.40, -6.15], [43.18, -6.55], [43.01, -7.55], [42.88, -8.54]]
    },
    {
        id: "invierno",
        name: "Invierno",
        link: "routes/route-invierno.html",
        tag: "Secret Winter Way",
        dist: "260km",
        desc: "Ponferrada → Santiago",
        stats: [
            { icon: "eye", text: "Secret Path", color: "green" },
            { icon: "cloud", text: "All Year", color: "blue" },
            { icon: "plane", text: "Fly: León", color: "blue" },
            { icon: "check", text: "No Crowds", color: "green" }
        ],
        mapCoords: [[42.54, -6.59], [42.42, -6.90], [42.52, -7.51], [42.63, -8.12], [42.88, -8.54]]
    },
    {
        id: "plata",
        name: "Via de la Plata",
        link: "routes/route-plata.html",
        tag: "The Longest",
        dist: "1000km",
        desc: "Seville → Santiago",
        stats: [
            { icon: "sun", text: "Very Hot", color: "orange" },
            { icon: "eye", text: "Solitary", color: "green" },
            { icon: "plane", text: "Fly: Seville", color: "blue" },
            { icon: "sun", text: "Spring/Autumn", color: "blue" }
        ],
        mapCoords: [[37.38, -5.98], [38.91, -6.34], [40.96, -5.66], [42.02, -5.66], [42.45, -6.05], [42.88, -8.54]]
    }
];

// --- 2. ICON LIBRARY (SVG Strings) ---
function getIcon(name, colorClass) {
    const paths = {
        mountain: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>', // Actually lightning bolt used for strenuous
        user: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
        plane: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>',
        sun: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>',
        flat: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
        chart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>',
        eye: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
        cloud: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>',
        check: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
    };
    // Map text colors to tailwind classes
    const colors = {
        orange: "text-orange-500",
        blue: "text-blue-500",
        green: "text-green-500",
        red: "text-red-500"
    };
    return `<svg class="w-4 h-4 ${colors[colorClass] || 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${paths[name] || ''}</svg>`;
}

// --- 3. RENDER FUNCTIONS ---

function renderInstallBanner() {
    document.getElementById('block-install').innerHTML = `
    <div id="installBanner" class="hidden bg-[#1967d2] text-white px-4 py-3 shadow-md flex justify-between items-center sticky top-0 z-[60]">
        <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></div>
            <div><p class="text-sm font-bold">Get the App</p><p class="text-xs text-blue-100">Better experience, works offline.</p></div>
        </div>
        <button id="installBtn" class="bg-white text-[#1967d2] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">Install</button>
    </div>`;
    // Attach event listeners logic here or in main logic
}

function renderHeader() {
    const linksHtml = SITE_CONFIG.navLinks.map(link => {
        if(link.primary) {
            return `<a href="${link.href}" class="nav-pill px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-[#1967d2] whitespace-nowrap flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                    ${link.label}</a>`;
        }
        return `<a href="${link.href}" class="nav-pill px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">${link.label}</a>`;
    }).join('');

    document.getElementById('block-header').innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center justify-between w-full md:w-auto">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.scrollTo(0,0)">
                <svg class="w-6 h-6 text-[#1967d2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span class="font-bold text-gray-700 text-lg tracking-tight">No BS <span class="text-[#1967d2]">Camino</span></span>
            </div>
        </div>
        <nav class="flex gap-2 overflow-x-auto no-scrollbar">${linksHtml}</nav>
    </div>`;
}

function renderHero() {
    document.getElementById('block-hero').innerHTML = `
    <h1 class="text-3xl md:text-4xl font-bold google-gradient tracking-tight leading-tight mb-6">${SITE_CONFIG.heroTitle}</h1>
    <h2 class="text-sm md:text-base font-medium text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
         <span class="text-black font-bold">${SITE_CONFIG.heroSubtitle}</span>
    </h2>`;
}

function renderRoutesSection() {
    let cardsHtml = ROUTES_DATA.map(route => {
        let statsHtml = route.stats.map(stat => `
            <div class="flex items-center gap-2">
                ${getIcon(stat.icon, stat.color)} ${stat.text}
            </div>
        `).join('');

        return `
        <a href="${route.link}" class="snap-center shrink-0 w-[85vw] md:w-[300px] card-flight overflow-hidden group cursor-pointer block">
            <div class="h-40 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                <div id="map-${route.id}" class="w-full h-full z-0 mix-blend-multiply opacity-90"></div>
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-gray-100 z-10">${route.tag}</div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-baseline mb-1">
                    <h4 class="text-lg font-bold text-gray-900 group-hover:text-[#1967d2] transition-colors">${route.name}</h4>
                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">${route.dist}</span>
                </div>
                <p class="text-xs text-gray-400 mb-4 uppercase tracking-wide">${route.desc}</p>
                <div class="grid grid-cols-2 gap-3 text-xs text-gray-600 font-medium">
                    ${statsHtml}
                </div>
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
    <div id="routes-carousel" class="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        ${cardsHtml}
    </div>`;
}

function renderPlannerPreview() {
    // This essentially keeps your specific "Try it live" block. 
    // You could make this dynamic too, but it's often a unique layout.
    // For now, I'll paste the HTML structure you had, but you can inject data if needed.
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
                <span class="bg-[#1967d2] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform group-hover:scale-105 flex items-center gap-2 pointer-events-auto">
                    Plan Your Specific Dates
                </span>
            </div>
        </div>
    </div>`;
    
    // Initialize the mini map for preview
    setTimeout(() => {
         if(document.getElementById('preview-map')) {
            var pMap = L.map('preview-map', { zoomControl: false, dragging: false, scrollWheelZoom: false, attributionControl: false }).setView([42.8, -2.5], 6); 
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(pMap);
         }
    }, 500);
}

function renderFAQ() {
    // You can move your FAQ data to a similar array object if you want to scale it.
    // For brevity, I'm pasting the structure, but this is easily loopable.
    const faqs = [
        { cat: "GEAR", tag: "MYTH", title: '"Trail Runners vs. Boots"', text: "90% of veterans recommend non-waterproof trail runners. Boots trap heat = blisters." },
        { cat: "RULES", tag: "2025 UPDATE", title: '"2025 Stamp Rules"', text: "You <strong>must</strong> get 2 stamps per day (start & end) for the last 100km, or no Compostela." },
        { cat: "LOGISTICS", tag: "", title: '"Book IN ADVAAAANCEEEE"', text: "Nonsense. Book 1 day ahead via WhatsApp. Use Gronze.com for numbers." }
    ];

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
    <div id="faq-carousel" class="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        ${faqHtml}
    </div>`;
}

function renderCosts() {
    document.getElementById('block-costs').innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#1967d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Real Cost (${SITE_CONFIG.year})
    </h3>
    <div class="card-flight overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr><th class="px-6 py-4 font-medium">Category</th><th class="px-6 py-4 font-medium text-red-500">Bloggers*</th><th class="px-6 py-4 font-bold text-blue-600 bg-blue-50/50">Reality</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr class="hover:bg-gray-50/50"><td class="px-6 py-4 font-medium">Bed (Albergue)</td><td class="px-6 py-4 text-gray-500">€5 - €8</td><td class="px-6 py-4 font-bold text-gray-800 bg-blue-50/30">€12 - €18</td></tr>
                    <tr class="hover:bg-gray-50/50"><td class="px-6 py-4 font-medium">Menu del Dia</td><td class="px-6 py-4 text-gray-500">€10</td><td class="px-6 py-4 font-bold text-gray-800 bg-blue-50/30">€14 - €18</td></tr>
                    <tr class="hover:bg-gray-50/50 bg-gray-50"><td class="px-6 py-4 font-bold">Total Daily</td><td class="px-6 py-4 text-gray-400 line-through">€25 / day</td><td class="px-6 py-4 font-black text-[#1967d2] bg-blue-50/30">€45 - €55 / day</td></tr>
                </tbody>
            </table>
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

function renderFooter() {
    document.getElementById('block-footer').innerHTML = `
    <div class="mb-6">
        <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-600 hover:border-yellow-400 hover:text-yellow-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Buy me a coffee
        </a>
    </div>
    <p class="text-sm text-gray-400">© ${SITE_CONFIG.year} ${SITE_CONFIG.name}. Built for utility.</p>`;
}

// --- 4. MAP DRAWING LOGIC (The "Hybrid" Part) ---
function initRouteMaps() {
    const mapOptions = { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, attributionControl: false, zoomSnap: 0.1 };
    const redLineStyle = { color: '#dc2626', weight: 4, opacity: 0.8, smoothFactor: 1 };

    ROUTES_DATA.forEach(route => {
        const mapId = `map-${route.id}`;
        if(document.getElementById(mapId)) {
            const map = L.map(mapId, mapOptions);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png').addTo(map);
            const line = L.polyline(route.mapCoords, redLineStyle).addTo(map);
            map.fitBounds(line.getBounds(), {padding: [20, 20]});
        }
    });
}
