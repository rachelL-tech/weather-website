// 引入渲染工具
import { renderHourlyForecast, renderDailySummary,renderForecast,renderCurrentWeather, renderLocationPopup } from './render.js';
import { getCard1RenderData, getCard2RenderData, getNow10MinRenderData,getForecastRenderData, get10MinLatLonCounty } from './api.js';
import { initLocationDropdown, setupGeoButton, findNearestStation } from './location.js';

// 跳轉頁面
const homePageBtn = document.getElementById('homePageBtn');
const forecastPageBtn = document.getElementById('forecastPageBtn');

function goTo(page) {
  const url = new URL(page, window.location.href);
  url.searchParams.set("city", window.city);
  window.location.href = url.toString();
}

function getCityFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("city");
}

if (forecastPageBtn) {
  forecastPageBtn.addEventListener('click', () => {
    goTo("forecast.html");
  });
}

if (homePageBtn) {
  homePageBtn.addEventListener('click', () => {
    goTo("index.html");
  });
}

function bindButtonSpin() {
  // focus button popover toggle 時加 is-open ，讓他旋轉（寫在is-open）
  const btn = document.querySelector("#location-popover__trigger");
  const pop = document.querySelector("#location-popover");

  if (!btn && !pop) return;

  // Popover API：會在開/關時觸發 toggle event
  pop.addEventListener("toggle", (e) => {
    // e.newState: "open" | "closed"
    btn.classList.toggle("is-open", e.newState === "open");
  });
}

async function renderData(city) {
  const CurrentWeather_Data = await getNow10MinRenderData(city);
  renderCurrentWeather(CurrentWeather_Data);

  const card1_Data = await getCard1RenderData(city);
  renderHourlyForecast(card1_Data);

  const card2_Data = await getCard2RenderData(city);
  renderDailySummary(card2_Data);

  const forecast_Data = await getForecastRenderData(city);
  renderForecast(forecast_Data);
  // 如果是在預測頁面，另外渲染背景
  if (document.querySelector(".screen.forecast")){
    console.log("目前背景天氣", CurrentWeather_Data.UIData?.Weather)
    WeatherManager.update(CurrentWeather_Data.UIData?.Weather);
  }
}

function init() {
  window.city = getCityFromUrl() || "臺北市";
  renderData(window.city);

  // 監聽使用者點擊選單
  document.addEventListener("citychange", async (e) => {
    const city = e.detail.city;
    renderData(city);
  });

  initLocationDropdown();

  bindButtonSpin();
  
  setupGeoButton({
      onSuccess: async ({ lat, lon }) => {
      const stations = await get10MinLatLonCounty();
      const nearestStationData = findNearestStation({ lat, lon }, stations);
      console.log("最近測站資料：", nearestStationData);
      
      renderLocationPopup(nearestStationData);
    },
  });
}

init();