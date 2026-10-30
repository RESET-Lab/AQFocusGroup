---
title: Sensor Map Component
theme: dashboard
---

```js
import deck from "npm:deck.gl";
const {DeckGL, ScatterplotLayer} = deck;

export function createSensorMap(container, sensors, onSensorSelect) {
  return new DeckGL({
    container,
    initialViewState: {
      longitude: -97.628513,
      latitude: 30.220349
      zoom: 10,
      pitch: 45,
      bearing: 0
    },
    controller: true,
    layers: [
      new ScatterplotLayer({
        id: 'sensors',
        data: sensors,
        getPosition: d => [parseFloat(d.sensorLng), parseFloat(d.sensorLat)],
        getColor: d => getReadingColor(d.lastReceivedRecord),
        getRadius: 100,
        pickable: true,
        onClick: info => onSensorSelect(info.object)
      })
    ]
  });
}

function getReadingColor(record) {
  if (!record) return [100, 100, 100];  // Gray for no data
  
  // Color based on CO levels
  const co = record.CO;
  if (co > 400) return [255, 0, 0];     // Red for high
  if (co > 300) return [255, 165, 0];   // Orange for medium
  return [0, 255, 0];                   // Green for low
}
```
