---
title: Dashboard Styles
theme: dashboard
---

```css
.card {
  background: var(--theme-background-secondary);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.sensor-reading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--theme-background);
}

.sensor-reading-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.wind-indicator {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px solid var(--theme-foreground-muted);
  border-radius: 50%;
}
```
