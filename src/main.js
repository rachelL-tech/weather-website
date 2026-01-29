// 引入渲染工具
import { renderHourlyForecast, renderDailySummary,renderForecast,renderCurrentWeather, renderLocationPopup } from './render.js';
import { getCard1RenderData, getCard2RenderData, getNow10MinRenderData,getForecastRenderData, get10MinLatLonCounty } from './api.js';
import { initLocationDropdown, setupGeoButton, findNearestStation } from './location.js';

// 跳轉頁面
const homePageBtn = document.getElementById('homePageBtn');
const forecastPageBtn = document.getElementById('forecastPageBtn');

if (forecastPageBtn) {
  forecastPageBtn.addEventListener('click', () => {
    window.location.href = 'forecast.html';
  });
}

if (homePageBtn) {
  homePageBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

async function renderData(city = "臺北市") {
  const CurrentWeather_Data = await getNow10MinRenderData(city);
  console.log(CurrentWeather_Data);
  renderCurrentWeather(CurrentWeather_Data);

  const card1_Data = await getCard1RenderData(city);
  console.log(card1_Data);
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
  renderData();

  // 監聽使用者點擊選單
  document.addEventListener("citychange", async (e) => {
    const city = e.detail.city;
    renderData(city);
  });

  initLocationDropdown();
  
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