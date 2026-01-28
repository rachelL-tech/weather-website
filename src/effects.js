/**
 * 控制粒子層的開關
 * @param {string} id - HTML 元素的 ID (例如 'tsparticles-rain')
 * @param {object} options - 該層要使用的配置物件 (例如 rainOptions)
 * @param {boolean} show - true 為開啟，false 為關閉
 */
async function toggleParticles(id, options, show) {
    // tsParticles.dom() 會回傳目前頁面上所有的粒子實體
    const allContainers = tsParticles.dom();
    // 1. 先檢查這個 ID 目前是否已經有粒子在執行了
    // 要把 Symbol 轉換成 string 後面才能用來比對
    const currentContainer = allContainers.find(c => {
        const containerId = typeof c.id === 'symbol' ? c.id.description : c.id;
        return containerId === id;
    });

    if (show) {
        // 如果要開啟，且目前「沒在跑」，才載入
        if (!currentContainer) {
            // 確保插件已載入 (這行可以放在全域，也可以放這)
            await loadAll(tsParticles); 
            
            await tsParticles.load({
                id: id,
                options: options
            });
            console.log(`${id} 已啟動`);
        }else{
            console.warn(`⚠️ ${id} 已經在跑了，不重複啟動`);
        }
    } else {
        // 如果要關閉，且目前「正在跑」，就摧毀它
        if (currentContainer) {
            currentContainer.destroy(); // 徹底銷毀並清空畫布
            console.log(`${id} 已關閉`);
        }else{
            console.error(`❌ 找不到 id 為 "${id}" 的粒子實體！目前在跑的有:`, allContainers.map(c => c.id));
        }
    }
}


//!光圈特效
function toggleSunnyFlare(show) {
    const flare = document.getElementById("sunny-flare");
    if (!flare) return;
    
    // 直接切換 display 即可，因為 CSS 動畫不怎麼吃效能
    flare.style.display = show ? "block" : "none";
}


//!下雨特效設置
const rainOptions = {
    fpsLimit: 60,
    fullScreen: { enable: true, zIndex: -1 }, // 確保全螢幕且在底層
    particles: {
        number: {
            value: 200,
            density: { enable: true, area: 800 }
        },
        color: {
            value: "#767575" // Nord 冰藍色
        },
        shape: {
            type: "line" // 關鍵：作者範例用的就是 line
        },
        stroke: {
            width: 1,      // 關鍵：必須有寬度
            color: "#767575"
        },
        opacity: {
            value: {min: 0.1, max: 0.7}
        },
        size: {
            value: { min: 1, max: 20 }, // 決定雨絲長度，範例給到 20
            animation: { enable: false }
        },
        rotate:{
            value:110,
            random: false
        },
        move: {
            enable: true,
            speed: 30,         // 雨滴下落速度
            direction: 110,
            random: true,      // 速度隨機，增加層次
            straight: true,    // 垂直落下
            outModes: "out"    // 掉出畫面重來
        }
    },
    detectRetina: true
};

//! 晴天特效設置
const sunnyOptions = {
    // background: {
    //     /* 使用你圖片中的亮藍色漸層 */
    //     color: "#4facfe" 
    // },
    fullScreen: { enable: true, zIndex: -1 }, // 確保全螢幕且在底層
    particles: {
        number: { value: 7 }, // 雲不需要多，3-5 朵才有質感
        move: {
            enable: true,
            speed: 0.5, // 極慢速，像在散步一樣
            direction: "right", // 統一向右緩慢漂移
            outModes: "out"
        },
        shape: {
            type: "image",
            options: {
                image: [
                    { src: "/design/background/cloud1.png", width: 100, height: 100 },
                    { src: "/design/background/cloud2.png", width: 100, height: 100 },
                    { src: "/design/background/cloud3.png", width: 100, height: 100 },
                    // { src: "/design/background/cloud4.png", width: 100, height: 100 }
                ]
            }
        },
        opacity: {
            value: { min: 0.3, max: 0.6 } // 讓雲朵半透明，重疊時更有層次
        },
        size: {
            value: { min: 200, max: 400 } // 雲朵要夠大才有 Apple 那種氛圍
        }
    }
};

//! 多雲特效設置
const cloudyOptions = {
    fullScreen: { enable: true, zIndex: -1 }, // 確保全螢幕且在底層
    particles: {
        number: { value: 15 },
        move: {
            enable: true,
            speed: 0.5,
            direction: "right",
            outModes: "out"
        },
        shape: {
            type: "image",
            options: {
                image: [
                    { src: "/design/background/cloud1.png", width: 100, height: 100 },
                    { src: "/design/background/cloud2.png", width: 100, height: 100 },
                    { src: "/design/background/cloud3.png", width: 100, height: 100 },
                ]
            }
        },
        opacity: {
            value: { min: 0.3, max: 0.6 } // 讓雲朵半透明，重疊時更有層次
        },
        size: {
            value: { min: 200, max: 400 } // 雲朵要夠大才有 Apple 那種氛圍
        }
    }
};

