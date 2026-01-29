// 引入渲染工具
import { renderHourlyForecast, renderDailySummary,renderForecast,renderCurrentWeather } from './render.js';
import { getCard1RenderData, getCard2RenderData, getNow10MinRenderData,getForecastRenderData, get10MinLatLonCountyTemp } from './api.js';
import { initLocationDropdown } from './location.js';

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

// const now_Data = await getNow10MinRenderData("臺北市");

const data = await get10MinLatLonCountyTemp();
console.log(data);

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
}

function init() {
  renderData();

  // 監聽使用者點擊選單
  document.addEventListener("citychange", async (e) => {
    const city = e.detail.city;
    renderData(city);
  });
  initLocationDropdown();
}

init();