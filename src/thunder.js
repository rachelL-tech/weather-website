let thunderRequest = null; // 用來存放動畫排程 ID

function toggleThunder(show) {
    const canvas = document.getElementById("lightning-canvas");
    const container = document.querySelector(".thunder-effect");
    
    // 安全檢查：如果找不到元素，就直接退出，不要強行執行
    if (!container || !canvas) {
        console.error("找不到閃電元素！請檢查 HTML class 是否為 thunder-effect");
        return;
    }

    if (show) {
        container.style.display = "block";
        // 只有在還沒啟動過時才啟動，避免重複跑多個動畫循環
        if (!thunderRequest) {
            initLightning(canvas);
        }
    } else {
        container.style.display = "none";
        if (thunderRequest) {
            // 停止動畫迴圈
            cancelAnimationFrame(thunderRequest);
            thunderRequest = null;
        }
    }
}

function initLightning(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 單純繪製閃電的函式
    function drawStrike() {
        // 1. 閃電瞬間的白光背景
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. 隨機起點 (從頂部隨機位置)
        let sx = Math.random() * canvas.width;
        let sy = 0;
        let color = "aliceblue";

        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(sx, sy);

        // 3. 畫出曲折的閃電路徑
        while (sy < canvas.height) {
            sx += (Math.random() * 60 - 30); // 左右晃動
            sy += (Math.random() * 40);      // 向下延伸
            ctx.lineTo(sx, sy);
        }
        ctx.stroke();
    }

    function animate() {
        // 清除上一幀，保持透明
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 隨機機率觸發閃電 (約 1% 的機率)
        if (Math.random() < 0.02) {
            drawStrike();
        }

        // 設定 thunderRequest (就不會是 null 了)
        thunderRequest = requestAnimationFrame(animate);
    }

    animate();
}