//! 星星特效設置
const starOptions = {
    fpsLimit: 60,
    background: {
        color: "transparent" // 保持透明，背景色交給 CSS
    },
    particles: {
        number: {
            value: 300, // 星星數量
            density: { enable: true, area: 800 }
        },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: { min: 0.1, max: 1 }, // 透明度在 0.1 到 1 之間
            animation: {
                enable: true,
                speed: 3,      // 閃爍速度
                minimumValue: 0.1,
                sync: false    // 關鍵：這會讓星星「隨機」閃爍，而不是一起閃
            }
        },
        size: {
            value: { min: 1, max: 3 } // 星星要小，才有距離感
        },
        move: {
            enable: true,
            speed: 0.1, // 極慢，模擬地球自轉感
            direction: "none",
            random: true,
            straight: false,
            outModes: "out"
        }
    }
};

// // 下雨了！
// toggleParticles("tsparticles-rain", rainOptions, true);

// // 轉晴了，關掉雨，開啟雲
// toggleParticles("tsparticles-rain", null, false);
// toggleParticles("tsparticles-clouds", sunnyOptions, true);

// // 變晚上了，關掉雲，開啟星星
// toggleParticles("tsparticles-clouds", null, false);
// toggleParticles("tsparticles-stars", starOptions, true);

//! 白天晚上判斷
function isDayTime(){
    const now = new Date()
    const hour = now.getHours()
    // 假設18:00以後就是晚上
    return (hour < 18)
};


//! 背景切換區
/**
 * 切換背景底色層
 * @param {string} state - 'sunny', 'cloudy', 或 'night'
 */
function updateBackgroundColor(state) {
    const bgLayer = document.getElementById("bg-color-layer");
    if (!bgLayer) return;

    // 先移除所有狀態類別
    bgLayer.classList.remove("state-sunny", "state-cloudy", "state-night");

    // 根據傳入的狀態加上對應類別
    const className = `state-${state}`;
    bgLayer.classList.add(className);
    
    console.log(`背景已切換至: ${state}`);
}

//! 統整切換區
/**
 * 根據天氣狀態與時間，一鍵切換所有層級
 * @param {string} type - 'Sunny', 'Cloudy', 'Rainy'
 * @param {boolean} hasLightning - 是否有閃電
 */
async function updateWeatherScene(type, hasLightning = false) {
    const isDay = isDayTime(); // 呼叫你的判斷函式
    const bgLayer = document.getElementById("bg-color-layer");

    // 1. 處理背景底色與光圈 (D區 + A區)
    if (isDay) {
        // 白天邏輯
        if (type === 'Rainy' || type === 'Cloudy') {
            bgLayer.className = 'state-cloudy'; // 變灰
            toggleSunnyFlare(false);
        } else {
            bgLayer.className = 'state-sunny'; // 變藍
            toggleSunnyFlare(true);
        }
    } else {
        // 晚上邏輯
        bgLayer.className = 'state-night'; // 變深藍
        toggleSunnyFlare(false);
    }

    // 2. 處理粒子層級 (A/B/D區)
    // 雲層 (A區)：晴天用少雲，多雲/雨天用多雲
    const cloudOpts = (type === 'Sunny') ? sunnyOptions : cloudyOptions;
    await toggleParticles("tsparticles-clouds", cloudOpts, true);

    // 雨水層 (B區)：只有 Rainy 時開啟
    await toggleParticles("tsparticles-rain", rainOptions, type === 'Rainy');

    // 星星層 (D區)：只有晚上且非 Rainy 時開啟 (Apple 天氣通常雨天看不見星星)
    await toggleParticles("tsparticles-stars", starOptions, !isDay && type !== 'Rainy');

    // 3. 處理閃電層 (C區)
    toggleThunder(hasLightning);
}

// 測試切換
const UIData = {
      "Weather": "陰有雨" // 不用切，回傳整個Weather字串
    }

// 天氣邏輯判斷
function generateWeatherParam(Weather){
    const params = {}
    // 先判斷第一個字串決定雲量
    if (Weather[0].includes("晴")){
        params.cloud = "sunny"
        params.sky = "blue"
    }else if (Weather[0].includes("陰")){
        params.cloud = "cloudy"
        params.sky = "gray"
    }else{
        params.cloud = "cloudy"
        params.sky = "blue"
    }

    // 判斷打雷＆下雨
    params.hasLightning = (Weather.includes("電")||Weather.includes("雷"))

    params.rainy = Weather.includes("雨")
}