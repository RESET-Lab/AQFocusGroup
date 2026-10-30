import Papa from 'npm:papaparse';
import _ from 'npm:lodash';
import { DATA_SOURCES } from "./config.js";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

/**
 * Filter sensor rows to only those within the last 48 hours from now
 * @param {Array} sensorData - Array of raw sensor rows (must have 'Timestamp' field)
 * @returns {Array} Filtered rows within the last 48h
 */
function filterLast48Hours(sensorData) {
  const cutoff = Date.now() - FORTY_EIGHT_HOURS_MS;
  return sensorData.filter(row => new Date(row['Timestamp']).getTime() >= cutoff);
}

/**
 * Fetch and process all sensor data from Google Sheets
 * @returns {Promise<Array>} Array of processed sensor objects
 */
export async function fetchSensorData() {
  try {
    const [sensitResponse, quantaqResponse] = await Promise.all([
      fetch(DATA_SOURCES.SENSIT_URL),
      fetch(DATA_SOURCES.QUANTAQ_URL)
    ]);

    const [sensitCsv, quantaqCsv] = await Promise.all([
      sensitResponse.text(),
      quantaqResponse.text(),
    ]);

    const sensitData = Papa.parse(sensitCsv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }).data;

    const quantaqData = Papa.parse(quantaqCsv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }).data;


    const groupedSensitData = _.groupBy(sensitData, 'Sensor ID');
    const groupedQuantaqData = _.groupBy(quantaqData, 'Name');

    const sensitSensors = Object.entries(groupedSensitData).map(([sensorId, sensorData]) => {
      const latestData = sensorData[sensorData.length - 1]; // used for name/coordinates only — metadata, not a reading
      const recent = filterLast48Hours(sensorData);
      const latestRecentData = recent.length > 0 ? recent[recent.length - 1] : null;

      return {
        id: sensorId,
        name: latestData['Name'],
        coordinates: [
          latestData['Longitude'],
          latestData['Latitude']
        ],
        lastReading: latestRecentData ? {
          time: new Date(latestRecentData['Timestamp']),
          pm25: latestRecentData['PM2.5'],
          pm10: latestRecentData['PM10'],
          co: latestRecentData['CO'],
          no2: latestRecentData['NO2'],
          o3: latestRecentData['O3'],
          //temp: latestRecentData['Temp'],
          //humidity: latestRecentData['Humidity'],
          voc: latestRecentData['pid1_PPB_Calc']
        } : null, // no reading within the last 48h — sensor is stale
        recentData: recent.map(row => ({
          time: new Date(row['Timestamp']),
          pm25: row['PM2.5'],
          pm10: row['PM10'],
          co: row['CO'],
          no2: row['NO2'],
          o3: row['O3'],
          //temp: row['Temp'],
          //humidity: row['Humidity'],
          voc: row['pid1_PPB_Calc']
        })),
        historicalData: sensorData.map(row => ({
          time: new Date(row['Timestamp']),
          pm25: row['PM2.5'],
          pm10: row['PM10'],
          co: row['CO'],
          no2: row['NO2'],
          o3: row['O3'],
          //temp: row['Temp'],
          //humidity: row['Humidity'],
          voc: row['pid1_PPB_Calc']
        }))
      };
    });

    const quantaqSensors = Object.entries(groupedQuantaqData).map(([sensorName, sensorData]) => {
      const latestData = sensorData[sensorData.length - 1]; // used for name/coordinates only — metadata, not a reading
      const recent = filterLast48Hours(sensorData);
      const latestRecentData = recent.length > 0 ? recent[recent.length - 1] : null;

      return {
        id: sensorName,
        name: latestData['Name'],
        coordinates: [
          latestData['Longitude'], // Longitude should be negative for Houston area
          latestData['Latitude']
        ],
        lastReading: latestRecentData ? {
          time: new Date(latestRecentData['Timestamp']),
          pm25: latestRecentData['PM2.5'],
          pm10: latestRecentData['PM10'],
          co: latestRecentData['CO'],
          no2: latestRecentData['NO2'],
          o3: latestRecentData['O3']//,
          //temp: null,
          //humidity: null
        } : null, // no reading within the last 48h — sensor is stale
        recentData: recent.map(row => ({
          time: new Date(row['Timestamp']),
          pm25: row['PM2.5'],
          pm10: row['PM10'],
          co: row['CO'],
          no2: row['NO2'],
          o3: row['O3']//
        })),
        historicalData: sensorData.map(row => ({
          time: new Date(row['Timestamp']),
          pm25: row['PM2.5'],
          pm10: row['PM10'],
          co: row['CO'],
          no2: row['NO2'],
          o3: row['O3']//
        }))
      };
    });

    return [...sensitSensors, ...quantaqSensors];

  } catch (error) {
    console.error("Error in data processing:", error);
    return [];
  }
}