import http from "k6/http";
import url from "./urls.js";
import signIn from "../utils/session.js";

export default function getRootFolder() {
  var request = http.get(url("/folders/"), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + signIn(),
    },
  });

  if (request.status !== 200) {
    console.log("Could not fetch root folder: " + request.status);
    return null;
  }
  try {
    const body = JSON.parse(request.body).id;
    console.log("Root folder fetched: " + body);
    return body;
  } catch (e) {
    console.log("Could not root folder: invalid response body");
    return null;
  }
}
