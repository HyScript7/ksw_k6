import config from "../config.js";

export default function url(path) {
  if (!config.baseUrl) console.error("No base URL set in config.js");
  var url = config.baseUrl;
  url += path;
  return url;
}
