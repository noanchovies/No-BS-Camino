// config.js
// ==============================================================================
// SITE CONFIGURATION (Edit this for new "Route Weather" sites)
// ==============================================================================

const SITE_CONFIG = {
    // 1. Text & Branding
    title: "Camino Weather Check",
    description: "Real-time weather forecast for every stage of your Camino Portuguese.",
    coffeeLink: "https://ko-fi.com/YOUR_USERNAME", // Change this to your link
    
    // 2. Map Settings
    mapCenter: [39.6, -8.6], // Center of Portugal
    zoomLevel: 7,

    // 3. The Weather Parameters (The "Camino" mix)
    weatherParams: [
        "temperature_2m",
        "precipitation_probability",
        "weathercode",
        "windspeed_10m",
        "windgusts_10m",  // Important for walking
        "uv_index"        // Important for walking
    ],

    // 4. The Route Checkpoints (Lat, Lon, Name)
    // You can add as many as you want here.
    checkpoints: [
        { name: "Lisbon (Start)", lat: 38.7223, lon: -9.1393 },
        { name: "Santarém", lat: 39.2333, lon: -8.6833 },
        { name: "Fátima", lat: 39.6172, lon: -8.6521 },
        { name: "Coimbra", lat: 40.2033, lon: -8.4103 },
        { name: "Porto", lat: 41.1579, lon: -8.6291 },
        { name: "Viana do Castelo", lat: 41.6918, lon: -8.8345 },
        { name: "Vigo (Spain)", lat: 42.2406, lon: -8.7207 },
        { name: "Pontevedra", lat: 42.4299, lon: -8.6446 },
        { name: "Santiago de Compostela", lat: 42.8782, lon: -8.5448 }
    ]
};
