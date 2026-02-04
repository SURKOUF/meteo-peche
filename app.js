const weatherKey = "7baa39789a0f591884f58f73f4704172";
const tideKey = "c738ad96-27ec-4298-80bb-873d0bd8a67c
";

async function loadData(lat, lon) {
  const output = document.getElementById("result");

  try {
    // 🌤 MÉTÉO
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`
    );
    const weather = await weatherRes.json();

    // 🌊 MARÉE
    const tideRes = await fetch(
      `https://www.worldtides.info/api/v3?heights&lat=${lat}&lon=${lon}&key=${tideKey}`
    );
    const tide = await tideRes.json();

    const h1 = tide.heights[0]?.height ?? 0;
    const h2 = tide.heights[1]?.height ?? 0;
    const tideTrend = h2 > h1 ? "Montante 🌊⬆️" : "Descendante 🌊⬇️";

    // 🌕 LUNE simple
    const day = new Date().getDate();
    const moon =
      day < 7 ? "Nouvelle lune 🌑" :
      day < 14 ? "Premier quartier 🌓" :
      day < 21 ? "Pleine lune 🌕" :
      "Dernier quartier 🌗";

    // 🎣 SCORE PÊCHE
    let score = "Moyen ⚠️";
    if (tideTrend.includes("Montante") && moon.includes("Pleine")) {
      score = "Excellent 🔥🎣";
    }

    output.innerHTML = `
      📍 Position détectée<br><br>
      🌡 Température : ${weather.main.temp} °C<br>
      🌥 Conditions : ${weather.weather[0].description}<br><br>
      🌊 Marée : ${h1.toFixed(2)} m (${tideTrend})<br>
      🌕 Lune : ${moon}<br><br>
      🎣 Pêche : <strong>${score}</strong>
    `;
  } catch (e) {
    output.innerText = "❌ Erreur lors du chargement";
    console.error(e);
  }
}

function getLocation() {
  const output = document.getElementById("result");

  if (!navigator.geolocation) {
    output.innerText = "❌ GPS non supporté";
    return;
  }

  output.innerText = "⏳ Recherche de la position...";

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      loadData(lat, lon);
    },
    error => {
      output.innerText = "❌ GPS refusé ou indisponible";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Optionnel : service worker pour PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}
