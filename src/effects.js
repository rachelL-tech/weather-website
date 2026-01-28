//! v3
const rainOptions = {
    fpsLimit: 60,
    background: {
        color: "#2e3440", // Nord 深色背景
        opacity: 0.7
    },
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

const sunnyOptions = {
    background: {
        /* 使用你圖片中的亮藍色漸層 */
        color: "#4facfe" 
    },
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

async function startRainyEffect() {
    await loadAll(tsParticles); // 確保套件已載入

    await tsParticles.load({
        id: "tsparticles",
        options: rainOptions
    });
    const rainyBackground = document.getElementById("tsparticles")
    rainyBackground.style.display = "block"
}

async function startSunnyEffect() {
    await loadAll(tsParticles); // 確保套件已載入

    await tsParticles.load({
        id: "tsparticles",
        options: sunnyOptions
    });
    const rainyBackground = document.getElementById("tsparticles")
    rainyBackground.style.display = "block"
}

// startRainyEffect()
startSunnyEffect()

function stopRainyEffect(){
    const rainyBackground = document.getElementById("tsparticles")
    tsParticles.domItem(0).destroy()
    rainyBackground.style.display = "none"
}
// 記得在切換天氣效果前，先呼叫 tsParticles.domItem(0).destroy() 來釋放記憶體，避免 Demo 時電腦越跑越燙