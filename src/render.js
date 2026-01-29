// Card 1
import { getIcon } from './icons.js'; // 引入函式

export function renderHourlyForecast(hoursData, selector = '.hourly-forecast') {
  const container = document.querySelector(selector);

  if (!container) return;

  // 假資料 (以後從 API 抓)
  // hoursData = [
  //   { time: '現在', temp: '23°C', type: 'rainy' },
  //   { time: '00', temp: '21°C', type: 'rainy' },
  //   { time: '01', temp: '20°C', type: 'thunder' },
  //   { time: '02', temp: '20°C', type: 'cloudy' },
  //   { time: '03', temp: '23°C', type: 'sunny' },
  //   { time: '04', temp: '26°C', type: 'sunny' },
  // ];

  let html = '';

  // 呼叫 getIcon(item.type) 拿到 SVG 字串
  const list = hoursData.renderData || [];
  list.forEach((item) => {
      // item 裡面直接就有 time, icon, temp
      html += `
          <div class="hourly-forecast__item value-text">
              <div class="hourly-forecast__time label-text">${item.time}</div>
              <div class="icon">
                  ${getIcon(item.icon)}
              </div>
              <div class="hourly-forecast__temp value-text">${item.temp}°C</div>
          </div>
      `;
    });


  container.innerHTML = html;
}

// Card 2
/**
 * @param {Object} data - API 回傳的資料
 */
export function renderDailySummary(data) {
  const errorEl = document.getElementById('c2-error');
  const forecastRow = document.getElementById('c2-row');
  const highLights = document.getElementById('c2-highlights');
  const container = document.querySelector('.temp-bar');

  if (!container) return;

  // 資料失敗的情況
  if (!data.ok) {
    forecastRow.classList.add('is-hidden');
    highLights.classList.add('is-hidden');
    errorEl.classList.remove('is-hidden');
    errorEl.textContent = data.error.message;
    return;
  }

  // 資料成功的情況
  highLights.classList.remove('is-hidden');
  forecastRow.classList.remove('is-hidden');
  errorEl.classList.add('is-hidden');

  // 解構資料
  const { minT, maxT, barLeft, barWidth, weather, comfortIndex, chanceOfRain } = data.renderData;
  // 填入資料
  document.getElementById('c2-min').textContent = minT + '°C';
  document.getElementById('c2-max').textContent = maxT + '°C';
  document.getElementById('c2-weather').textContent = weather;
  document.getElementById('c2-comfort').textContent = comfortIndex;
  document.getElementById('c2-rain').textContent = chanceOfRain + '%';
  //
  const currentWeatherText = document.querySelector('.current-weather__text');
  console.log(data.renderData.weather)
  currentWeatherText.textContent = data.renderData.weather

  // CSS 樣式控制
  const barEl = document.getElementById('c2-bar');
  barEl.style.left = barLeft + '%';
  barEl.style.width = barWidth + '%';
}

// // 假資料 (以後從 API 抓)
// const fakeData = {
//   ok: true,
//   renderData: {
//     minT: 18,
//     maxT: 32,
//     barLeft: '25', // 模擬算出 25%
//     barWidth: '40', // 模擬算出 40%
//     weather: '雷陣雨',
//     comfortIndex: '悶熱',
//     chanceOfRain: 60,
//   },
// };

// // 假資料 (以後從 API 抓)
// const fakeErrorData = {
//   ok: false,
//   error: {
//     message: '無法連線到氣象資料服務，請稍後再試。',
//   },
// };

// renderForecast

export function renderForecast(data,selector = '.forecast-list'){
  const container = document.querySelector(selector);
  const subtitle = document.querySelector(".subtitle");
  if (!container) return;

  if(!data || !data.renderData){
    container.innerHTML = '<div class = "error">暫無預報資料</div>';
    return
  } 

  subtitle.textContent = data.renderData[city];

  const forecastList = Object.entries(data.renderData);

  let html = '';

  forecastList.pop();

  forecastList.forEach(([weekday,values])=>{

    const dataStr = values[0];
    const iconType = values[1];
    const conditionText = values[2];

    const tempObj = values[3] || {};
    const maxT = tempObj['最高溫'] ?? '--';
    const minT = tempObj['最低溫'] ?? '--';

    const popObj = values[4] || {};
    const pop = popObj['降雨機率'] ?? '--';
    const popDisplay = pop === '--' ? '--' : `${pop}%`;
    
    const windObj = values[5] || {};
    const wind = windObj['風速'] ?? '--';

    html += `
      <article class = "forecast-list__row">

        <div class="day-item">
          <div class="day-item__weekday label-text">${weekday}</div>
          <div class="day-item__date value-text">${dataStr}</div>
        </div>

        <div class="forecast-list__icon">
          ${getIcon(iconType)}
        </div>

        <div class="forecast-list__condition value-text">${conditionText}</div>

        <div class="forecast-list__metrics">

          <div class="weather-metric">
            <div class="weather-metric__label label-text">高溫 / 低溫</div>
            <div class="weather-metric__value value-text">${maxT}° / ${minT}°</div>
          </div>

          <div class="weather-metric">
            <div class="weather-metric__label label-text">降雨機率</div>
            <div class="weather-metric__value value-text">${popDisplay}</div>
          </div>

          <div class="weather-metric">
            <div class="weather-metric__label label-text">風速</div>
            <div class="weather-metric__value value-text">${wind}m/s</div>
          </div>

        </div>
      </article>
    `;
  });
  container.innerHTML = html;
}

//  renderCurrentWeather
export function renderCurrentWeather(data){
  const tempEL = document.querySelector('.current-weather__temp');

  if (!tempEL || !data || !data.renderData) 
    return;

  const temp = data.renderData.T;
  tempEL.textContent = `${temp}°C`

  const weatherText = data.UIData?.Weather;
  console.log("目前背景天氣", weatherText)

  //在這邊切換背景
  WeatherManager.update(weatherText);
}

// renderLocationPopup
export function renderLocationPopup(data){
  const popUp = document.querySelector(".location-popup__container")
  if (!popUp) return
  popUp.innerHTML = `<h4>📍 即時位置資訊</h4>
      <p>離您最近的觀測站是：
        <span class="location-popup__staion-name">${data.StationName}</span>
      </p>
      <ul class="location-popup__info">
        <li>🌦️ 天氣狀況｜${data.Weather}</li>
        <li>🌡️ 目前溫度｜${data.AirTemperature}</li>
        <li>💧 相對濕度｜${data.RelativeHumidity}%</li>
        <li>☀️ 紫外線指數｜${data.UVIndex}</li>
      </ul>`
}