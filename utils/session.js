import http from "k6/http";
import url from "./urls.js";
import config from "../config.js";

export default function signIn() {
  var request = http.post(url("/auth/login"), JSON.stringify(config.testUser), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (request.status !== 200) {
    console.log("Could not fetch token: " + request.status);
    return null;
  }
  try {
    const body = JSON.parse(request.body).token;
    console.log("Token fetched: " + body);
    return body;
  } catch (e) {
    console.log("Could not fetch token: invalid response body");
    return null;
  }
}
