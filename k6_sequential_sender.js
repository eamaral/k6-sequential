import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


const numLines = 6;
const vus = 200;
const iterationsPerVU = Math.ceil(numLines / vus);

export const options = {
  discardResponseBodies: true,
  scenarios: {
    per_vu_iterations: {
      executor: "per-vu-iterations",
      vus: vus,
      iterations: iterationsPerVU,
      // maxDuration: "30m",
    },
  },
};

function generateUUID() {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const csvData = new SharedArray("CSV data", function () {
  const csvFile = open("./data.csv");
  return papaparse.parse(csvFile, { header: true }).data;
});

export default function () {
  const index = (__VU - 1) * iterationsPerVU + __ITER;

  if (index >= csvData.length) {
    console.log("Todas as mensagens foram enviadas.");
    return;
  }

  const item = csvData[index];

  let document = item.document.trim();
  if (document.length < 11) {
    document = document.padStart(11, "0");
  }

  const payload = JSON.stringify({
      event: "topic_name",
      document: document,
      decisionId: item.anyNumber,
      infoId: item.infoId,
      subInfoId: item.subInfoId,
      xValue: parseFloat(item.xValue),
      yValue: parseFloat(item.yValue),
      zValue: parseFloat(item.zValue),
      floatNumber: parseFloat(item.floatNumber),
      string: item.string,
      correlationId: generateUUID(),
      timestamp: getFormattedTimestamp(),
  });

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const res = http.post(
    "http://your-url/example",
    payload,
    { headers }
  );

  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}

export function handleSummary(data) {
  const name = "_k6_sequencial_sender";
  const fileName = "index" + name + ".html";
  return {
    [fileName]: htmlReport(data),
  };
}
