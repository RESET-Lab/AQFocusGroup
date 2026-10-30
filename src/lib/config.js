// Pollutant configuration with thresholds and styling
export const pollutantConfig = {
  aqi: {
    name: "AQI",
    unit: "",
    thresholds: [
      { max: 51, label: "Good", color: "#00e676" },
      { max: 101, label: "Moderate", color: "#ffd54f" },
      { max: 151, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 201, label: "Unhealthy", color: "#ff1744" },
      { max: 301, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0;">Air Quality Index (Calculated from PM2.5)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-50)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (51-100)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (101-150)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (151-200)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (201-300)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>300)</div>
    `
  },
  pm25: {
    name: "PM2.5",
    unit: "µg/m³",
    thresholds: [
      { max: 9, label: "Good", color: "#00e676" },
      { max: 35, label: "Moderate", color: "#ffd54f" },
      { max: 55, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 125, label: "Unhealthy", color: "#ff1744" },
      { max: 255, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
    <h4 style="margin: 0 0 5px 0;">PM2.5 Levels (µg/m³)</h4>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-9)</div>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (9-35)</div>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (35-55)</div>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (55-125)</div>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (125-255)</div>
    <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>255)</div>
    `
  },
  pm10: {
    name: "PM10",
    unit: "µg/m³",
    thresholds: [
      { max: 54, label: "Good", color: "#00e676" },
      { max: 154, label: "Moderate", color: "#ffd54f" },
      { max: 254, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 354, label: "Unhealthy", color: "#ff1744" },
      { max: 424, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0;">PM10 Levels (µg/m³)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-55)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (55-155)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (155-255)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (255-355)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (355-425)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>425)</div>
    `
  },
  co: {
    name: "CO",
    unit: "ppb",
    thresholds: [
      { max: 4500, label: "Good", color: "#00e676" },
      { max: 9500, label: "Moderate", color: "#ffd54f" },
      { max: 12500, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 15500, label: "Unhealthy", color: "#ff1744" },
      { max: 30500, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0;">CO Levels (ppb)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-4500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (4500-9500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (9500-12500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (12500-15500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (15500-30500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>30500)</div>
    `
  },
  no2: {
    name: "NO₂",
    unit: "ppb",
    thresholds: [
      { max: 54, label: "Good", color: "#00e676" },
      { max: 100, label: "Moderate", color: "#ffd54f" },
      { max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 200, label: "Unhealthy", color: "#ff1744" },
      { max: 300, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0;">NO₂ Levels (ppb)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-55)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (55-100)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (100-150)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (150-200)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (200-300)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>300)</div>
    `
  },
  o3: {
    name: "O₃",
    unit: "ppb",
    thresholds: [
      { max: 55, label: "Good", color: "#00e676" },
      { max: 70, label: "Moderate", color: "#ffd54f" },
      { max: 85, label: "Unhealthy for Sensitive Groups", color: "#ff9100" },
      { max: 105, label: "Unhealthy", color: "#ff1744" },
      { max: 200, label: "Very Unhealthy", color: "#8f3f97" },
      { max: Infinity, label: "Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0; font-size: 14px;">O₃ Levels (ppb)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-55)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (55-70)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Unhealthy for Sensitive Groups (70-85)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> Unhealthy (85-105)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very Unhealthy (105-200)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Hazardous (>200)</div>    `
  },
  voc: {
    name: "VOC",
    unit: "ppb",
    thresholds: [
      { max: 75, label: "Good", color: "#00e676" },
      { max: 150, label: "Moderate", color: "#ffd54f" },
      { max: 250, label: "Moderately High", color: "#ff9100" },
      { max: 500, label: "High", color: "#ff1744" },
      { max: 1000, label: "Very High", color: "#8f3f97" },
      { max: Infinity, label: "Possibly Hazardous", color: "#7e0023" }
    ],
    getLegendHTML: () => `
      <h4 style="margin: 0 0 5px 0;">VOC Levels (ppb)</h4>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #00e676; margin-right: 5px;"></span> Good (0-75)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ffd54f; margin-right: 5px;"></span> Moderate (75-150)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff9100; margin-right: 5px;"></span> Moderately High (150-250)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #ff1744; margin-right: 5px;"></span> High (250-500)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #8f3f97; margin-right: 5px;"></span> Very High (500-1000)</div>
      <div><span style="display: inline-block; width: 12px; height: 12px; background: #7e0023; margin-right: 5px;"></span> Possibly Hazardous (>1000)</div>    
    `
  }
};

// Neighborhood definitions
export const neighborhoodGroups = {
  "Bastrop": {
    name: "Bastrop",
    sensorNames: [
      "Bastrop"
    ]
  },
  "Tesla Neighbors": {
    name: "Tesla Neighbors",
    sensorNames: [
      "Del Valle",
      "Green Grove 1",
      "Green Grove 2",
      "Austin's Colony",
      "Tesla SPOD"
    ]
  },
  "Airport Neighbors": {
    name: "Airport Neighbors",
    sensorNames: [
      "Fuel Tank SPOD",
      "McCall Ln"
    ]
  },
};

// Neighborhood centers for map positioning
export const neighborhoodCenters = {
  "Bastrop": { center: [-97.425052, 30.167164], zoom: 12 },
  "Tesla Neighbors": { center: [-97.628513, 30.220349], zoom: 12 },
  "Airport Neighbors": { center: [-97.683664, 30.204965], zoom: 12 },
};

// Alert thresholds for different pollutants
export const alertThresholds = {
  pm25: 35,
  pm10: 150,
  co: 9000,
  no2: 100,
  o3: 70,
  voc: 150
};

// Data source URLs
export const DATA_SOURCES = {
  //PURPLE_AIR_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2ph5qMZYAjMTnYpYxbhcnUsu3kdubwXEYO8LZ4Tn1rJSMGYt9sF6bvnBAcjwQO01cp2b7z-f8cbTj/pub?gid=1535866174&single=true&output=csv", // AAH
  SENSIT_URL: `https://docs.google.com/spreadsheets/d/1anK0TYwp9xeRYOYYtyPxYOfRubbppskXK2e1uJYZopI/export?format=csv&gid=1225202791&t=${Date.now()}`,
  QUANTAQ_URL: `https://docs.google.com/spreadsheets/d/1anK0TYwp9xeRYOYYtyPxYOfRubbppskXK2e1uJYZopI/export?format=csv&gid=0&t=${Date.now()}`
  //CAMP_AG_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2ph5qMZYAjMTnYpYxbhcnUsu3kdubwXEYO8LZ4Tn1rJSMGYt9sF6bvnBAcjwQO01cp2b7z-f8cbTj/pub?gid=580739053&single=true&output=csv" // AAH
};

// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: 'pk.eyJ1IjoiZXZhbm9uZWlsIiwiYSI6ImNpb3Vld3BtejAwcmp1Zm00bnY0cGZja2IifQ._kXkIWTy9bzQUcXhO5bgrA',
  style: 'mapbox://styles/mapbox/light-v11',
  defaultCenter: [-97.628513, 30.220349],
  defaultZoom: 10
};
