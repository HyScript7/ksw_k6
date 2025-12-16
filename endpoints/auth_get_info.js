import url from "../utils/urls.js";
import signIn from "../utils/session.js";

import http from "k6/http";
import { sleep, check, fail } from "k6";

export function setup() {
  let data = {};
  try {
    data.token = signIn();
  } catch (e) {
    data.token = null;
  }
  return data;
}

export const options = {
  vus: 10,
  duration: "10s",
};

export default function (data) {
  var token = data.token;
  if (token === null) {
    fail("Could not fetch token");
  }
  let res = http.get(url("/auth/info"), {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "../report/summary.html": htmlReport(data),
  };
}
