const BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";
const AUTH = "rdec-key-123-45678-011121314";

// ==============================
// 全台縣市 → 代表觀測站（O-A0003-001）
// ==============================
const CITY_TO_STATION = {
  "臺北市": "466920",
  "新北市": "466880",
  "桃園市": "467050",
  "臺中市": "467490",
  "臺南市": "467410",
  "高雄市": "467440",

  "基隆市": "466940",
  "新竹市": "467571",
  "新竹縣": "467571",
  "苗栗縣": "467300",
  "彰化縣": "467270",
  "南投縣": "467650",
  "雲林縣": "467530",
  "嘉義市": "467480",
  "嘉義縣": "467480",
  "屏東縣": "467590",
  "宜蘭縣": "467080",
  "花蓮縣": "466990",
  "臺東縣": "467660",

  "澎湖縣": "467350",
  "金門縣": "467110",
  "連江縣": "467990",
};


function ok(renderData) {
  return { ok: true, renderData };
}
function fail(message = "無法連線到氣象資料服務，請稍後再試。") {
  return { ok: false, error: { message } };
}

async function fetchCWA(datasetId, params = {}) {
  const url = new URL(`${BASE_URL}/${datasetId}`);
  url.searchParams.set("Authorization", AUTH);
  url.searchParams.set("format", "JSON");

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json?.success !== "true") throw new Error("CWA success != true");
  return json;
}

function findEl(arr, name) {
  return arr?.find((e) => e.elementName === name) ?? null;
}
function firstVal(timeObj) {
  if (!timeObj) return null;

  // format A: elementValue: [{ value: "22" }]
  if (Array.isArray(timeObj.elementValue) && timeObj.elementValue.length > 0) {
    return timeObj.elementValue[0]?.value ?? null;
  }

  // format B: parameter: { parameterName: "多雲", parameterValue: "22" }
  const p = timeObj.parameter;
  if (p && typeof p === "object") {
    // 多數欄位（Wx/CI）會放在 parameterName
    return p.parameterName ?? p.parameterValue ?? null;
  }

  return null;
}
function safeNum(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "" || s === "--" || s === "-" ) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function getCard2RenderData(city = "臺北市") {
  try {
    const raw = await fetchCWA("F-C0032-001", { locationName: city });

    const loc = raw?.records?.location?.find(l => l.locationName === city) 
         ?? raw?.records?.location?.[0];
    const we = loc?.weatherElement ?? [];

    console.log("elementName list:", we.map(e => e.elementName));
    console.log("Wx time[0] sample:", we.find(e => e.elementName === "Wx")?.time?.[0]);

    const wxEl = findEl(we, "Wx");
    const popEl = findEl(we, "PoP");
    const ciEl = findEl(we, "CI");
    const minEl = findEl(we, "MinT");
    const maxEl = findEl(we, "MaxT");

    // time[0] 一定要有
    const wxT0 = wxEl?.time?.[0];
    if (!wxT0) throw new Error("Wx time[0] missing");

    // 其他用 time[0]
    const weatherText = firstVal(wxT0) ?? "";
    const comfortIndex = firstVal(ciEl?.time?.[0]) ?? "";
    const chanceOfRain = safeNum(firstVal(popEl?.time?.[0]));

    // Min/Max 用 time[0] + time[1] 合併（24hr）
    const min0 = safeNum(firstVal(minEl?.time?.[0]));
    const min1 = safeNum(firstVal(minEl?.time?.[1]));
    const max0 = safeNum(firstVal(maxEl?.time?.[0]));
    const max1 = safeNum(firstVal(maxEl?.time?.[1]));

    const mins = [min0, min1].filter((v) => v !== null);
    const maxs = [max0, max1].filter((v) => v !== null);

    const minT = mins.length ? Math.min(...mins) : null;
    const maxT = maxs.length ? Math.max(...maxs) : null;

    // 溫度條固定 10~35
    const RANGE_MIN = 10;
    const RANGE_MAX = 25;
    const range = RANGE_MAX - RANGE_MIN;
    const clamp = (x) => Math.min(RANGE_MAX, Math.max(RANGE_MIN, x));

    const minC = minT == null ? null : clamp(minT);
    const maxC = maxT == null ? null : clamp(maxT);

    // 用百分比（0~100）讓 CSS 算 left/width 最方便
    const barLeft =
      minC == null ? "0" : String(Math.round(((minC - RANGE_MIN) / range) * 100));
    const barWidth =
      minC == null || maxC == null
        ? "0"
        : String(Math.round(((maxC - minC) / range) * 100));

    return ok({
      minT: minT != null ? String(minT) : "--",
      maxT: maxT != null ? String(maxT) : "--",
      barLeft,
      barWidth,
      weather: weatherText,
      comfortIndex,
      chanceOfRain: chanceOfRain != null ? String(chanceOfRain) : "--",
    });
  } catch (e) {
    return fail();
  }
}

