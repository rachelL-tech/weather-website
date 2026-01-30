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
        // 如果已經在跑了，先銷毀它，確保能套用新的 options (如雲量變化)
        if (currentContainer) {
            currentContainer.destroy();
            // console.log(` ${id} 重新配置中...`);
        }
        await loadAll(tsParticles); 
        
        await tsParticles.load({
            id: id,
            options: options
        });
        // console.log(`${id} 已啟動`);
    } else {
        // 如果要關閉，且目前「正在跑」，就摧毀它
        if (currentContainer) {
            currentContainer.destroy(); // 徹底銷毀並清空畫布
            // console.log(`${id} 已關閉`)
        }
    }
}


/**
 *  光圈特效開關
 * @param {boolean} show - true 為開啟，false 為關閉
 */
function toggleSunnyFlare(show) {
    const flare = document.getElementById("sunny-flare");
    if (!flare) return;
    
    // 直接切換 display 即可，因為 CSS 動畫不怎麼吃效能
    flare.style.display = show ? "block" : "none";
}

// 所有粒子特效的參數
const particlesOptions = {
    rain:{
        fpsLimit: 60,
        fullScreen: { enable: true, zIndex: 0},
        particles: {
            number: {
                value: 300,
                density: { enable: true, area: 800 }
            },
            color: {
                value: "#E1DEEE" // Nord 冰藍色
            },
            shape: {
                type: "line" // 關鍵：作者範例用的就是 line
            },
            stroke: {
                width: 0.3,      // 關鍵：必須有寬度
                color: "#E1DEEE"
            },
            opacity: {
                value: { min: 0.1, max: 0.5}, // 透明度在 0.1 到 1 之間
                animation: {
                    enable: true,
                    speed: 1,      // 閃爍速度
                    minimumValue: 0.1,
                    sync: false    // 隨機閃爍
                }
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
                speed: 20,         // 雨滴下落速度
                direction: 110,
                random: true,      // 速度隨機，增加層次
                straight: true,    // 垂直落下
                outModes: "out"    // 掉出畫面重來
            }
        },
        detectRetina: true
    },
    sunny:{
        // background: {
        //     color: "#4facfe"  // 天藍色
        // },
        fullScreen: { enable: true, zIndex: 2},
        particles: {
            number: { value: 7 }, 
            move: {
                enable: true,
                speed: 0.5, // 極慢速，
                direction: "right", // 向右
                outModes: "out"
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        { src: "./design/background/cloud1.png", width: 100, height: 100 },
                        { src: "./design/background/cloud2.png", width: 100, height: 100 },
                        { src: "./design/background/cloud3.png", width: 100, height: 100 },
                        // { src: "./design/background/cloud4.png", width: 100, height: 100 }
                    ]
                }
            },
            opacity: {
                value: { min: 0.4, max: 0.6 } // 讓雲朵半透明，重疊時更有層次
            },
            size: {
                value: { min: 200, max: 400 }
            }
        }
    },
    cloudy:{
        fullScreen: { enable: true, zIndex: 2},
        particles: {
            number: { value: 18 },
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
                        { src: "./design/background/cloud1.png", width: 100, height: 100 },
                        { src: "./design/background/cloud2.png", width: 100, height: 100 },
                        { src: "./design/background/cloud3.png", width: 100, height: 100 },
                    ]
                }
            },
            opacity: {
                value: { min: 0.4, max: 0.8 }
            },
            size: {
                value: { min: 200, max: 400 }
            }
        }
    },
    stars:{
        fullScreen: { enable: true, zIndex: 0},
        fpsLimit: 60,
        background: {
            color: "transparent" // 保持透明，背景色交給 CSS
        },
        particles: {
            number: {
                value: 150, // 星星數量
                density: { enable: true, area: 800 }
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: { min: 0.1, max: 0.6}, // 透明度在 0.1 到 1 之間
                animation: {
                    enable: true,
                    speed: 1,      // 閃爍速度
                    minimumValue: 0.1,
                    sync: false    // 隨機
                }
            },
            size: {
                value: { min: 1, max: 3 }
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
    }
}

//! 白天晚上判斷
function isDayTime(){
    const now = new Date()
    const hour = now.getHours()
    // 假設18:00以後就是晚上
    if (hour > 5 && hour < 18){
        return true
    }
    return false //TODO 可以更動這個函式的回傳直來測試 白天/夜間 模式
};


// 天氣特效控制中心(總開關)
// !WeatherManager物件
const WeatherManager = {

    //! 解析 API 天氣字串並轉換為前端特效參數
    // 傳入參數：字串 , 輸出：參數集合物件（給update函式使用）
    parseTextToParams(weatherText = "") { //預設空字串，避免API沒有回傳天氣字串
        const isDay = isDayTime();
        const text = weatherText || ""; // 雙重保險

        // 預設值
        const params = {
            cloud: "sunny",       // 雲量設定
            sky: isDay ? "blue" : "night", // 天色設定(背景) blue, gray, night
            rainy: weatherText.includes("雨"), // 雨水開關
            hasLightning: (weatherText.includes("電") || weatherText.includes("雷")) ,  // 閃電開關
            stars: false,         // 星空開關
            sunFlare: false,       // 太陽光環開關
            time: isDay ? "day" : "night" // 整合時間判斷
        };

        // 如果 API 沒給文字，就回傳上面這套基本的「晴天/夜晚」預設值
        if (!text) return params

        // 雲量及天色判斷
        if (text.includes("陰") || text.includes("多雲")) {
            params.cloud = "cloudy";
            // if (isDay && !text.includes("晴")) params.sky = "gray"; 
            if (isDay && text.includes("陰")) params.sky = "gray"; // 改成只有陰天才是灰天空
        }

        if (text.includes("晴") && isDay) {
            params.sky = "blue";
            params.sunFlare = true;
            params.cloud = "sunny";
        }

        // 星空判斷
        if (!isDay && text.includes("晴") && !params.rainy) {
            params.stars = true;
        }

        return params;
    },


    //! 主進入點：執行完整特效更新
    async update(rawWeatherText) {
        // 從API回傳的字串解析出參數
        const params = this.parseTextToParams(rawWeatherText); // 利用工具函式解析字串
        
        // 這裡的 this 指向 WeatherManager 本身
        this.setBaseBackground(params.sky); // 利用工具函式切換背景
        
        // 天體開關 (光圈/星星)
        toggleSunnyFlare(params.sunFlare);
        await toggleParticles("tsparticles-stars", particlesOptions.stars, params.stars);

        // 雲朵層
        const cloudConfig = params.cloud === "cloudy" ? particlesOptions.cloudy : particlesOptions.sunny;
        await toggleParticles("tsparticles-clouds", cloudConfig, true);

        // 雨水與閃電
        await toggleParticles("tsparticles-rain", particlesOptions.rain, params.rainy);
        toggleThunder(params.hasLightning);
    },

    //!專門處理 CSS Class 的小工具
    setBaseBackground(sky) {
        const bgLayer = document.getElementById("bg-color-layer");
        if (!bgLayer) return;
        bgLayer.className = `state-${sky}`;
    }
};

// 雲朵圖片預載
function preLoadCloudImg(){
    const cloudUrls = [
        "./design/background/cloud1.png", 
        "./design/background/cloud2.png", 
        "./design/background/cloud3.png"]
    
    cloudUrls.forEach(url =>{
        const image = new Image()
        image.src = url
    })
}


// 預設模式：晴
function initDefalueBackground(Wx){
    preLoadCloudImg()
    WeatherManager.update(Wx) 
}
initDefalueBackground("晴")//預設晴天