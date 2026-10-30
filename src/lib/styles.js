/**
 * Get common HTML styles and fonts
 * @returns {string} - HTML string with styles
 */
export function getCommonStyles() {
  return `
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Aleo:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
      footer {
        display:none !important;
      }

      @import url('https://fonts.googleapis.com/css2?family=Aleo:wght@300;400;700&family=Roboto:wght@400;500;700&display=swap');

      html {
        background: white !important;
        font-family: 'Roboto', sans-serif;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: 'Aleo', serif;
      }

      .aleo {
        font-family: 'Aleo', serif;
      }

      .roboto {
        font-family: 'Roboto', sans-serif;
      }

      .mapboxgl-popup {
        z-index: 2;
      }

      .mapboxgl-popup-content {
        font-family: 'Roboto', sans-serif;
        max-width: none !important;
      }

      .mapboxgl-ctrl-attrib-inner {
        display:none;
      }

      #observablehq-main > div:nth-child(5) > span > div > div:nth-child(1) > div > svg > g:nth-child(7) {
        margin-top:50px;
      }
    </style>
  `;
}

/**
 * Get pollutant selector HTML
 * @returns {string} - HTML for pollutant selector
 */
export function getPollutantSelector() {
  return `
    <div style="margin-top:50px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center;">
      <div style="
        background: #e3e935;
        padding: 20px;
        border-radius: 8px 8px 0px 0px;
        font-family: Aleo;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
      ">
        <span>Select current pollutant levels to display:</span>
        <select id="pollutant-select" style="
          padding: 5px;
          border-radius: 4px;
          font-family: 'Roboto', sans-serif;
        ">
          <option value="aqi">AQI</option>
          <option value="pm25">PM2.5</option>
          <option value="co">CO</option>
          <option value="no2">NO₂</option>
          <option value="o3">O₃</option>
          <option value="voc">VOC</option>
        </select>
      </div>
    </div>
  `;
}

/**
 * Get map container HTML
 * @returns {string} - HTML for map container
 */
export function getMapContainer() {
  return `
    <div style="position: relative; display: flex;">
      <!-- Side panel -->
      <div id="sensor-panel" style="
        width: 280px;
        background: white;
        display: none;
        overflow-y: auto;
        padding: 15px;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        border-radius: 4px;
        max-height: 450px;">
        <button id="close-panel" style="position: absolute; top: 16px; right: 20px; background: none; border: none; cursor: pointer; font-size: 18px; color: black; padding: 5px;">×</button>
        <div id="panel-content"></div>
      </div>

      <div style="flex: 1;">
        <div id="map" style="width: 100%; height: 500px;"></div>
        <div id="legend" style="position: absolute; bottom: 5px; right: 5px; background: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 1; font-family: 'Roboto', sans-serif; font-size: 12px;"></div>
      </div>
    </div>
  `;
}
