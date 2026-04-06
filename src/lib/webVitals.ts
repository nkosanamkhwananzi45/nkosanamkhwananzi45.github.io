/**
 * Web Vitals monitoring — lightweight, no external dependencies.
 * Reports CLS, FID, LCP, FCP, TTFB via PerformanceObserver when available.
 */

type MetricCallback = (metric: { name: string; value: number; rating: string }) => void;

const getRating = (name: string, value: number): string => {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };
  const [good, poor] = thresholds[name] ?? [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
};

export function reportWebVitals(onReport: MetricCallback = console.debug.bind(console)) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  // CLS
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
    addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        onReport({ name: "CLS", value: clsValue, rating: getRating("CLS", clsValue) });
        clsObserver.disconnect();
      }
    }, { once: true });
  } catch { /* unsupported */ }

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        onReport({ name: "LCP", value: last.startTime, rating: getRating("LCP", last.startTime) });
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch { /* unsupported */ }

  // FID
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      if (entry) {
        const value = (entry as any).processingStart - entry.startTime;
        onReport({ name: "FID", value, rating: getRating("FID", value) });
      }
    });
    fidObserver.observe({ type: "first-input", buffered: true });
  } catch { /* unsupported */ }

  // FCP
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          onReport({ name: "FCP", value: entry.startTime, rating: getRating("FCP", entry.startTime) });
          fcpObserver.disconnect();
        }
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch { /* unsupported */ }

  // TTFB
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      const value = nav.responseStart - nav.requestStart;
      onReport({ name: "TTFB", value, rating: getRating("TTFB", value) });
    }
  } catch { /* unsupported */ }
}
