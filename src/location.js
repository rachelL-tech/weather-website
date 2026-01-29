// dropdown menu function
export function initLocationDropdown() {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown) return;
    const button = dropdown.querySelector(".dropdown-toggle.current-weather__location");
    if (!button) return;

    // 初始 city：預設按鈕上的文字
    let city = (button.textContent || "").trim() || "臺北市";
    window.city = city;

    // 只在「不能 hover 的裝置」才用 click toggle，避免桌機 hover + click 狀態打架
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) {
        button.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
        });
    }
    
    // 點按鈕：開/關選單（看你 CSS 是否用 .active 控制）
    button.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
    });

    // 點選城市：swap + 存 city + 觸發事件給 API 那邊
    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const nextCity = (this.dataset.location || this.textContent || "").trim();
            const prevCity = (button.textContent || "").trim();

            // 1) UI：button 顯示新城市
            button.textContent = nextCity;

            // 2) 讓「原本被點的那個 item」變成「上一個城市」
            //    這樣新城市就不在清單裡了；臺北市也會被放回清單
            this.textContent = prevCity;
            this.dataset.location = prevCity;

            // 3) 存 city
            city = nextCity;
            window.city = city;

            // 4) 通知其他檔案（例如 api.js / main.js）去抓資料並渲染
            document.dispatchEvent(new CustomEvent("citychange", { detail: { city } }));

            // 5) 視覺回饋 + 關閉選單
            dropdown.classList.remove("active");
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        });
    });
    
    // Improve keyboard accessibility
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
}