// ==============================
// forecast：7日預報（縣市）
// 使用 F-D0047-091
// ==============================

// 只留 forecast 會用到的工具
function findElByNames(arr, names) {
  for (const n of names) {
    const hit = arr?.find((e) => e.elementName === n);
    if (hit) return hit;
  }
  return null;
}

function wxToIcon(wxText = "") {
  const t = String(wxText);
  if (t.includes("雷") || t.includes("雨") || t.includes("陣雨")) return "Rainy";
  if (t.includes("雪")) return "Rainy";
  if (t.includes("陰") || t.includes("多雲") || t.includes("雲")) return "Cloudy";
  if (t.includes("晴")) return "Sunny";
  return "Cloudy";
}

// 日期工具（支援 "2026-01-28 12:00:00"）
function toDateObj(text) {
  return new Date(String(text).replace(" ", "T"));
}
function dateKey(text) {
  const d = toDateObj(text);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function mdLabel(text) {
  const d = toDateObj(text);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function weekdayZh(text) {
  const d = toDateObj(text);
  const map = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return map[d.getDay()];
}
function mode(arr) {
  const map = new Map();
  let best = null;
  let bestCount = 0;
  for (const x of arr) {
    if (!x) continue;
    const c = (map.get(x) ?? 0) + 1;
    map.set(x, c);
    if (c > bestCount) {
      bestCount = c;
      best = x;
    }
  }
  return best;
}

// ✅ 縣市版：用 city 找對應的 location
function pickForecastLocation(raw, city) {
  const list = raw?.records?.locations?.[0]?.location ?? [];
  return list.find((l) => l.locationName === city) ?? null;
}

// ==============================
// 主函式：7 日預報
// ==============================
export async function getForecastRenderData(city = "臺北市") {
  try {
    const raw = await fetchCWA("F-D0047-091", { locationName: city });

    // ✅ 091 實際路徑：records.Locations[0].Location
    const loc =
      raw?.records?.Locations?.[0]?.Location?.find((l) => l.LocationName === city);

    if (!loc) throw new Error("city not found");

    const we = loc.WeatherElement ?? [];

    // ✅ 091 實際 ElementName（中文）
    const wxEl = we.find((e) => e.ElementName === "天氣現象");
    const maxTEl = we.find((e) => e.ElementName === "最高溫度");
    const minTEl = we.find((e) => e.ElementName === "最低溫度");
    const popEl = we.find((e) => e.ElementName === "12小時降雨機率" || e.ElementName === "降雨機率");
    const wsEl  = we.find((e) => e.ElementName === "風速"); // WindSpeed :contentReference[oaicite:2]{index=2}

    if (!wxEl?.Time?.length) throw new Error("Wx missing");

    // 用 Wx 建立每日 bucket
    const days = new Map();

    for (const t of wxEl.Time) {
      const dk = dateKey(t.StartTime);
      if (!days.has(dk)) {
        days.set(dk, {
          weekday: weekdayZh(t.StartTime),
          md: mdLabel(t.StartTime),
          wxList: [],
          maxList: [],
          minList: [],
          popList: [],
          wsList: [],
        });
      }
      const wxText = t.ElementValue?.[0]?.Weather ?? "";
      days.get(dk).wxList.push(wxText);
    }

    // 把數值型資料灌進每日 bucket
    function collect(el, listName, valueKey) {
      if (!el?.Time?.length) return;
      for (const t of el.Time) {
        const dk = dateKey(t.StartTime);
        if (!days.has(dk)) continue;
        const v = safeNum(t.ElementValue?.[0]?.[valueKey]);
        if (v == null) continue;
        days.get(dk)[listName].push(v);
      }
    }

    collect(maxTEl, "maxList", "MaxTemperature");
    collect(minTEl, "minList", "MinTemperature");
    collect(popEl,  "popList", "ProbabilityOfPrecipitation");
    collect(wsEl,   "wsList",  "WindSpeed"); // :contentReference[oaicite:3]{index=3}

    // 取前 7 天
    const sortedDays = Array.from(days.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(0, 7)
      .map(([, v]) => v);

    // 組成 renderData（✅符合你指定格式）
    const renderData = {};
    for (const d of sortedDays) {
      const wxText = mode(d.wxList) ?? d.wxList.find(Boolean) ?? "";
      const icon = wxToIcon(wxText);

      const maxT = d.maxList.length ? Math.max(...d.maxList) : null;
      const minT = d.minList.length ? Math.min(...d.minList) : null;
      const pop  = d.popList.length ? Math.max(...d.popList) : null;
      const ws   = d.wsList.length
        ? Math.round((d.wsList.reduce((s, x) => s + x, 0) / d.wsList.length) * 10) / 10
        : null;

      renderData[d.weekday] = [
        d.md,
        icon,
        wxText,
        { 最高溫: maxT ?? "--", 最低溫: minT ?? "--" },
        { 降雨機率: pop ?? "--" },
        { 風速: ws ?? "--" },
      ];
    }

    return ok(renderData);
  } catch (e) {
    console.error("forecast error:", e);
    return fail();
  }
}


// ==============================
// card 1 輔助工具
// ==============================
function pickBestPoint(timeArr, targetMs) {
  let best = null;
  let bestMs = Infinity;

  for (const t of timeArr ?? []) {
    const ms = new Date(t.startTime).getTime();
    if (ms >= targetMs && ms < bestMs) {
      bestMs = ms;
      best = t;
    }
  }
  return best; // 可能為 null
}

function safeNumObs(v) {
  const n = safeNum(v);
  if (n === null) return null;
  // O-A0003-001 無資料常見值
  if (n <= -90) return null;
  return n;
}

// 用縣市取得「現在觀測溫度」（10 分鐘）
async function getNowTempByCity(city) {
  const stationId = CITY_TO_STATION[city];
  if (!stationId) return null;

  const raw = await fetchCWA("O-A0003-001");
  const stations = raw?.records?.Station ?? [];
  const st = stations.find(s => s?.StationId === stationId);
  if (!st) return null;

  // 001：WeatherElement 是 object，不是 array
  const we = st?.WeatherElement ?? {};
  return safeNumObs(we?.AirTemperature);
}

// ==============================
// card 1 主函式
// ==============================
export async function getCard1RenderData(city = "臺北市") {
  try {
    const raw = await fetchCWA("F-D0047-089", { locationName: city });

    // ✅ 正確路徑（注意大小寫）
    const loc =
      raw?.records?.Locations?.[0]?.Location?.find(l => l.LocationName === city);

    if (!loc) throw new Error("location not found");

    const we = loc.WeatherElement ?? [];

    // ✅ 089 使用中文 ElementName
    const tEl = we.find(e => e.ElementName === "溫度");
    const wxEl = we.find(e => e.ElementName === "天氣現象");

    if (!tEl?.Time?.length) throw new Error("no temperature data");

    // 對齊整點
    const base = new Date();
    base.setMinutes(0, 0, 0);

    const renderData = [];
    let nowTempFromForecast = null;

    // 取 DataTime 或 StartTime
    const getTimeMs = (t) =>
      new Date(t.DataTime ?? t.StartTime).getTime();

    const pickBestPoint089 = (arr, targetMs) => {
      let best = null;
      let bestMs = Infinity;
      for (const t of arr ?? []) {
        const ms = getTimeMs(t);
        if (ms >= targetMs && ms < bestMs) {
          bestMs = ms;
          best = t;
        }
      }
      return best;
    };

    for (let i = 0; i <= 5; i++) {
      const target = new Date(base.getTime() + i * 60 * 60 * 1000);
      const targetMs = target.getTime();

      const tPoint = pickBestPoint089(tEl.Time, targetMs);
      const wxPoint = wxEl ? pickBestPoint089(wxEl.Time, targetMs) : null;

      const temp = safeNum(
        tPoint?.ElementValue?.[0]?.Temperature
      );

      const wxText =
        wxPoint?.ElementValue?.[0]?.Weather ?? "";

      const icon = wxToIcon(wxText);

      const timeStr = i === 0
        ? "now"
        : String(target.getHours()).padStart(2, "0");

      renderData.push({
      time: timeStr,
      icon: icon,
      temp: temp != null ? String(temp) : "--"
      }); 

      // renderData[key] = [icon, temp != null ? String(temp) : "--"];

      if (i === 0) nowTempFromForecast = temp;
    }

    // 23 點後補 10 分鐘觀測
    if (nowTempFromForecast === null) {
      const obsTemp = await getNowTempByCity(city);
      if (obsTemp !== null) {
        if (renderData.length > 0) {
          renderData[0].temp = String(obsTemp);
        }
      }
    }

    return ok(renderData);
  } catch (err) {
    console.error("card1 error:", err);
    return fail();
  }
}


// ==============================
// 10 分鐘觀測（O-A0003-001）
// 回傳原始 weather 字串（不轉 icon）
// ==============================
export async function getNow10MinRenderData(city = "臺北市") {
  try {
    const stationId = CITY_TO_STATION[city];
    if (!stationId) throw new Error("No station mapping");

    const raw = await fetchCWA("O-A0003-001");
    const stations = raw?.records?.Station ?? [];
    const st = stations.find(s => s?.StationId === stationId);
    if (!st) throw new Error("Station not found");

    const we = st?.WeatherElement ?? {};

    const T = safeNumObs(we?.AirTemperature);
    const weatherText = we?.Weather ?? "";

    return {
      ok: true,
      renderData: {
        T: T != null ? String(Math.round(T)) : "--"
      },
      UIData: {
        Weather: weatherText
      }
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "無法連線到氣象資料服務，請稍後再試。"
      }
    };
  }
}