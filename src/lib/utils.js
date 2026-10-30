import { pollutantConfig } from "./config.js";

/**
 * Calculate Air Quality Index from PM2.5 value
 * @param {number} pm25 - PM2.5 concentration
 * @returns {number|null} - AQI value or null if invalid
 */
export function calculateAQI(pm25) {
  const breakpoints = [
    { min: 0, max: 12.05, aqi_min: 0, aqi_max: 50 },
    { min: 12.05, max: 35.4, aqi_min: 51, aqi_max: 100 },
    { min: 35.5, max: 55.4, aqi_min: 101, aqi_max: 150 },
    { min: 55.5, max: 150.4, aqi_min: 151, aqi_max: 200 },
    { min: 150.5, max: 250.4, aqi_min: 201, aqi_max: 300 },
    { min: 250.5, max: 500.4, aqi_min: 301, aqi_max: 500 }
  ];

  const bp = breakpoints.find(({ min, max }) => pm25 >= min && pm25 <= max);

  if (!bp) {
    if (pm25 < 0) return 0;
    if (pm25 > 500.4) return 500;
    return null;
  }

  const aqi = Math.round(
    ((bp.aqi_max - bp.aqi_min) / (bp.max - bp.min)) *
    (pm25 - bp.min) +
    bp.aqi_min
  );

  return aqi;
}

/**
 * Get color and category for a pollutant value
 * @param {number} value - Pollutant value
 * @param {string} pollutant - Pollutant type (aqi, pm25, co, no2, o3, voc)
 * @returns {object} - Object with color and category
 */
export function getColorAndCategory(value, pollutant) {
  if (value === null || value === undefined || isNaN(value) || value < 0) {
    return {
      color: "#9ca3af",
      category: "No Data"
    };
  }

  const thresholds = pollutantConfig[pollutant].thresholds;
  for (const threshold of thresholds) {
    if (value < threshold.max) {
      return {
        color: threshold.color,
        category: threshold.label
      };
    }
  }
  return {
    color: thresholds[thresholds.length - 1].color,
    category: thresholds[thresholds.length - 1].label
  };
}

/**
 * Safe AQI calculation with error handling
 * @param {number} pm25 - PM2.5 value
 * @returns {number|null} - AQI value or null
 */
export function safeCalculateAQI(pm25) {
  try {
    if (pm25 === null || pm25 === undefined || isNaN(pm25)) return null;
    return calculateAQI(Number(pm25));
  } catch (e) {
    console.error('Error calculating AQI:', e);
    return null;
  }
}

/**
 * Get neighborhood key from neighborhood name
 * @param {string} neighborhoodName - Name of the neighborhood
 * @param {object} neighborhoodGroups - Neighborhood groups object
 * @returns {string|undefined} - Neighborhood key
 */
export function getNeighborhoodKey(neighborhoodName, neighborhoodGroups) {
  return Object.keys(neighborhoodGroups).find(key =>
    neighborhoodGroups[key].name === neighborhoodName
  );
}

/**
 * Calculate neighborhood-level metrics from sensors
 * @param {array} sensors - Array of all sensors
 * @param {object} neighborhoodGroups - Neighborhood groups configuration
 * @returns {array} - Array of neighborhood metrics
 */
export function calculateNeighborhoodMetrics(sensors, neighborhoodGroups) {
  return Object.entries(neighborhoodGroups).map(([id, neighborhood]) => {
    const neighborhoodSensors = sensors.filter(sensor =>
      neighborhood.sensorNames.includes(sensor.name)
    );

    const metrics = {
      pm25: 0,
      co: 0,
      no2: 0,
      o3: 0,
      temperature: 0,
      humidity: 0,
      activeCount: 0
    };

    neighborhoodSensors.forEach(sensor => {
      if (sensor.lastReading) {
        metrics.activeCount++;
        metrics.pm25 += sensor.lastReading.pm25 || 0;
        metrics.co += sensor.lastReading.co || 0;
        metrics.no2 += sensor.lastReading.no2 || 0;
        metrics.o3 += sensor.lastReading.o3 || 0;
        metrics.temperature += sensor.lastReading.temp || 0;
        metrics.humidity += sensor.lastReading.humidity || 0;
      }
    });

    const count = metrics.activeCount;
    if (count > 0) {
      Object.keys(metrics).forEach(key => {
        if (key !== 'activeCount') {
          metrics[key] = metrics[key] / count;
        }
      });
    }

    metrics.aqi = calculateAQI(metrics.pm25);

    return {
      id,
      name: neighborhood.name,
      sensorCount: neighborhoodSensors.length,
      activeCount: metrics.activeCount,
      ...metrics
    };
  }).filter(n => n.activeCount > 0);
}

/**
 * Calculate average values for all pollutants
 * Only sensors with a current reading (i.e. non-null lastReading, meaning
 * a reading exists within the last 48h) are included in the averages.
 * @param {array} sensors - Array of sensors
 * @returns {object} - Object with average values
 */
