# iWeather 即時天氣動態 
**網址**：
<a>https://rachell-tech.github.io/weather-website/index.html</a>

**demo** 

![iWeather Website](https://github.com/user-attachments/assets/9eada284-18f1-4ad4-93dc-dda4ab023bc1)
![iWeather Website](https://youtu.be/cSlalXol9Vw?si=8Ls1AFWXjKYQx7Dk)

## 1. 概念發想
參考 apple 內建的 weather app 「磨砂玻璃 (Glassmorphism)」、 dribbble 網站上的UI設計，透過中央氣象局 API 取得即時及未來天氣資訊，並渲染進卡片。

![ios weather app](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/71/26/fa/7126fafa-a1b6-7e28-00ef-efe833157418/iPhone-Location-1320x2868.png/460x998bb.webp)

![](https://cdn.dribbble.com/userupload/3883602/file/original-cd199332bb9c727827b68ca1db5e49b7.jpg?resize=1504x1027&vertical=center)
<a>https://dribbble.com/shots/19740043-Daily-UI-037-Weather</a>

## 2. 團隊分工
本次開發因為僅有4天，時程緊湊，採全前端模式，並利用 github page 部署上線。

* 映叡
    * UI/UX 藍圖
    * API 結構定義
    * Git 管理
    * 頁面功能整合、debug
    * 首頁定位功能發想

* 佳弘
    * API Fetch 資料抓取及清洗
    * Datetime 邏輯判斷

* 竣鵬
    * API 資料串接與渲染
    * RWD
    * 前端介面開發
    * CSS 架構模組化

* 元鴻
    * 天氣即時背景特效
    * 背景切換邏輯
    * UI/UX優化
    * Demo資料串接及模擬器

## 3. 使用技術
HTML、CSS、JavaScript、tsParticles、HTML canvas

## 4. 主要功能介紹
### 首頁（index.html）
* 基本功能
| 位置  | 說明 |
| ------------- |:-------------:|
| 左側      | 10分鐘內溫度及天氣狀況。預設城市為臺北市。     |
| 右上      | 從現在到未來五小時，每小時的天氣狀況。     |
| 右下      | 36小時內天氣摘要。     |

* 客製化功能
| 名稱  | 說明 |
| ------------- |:-------------:|
| 城市選單（dropdown menu）| 方便使用者了解該城市天氣狀況。使用者點擊選單中任一城市，會同步渲染首頁及未來 7 日頁面的所有卡片。|
| 經緯度定位（dropdown menu）| 經使用者同意取得其所在位置的經緯度後，利用畢氏定理計算離使用者最近觀測站，並顯示該觀測站10分鐘內的重要天氣資訊，包含：天氣狀況、目前溫度、相對濕度、紫外線指數。|

### 未來 7 日頁面（forcast.html）
未來 7 日天氣預報，包含星期幾、日期、天氣描述、最高溫＆最低溫、降雨機率、風速。

### 網站動態背景
動態背景分為以下幾層結構組成：

* 天色 - 藍/灰/深藍 ｜CSS

* 雲量 - 正常/多雲 ｜tsParticles

* 閃電 - 有/無 ｜HTML canvas

* 雨滴 - 有/無 ｜tsParticles

* 星星 - 有/無 ｜tsParticles

* 光圈 - 有/無 ｜CSS

透過API回覆的天氣描述來判斷各層的設置及開關。

##  5. 參考連結
* 初始UI設計：<a>https://dribbble.com/shots/19740043-Daily-UI-037-Weather</a>
* dropdown menu：<a>https://codepen.io/bogdansandu/pen/Pwzbbwa</a>
* 閃電特效：<a>https://codepen.io/mnald12/pen/RwvbvLq</a>


## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![ios weather app](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/71/26/fa/7126fafa-a1b6-7e28-00ef-efe833157418/iPhone-Location-1320x2868.png/460x998bb.webp)

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

```
let message = 'Hello world';
alert(message);
```

## Inline code

This web site is using `markedjs/marked`.
