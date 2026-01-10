/**
 * CAMINO MASTER DATA (Global)
 * Source of Truth for all widgets (Daily Check, Landing Page, etc.)
 * Last Updated: Jan 2026 (Restored Custom Copy)
 */

const CAMINO_DB = {
    // =========================================================================
    // 0. GLOBAL SITE CONFIG (The "Marketing" Layer)
    // =========================================================================
    config: {
        site_name: "No BS Camino",
        year: "2026",
        hero: {
            title: "Easy Camino Planning",
            subtitle: "All the 2026 information you need. No noise. No spam"
        },
        featured_route_id: "frances" 
    },

    // -------------------------------------------------------------------------
    // 0.1 ROUTE METADATA (Cards, Tags, Visuals)
    // -------------------------------------------------------------------------
    routes_meta: {
        "frances": {
            name: "French Way (Francés)",
            link: "routes/route-frances.html",
            tag: "The Classic",
            tag_bg: "bg-white/90", // Default
            dist_label: "790km",
            desc: "St. Jean → Santiago",
            stats: [
                { icon: "mountain", text: "Varied Terrain", color: "orange" },
                { icon: "user", text: "High Traffic", color: "orange" },
                { icon: "plane", text: "Fly: Biarritz", color: "blue" },
                { icon: "sun", text: "May - Oct", color: "blue" }
            ]
        },
        "portugues": {
            name: "Portuguese Central",
            link: "routes/route-portugues.html",
            tag: "#2 Most Traveled",
            dist_label: "620km",
            desc: "Lisbon → Santiago",
            stats: [
                { icon: "flat", text: "Flat / Easy", color: "green" },
                { icon: "user", text: "Med Traffic", color: "green" },
                { icon: "plane", text: "Fly: Lisbon", color: "blue" },
                { icon: "sun", text: "All Year", color: "blue" }
            ]
        },
        "coastal": {
            name: "Portuguese Coastal",
            link: "routes/route-coastal.html",
            tag: "Scenic & Beachfront",
            dist_label: "280km",
            desc: "Porto → Santiago",
            stats: [
                { icon: "flat", text: "Boardwalks", color: "green" },
                { icon: "user", text: "Med Traffic", color: "orange" },
                { icon: "plane", text: "Fly: Porto", color: "blue" },
                { icon: "sun", text: "Apr - Oct", color: "blue" }
            ]
        },
        "primitivo": {
            name: "Primitivo",
            link: "routes/route-primitivo.html",
            tag: "The Oldest Camino Route",
            dist_label: "320km",
            desc: "Oviedo → Santiago",
            stats: [
                { icon: "mountain", text: "Mountains", color: "red" },
                { icon: "chart", text: "Hardest", color: "red" },
                { icon: "plane", text: "Fly: Asturias", color: "blue" },
                { icon: "sun", text: "May - Sep", color: "blue" }
            ]
        },
        "norte": {
            name: "Norte",
            link: "routes/route-norte.html",
            tag: "Stunning Rugged Landscapes",
            dist_label: "820km",
            desc: "Irún → Santiago",
            stats: [
                { icon: "mountain", text: "Very Hilly", color: "red" },
                { icon: "user", text: "Low Traffic", color: "green" },
                { icon: "plane", text: "Fly: San Seb.", color: "blue" },
                { icon: "sun", text: "Summer Only", color: "blue" }
            ]
        },
        "plata": {
            name: "Via de la Plata",
            link: "routes/route-plata.html",
            tag: "Roman Roads & a Real Taste of Spain",
            dist_label: "1000km",
            desc: "Seville → Santiago",
            stats: [
                { icon: "sun", text: "Very Hot", color: "orange" },
                { icon: "eye", text: "Solitary", color: "green" },
                { icon: "plane", text: "Fly: Seville", color: "blue" },
                { icon: "sun", text: "Spring/Autumn", color: "blue" }
            ]
        },
        "invierno": {
            name: "Invierno",
            link: "routes/route-invierno.html",
            tag: "The Secret Winter Way",
            dist_label: "260km",
            desc: "Ponferrada → Santiago",
            stats: [
                { icon: "eye", text: "Secret Path", color: "green" },
                { icon: "cloud", text: "All Year", color: "blue" },
                { icon: "plane", text: "Fly: León", color: "blue" },
                { icon: "check", text: "No Crowds", color: "green" }
            ]
        }
    },

    // -------------------------------------------------------------------------
    // 0.2 FAQ DATA (Restored Source & Links)
    // -------------------------------------------------------------------------
    faqs: [
        { 
            cat: "GEAR", tag: "MYTH", 
            title: '"Trail Runners vs. Boots"', 
            text: "90% of veterans recommend non-waterproof trail runners. Boots trap heat = blisters.",
            source: "r/CaminoDeSantiago",
            url: "myths.html#gear-boots"
        },
        { 
            cat: "RULES", tag: "2025 UPDATE", 
            title: '"2025 Stamp Rules"', 
            text: "You <strong>must</strong> get 2 stamps per day (start & end) for the last 100km, or no Compostela.",
            source: "Pilgrim Office",
            url: "myths.html#rules-stamps"
        },
        { 
            cat: "LOGISTICS", tag: "", 
            title: '"Book IN ADVAAAANCEEEE"', 
            text: "Nonsense. Book 1 day ahead via WhatsApp. Use Gronze.com for numbers.",
            source: "Veteran Walkers",
            url: "myths.html#logistics-booking"
        },
        { 
            cat: "MONEY", tag: "", 
            title: '"Costs & Cash vs Card"', 
            text: "Budget €50/day. The €25/day 'budget camino' is dead due to inflation.",
            source: "Experience",
            url: "myths.html#money-cash"
        },
        { 
            cat: "WEIGHT", tag: "MYTH", 
            title: '"Pack for every emergency."', 
            text: "Pack 10% of your body weight (5-7kg). Light is right.",
            source: "Ivar",
            url: "myths.html#weight-10percent"
        },
        { 
            cat: "SLEEP", tag: "FEAR", 
            title: '"Albergues are dirty."', 
            text: "Bed bugs happen everywhere. Use <strong>Permethrin</strong> spray before leaving home.",
            source: "Science",
            url: "myths.html#sleep-bedbugs"
        },
        { 
            cat: "SAFETY", tag: "", 
            title: '"It\'s dangerous solo."', 
            text: "Statistically safer than your hometown. You will meet a 'Tramily' quickly.",
            source: "Crime Stats",
            url: "myths.html#safety-solo"
        },
        { 
            cat: "FITNESS", tag: "", 
            title: '"I need to run marathons."', 
            text: "The first week <em>is</em> the training. Start slow. Most paths are flat.",
            source: "Physiology",
            url: "myths.html#fitness-training"
        },
        { 
            cat: "TECH", tag: "", 
            title: '"I\'ll use Google Maps."', 
            text: "Google sends you to highways. Use <strong>Mapy.cz</strong> or Organic Maps.",
            source: "Navigation",
            url: "myths.html#tech-maps"
        },
        { 
            cat: "THE VIBE", tag: "TOXIC MYTH", 
            title: '"The last 100km isn\'t real."', 
            text: "Ignore the gatekeepers. Walking 100km is still a huge achievement.",
            source: "The Spirit",
            url: "myths.html#vibe-gatekeeping"
        }
    ],

    // -------------------------------------------------------------------------
    // 0.3 COST DATA
    // -------------------------------------------------------------------------
    costs: {
        rows: [
            { item: "Bed (Albergue)", myth: "€5 - €8", reality: "€12 - €18" },
            { item: "Menu del Dia", myth: "€10", reality: "€14 - €18" },
            { item: "1 Coffee /1 Beer", myth: "€1.00", reality: "€1.80 - €3.00" }
        ],
        total: { label: "Total Daily", myth: "€25 / day", reality: "€45 - €55 / day" },
        disclaimer: "Most 'Budget Guide' blogs haven't walked since 2018. They keep prices low to sell you ads. Post-2022 inflation hit rural Spain hard."
    },

    // -------------------------------------------------------------------------
    // 1. HOLIDAY LOGIC (2026 EDITION)
    // -------------------------------------------------------------------------
    holidays: {
        national: [
            "2026-01-01", "2026-01-06", "2026-04-03", "2026-05-01",
            "2026-08-15", "2026-10-12", "2026-11-01", "2026-12-06",
            "2026-12-08", "2026-12-25"
        ],
        portugal: [
            "2026-01-01", "2026-04-03", "2026-04-25", "2026-05-01",
            "2026-06-10", "2026-08-15", "2026-10-05", "2026-11-01",
            "2026-12-01", "2026-12-08", "2026-12-25"
        ],
        regional: {
            "Navarra": ["2026-04-02", "2026-04-06", "2026-11-02", "2026-12-03"],
            "La Rioja": ["2026-04-02", "2026-04-06", "2026-06-09"],
            "Castilla y León": ["2026-04-02", "2026-04-23", "2026-11-02", "2026-12-07"],
            "Galicia": ["2026-04-02", "2026-05-17", "2026-07-25"],
            "Portugal": ["2026-06-13", "2026-06-24"]
        }
    },

    // -------------------------------------------------------------------------
    // 2. EXISTING DATA STRUCTURES (Seasonality, Routes, Start Locations)
    // -------------------------------------------------------------------------
    // ... (These remain exactly as they were in your previous file. 
    //      I am not repeating the 3000 lines of coordinates here for brevity, 
    //      but ensure you keep the 'seasonality', 'routes', and 'start_locations' objects below.)
    
    // START PASTE OF EXISTING DATA (Seasonality, Routes, Start Locations)
    seasonality: {
        "frances": { 0: { status: "Open (Modified)", vibe: "Solitary", risk: "Snow on Pyrenees" }, 1: { status: "Open (Modified)", vibe: "Solitary", risk: "Mud/Ice" }, 2: { status: "Open", vibe: "Awakening", risk: "Semana Santa (Crowds)" }, 3: { status: "Open", vibe: "Social", risk: "Easter Crowds" }, 4: { status: "Ideal", vibe: "Bustling", risk: "School Groups start" }, 5: { status: "Open", vibe: "Social", risk: "Heatwaves possible" }, 6: { status: "Busy", vibe: "Crowded Party", risk: "San Fermín (Pamplona blocked)" }, 7: { status: "Busy", vibe: "Crowded Party", risk: "Feast of Assumption" }, 8: { status: "Ideal", vibe: "Social", risk: "Wine Harvest (Rioja)" }, 9: { status: "Ideal", vibe: "Mellow", risk: "Rain returns late Oct" }, 10: { status: "Open", vibe: "Quiet", risk: "Rain/Mud" }, 11: { status: "Open (Modified)", vibe: "Solitary", risk: "Christmas closures" } },
        "norte": { 0: { status: "Closed", vibe: "Ghost Town", risk: "Flooding/Mud" }, 1: { status: "Closed", vibe: "Ghost Town", risk: "Flooding/Mud" }, 2: { status: "Risk", vibe: "Solitary", risk: "Semana Santa" }, 3: { status: "Open", vibe: "Fresh", risk: "Easter" }, 4: { status: "Ideal", vibe: "Social", risk: "None" }, 5: { status: "Open", vibe: "Social", risk: "Local fiestas" }, 6: { status: "Busy", vibe: "Tourist Heavy", risk: "Beach crowds/High Prices" }, 7: { status: "Busy", vibe: "Tourist Heavy", risk: "Semana Grande" }, 8: { status: "Ideal", vibe: "Social", risk: "None" }, 9: { status: "Ideal", vibe: "Mellow", risk: "Late Oct storms" }, 10: { status: "Risk", vibe: "Solitary", risk: "Wet/Slippery rocks" }, 11: { status: "Closed", vibe: "Ghost Town", risk: "Closures" } },
        "plata": { 0: { status: "Risk", vibe: "Solitary", risk: "Frost/Cold" }, 1: { status: "Risk", vibe: "Solitary", risk: "Cold mornings" }, 2: { status: "Open", vibe: "Awakening", risk: "Semana Santa (Sevilla FULL)" }, 3: { status: "Ideal", vibe: "Social", risk: "Feria de Abril" }, 4: { status: "Ideal", vibe: "Warm", risk: "Heat starting" }, 5: { status: "Risk", vibe: "Endurance", risk: "Heatwaves 35C+" }, 6: { status: "Danger", vibe: "Dangerous", risk: "Extreme Heat 40C+" }, 7: { status: "Danger", vibe: "Dangerous", risk: "Extreme Heat 40C+" }, 8: { status: "Risk", vibe: "Endurance", risk: "Late summer heat" }, 9: { status: "Ideal", vibe: "Mellow", risk: "None" }, 10: { status: "Open", vibe: "Solitary", risk: "Rain returns" }, 11: { status: "Risk", vibe: "Solitary", risk: "Frost" } },
        "primitivo": { 0: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" }, 1: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" }, 2: { status: "Risk", vibe: "Remote", risk: "Mud/Cold" }, 3: { status: "Open", vibe: "Remote", risk: "Easter" }, 4: { status: "Ideal", vibe: "Community", risk: "None" }, 5: { status: "Open", vibe: "Community", risk: "None" }, 6: { status: "Open", vibe: "Social", risk: "Heat on climbs" }, 7: { status: "Open", vibe: "Social", risk: "San Roque (Tineo)" }, 8: { status: "Ideal", vibe: "Community", risk: "None" }, 9: { status: "Risk", vibe: "Solitary", risk: "Fog in mountains" }, 10: { status: "Closed", vibe: "Dangerous", risk: "Snow/Mud" }, 11: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" } },
        "lusitana": { 0: { status: "Risk", vibe: "Quiet", risk: "Rain" }, 1: { status: "Risk", vibe: "Quiet", risk: "Rain" }, 2: { status: "Open", vibe: "Social", risk: "Semana Santa" }, 3: { status: "Open", vibe: "Bustling", risk: "Easter" }, 4: { status: "Ideal", vibe: "Bustling", risk: "Fatima Anniversary" }, 5: { status: "Open", vibe: "Social", risk: "São João (Porto)" }, 6: { status: "Open", vibe: "Crowded", risk: "Summer Crowds" }, 7: { status: "Open", vibe: "Crowded", risk: "Summer Crowds" }, 8: { status: "Ideal", vibe: "Social", risk: "Harvest" }, 9: { status: "Ideal", vibe: "Mellow", risk: "Rain increases" }, 10: { status: "Open", vibe: "Quiet", risk: "Rain" }, 11: { status: "Risk", vibe: "Quiet", risk: "Rain" } },
        "coastal": { 0: { status: "Risk", vibe: "Breezy", risk: "High Surf/Wind" }, 1: { status: "Risk", vibe: "Breezy", risk: "High Surf" }, 2: { status: "Open", vibe: "Active", risk: "Semana Santa" }, 3: { status: "Open", vibe: "Active", risk: "Easter" }, 4: { status: "Ideal", vibe: "Social", risk: "None" }, 5: { status: "Open", vibe: "Bustling", risk: "São João" }, 6: { status: "Open", vibe: "Crowded", risk: "Beach High Season" }, 7: { status: "Open", vibe: "Crowded", risk: "Beach High Season" }, 8: { status: "Ideal", vibe: "Social", risk: "None" }, 9: { status: "Ideal", vibe: "Mellow", risk: "Rain" }, 10: { status: "Open", vibe: "Quiet", risk: "Wind/Rain" }, 11: { status: "Risk", vibe: "Quiet", risk: "Storms" } },
        "invierno": { 0: { status: "Risk", vibe: "Introspective", risk: "Fog" }, 1: { status: "Risk", vibe: "Introspective", risk: "Fog" }, 2: { status: "Open", vibe: "Quiet", risk: "Rain" }, 3: { status: "Ideal", vibe: "Quiet", risk: "Easter" }, 4: { status: "Ideal", vibe: "Peaceful", risk: "None" }, 5: { status: "Open", vibe: "Peaceful", risk: "None" }, 6: { status: "Open", vibe: "Warm", risk: "Heat" }, 7: { status: "Open", vibe: "Warm", risk: "Heat" }, 8: { status: "Ideal", vibe: "Peaceful", risk: "Harvest" }, 9: { status: "Ideal", vibe: "Mellow", risk: "Rain" }, 10: { status: "Risk", vibe: "Introspective", risk: "Rain/Fog" }, 11: { status: "Risk", vibe: "Introspective", risk: "Rain" } }
    },
    // (Ensure the big 'routes' and 'start_locations' arrays are here too)
    // ... PASTE YOUR EXISTING 'routes' AND 'start_locations' HERE ...
    routes: CAMINO_DB ? CAMINO_DB.routes : {}, // Placeholder: You must keep your existing coordinate data here
    start_locations: CAMINO_DB ? CAMINO_DB.start_locations : {} // Placeholder: Keep your existing start locations
};

