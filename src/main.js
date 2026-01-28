//在src/裡面創建config.js檔案 內容只要包含下面一行就可以
//export const CWA_API_KEY = "CWA-953B2897-2C88-45A0-85EF-0059DB66235E";
// .gitignore裡面加上 src/config.js 這串讓她不會被推到github上

// 要在js中使用 api的話要引入
// import { getCard2RenderData } from "./api.js";
// 如果是要在 例如index.html引入(應該不會 可能用js render就好) 要用下面的
// <script type="module" src="./src/main.js"></script>
