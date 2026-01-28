import { CWA_API_KEY } from "./config.js";
const BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";
const AUTH = CWA_API_KEY;

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

export async function getCard2RenderData(city) {
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

    // 溫度條固定 0~45
    const RANGE_MIN = 0;
    const RANGE_MAX = 45;
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