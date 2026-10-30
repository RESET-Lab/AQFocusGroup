import mapboxgl from 'npm:mapbox-gl';
import { pollutantConfig, MAPBOX_CONFIG } from "./config.js";
import { getColorAndCategory, calculateAQI } from "./utils.js";
import { getHighPollutantAlerts } from "./alerts.js";

/**
 * Create circle marker element for map
 * @param {string} color - Marker color
 * @returns {HTMLElement} - Marker element
 */
export function createCircleMarker(color) {
  const el = document.createElement('div');
  el.className = 'circle-marker';
  el.style.cssText = `
    background-color: ${color};
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.3);
    cursor: pointer;
  `;
  return el;
}

/**
 * Initialize Mapbox map
 * @param {object} options - Map options
 * @returns {object} - Mapbox map instance
 */
export function initializeMap({ center, zoom } = {}) {
  mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: MAPBOX_CONFIG.style,
    center: center || MAPBOX_CONFIG.defaultCenter,
    zoom: zoom || MAPBOX_CONFIG.defaultZoom
  });

  map.addControl(new mapboxgl.NavigationControl());

  // Add custom attribution
  const customAttribution = document.createElement('div');
  customAttribution.className = 'mapboxgl-ctrl mapboxgl-ctrl-attrib';
  customAttribution.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 5px;
    padding: 5px 10px;
    background: black;
    border: 1px white;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif;
    font-size: 11px;
    z-index: 999;
  `;
  customAttribution.innerHTML = '<a href="https://evanoneil.studio" target="_blank" style="color: #c3e84e; text-decoration: none;">Built by DS_o_EO</a>';
  map.getContainer().appendChild(customAttribution);

  return map;
}

/**
 * Update map markers based on pollutant selection
 * @param {object} map - Mapbox map instance
 * @param {array} sensors - Sensor data
 * @param {array} currentMarkers - Current markers array
 * @param {string} pollutant - Selected pollutant
 * @param {function} onMarkerClick - Callback for marker click
 * @returns {array} - Updated markers array
 */
export function updateMarkers(map, sensors, currentMarkers, pollutant, onMarkerClick) {
  // Calculate AQI values if needed
  if (pollutant === 'aqi') {
    sensors.forEach(sensor => {
      if (sensor.lastReading && sensor.lastReading.pm25) {
        sensor.lastReading.aqi = calculateAQI(sensor.lastReading.pm25);
      }
      if (sensor.recentData) {
        sensor.recentData.forEach(reading => {
          if (reading.pm25) {
            reading.aqi = calculateAQI(reading.pm25);
          }
        });
      }
    });
  }

  // Remove existing markers
  currentMarkers.forEach(marker => marker.remove());
  const newMarkers = [];

  // Create new markers
  sensors.forEach(sensor => {
    const value = sensor.lastReading ? sensor.lastReading[pollutant] : null;
    const { color: markerColor } = getColorAndCategory(value, pollutant);

    const marker = new mapboxgl.Marker({
      element: createCircleMarker(markerColor),
      anchor: 'center'
    })
      .setLngLat(sensor.coordinates)
      .addTo(map);

    marker.getElement().addEventListener('click', () => {
      if (onMarkerClick) {
        onMarkerClick(sensor, pollutant, newMarkers);
      }
    });

    newMarkers.push(marker);
  });

  // Update legend
  const legendElement = document.getElementById('legend');
  if (legendElement) {
    legendElement.innerHTML = pollutantConfig[pollutant].getLegendHTML();
  }

  return newMarkers;
}

/**
 * Create sensor panel content
 * @param {object} sensor - Sensor data
 * @param {string} pollutant - Selected pollutant
 * @param {array} markers - All markers
 * @returns {string} - HTML content
 */
export function createSensorPanelContent(sensor, pollutant, markers) {
  const value = sensor.lastReading ? sensor.lastReading[pollutant] : null;
  const config = pollutantConfig[pollutant];
  const { color: markerColor, category } = getColorAndCategory(value, pollutant);

  return {
    headerHTML: `<h3 style="margin: 0; color: white;">${sensor.name}</h3>`,
    headerColor: markerColor,
    valueHTML: `
      <p style="margin: 5px 0;">
        <strong>${config.name}:</strong>
        <span style="padding:2px 5px;border-radius:8px;color: ${markerColor}; font-weight: bold;">
          ${category}
        </span>
        <br /><span style="font-size:60px;">${value?.toFixed(1) || 'N/A'} </span> ${config.unit}
      </p>
    `,
    detailsHTML: `      
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
        Last Update: ${sensor.lastReading?.time?.toLocaleString() || 'N/A'}
      </p>
    `,
    chartData: sensor.recentData?.length ? sensor.recentData.map(reading => ({
      time: reading.time,
      value: reading[pollutant]
    })) : null,
    config
  };
}

/**
 * Create alerts control for map
 * @param {function} onAlertsClick - Callback when alerts button clicked
 * @returns {object} - Mapbox control
 */
export function createAlertsControl(onAlertsClick) {
  class AlertsControl {
    onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

      const button = document.createElement('button');
      button.id = 'alerts-toggle-btn';
      button.className = 'alerts-toggle';
      button.style.cssText = `
        padding: 8px;
        background: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
      `;

      const alertIcon = document.createElement('div');
      alertIcon.innerHTML = '⚠️';

      const text = document.createElement('span');
      text.textContent = 'View High Alerts';

      button.appendChild(alertIcon);
      button.appendChild(text);

      button.addEventListener('click', onAlertsClick);

      this._container.appendChild(button);
      return this._container;
    }

    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }

  return new AlertsControl();
}

/**
 * Create neighborhood alerts control for map
 * @param {string} neighborhoodName - Name of neighborhood
 * @param {function} onAlertsClick - Callback when alerts button clicked
 * @returns {object} - Mapbox control
 */
export function createNeighborhoodAlertsControl(neighborhoodName, onAlertsClick) {
  class NeighborhoodAlertsControl {
    onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

      const button = document.createElement('button');
      button.id = 'neighborhood-alerts-btn';
      button.className = 'alerts-toggle';
      button.style.cssText = `
        padding: 8px;
        background: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
      `;

      const alertIcon = document.createElement('div');
      alertIcon.innerHTML = '⚠️';

      const text = document.createElement('span');
      text.textContent = `View High Alerts in ${neighborhoodName}`;

      button.appendChild(alertIcon);
      button.appendChild(text);

      button.addEventListener('click', onAlertsClick);

      this._container.appendChild(button);
      return this._container;
    }

    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }

  return new NeighborhoodAlertsControl();
}

/**
 * Show alerts panel with filtering
 * @param {array} alerts - Array of alerts
 * @param {string} neighborhoodName - Optional neighborhood name for filtering
 * @param {array} sensors - All sensors
 * @param {object} map - Map instance
 * @param {array} currentMarkers - Current markers
 * @param {object} neighborhoodGroups - Neighborhood groups
 */
export function showAlertsPanel(alerts, neighborhoodName, sensors, map, currentMarkers, neighborhoodGroups) {
  const panel = document.getElementById('sensor-panel');
  const panelContent = document.getElementById('panel-content');

  panel.dataset.showingAlerts = 'true';

  const contentDiv = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'sensor-header';
  header.style.cssText = `
    background-color: #c76870;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  header.innerHTML = `
    <h3 style="margin: 0; color: white;">High Pollutant Alerts${neighborhoodName ? ` in ${neighborhoodName}` : ''}</h3>
    <button id="close-panel" style="
      position: absolute;
      top: 16px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: white;
      padding: 5px;
    ">×</button>
  `;

  header.querySelector('#close-panel').addEventListener('click', () => {
    panel.style.display = 'none';
    panel.dataset.showingAlerts = 'false';
    currentMarkers.forEach(m => m.getElement().style.opacity = '1');
  });

  contentDiv.appendChild(header);

  const filteredAlerts = neighborhoodName && neighborhoodGroups
    ? alerts.filter(alert => {
        const neighborhood = Object.values(neighborhoodGroups).find(n => n.name === neighborhoodName);
        return neighborhood ? neighborhood.sensorNames.includes(alert.sensorName) : false;
      })
    : alerts;

  if (filteredAlerts.length === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.style.cssText = 'text-align: center; color: #666; padding: 20px;';
    noAlerts.textContent = neighborhoodName
      ? `No sensors currently reporting high pollutant levels in ${neighborhoodName}`
      : 'No sensors currently reporting high pollutant levels';
    contentDiv.appendChild(noAlerts);
  } else {
    filteredAlerts.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.style.cssText = `
        border-left: 4px solid #dc2626;
        padding: 10px;
        margin-bottom: 10px;
        background: #fee2e2;
        cursor: pointer;
      `;

      const sensor = sensors.find(s => s.name === alert.sensorName);

      alertDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${alert.sensorName}</div>
        ${alert.alerts.map(a => `
          <div style="margin-left: 10px;">
            <span class="pollutant-link" style="cursor: pointer; color: #0284c7; text-decoration: underline;"
              data-pollutant="${a.pollutant === 'PM2.5' ? 'pm25' :
                a.pollutant === 'PM10' ? 'pm10' :
                a.pollutant === 'NO₂' ? 'no2' :
                a.pollutant === 'O₃' ? 'o3' :
                a.pollutant === 'VOC' ? 'voc' : 'co'}"
              data-value="${a.value}"
            >
              ${a.pollutant}: <strong>${a.value} ${a.unit}</strong>
            </span>
          </div>
        `).join('')}
      `;

      const pollutantLinks = alertDiv.querySelectorAll('.pollutant-link');
      pollutantLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
          const pollutant = link.dataset.pollutant;
          const pollutantSelect = document.getElementById('pollutant-select');
          if (pollutantSelect) {
            pollutantSelect.value = pollutant;
            pollutantSelect.dispatchEvent(new Event('change'));
          }

          if (sensor) {
            map.flyTo({
              center: sensor.coordinates,
              zoom: 14,
              duration: 2000
            });

            currentMarkers.forEach(m => m.getElement().style.opacity = '0.5');
            const marker = currentMarkers.find(m =>
              m.getLngLat().lng === sensor.coordinates[0] &&
              m.getLngLat().lat === sensor.coordinates[1]
            );
            if (marker) {
              marker.getElement().style.opacity = '1';
            }
          }
        });
      });

      alertDiv.addEventListener('click', () => {
        if (sensor) {
          map.flyTo({
            center: sensor.coordinates,
            zoom: 14,
            duration: 2000
          });

          currentMarkers.forEach(m => m.getElement().style.opacity = '0.5');
          const marker = currentMarkers.find(m =>
            m.getLngLat().lng === sensor.coordinates[0] &&
            m.getLngLat().lat === sensor.coordinates[1]
          );
          if (marker) {
            marker.getElement().style.opacity = '1';
          }
        }
      });

      contentDiv.appendChild(alertDiv);
    });
  }

  panelContent.innerHTML = '';
  panelContent.appendChild(contentDiv);

  currentMarkers.forEach(m => m.getElement().style.opacity = '0.5');

  panel.style.display = 'block';
}
