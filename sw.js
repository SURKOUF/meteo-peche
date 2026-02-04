self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("meteo-peche").then(cache =>
      cache.addAll(["./", "./index.html", "./app.js"])
    )
  );
});
