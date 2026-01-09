/* ==========================================
   HOLIDAY LOGIC (2026 EDITION)
   Updated: Jan 2026
   ========================================== */

const REGIONS = {
    // Spain
    NAVARRA: "Navarra",
    RIOJA: "La Rioja",
    CYL: "Castilla y León",
    GALICIA: "Galicia",
    // Portugal (Treated as one region for simplicity)
    PORTUGAL: "Portugal"
};

// 1. NATIONAL HOLIDAYS 2026 (Spain & Portugal)
// Dates where almost everything is closed in the respective country
const holidays2026 = {
    SPAIN: [
        "2026-01-01", // New Year
        "2026-01-06", // Epiphany (Reyes)
        "2026-04-03", // Good Friday (Viernes Santo)
        "2026-05-01", // Labor Day
        "2026-08-15", // Assumption of Mary
        "2026-10-12", // Hispanic Day
        "2026-11-01", // All Saints (Sunday - see regional for Monday shifts)
        "2026-12-06", // Constitution Day (Sunday - see regional for Monday shifts)
        "2026-12-08", // Immaculate Conception
        "2026-12-25"  // Christmas
    ],
    PORTUGAL: [
        "2026-01-01", // New Year
        "2026-04-03", // Good Friday
        "2026-04-25", // Freedom Day (Liberty Day)
        "2026-05-01", // Labor Day
        "2026-06-10", // Portugal Day
        "2026-08-15", // Assumption
        "2026-10-05", // Republic Day
        "2026-11-01", // All Saints
        "2026-12-01", // Restoration of Independence
        "2026-12-08", // Immaculate Conception
        "2026-12-25"  // Christmas
    ]
};

// 2. REGIONAL SPECIFICS 2026 (The "Tricky" Dates)
const regionalHolidays2026 = {
    [REGIONS.NAVARRA]: [
        "2026-04-02", // Maundy Thursday
        "2026-04-06", // Easter Monday
        "2026-11-02", // Mon after All Saints
        "2026-12-03"  // San Francisco Javier (Region Day)
    ],
    [REGIONS.RIOJA]: [
        "2026-04-02", // Maundy Thursday
        "2026-04-06", // Easter Monday
        "2026-06-09"  // Day of La Rioja
    ],
    [REGIONS.CYL]: [ // Castilla y León
        "2026-04-02", // Maundy Thursday
        "2026-04-23", // Villalar (Region Day)
        "2026-11-02", // Mon after All Saints (Observed)
        "2026-12-07"  // Mon after Constitution Day (Observed)
    ],
    [REGIONS.GALICIA]: [
        "2026-04-02", // Maundy Thursday
        "2026-05-17", // Galician Literature Day
        "2026-07-25"  // Santiago Day (National Day of Galicia)
    ],
    [REGIONS.PORTUGAL]: [
        "2026-06-13", // St Anthony (Lisbon only - technically local but major)
        "2026-06-24"  // St John (Porto only - technically local but major)
    ]
};

// 3. STAGE LOOKUP
// Helper to map a Route + Stage ID to a Region
function getStageRegion(route, stageId) {
    // Portuguese Routes
    if (route === "lusitana" || route === "coastal") {
        // Simple logic: If it's a Portuguese route, assume Portugal
        // (Note: Coastal & Lusitana eventually cross into Galicia. 
        // You can refine this if you need 100% precision on the border crossing)
        if (route === "lusitana" && stageId > 20) return REGIONS.GALICIA; // Crossing Tui
        if (route === "coastal" && stageId > 5) return REGIONS.GALICIA; // Crossing Caminha (ferry)
        return REGIONS.PORTUGAL;
    }

    // Camino Francés
    if (route === "frances") {
        if (stageId <= 6) return REGIONS.NAVARRA;
        if (stageId <= 9) return REGIONS.RIOJA;
        if (stageId <= 24) return REGIONS.CYL;
        return REGIONS.GALICIA;
    }

    // Default Fallback
    return null;
}

/**
 * MASTER CHECKER
 * Call this in your daily generator loop
 */
function isCaminoHoliday(dateString, route, stageId) {
    const region = getStageRegion(route, stageId);
    
    // 1. Check Country-Wide Holidays
    const country = (region === REGIONS.PORTUGAL) ? "PORTUGAL" : "SPAIN";
    if (holidays2026[country].includes(dateString)) return true;

    // 2. Check Regional Specifics
    if (region && regionalHolidays2026[region]) {
        if (regionalHolidays2026[region].includes(dateString)) return true;
    }

    return false;
}

