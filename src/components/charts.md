---
title: Visualization Components
theme: dashboard
---

```js
import * as Plot from "@observablehq/plot";

export function timeSeriesChart(sensor, width, height) {
  if (!sensor) return Plot.plot({width, height});
  
  return Plot.plot({
    width,
    height: height - 40,
    marginBottom: 40,
    x: {label: "Time", tickFormat: "%H:%M"},
    y: {label: "Value", grid: true},
    marks: [
      Plot.line(sensor.data, {
        x: "date",
        y: "CO",
        stroke: "red",
        strokeWidth: 1.5,
        title: d => `CO: ${d.CO.toFixed(1)}`
      }),
      Plot.line(sensor.data, {
        x: "date",
        y: "NO2",
        stroke: "blue",
        strokeWidth: 1.5,
        title: d => `NO₂: ${d.NO2.toFixed(1)}`
      }),
      Plot.line(sensor.data, {
        x: "date",
        y: "O3",
        stroke: "green",
        strokeWidth: 1.5,
        title: d => `O₃: ${d.O3.toFixed(1)}`
      })
    ]
  });
}

export function currentReadings(sensor, width, height) {
  if (!sensor) return Plot.plot({width, height});
  
  const readings = sensor.lastReceivedRecord;
  return Plot.plot({
    width,
    height: height - 40,
    marks: [
      Plot.barY([
        {parameter: "CO", value: readings.CO},
        {parameter: "NO₂", value: readings.NO2},
        {parameter: "O₃", value: readings.O3},
        {parameter: "PM2.5", value: readings.PM_1_2_5},
        {parameter: "PM10", value: readings.PM_1_10_0}
      ], {
        x: "parameter",
        y: "value",
        fill: "parameter",
        title: d => `${d.parameter}: ${d.value.toFixed(1)}`
      })
    ]
  });
}

export function windDisplay(sensor, width, height) {
  if (!sensor) return Plot.plot({width, height});
  
  const windData = sensor.lastReceivedRecord;
  
  return Plot.plot({
    width,
    height: height - 40,
    projection: "polar",
    marks: [
      Plot.vector([windData], {
        length: "WS",
        rotate: "WD",
        stroke: "currentColor",
        title: d => `Speed: ${d.WS.toFixed(1)} m/s\nDirection: ${d.WD.toFixed(1)}°`
      })
    ]
  });
}
```
