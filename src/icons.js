// src/icons.js

// 這裡我們定義所有的 SVG 字串
// 這樣你的 HTML 就不會被這些落落長的代碼淹沒了
const svgLibrary = {
  // 1. 晴天
  Sunny: `
    <svg class="weather-svg spinning-sun" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="32" r="14" />
        <g>
            <line x1="32" y1="10" x2="32" y2="4" />
            <line x1="32" y1="54" x2="32" y2="60" />
            <line x1="10" y1="32" x2="4" y2="32" />
            <line x1="54" y1="32" x2="60" y2="32" />
            <line x1="16.5" y1="16.5" x2="12" y2="12" />
            <line x1="47.5" y1="16.5" x2="52" y2="12" />
            <line x1="16.5" y1="47.5" x2="12" y2="52" />
            <line x1="47.5" y1="47.5" x2="52" y2="52" />
        </g>
      </g>
    </svg>
  `,

  // 2. 陰天
  Cloudy: `
    <svg class="weather-svg floating-cloud" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M48,28c0-8.8-7.2-16-16-16c-6.8,0-12.6,4.3-15,10.4C16.4,22.1,16,22,15.5,22C9.7,22,5,26.7,5,32.5
            c0,5.8,4.7,10.5,10.5,10.5h32.5c5.5,0,10-4.5,10-10C58,32.5,53.5,28,48,28z" 
        fill="none" stroke="white" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
  `,

  // 3. 雨天
  Rainy: `
    <svg class="weather-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M48,28c0-8.8-7.2-16-16-16c-6.8,0-12.6,4.3-15,10.4C16.4,22.1,16,22,15.5,22C9.7,22,5,26.7,5,32.5
            c0,5.8,4.7,10.5,10.5,10.5h32.5c5.5,0,10-4.5,10-10C58,32.5,53.5,28,48,28z" 
        fill="none" stroke="white" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
      <g class="rain-drops">
          <line x1="20" y1="50" x2="20" y2="58" fill="none" stroke="#6fb7ff" stroke-width="3" stroke-linecap="round" />
          <line x1="32" y1="50" x2="32" y2="58" fill="none" stroke="#6fb7ff" stroke-width="3" stroke-linecap="round" />
          <line x1="44" y1="50" x2="44" y2="58" fill="none" stroke="#6fb7ff" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `,

  // 4. 雷雨 (三道黃色閃電版)
  Thunder: `
    <svg class="weather-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M48,28c0-8.8-7.2-16-16-16c-6.8,0-12.6,4.3-15,10.4C16.4,22.1,16,22,15.5,22C9.7,22,5,26.7,5,32.5
            c0,5.8,4.7,10.5,10.5,10.5h32.5c5.5,0,10-4.5,10-10C58,32.5,53.5,28,48,28z" 
        fill="none" stroke="white" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
      
      <g class="lightning-strikes" fill="none" stroke="#FCD34D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path transform="translate(-8, 4)" d="M30,36 l-6,12 h8 l-4,12 l14,-16 h-8 z" />
        <path d="M30,36 l-6,12 h8 l-4,12 l14,-16 h-8 z" />
        <path transform="translate(8, 2)" d="M30,36 l-6,12 h8 l-4,12 l14,-16 h-8 z" />
      </g>
    </svg>
  `,
};

// 我們匯出一個函式，你給它天氣名稱，它吐給你 SVG 字串
// 如果找不到對應的圖示，預設給陰天 (cloudy)
export function getIcon(weatherType) {
  return svgLibrary[weatherType] || svgLibrary.Cloudy;
}