export function calculateAverages(sensors) {
  if (!sensors.length) {
    return {
      avgPM25: '0.0',
      avgCO: '0.0',
      avgNO2: '0.0',
      avgO3: '0.0',
      avgVOC: 'N/A',
      avgAQI: '0.0'
    };
  }

  // Exclude sensors with no current (within-48h) reading from all averages
  const activeSensors = sensors.filter(s => s.lastReading);

  if (!activeSensors.length) {
    return {
      avgPM25: 'N/A',
      avgCO: 'N/A',
      avgNO2: 'N/A',
      avgO3: 'N/A',
      avgVOC: 'N/A',
      avgAQI: 'N/A'
    };
  }

  const avgPM25 = (activeSensors.reduce((sum, s) => sum + (s.lastReading.pm25 || 0), 0) / activeSensors.length).toFixed(1);
  const avgCO = (activeSensors.reduce((sum, s) => sum + (s.lastReading.co || 0), 0) / activeSensors.length).toFixed(1);
  const avgNO2 = (activeSensors.reduce((sum, s) => sum + (s.lastReading.no2 || 0), 0) / activeSensors.length).toFixed(1);
  const avgO3 = (activeSensors.reduce((sum, s) => sum + (s.lastReading.o3 || 0), 0) / activeSensors.length).toFixed(1);

  const vocSensors = activeSensors.filter(s => s.lastReading?.voc >= 0);
  const avgVOC = vocSensors.length
    ? (vocSensors.reduce((sum, s) => sum + s.lastReading.voc, 0) / vocSensors.length).toFixed(1)
    : 'N/A';

  const avgAQI = (activeSensors.reduce((sum, s) => sum + (calculateAQI(s.lastReading.pm25) || 0), 0) / activeSensors.length).toFixed(1);

  return { avgPM25, avgCO, avgNO2, avgO3, avgVOC, avgAQI };
}

/**
 * Process neighborhood historical data with gap handling
 * @param {array} sensors - Array of sensors
 * @param {object} neighborhoodGroups - Neighborhood groups
 * @returns {object} - Neighborhood averages keyed by group ID
 */
export function processNeighborhoodHistoricalData(sensors, neighborhoodGroups) {
  const neighborhoodData = {};

  // First get all timestamps
  let allTimestamps = [];
  sensors.forEach(sensor => {
    if (sensor.historicalData) {
      allTimestamps.push(...sensor.historicalData.map(d => d.time.getTime()));
    }
  });

  const globalMinTime = Math.min(...allTimestamps);
  const globalMaxTime = Math.max(...allTimestamps);

  // Process each neighborhood
  Object.keys(neighborhoodGroups).forEach(groupId => {
    neighborhoodData[groupId] = [];

    const neighborhoodSensors = sensors.filter(sensor =>
      neighborhoodGroups[groupId].sensorNames.includes(sensor.name)
    );

    neighborhoodSensors.forEach(sensor => {
      if (sensor.historicalData) {
        const validReadings = sensor.historicalData
          .filter(d => d.pm25 != null && !isNaN(d.pm25))
          .map(d => ({
            time: d.time.getTime(),
            pm25: d.pm25
          }));
        neighborhoodData[groupId].push(...validReadings);
      }
    });

    neighborhoodData[groupId].sort((a, b) => a.time - b.time);

    if (neighborhoodData[groupId].length > 0) {
      if (neighborhoodData[groupId][0].time > globalMinTime) {
        neighborhoodData[groupId].unshift({
          time: globalMinTime,
          pm25: neighborhoodData[groupId][0].pm25
        });
      }

      if (neighborhoodData[groupId][neighborhoodData[groupId].length - 1].time < globalMaxTime) {
        neighborhoodData[groupId].push({
          time: globalMaxTime,
          pm25: neighborhoodData[groupId][neighborhoodData[groupId].length - 1].pm25
        });
      }
    }
  });

  // Calculate averages with interpolation
  const neighborhoodAverages = {};
  Object.keys(neighborhoodData).forEach(groupId => {
    const data = neighborhoodData[groupId];
    if (data.length === 0) return;

    const neighborhoodSensors = sensors.filter(sensor =>
      neighborhoodGroups[groupId].sensorNames.includes(sensor.name)
    );

    const hourlyData = {};
    data.forEach(reading => {
      const hour = Math.floor(reading.time / (1000 * 60 * 60)) * (1000 * 60 * 60);
      if (!hourlyData[hour]) hourlyData[hour] = [];
      hourlyData[hour].push(reading.pm25);
    });

    neighborhoodAverages[groupId] = Object.entries(hourlyData)
      .map(([time, values]) => {
        const avgPM25 = values.reduce((sum, val) => sum + val, 0) / values.length;
        return {
          time: new Date(parseInt(time)),
          aqi: calculateAQI(avgPM25)
        };
      })
      .sort((a, b) => a.time - b.time)
      .filter(d => d.aqi != null && !isNaN(d.aqi));

    // Add interpolation
    const result = [];
    for (let i = 0; i < neighborhoodAverages[groupId].length - 1; i++) {
      const current = neighborhoodAverages[groupId][i];
      const next = neighborhoodAverages[groupId][i + 1];
      result.push(current);

      const gap = next.time - current.time;
      const maxGapSize = neighborhoodSensors.length === 1 ? 43200000 : 21600000;
      if (gap > 3600000 && gap < maxGapSize) {
        const steps = Math.floor(gap / 3600000);
        for (let j = 1; j < steps; j++) {
          const t = new Date(current.time.getTime() + j * 3600000);
          const ratio = j / steps;
          const interpolatedAQI = current.aqi + (next.aqi - current.aqi) * ratio;
          result.push({
            time: t,
            aqi: interpolatedAQI
          });
        }
      }
    }
    if (neighborhoodAverages[groupId].length > 0) {
      result.push(neighborhoodAverages[groupId][neighborhoodAverages[groupId].length - 1]);
    }
    neighborhoodAverages[groupId] = result;
  });

  return neighborhoodAverages;
}