const CAMINO_DB = {
    // -------------------------------------------------------------------------
    // 1. SEASONALITY MATRIX (Vibe & Risk by Month)
    // -------------------------------------------------------------------------
    seasonality: {
        "frances": {
            0: { status: "Open (Modified)", vibe: "Solitary", risk: "Snow on Pyrenees" }, // Jan
            1: { status: "Open (Modified)", vibe: "Solitary", risk: "Mud/Ice" },
            2: { status: "Open", vibe: "Awakening", risk: "Semana Santa (Crowds)" },
            3: { status: "Open", vibe: "Social", risk: "Easter Crowds" },
            4: { status: "Ideal", vibe: "Bustling", risk: "School Groups start" },
            5: { status: "Open", vibe: "Social", risk: "Heatwaves possible" },
            6: { status: "Busy", vibe: "Crowded Party", risk: "San Fermín (Pamplona blocked)" },
            7: { status: "Busy", vibe: "Crowded Party", risk: "Feast of Assumption" },
            8: { status: "Ideal", vibe: "Social", risk: "Wine Harvest (Rioja)" },
            9: { status: "Ideal", vibe: "Mellow", risk: "Rain returns late Oct" },
            10: { status: "Open", vibe: "Quiet", risk: "Rain/Mud" },
            11: { status: "Open (Modified)", vibe: "Solitary", risk: "Christmas closures" }
        },
        "norte": {
            0: { status: "Closed", vibe: "Ghost Town", risk: "Flooding/Mud" },
            1: { status: "Closed", vibe: "Ghost Town", risk: "Flooding/Mud" },
            2: { status: "Risk", vibe: "Solitary", risk: "Semana Santa" },
            3: { status: "Open", vibe: "Fresh", risk: "Easter" },
            4: { status: "Ideal", vibe: "Social", risk: "None" },
            5: { status: "Open", vibe: "Social", risk: "Local fiestas" },
            6: { status: "Busy", vibe: "Tourist Heavy", risk: "Beach crowds/High Prices" },
            7: { status: "Busy", vibe: "Tourist Heavy", risk: "Semana Grande" },
            8: { status: "Ideal", vibe: "Social", risk: "None" },
            9: { status: "Ideal", vibe: "Mellow", risk: "Late Oct storms" },
            10: { status: "Risk", vibe: "Solitary", risk: "Wet/Slippery rocks" },
            11: { status: "Closed", vibe: "Ghost Town", risk: "Closures" }
        },
        "plata": {
            0: { status: "Risk", vibe: "Solitary", risk: "Frost/Cold" },
            1: { status: "Risk", vibe: "Solitary", risk: "Cold mornings" },
            2: { status: "Open", vibe: "Awakening", risk: "Semana Santa (Sevilla FULL)" },
            3: { status: "Ideal", vibe: "Social", risk: "Feria de Abril" },
            4: { status: "Ideal", vibe: "Warm", risk: "Heat starting" },
            5: { status: "Risk", vibe: "Endurance", risk: "Heatwaves 35C+" },
            6: { status: "Danger", vibe: "Dangerous", risk: "Extreme Heat 40C+" },
            7: { status: "Danger", vibe: "Dangerous", risk: "Extreme Heat 40C+" },
            8: { status: "Risk", vibe: "Endurance", risk: "Late summer heat" },
            9: { status: "Ideal", vibe: "Mellow", risk: "None" },
            10: { status: "Open", vibe: "Solitary", risk: "Rain returns" },
            11: { status: "Risk", vibe: "Solitary", risk: "Frost" }
        },
        "primitivo": {
            0: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" },
            1: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" },
            2: { status: "Risk", vibe: "Remote", risk: "Mud/Cold" },
            3: { status: "Open", vibe: "Remote", risk: "Easter" },
            4: { status: "Ideal", vibe: "Community", risk: "None" },
            5: { status: "Open", vibe: "Community", risk: "None" },
            6: { status: "Open", vibe: "Social", risk: "Heat on climbs" },
            7: { status: "Open", vibe: "Social", risk: "San Roque (Tineo)" },
            8: { status: "Ideal", vibe: "Community", risk: "None" },
            9: { status: "Risk", vibe: "Solitary", risk: "Fog in mountains" },
            10: { status: "Closed", vibe: "Dangerous", risk: "Snow/Mud" },
            11: { status: "Closed", vibe: "Dangerous", risk: "Snow Blockage" }
        },
        "lusitana": {
            0: { status: "Risk", vibe: "Quiet", risk: "Rain" },
            1: { status: "Risk", vibe: "Quiet", risk: "Rain" },
            2: { status: "Open", vibe: "Social", risk: "Semana Santa" },
            3: { status: "Open", vibe: "Bustling", risk: "Easter" },
            4: { status: "Ideal", vibe: "Bustling", risk: "Fatima Anniversary" },
            5: { status: "Open", vibe: "Social", risk: "São João (Porto)" },
            6: { status: "Open", vibe: "Crowded", risk: "Summer Crowds" },
            7: { status: "Open", vibe: "Crowded", risk: "Summer Crowds" },
            8: { status: "Ideal", vibe: "Social", risk: "Harvest" },
            9: { status: "Ideal", vibe: "Mellow", risk: "Rain increases" },
            10: { status: "Open", vibe: "Quiet", risk: "Rain" },
            11: { status: "Risk", vibe: "Quiet", risk: "Rain" }
        },
        "coastal": {
            0: { status: "Risk", vibe: "Breezy", risk: "High Surf/Wind" },
            1: { status: "Risk", vibe: "Breezy", risk: "High Surf" },
            2: { status: "Open", vibe: "Active", risk: "Semana Santa" },
            3: { status: "Open", vibe: "Active", risk: "Easter" },
            4: { status: "Ideal", vibe: "Social", risk: "None" },
            5: { status: "Open", vibe: "Bustling", risk: "São João" },
            6: { status: "Open", vibe: "Crowded", risk: "Beach High Season" },
            7: { status: "Open", vibe: "Crowded", risk: "Beach High Season" },
            8: { status: "Ideal", vibe: "Social", risk: "None" },
            9: { status: "Ideal", vibe: "Mellow", risk: "Rain" },
            10: { status: "Open", vibe: "Quiet", risk: "Wind/Rain" },
            11: { status: "Risk", vibe: "Quiet", risk: "Storms" }
        },
        "invierno": {
            0: { status: "Risk", vibe: "Introspective", risk: "Fog" },
            1: { status: "Risk", vibe: "Introspective", risk: "Fog" },
            2: { status: "Open", vibe: "Quiet", risk: "Rain" },
            3: { status: "Ideal", vibe: "Quiet", risk: "Easter" },
            4: { status: "Ideal", vibe: "Peaceful", risk: "None" },
            5: { status: "Open", vibe: "Peaceful", risk: "None" },
            6: { status: "Open", vibe: "Warm", risk: "Heat" },
            7: { status: "Open", vibe: "Warm", risk: "Heat" },
            8: { status: "Ideal", vibe: "Peaceful", risk: "Harvest" },
            9: { status: "Ideal", vibe: "Mellow", risk: "Rain" },
            10: { status: "Risk", vibe: "Introspective", risk: "Rain/Fog" },
            11: { status: "Risk", vibe: "Introspective", risk: "Rain" }
        }
    },

    // -------------------------------------------------------------------------
    // 2. ROUTE STAGES (Data Wealth: Crux Coords, Water Gaps, Bailouts)
    // -------------------------------------------------------------------------
    routes: {
        "frances": [
            { id: 1, start: "St-Jean", end: "Roncesvalles", dist: 24.2, lat: 43.05, lon: -1.27, crux: {lat: 43.05, lon: -1.27}, water_gap: 12, bailout: "Low" },
            { id: 2, start: "Roncesvalles", end: "Zubiri", dist: 22, lat: 42.96, lon: -1.45, crux: {lat: 42.96, lon: -1.45}, water_gap: 5, bailout: "Med" },
            { id: 3, start: "Zubiri", end: "Pamplona", dist: 19.8, lat: 42.86, lon: -1.58, crux: {lat: 42.86, lon: -1.58}, water_gap: 5, bailout: "Med" },
            { id: 4, start: "Pamplona", end: "Puente la Reina", dist: 24.3, lat: 42.74, lon: -1.74, crux: {lat: 42.74, lon: -1.74}, water_gap: 8, bailout: "High" },
            { id: 5, start: "Puente la Reina", end: "Estella", dist: 23.3, lat: 42.67, lon: -1.92, crux: {lat: 42.67, lon: -1.92}, water_gap: 5, bailout: "Med" },
            { id: 6, start: "Estella", end: "Torres del Río", dist: 29, lat: 42.58, lon: -2.18, crux: {lat: 42.58, lon: -2.18}, water_gap: 5, bailout: "Med" },
            { id: 7, start: "Torres del Río", end: "Logroño", dist: 21.1, lat: 42.49, lon: -2.35, crux: {lat: 42.49, lon: -2.35}, water_gap: 5, bailout: "Med" },
            { id: 8, start: "Logroño", end: "Nájera", dist: 30.1, lat: 42.43, lon: -2.62, crux: {lat: 42.43, lon: -2.62}, water_gap: 5, bailout: "Med" },
            { id: 9, start: "Nájera", end: "Grañón", dist: 28.8, lat: 42.40, lon: -2.91, crux: {lat: 42.40, lon: -2.91}, water_gap: 5, bailout: "Med" },
            { id: 10, start: "Grañón", end: "Belorado", dist: 17, lat: 42.41, lon: -3.10, crux: {lat: 42.41, lon: -3.10}, water_gap: 5, bailout: "Med" },
            { id: 11, start: "Belorado", end: "San Juan de Ortega", dist: 24.8, lat: 42.39, lon: -3.34, crux: {lat: 42.39, lon: -3.34}, water_gap: 5, bailout: "Med" },
            { id: 12, start: "San Juan de Ortega", end: "Burgos", dist: 30.4, lat: 42.36, lon: -3.58, crux: {lat: 42.36, lon: -3.58}, water_gap: 10, bailout: "Med" },
            { id: 13, start: "Burgos", end: "Hontanas", dist: 29.8, lat: 42.33, lon: -3.92, crux: {lat: 42.33, lon: -3.92}, water_gap: 10, bailout: "Med" },
            { id: 14, start: "Hontanas", end: "Ermita San Nicolás", dist: 18.7, lat: 42.31, lon: -4.13, crux: {lat: 42.31, lon: -4.13}, water_gap: 10, bailout: "Med" },
            { id: 15, start: "Ermita San Nicolás", end: "Villalcázar", dist: 29.9, lat: 42.31, lon: -4.43, crux: {lat: 42.31, lon: -4.43}, water_gap: 10, bailout: "Med" },
            { id: 16, start: "Villalcázar", end: "Calzadilla Cueza", dist: 23.3, lat: 42.35, lon: -4.71, crux: {lat: 42.35, lon: -4.71}, water_gap: 17, bailout: "Low" },
            { id: 17, start: "Calzadilla Cueza", end: "Sahagún", dist: 24.8, lat: 42.37, lon: -4.95, crux: {lat: 42.37, lon: -4.95}, water_gap: 10, bailout: "Med" },
            { id: 18, start: "Sahagún", end: "Reliegos", dist: 31.1, lat: 42.47, lon: -5.25, crux: {lat: 42.47, lon: -5.25}, water_gap: 10, bailout: "Med" },
            { id: 19, start: "Reliegos", end: "León", dist: 29.9, lat: 42.55, lon: -5.48, crux: {lat: 42.55, lon: -5.48}, water_gap: 10, bailout: "Med" },
            { id: 20, start: "León", end: "Hospital de Órbigo", dist: 32, lat: 42.53, lon: -5.84, crux: {lat: 42.53, lon: -5.84}, water_gap: 5, bailout: "Med" },
            { id: 21, start: "Hospital de Órbigo", end: "Sta. Catalina", dist: 26.5, lat: 42.48, lon: -6.11, crux: {lat: 42.48, lon: -6.11}, water_gap: 5, bailout: "Med" },
            { id: 22, start: "Sta. Catalina", end: "El Acebo", dist: 33.9, lat: 42.50, lon: -6.38, crux: {lat: 42.50, lon: -6.38}, water_gap: 5, bailout: "Med" },
            { id: 23, start: "El Acebo", end: "Ponferrada", dist: 18.1, lat: 42.53, lon: -6.55, crux: {lat: 42.53, lon: -6.55}, water_gap: 5, bailout: "Med" },
            { id: 24, start: "Ponferrada", end: "Villafranca", dist: 25.5, lat: 42.58, lon: -6.74, crux: {lat: 42.58, lon: -6.74}, water_gap: 5, bailout: "Med" },
            { id: 25, start: "Villafranca", end: "O Cebreiro", dist: 27.5, lat: 42.70, lon: -7.05, crux: {lat: 42.70, lon: -7.05}, water_gap: 8, bailout: "Low" },
            { id: 26, start: "O Cebreiro", end: "Triacastela", dist: 21.5, lat: 42.73, lon: -7.18, crux: {lat: 42.73, lon: -7.18}, water_gap: 5, bailout: "Med" },
            { id: 27, start: "Triacastela", end: "Barbadelo", dist: 23.7, lat: 42.77, lon: -7.38, crux: {lat: 42.77, lon: -7.38}, water_gap: 5, bailout: "Med" },
            { id: 28, start: "Barbadelo", end: "Gonzar", dist: 26.2, lat: 42.82, lon: -7.58, crux: {lat: 42.82, lon: -7.58}, water_gap: 5, bailout: "Med" },
            { id: 29, start: "Gonzar", end: "Melide", dist: 31.4, lat: 42.88, lon: -7.88, crux: {lat: 42.88, lon: -7.88}, water_gap: 5, bailout: "Med" },
            { id: 30, start: "Melide", end: "Santa Irene", dist: 30.7, lat: 42.92, lon: -8.22, crux: {lat: 42.92, lon: -8.22}, water_gap: 5, bailout: "Med" },
            { id: 31, start: "Santa Irene", end: "Santiago", dist: 25.3, lat: 42.90, lon: -8.45, crux: {lat: 42.90, lon: -8.45}, water_gap: 5, bailout: "Med" }
        ],
        "norte": [
            { id: 1, start: "Bayonne", end: "St-Jean-de-Luz", dist: 26, lat: 43.43, lon: -1.55, crux: {lat: 43.43, lon: -1.55}, water_gap: 5, bailout: "Med" },
            { id: 2, start: "St-Jean-de-Luz", end: "Irún", dist: 15.9, lat: 43.36, lon: -1.73, crux: {lat: 43.36, lon: -1.73}, water_gap: 5, bailout: "Med" },
            { id: 3, start: "Irún", end: "San Sebastián", dist: 24.5, lat: 43.32, lon: -1.90, crux: {lat: 43.32, lon: -1.90}, water_gap: 12, bailout: "Low" },
            { id: 4, start: "San Sebastián", end: "Zarautz", dist: 22.3, lat: 43.29, lon: -2.10, crux: {lat: 43.29, lon: -2.10}, water_gap: 5, bailout: "Med" },
            { id: 5, start: "Zarautz", end: "Deba", dist: 26, lat: 43.29, lon: -2.30, crux: {lat: 43.29, lon: -2.30}, water_gap: 5, bailout: "Med" },
            { id: 6, start: "Deba", end: "Markina", dist: 25, lat: 43.27, lon: -2.45, crux: {lat: 43.27, lon: -2.45}, water_gap: 5, bailout: "Med" },
            { id: 7, start: "Markina", end: "Gernika", dist: 26.5, lat: 43.28, lon: -2.60, crux: {lat: 43.28, lon: -2.60}, water_gap: 5, bailout: "Med" },
            { id: 8, start: "Gernika", end: "Lezama", dist: 20, lat: 43.28, lon: -2.75, crux: {lat: 43.28, lon: -2.75}, water_gap: 5, bailout: "Med" },
            { id: 9, start: "Lezama", end: "Bilbao", dist: 11.5, lat: 43.26, lon: -2.90, crux: {lat: 43.26, lon: -2.90}, water_gap: 5, bailout: "Med" },
            { id: 10, start: "Bilbao", end: "Portugalete", dist: 19, lat: 43.30, lon: -3.00, crux: {lat: 43.30, lon: -3.00}, water_gap: 5, bailout: "Med" },
            { id: 11, start: "Portugalete", end: "Castro-Urdiales", dist: 25.7, lat: 43.35, lon: -3.15, crux: {lat: 43.35, lon: -3.15}, water_gap: 5, bailout: "Med" },
            { id: 12, start: "Castro-Urdiales", end: "Liendo", dist: 20, lat: 43.38, lon: -3.30, crux: {lat: 43.38, lon: -3.30}, water_gap: 5, bailout: "Med" },
            { id: 13, start: "Liendo", end: "Santoña", dist: 12.5, lat: 43.43, lon: -3.45, crux: {lat: 43.43, lon: -3.45}, water_gap: 5, bailout: "Med" },
            { id: 14, start: "Santoña", end: "Güemes", dist: 20.6, lat: 43.45, lon: -3.55, crux: {lat: 43.45, lon: -3.55}, water_gap: 5, bailout: "Med" },
            { id: 15, start: "Güemes", end: "Santander", dist: 11, lat: 43.44, lon: -3.75, crux: {lat: 43.44, lon: -3.75}, water_gap: 5, bailout: "Med" },
            { id: 16, start: "Santander", end: "Mogro", dist: 24, lat: 43.43, lon: -3.90, crux: {lat: 43.43, lon: -3.90}, water_gap: 5, bailout: "Med" },
            { id: 17, start: "Mogro", end: "Santillana", dist: 21, lat: 43.40, lon: -4.05, crux: {lat: 43.40, lon: -4.05}, water_gap: 5, bailout: "Med" },
            { id: 18, start: "Santillana", end: "Comillas", dist: 22.7, lat: 43.39, lon: -4.20, crux: {lat: 43.39, lon: -4.20}, water_gap: 5, bailout: "Med" },
            { id: 19, start: "Comillas", end: "Serdio", dist: 18.5, lat: 43.37, lon: -4.40, crux: {lat: 43.37, lon: -4.40}, water_gap: 5, bailout: "Med" },
            { id: 20, start: "Serdio", end: "Llanes", dist: 33.7, lat: 43.40, lon: -4.60, crux: {lat: 43.40, lon: -4.60}, water_gap: 5, bailout: "Med" },
            { id: 21, start: "Llanes", end: "Nueva", dist: 18, lat: 43.42, lon: -4.85, crux: {lat: 43.42, lon: -4.85}, water_gap: 5, bailout: "Med" },
            { id: 22, start: "Nueva", end: "Ribadesella", dist: 13.5, lat: 43.45, lon: -5.00, crux: {lat: 43.45, lon: -5.00}, water_gap: 5, bailout: "Med" },
            { id: 23, start: "Ribadesella", end: "La Isla", dist: 18, lat: 43.48, lon: -5.15, crux: {lat: 43.48, lon: -5.15}, water_gap: 5, bailout: "Med" },
            { id: 24, start: "La Isla", end: "Villaviciosa", dist: 21.8, lat: 43.50, lon: -5.35, crux: {lat: 43.50, lon: -5.35}, water_gap: 5, bailout: "Med" },
            { id: 25, start: "Villaviciosa", end: "Gijón", dist: 30, lat: 43.52, lon: -5.55, crux: {lat: 43.52, lon: -5.55}, water_gap: 5, bailout: "Med" },
            { id: 26, start: "Gijón", end: "Avilés", dist: 25, lat: 43.55, lon: -5.80, crux: {lat: 43.55, lon: -5.80}, water_gap: 5, bailout: "Med" },
            { id: 27, start: "Avilés", end: "Muros de Nalón", dist: 23.5, lat: 43.55, lon: -6.05, crux: {lat: 43.55, lon: -6.05}, water_gap: 5, bailout: "Med" },
            { id: 28, start: "Muros", end: "Soto de Luiña", dist: 15.5, lat: 43.56, lon: -6.20, crux: {lat: 43.56, lon: -6.20}, water_gap: 5, bailout: "Med" },
            { id: 29, start: "Soto", end: "Cadavedo", dist: 18.4, lat: 43.55, lon: -6.35, crux: {lat: 43.55, lon: -6.35}, water_gap: 5, bailout: "Med" },
            { id: 30, start: "Cadavedo", end: "Luarca", dist: 16.6, lat: 43.54, lon: -6.50, crux: {lat: 43.54, lon: -6.50}, water_gap: 5, bailout: "Med" },
            { id: 31, start: "Luarca", end: "La Caridad", dist: 32, lat: 43.54, lon: -6.70, crux: {lat: 43.54, lon: -6.70}, water_gap: 5, bailout: "Med" },
            { id: 32, start: "La Caridad", end: "Ribadeo", dist: 22, lat: 43.54, lon: -6.95, crux: {lat: 43.54, lon: -6.95}, water_gap: 5, bailout: "Med" },
            { id: 33, start: "Ribadeo", end: "Lourenzá", dist: 27.8, lat: 43.45, lon: -7.20, crux: {lat: 43.45, lon: -7.20}, water_gap: 5, bailout: "Med" },
            { id: 34, start: "Lourenzá", end: "Abadín", dist: 27, lat: 43.35, lon: -7.40, crux: {lat: 43.35, lon: -7.40}, water_gap: 5, bailout: "Med" },
            { id: 35, start: "Abadín", end: "Vilalba", dist: 20, lat: 43.30, lon: -7.60, crux: {lat: 43.30, lon: -7.60}, water_gap: 5, bailout: "Med" },
            { id: 36, start: "Vilalba", end: "Baamonde", dist: 20.6, lat: 43.20, lon: -7.70, crux: {lat: 43.20, lon: -7.70}, water_gap: 5, bailout: "Med" },
            { id: 37, start: "Baamonde", end: "Sobrado", dist: 40.3, lat: 43.10, lon: -7.90, crux: {lat: 43.10, lon: -7.90}, water_gap: 15, bailout: "Low" },
            { id: 38, start: "Sobrado", end: "O Pedrouzo", dist: 37.7, lat: 42.95, lon: -8.30, crux: {lat: 42.95, lon: -8.30}, water_gap: 5, bailout: "Med" },
            { id: 39, start: "O Pedrouzo", end: "Santiago", dist: 20.1, lat: 42.90, lon: -8.50, crux: {lat: 42.90, lon: -8.50}, water_gap: 5, bailout: "Med" }
        ],
        "plata": [
            { id: 1, start: "Sevilla", end: "Guillena", dist: 22.6, lat: 37.47, lon: -6.02, crux: {lat: 37.47, lon: -6.02}, water_gap: 5, bailout: "Med" },
            { id: 2, start: "Guillena", end: "Castilblanco", dist: 18, lat: 37.60, lon: -6.01, crux: {lat: 37.60, lon: -6.01}, water_gap: 5, bailout: "Med" },
            { id: 3, start: "Castilblanco", end: "Almadén", dist: 29.5, lat: 37.78, lon: -6.00, crux: {lat: 37.78, lon: -6.00}, water_gap: 20, bailout: "Zero" },
            { id: 4, start: "Almadén", end: "El Real", dist: 15.4, lat: 37.90, lon: -6.10, crux: {lat: 37.90, lon: -6.10}, water_gap: 5, bailout: "Med" },
            { id: 5, start: "El Real", end: "Monesterio", dist: 19.8, lat: 38.02, lon: -6.20, crux: {lat: 38.02, lon: -6.20}, water_gap: 5, bailout: "Med" },
            { id: 6, start: "Monesterio", end: "F. de Cantos", dist: 21.6, lat: 38.16, lon: -6.25, crux: {lat: 38.16, lon: -6.25}, water_gap: 5, bailout: "Med" },
            { id: 7, start: "F. de Cantos", end: "Zafra", dist: 25.1, lat: 38.32, lon: -6.35, crux: {lat: 38.32, lon: -6.35}, water_gap: 5, bailout: "Med" },
            { id: 8, start: "Zafra", end: "Villafranca", dist: 18.9, lat: 38.48, lon: -6.38, crux: {lat: 38.48, lon: -6.38}, water_gap: 5, bailout: "Med" },
            { id: 9, start: "Villafranca", end: "Torremejía", dist: 27.4, lat: 38.68, lon: -6.38, crux: {lat: 38.68, lon: -6.38}, water_gap: 27, bailout: "High" },
            { id: 10, start: "Torremejía", end: "Mérida", dist: 15.6, lat: 38.85, lon: -6.35, crux: {lat: 38.85, lon: -6.35}, water_gap: 5, bailout: "Med" },
            { id: 11, start: "Mérida", end: "Aljucén", dist: 15.9, lat: 39.00, lon: -6.35, crux: {lat: 39.00, lon: -6.35}, water_gap: 5, bailout: "Med" },
            { id: 12, start: "Aljucén", end: "Alcuéscar", dist: 20.1, lat: 39.10, lon: -6.25, crux: {lat: 39.10, lon: -6.25}, water_gap: 5, bailout: "Med" },
            { id: 13, start: "Alcuéscar", end: "Valdesalor", dist: 25.7, lat: 39.25, lon: -6.25, crux: {lat: 39.25, lon: -6.25}, water_gap: 5, bailout: "Med" },
            { id: 14, start: "Valdesalor", end: "Casar", dist: 21.8, lat: 39.40, lon: -6.35, crux: {lat: 39.40, lon: -6.35}, water_gap: 5, bailout: "Med" },
            { id: 15, start: "Casar", end: "Cañaveral", dist: 33, lat: 39.65, lon: -6.40, crux: {lat: 39.65, lon: -6.40}, water_gap: 5, bailout: "Med" },
            { id: 16, start: "Cañaveral", end: "Galisteo", dist: 29.3, lat: 39.88, lon: -6.38, crux: {lat: 39.88, lon: -6.38}, water_gap: 5, bailout: "Med" },
            { id: 17, start: "Galisteo", end: "Carcaboso", dist: 11.5, lat: 40.00, lon: -6.30, crux: {lat: 40.00, lon: -6.30}, water_gap: 5, bailout: "Med" },
            { id: 18, start: "Carcaboso", end: "Cáparra", dist: 40, lat: 40.11, lon: -6.15, crux: {lat: 40.11, lon: -6.15}, water_gap: 30, bailout: "Zero" },
            { id: 19, start: "Cáparra", end: "Calzada", dist: 22.5, lat: 40.25, lon: -5.95, crux: {lat: 40.25, lon: -5.95}, water_gap: 5, bailout: "Med" },
            { id: 20, start: "Calzada", end: "Fuenterroble", dist: 20.3, lat: 40.45, lon: -5.85, crux: {lat: 40.45, lon: -5.85}, water_gap: 5, bailout: "Med" },
            { id: 21, start: "Fuenterroble", end: "San Pedro", dist: 29.9, lat: 40.65, lon: -5.75, crux: {lat: 40.65, lon: -5.75}, water_gap: 5, bailout: "Med" },
            { id: 22, start: "San Pedro", end: "Salamanca", dist: 23.1, lat: 40.85, lon: -5.70, crux: {lat: 40.85, lon: -5.70}, water_gap: 5, bailout: "Med" },
            { id: 23, start: "Salamanca", end: "Valdunciel", dist: 15, lat: 41.05, lon: -5.65, crux: {lat: 41.05, lon: -5.65}, water_gap: 5, bailout: "Med" },
            { id: 24, start: "Valdunciel", end: "El Cubo", dist: 20, lat: 41.15, lon: -5.68, crux: {lat: 41.15, lon: -5.68}, water_gap: 5, bailout: "Med" },
            { id: 25, start: "El Cubo", end: "Zamora", dist: 31.7, lat: 41.35, lon: -5.75, crux: {lat: 41.35, lon: -5.75}, water_gap: 5, bailout: "Med" },
            { id: 26, start: "Zamora", end: "Montamarta", dist: 18.3, lat: 41.58, lon: -5.80, crux: {lat: 41.58, lon: -5.80}, water_gap: 5, bailout: "Med" },
            { id: 27, start: "Montamarta", end: "Granja", dist: 22.5, lat: 41.75, lon: -5.78, crux: {lat: 41.75, lon: -5.78}, water_gap: 5, bailout: "Med" },
            { id: 28, start: "Granja", end: "Tábara", dist: 25.6, lat: 41.85, lon: -5.95, crux: {lat: 41.85, lon: -5.95}, water_gap: 5, bailout: "Med" },
            { id: 29, start: "Tábara", end: "Santa Marta", dist: 22.8, lat: 41.95, lon: -6.05, crux: {lat: 41.95, lon: -6.05}, water_gap: 5, bailout: "Med" },
            { id: 30, start: "Santa Marta", end: "Mombuey", dist: 35.2, lat: 42.05, lon: -6.20, crux: {lat: 42.05, lon: -6.20}, water_gap: 5, bailout: "Med" },
            { id: 31, start: "Mombuey", end: "Puebla", dist: 31.8, lat: 42.08, lon: -6.50, crux: {lat: 42.08, lon: -6.50}, water_gap: 5, bailout: "Med" },
            { id: 32, start: "Puebla", end: "Lubián", dist: 29.5, lat: 42.05, lon: -6.85, crux: {lat: 42.05, lon: -6.85}, water_gap: 5, bailout: "Med" },
            { id: 33, start: "Lubián", end: "A Gudiña", dist: 25.7, lat: 42.06, lon: -7.10, crux: {lat: 42.06, lon: -7.10}, water_gap: 5, bailout: "Med" },
            { id: 34, start: "A Gudiña", end: "Laza", dist: 35, lat: 42.05, lon: -7.40, crux: {lat: 42.05, lon: -7.40}, water_gap: 20, bailout: "Low" },
            { id: 35, start: "Laza", end: "Xunqueira", dist: 33, lat: 42.15, lon: -7.60, crux: {lat: 42.15, lon: -7.60}, water_gap: 5, bailout: "Med" },
            { id: 36, start: "Xunqueira", end: "Ourense", dist: 22.5, lat: 42.25, lon: -7.80, crux: {lat: 42.25, lon: -7.80}, water_gap: 5, bailout: "Med" },
            { id: 37, start: "Ourense", end: "Cea", dist: 22.5, lat: 42.38, lon: -7.98, crux: {lat: 42.38, lon: -7.98}, water_gap: 5, bailout: "Med" },
            { id: 38, start: "Cea", end: "Castro Dozón", dist: 19.5, lat: 42.50, lon: -8.02, crux: {lat: 42.50, lon: -8.02}, water_gap: 5, bailout: "Med" },
            { id: 39, start: "Castro", end: "Silleda", dist: 28, lat: 42.65, lon: -8.15, crux: {lat: 42.65, lon: -8.15}, water_gap: 5, bailout: "Med" },
            { id: 40, start: "Silleda", end: "Ponte Ulla", dist: 19.6, lat: 42.78, lon: -8.35, crux: {lat: 42.78, lon: -8.35}, water_gap: 5, bailout: "Med" },
            { id: 41, start: "Ponte Ulla", end: "Santiago", dist: 20.5, lat: 42.82, lon: -8.50, crux: {lat: 42.82, lon: -8.50}, water_gap: 5, bailout: "Med" }
        ],
        "lusitana": [
            { id: 1, start: "Lisboa", end: "Alverca", dist: 31, lat: 38.80, lon: -9.05, crux: {lat: 38.80, lon: -9.05}, water_gap: 5, bailout: "Med" },
            { id: 2, start: "Alverca", end: "Azambuja", dist: 32, lat: 39.00, lon: -8.90, crux: {lat: 39.00, lon: -8.90}, water_gap: 5, bailout: "Med" },
            { id: 3, start: "Azambuja", end: "Santarém", dist: 35, lat: 39.15, lon: -8.75, crux: {lat: 39.15, lon: -8.75}, water_gap: 5, bailout: "Med" },
            { id: 4, start: "Santarém", end: "Arneiro", dist: 27, lat: 39.30, lon: -8.70, crux: {lat: 39.30, lon: -8.70}, water_gap: 5, bailout: "Med" },
            { id: 5, start: "Arneiro", end: "Minde", dist: 20, lat: 39.45, lon: -8.65, crux: {lat: 39.45, lon: -8.65}, water_gap: 5, bailout: "Med" },
            { id: 6, start: "Minde", end: "Fátima", dist: 25, lat: 39.55, lon: -8.65, crux: {lat: 39.55, lon: -8.65}, water_gap: 5, bailout: "Med" },
            { id: 7, start: "Fátima", end: "Caxarias", dist: 26, lat: 39.70, lon: -8.60, crux: {lat: 39.70, lon: -8.60}, water_gap: 5, bailout: "Med" },
            { id: 8, start: "Caxarias", end: "Ansião", dist: 33, lat: 39.85, lon: -8.55, crux: {lat: 39.85, lon: -8.55}, water_gap: 5, bailout: "Med" },
            { id: 9, start: "Ansião", end: "Condeixa", dist: 32, lat: 40.00, lon: -8.50, crux: {lat: 40.00, lon: -8.50}, water_gap: 5, bailout: "Low" },
            { id: 10, start: "Condeixa", end: "Coimbra", dist: 16, lat: 40.15, lon: -8.45, crux: {lat: 40.15, lon: -8.45}, water_gap: 5, bailout: "Med" },
            { id: 11, start: "Coimbra", end: "Sernadelo", dist: 27, lat: 40.30, lon: -8.45, crux: {lat: 40.30, lon: -8.45}, water_gap: 5, bailout: "Med" },
            { id: 12, start: "Sernadelo", end: "Águeda", dist: 29, lat: 40.45, lon: -8.45, crux: {lat: 40.45, lon: -8.45}, water_gap: 5, bailout: "Med" },
            { id: 13, start: "Águeda", end: "Albergaria", dist: 18, lat: 40.65, lon: -8.48, crux: {lat: 40.65, lon: -8.48}, water_gap: 5, bailout: "Med" },
            { id: 14, start: "Albergaria", end: "S. João", dist: 34, lat: 40.80, lon: -8.50, crux: {lat: 40.80, lon: -8.50}, water_gap: 5, bailout: "Low" },
            { id: 15, start: "S. João", end: "Porto", dist: 44, lat: 41.00, lon: -8.60, crux: {lat: 41.00, lon: -8.60}, water_gap: 5, bailout: "Low" },
            { id: 16, start: "Porto", end: "Vilarinho", dist: 26, lat: 41.25, lon: -8.65, crux: {lat: 41.25, lon: -8.65}, water_gap: 5, bailout: "Med" },
            { id: 17, start: "Vilarinho", end: "Barcelos", dist: 30, lat: 41.45, lon: -8.62, crux: {lat: 41.45, lon: -8.62}, water_gap: 5, bailout: "Low" },
            { id: 18, start: "Barcelos", end: "Ponte Lima", dist: 34, lat: 41.65, lon: -8.58, crux: {lat: 41.65, lon: -8.58}, water_gap: 5, bailout: "Med" },
            { id: 19, start: "Ponte Lima", end: "Rubiães", dist: 19, lat: 41.90, lon: -8.60, crux: {lat: 41.90, lon: -8.60}, water_gap: 5, bailout: "Low" },
            { id: 20, start: "Rubiães", end: "Tui", dist: 20, lat: 42.00, lon: -8.64, crux: {lat: 42.00, lon: -8.64}, water_gap: 5, bailout: "Med" },
            { id: 21, start: "Tui", end: "O Porriño", dist: 18, lat: 42.10, lon: -8.62, crux: {lat: 42.10, lon: -8.62}, water_gap: 5, bailout: "Med" },
            { id: 22, start: "O Porriño", end: "Redondela", dist: 16, lat: 42.22, lon: -8.61, crux: {lat: 42.22, lon: -8.61}, water_gap: 5, bailout: "Med" },
            { id: 23, start: "Redondela", end: "Pontevedra", dist: 20, lat: 42.35, lon: -8.64, crux: {lat: 42.35, lon: -8.64}, water_gap: 5, bailout: "Low" },
            { id: 24, start: "Pontevedra", end: "Caldas", dist: 23, lat: 42.52, lon: -8.65, crux: {lat: 42.52, lon: -8.65}, water_gap: 5, bailout: "Med" },
            { id: 25, start: "Caldas", end: "Padrón", dist: 19, lat: 42.68, lon: -8.66, crux: {lat: 42.68, lon: -8.66}, water_gap: 5, bailout: "Med" },
            { id: 26, start: "Padrón", end: "Santiago", dist: 25, lat: 42.80, lon: -8.60, crux: {lat: 42.80, lon: -8.60}, water_gap: 5, bailout: "Med" }
        ],
        "coastal": [
            { id: 1, start: "Porto", end: "Labruge", dist: 24.5, lat: 41.22, lon: -8.70, crux: {lat: 41.22, lon: -8.70}, water_gap: 5, bailout: "High" },
            { id: 2, start: "Labruge", end: "Póvoa", dist: 16.2, lat: 41.35, lon: -8.75, crux: {lat: 41.35, lon: -8.75}, water_gap: 5, bailout: "High" },
            { id: 3, start: "Póvoa", end: "Esposende", dist: 20.2, lat: 41.48, lon: -8.78, crux: {lat: 41.48, lon: -8.78}, water_gap: 8, bailout: "High" },
            { id: 4, start: "Esposende", end: "Viana", dist: 25.5, lat: 41.65, lon: -8.82, crux: {lat: 41.65, lon: -8.82}, water_gap: 8, bailout: "High" },
            { id: 5, start: "Viana", end: "Caminha", dist: 26.8, lat: 41.80, lon: -8.85, crux: {lat: 41.80, lon: -8.85}, water_gap: 10, bailout: "High" },
            { id: 6, start: "Caminha", end: "Mougás", dist: 23.5, lat: 41.95, lon: -8.88, crux: {lat: 41.95, lon: -8.88}, water_gap: 10, bailout: "Low" },
            { id: 7, start: "Mougás", end: "Ramallosa", dist: 16.4, lat: 42.08, lon: -8.85, crux: {lat: 42.08, lon: -8.85}, water_gap: 5, bailout: "High" },
            { id: 8, start: "Ramallosa", end: "Vigo", dist: 20.1, lat: 42.20, lon: -8.75, crux: {lat: 42.20, lon: -8.75}, water_gap: 5, bailout: "High" },
            { id: 9, start: "Vigo", end: "Redondela", dist: 16.5, lat: 42.28, lon: -8.65, crux: {lat: 42.28, lon: -8.65}, water_gap: 5, bailout: "High" },
            { id: 10, start: "Redondela", end: "Pontevedra", dist: 20, lat: 42.35, lon: -8.64, crux: {lat: 42.35, lon: -8.64}, water_gap: 5, bailout: "Low" },
            { id: 11, start: "Pontevedra", end: "Caldas", dist: 23, lat: 42.52, lon: -8.65, crux: {lat: 42.52, lon: -8.65}, water_gap: 5, bailout: "Med" },
            { id: 12, start: "Caldas", end: "Padrón", dist: 19, lat: 42.68, lon: -8.66, crux: {lat: 42.68, lon: -8.66}, water_gap: 5, bailout: "High" },
            { id: 13, start: "Padrón", end: "Santiago", dist: 25, lat: 42.80, lon: -8.60, crux: {lat: 42.80, lon: -8.60}, water_gap: 5, bailout: "Med" }
        ],
        "primitivo": [
            { id: 1, start: "Oviedo", end: "Grado", dist: 25.8, lat: 43.38, lon: -5.95, crux: {lat: 43.38, lon: -5.95}, water_gap: 5, bailout: "High" },
            { id: 2, start: "Grado", end: "Salas", dist: 22.5, lat: 43.40, lon: -6.15, crux: {lat: 43.40, lon: -6.15}, water_gap: 8, bailout: "Med" },
            { id: 3, start: "Salas", end: "Tineo", dist: 20.2, lat: 43.35, lon: -6.30, crux: {lat: 43.35, lon: -6.30}, water_gap: 10, bailout: "Med" },
            { id: 4, start: "Tineo", end: "Pola de Allande", dist: 28.2, lat: 43.27, lon: -6.50, crux: {lat: 43.27, lon: -6.50}, water_gap: 12, bailout: "Low" },
            { id: 5, start: "Pola de Allande", end: "La Mesa", dist: 22.8, lat: 43.15, lon: -6.60, crux: {lat: 43.15, lon: -6.60}, water_gap: 15, bailout: "Zero" },
            { id: 6, start: "La Mesa", end: "Grandas", dist: 16.8, lat: 43.18, lon: -6.80, crux: {lat: 43.18, lon: -6.80}, water_gap: 10, bailout: "Low" },
            { id: 7, start: "Grandas", end: "A Fonsagrada", dist: 28.1, lat: 43.15, lon: -7.00, crux: {lat: 43.15, lon: -7.00}, water_gap: 12, bailout: "Low" },
            { id: 8, start: "A Fonsagrada", end: "O Cádavo", dist: 23.4, lat: 43.05, lon: -7.10, crux: {lat: 43.05, lon: -7.10}, water_gap: 15, bailout: "Low" },
            { id: 9, start: "O Cádavo", end: "Lugo", dist: 30.5, lat: 43.02, lon: -7.35, crux: {lat: 43.02, lon: -7.35}, water_gap: 8, bailout: "High" },
            { id: 10, start: "Lugo", end: "Ferreira", dist: 26.5, lat: 42.95, lon: -7.65, crux: {lat: 42.95, lon: -7.65}, water_gap: 10, bailout: "Med" },
            { id: 11, start: "Ferreira", end: "Melide", dist: 20.2, lat: 42.92, lon: -7.90, crux: {lat: 42.92, lon: -7.90}, water_gap: 5, bailout: "High" }
        ],
        "invierno": [
            { id: 1, start: "Ponferrada", end: "Las Médulas", dist: 27.2, lat: 42.48, lon: -6.75, crux: {lat: 42.48, lon: -6.75}, water_gap: 8, bailout: "Med" },
            { id: 2, start: "Las Médulas", end: "O Barco", dist: 26.4, lat: 42.42, lon: -6.90, crux: {lat: 42.42, lon: -6.90}, water_gap: 10, bailout: "High" },
            { id: 3, start: "O Barco", end: "A Rúa", dist: 14.2, lat: 42.38, lon: -7.05, crux: {lat: 42.38, lon: -7.05}, water_gap: 5, bailout: "High" },
            { id: 4, start: "A Rúa", end: "Quiroga", dist: 26.3, lat: 42.42, lon: -7.20, crux: {lat: 42.42, lon: -7.20}, water_gap: 12, bailout: "Med" },
            { id: 5, start: "Quiroga", end: "Monforte", dist: 35.2, lat: 42.48, lon: -7.40, crux: {lat: 42.48, lon: -7.40}, water_gap: 15, bailout: "Med" },
            { id: 6, start: "Monforte", end: "Chantada", dist: 30.4, lat: 42.55, lon: -7.65, crux: {lat: 42.55, lon: -7.65}, water_gap: 10, bailout: "Low" },
            { id: 7, start: "Chantada", end: "Rodeiro", dist: 25.8, lat: 42.62, lon: -7.85, crux: {lat: 42.62, lon: -7.85}, water_gap: 12, bailout: "Low" },
            { id: 8, start: "Rodeiro", end: "A Laxe", dist: 27.2, lat: 42.70, lon: -8.05, crux: {lat: 42.70, lon: -8.05}, water_gap: 8, bailout: "Med" },
            { id: 9, start: "A Laxe", end: "Outeiro", dist: 34.1, lat: 42.78, lon: -8.35, crux: {lat: 42.78, lon: -8.35}, water_gap: 10, bailout: "Low" },
            { id: 10, start: "Outeiro", end: "Santiago", dist: 16.5, lat: 42.85, lon: -8.50, crux: {lat: 42.85, lon: -8.50}, water_gap: 5, bailout: "High" }
        ]
    },

    // -------------------------------------------------------------------------
    // 3. START LOCATIONS (Logistics for Landing Page & Planner)
    // -------------------------------------------------------------------------
    start_locations: {
        "frances": [
            { city: "St-Jean-Pied-de-Port", dist: "~780 km", airport: "Biarritz (BIQ)", commute: "1.5 - 2h", method: "Bus/Train" },
            { city: "Roncesvalles", dist: "~755 km", airport: "Pamplona (PNA)", commute: "1h 15m", method: "Bus (ALSA)" },
            { city: "Pamplona", dist: "~712 km", airport: "Pamplona (PNA)", commute: "15m", method: "Taxi/Bus" },
            { city: "Logroño", dist: "~617 km", airport: "Logroño (RJL)", commute: "15m", method: "Taxi" },
            { city: "Burgos", dist: "~492 km", airport: "Burgos (RGS)", commute: "15m", method: "Taxi" },
            { city: "León", dist: "~300 km", airport: "León (LEN)", commute: "20m", method: "Taxi" },
            { city: "Sarria", dist: "~114 km", airport: "Santiago (SCQ)", commute: "1.5h", method: "Bus/Train" }
        ],
        "norte": [
            { city: "Irún", dist: "~835 km", airport: "Biarritz (BIQ)", commute: "30m", method: "Bus" },
            { city: "San Sebastián", dist: "~808 km", airport: "San Sebastián (EAS)", commute: "20m", method: "Bus" },
            { city: "Bilbao", dist: "~680 km", airport: "Bilbao (BIO)", commute: "20m", method: "Bus A3247" },
            { city: "Santander", dist: "~535 km", airport: "Santander (SDR)", commute: "15m", method: "Taxi" },
            { city: "Gijón", dist: "~346 km", airport: "Asturias (OVD)", commute: "45m", method: "Bus" },
            { city: "Ribadeo", dist: "~188 km", airport: "Asturias (OVD)", commute: "1h 15m", method: "Bus" }
        ],
        "plata": [
            { city: "Sevilla", dist: "~1000 km", airport: "Sevilla (SVQ)", commute: "20m", method: "Bus EA" },
            { city: "Mérida", dist: "~787 km", airport: "Badajoz (BJZ)", commute: "45m", method: "Bus" },
            { city: "Cáceres", dist: "~713 km", airport: "Madrid (MAD)", commute: "3h", method: "Train" },
            { city: "Salamanca", dist: "~500 km", airport: "Madrid (MAD)", commute: "1.5h", method: "Train" },
            { city: "Ourense", dist: "~105 km", airport: "Santiago (SCQ)", commute: "40m", method: "Train" }
        ],
        "lusitana": [
            { city: "Lisbon", dist: "~650 km", airport: "Lisbon (LIS)", commute: "20m", method: "Metro" },
            { city: "Santarém", dist: "~563 km", airport: "Lisbon (LIS)", commute: "1h", method: "Train" },
            { city: "Coimbra", dist: "~410 km", airport: "Porto (OPO)", commute: "1.5h", method: "Train" },
            { city: "Porto", dist: "~240 km", airport: "Porto (OPO)", commute: "30m", method: "Metro" },
            { city: "Tui", dist: "~115 km", airport: "Vigo (VGO)", commute: "25m", method: "Taxi" }
        ],
       "coastal": [
            { city: "Porto", dist: "~280 km", airport: "Porto (OPO)", commute: "20m", method: "Metro" },
            { city: "Viana do Castelo", dist: "~190 km", airport: "Porto (OPO)", commute: "1h", method: "Bus/Train" },
            { city: "Vigo", dist: "~100 km", airport: "Vigo (VGO)", commute: "15m", method: "Taxi" }
        ],
        "primitivo": [
            { city: "Oviedo", dist: "~320 km", airport: "Asturias (OVD)", commute: "45m", method: "Bus" },
            { city: "Lugo", dist: "~100 km", airport: "Santiago (SCQ)", commute: "1.5h", method: "Bus (Monbus)" },
            { city: "A Fonsagrada", dist: "~160 km", airport: "Asturias (OVD)", commute: "2.5h", method: "Bus (Alsa)" }
        ],
        "invierno": [
            { city: "Ponferrada", dist: "~263 km", airport: "León (LEN)", commute: "1.5h", method: "Bus/Train" },
            { city: "Monforte de Lemos", dist: "~130 km", airport: "Santiago (SCQ)", commute: "2h", method: "Train/Bus" },
            { city: "A Rúa", dist: "~200 km", airport: "Santiago (SCQ)", commute: "2.5h", method: "Bus" }
        ]
    }
};