// --- RESTORED GLOBAL FUNCTIONS (Logic) ---
const REGIONS = { NAVARRA: "Navarra", RIOJA: "La Rioja", CYL: "Castilla y León", GALICIA: "Galicia", PORTUGAL: "Portugal" };

function getStageRegion(route, stageId) {
    if (route === "lusitana" || route === "coastal") {
        if (route === "lusitana" && stageId > 20) return REGIONS.GALICIA;
        if (route === "coastal" && stageId > 5) return REGIONS.GALICIA;
        return REGIONS.PORTUGAL;
    }
    if (route === "frances") {
        if (stageId <= 6) return REGIONS.NAVARRA;
        if (stageId <= 9) return REGIONS.RIOJA;
        if (stageId <= 24) return REGIONS.CYL;
        return REGIONS.GALICIA;
    }
    return null;
}

function isCaminoHoliday(dateString, route, stageId) {
    const region = getStageRegion(route, stageId);
    if (!CAMINO_DB.holidays) return false;
    
    const country = (region === REGIONS.PORTUGAL) ? "portugal" : "national"; // Fixed key reference
    if (CAMINO_DB.holidays[country] && CAMINO_DB.holidays[country].includes(dateString)) return true;

    if (region && CAMINO_DB.holidays.regional[region]) {
        if (CAMINO_DB.holidays.regional[region].includes(dateString)) return true;
    }
    return false;
}
