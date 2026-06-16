const fs = require("fs");

// Fix app.js BOM
let appjs = fs.readFileSync("app.js", "utf8");
if(appjs.charCodeAt(0) === 0xFEFF) {
  appjs = appjs.substring(1);
  console.log("Removed BOM from app.js");
}
fs.writeFileSync("app.js", appjs, "utf8");

// Fix index.css BOM too (just in case)
let css = fs.readFileSync("index.css", "utf8");
if(css.charCodeAt(0) === 0xFEFF) {
  css = css.substring(1);
  console.log("Removed BOM from index.css");
}
fs.writeFileSync("index.css", css, "utf8");

// Fix index.html BOM too
let html = fs.readFileSync("index.html", "utf8");
if(html.charCodeAt(0) === 0xFEFF) {
  html = html.substring(1);
  console.log("Removed BOM from index.html");
}
fs.writeFileSync("index.html", html, "utf8");

console.log("All BOMs removed!");
console.log("app.js first char:", appjs.charCodeAt(0), "(" + appjs[0] + ")");