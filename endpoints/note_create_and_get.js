import url from "../utils/urls.js";
import signIn from "../utils/session.js";
import getRootFolder from "../utils/folder.js";

import http from "k6/http";
import { sleep, check, fail } from "k6";

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export function setup() {
  let data = {};
  try {
    data.token = signIn();
    data.root = getRootFolder();
  } catch (e) {
    data.token = null;
    data.root = null;
  }
  return data;
}

export const options = {
  vus: 10,
  duration: "10s",
};

export default function (data) {
  var token = data.token;
  var root = data.root;
  if (token === null) {
    fail("Could not fetch token");
  }
  if (root === null) {
    fail("Could not fetch root folder ID");
  }
  let res = http.post(
    url("/notes/create"),
    JSON.stringify({
      folderId: root,
      name: randomString(64),
      content: "string",
    }),
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    },
  );
  check(res, { "creation succeeds": (res) => res.status === 200 });
  let body = JSON.parse(res.body);
  let res2 = http.get(url("/notes/" + body.id), {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  check(res2, { "note can be querried": (res) => res.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./report/summary.html": htmlReport(data),
  };
}
