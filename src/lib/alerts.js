import { alertThresholds } from "./config.js";

/**
 * Get high pollutant alerts for sensors
 * @param {array} sensors - All sensors
 * @param {object} neighborhoodGroups - Neighborhood groups (optional)
 * @param {string} neighborhoodKey - Key for specific neighborhood (optional)
 * @returns {array} - Array of alerts
 */
export function getHighPollutantAlerts(sensors, neighborhoodGroups = null, neighborhoodKey = null) {
  const alerts = [];

  // Filter sensors by neighborhood if specified
  const sensorsToCheck = neighborhoodKey && neighborhoodGroups
    ? sensors.filter(sensor =>
        neighborhoodGroups[neighborhoodKey].sensorNames.includes(sensor.name)
      )
    : sensors;

  sensorsToCheck.forEach(sensor => {
    const sensorAlerts = [];

    // Check PM2.5
    if (sensor.lastReading?.pm25 > alertThresholds.pm25) {
      sensorAlerts.push({
        pollutant: 'PM2.5',
        value: sensor.lastReading.pm25.toFixed(1),
        unit: 'µg/m³'
      });
    }

    // Check CO
    if (sensor.lastReading?.co > alertThresholds.co) {
      sensorAlerts.push({
        pollutant: 'CO',
        value: sensor.lastReading.co.toFixed(1),
        unit: 'ppb'
      });
    }

    // Check NO2
    if (sensor.lastReading?.no2 > alertThresholds.no2) {
      sensorAlerts.push({
        pollutant: 'NO₂',
        value: sensor.lastReading.no2.toFixed(1),
        unit: 'ppb'
      });
    }

    // Check O3
    if (sensor.lastReading?.o3 > alertThresholds.o3) {
      sensorAlerts.push({
        pollutant: 'O₃',
        value: sensor.lastReading.o3.toFixed(1),
        unit: 'ppb'
      });
    }

    // Check VOC
    if (sensor.lastReading?.voc > alertThresholds.voc) {
      sensorAlerts.push({
        pollutant: 'VOC',
        value: sensor.lastReading.voc.toFixed(1),
        unit: 'ppb'
      });
    }

    if (sensorAlerts.length > 0) {
      alerts.push({
        sensorName: sensor.name,
        alerts: sensorAlerts,
        lastUpdate: sensor.lastReading.time
      });
    }
  });

  return alerts;
}

/**
 * Create alerts display HTML
 * @param {array} alerts - Array of alerts
 * @param {string} neighborhoodName - Name of neighborhood (optional)
 * @returns {string} - HTML string
 */
export function createAlertsHTML(alerts, neighborhoodName = '') {
  if (alerts.length === 0) {
    const message = neighborhoodName
      ? `No sensors currently reporting high pollutant levels in ${neighborhoodName}`
      : 'No sensors currently reporting high pollutant levels';
    return `<p style="text-align: center; color: #666; padding: 20px;">${message}</p>`;
  }

  return alerts.map(alert => `
    <div style="
      flex: 0 1 calc(12.5% - 10px);
      min-width: 200px;
      border-left: 4px solid #c76870;
      padding: 10px;
      background: #fee2e2;
    ">
      <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px;">${alert.sensorName}</div>
      ${alert.alerts.map(a => `
        <div style="margin-left: 10px; font-size: 11px;">
          ${a.pollutant}: <strong>${a.value} ${a.unit}</strong>
        </div>
      `).join('')}
      <div style="font-size: 10px; color: #666; margin-top: 5px;">
        Last updated: ${alert.lastUpdate.toLocaleString()}
      </div>
    </div>
  `).join('');
}
