const https = require("https");
https.get("https://harsh-docode24.github.io/Retail-Sales-AI-Assistant/", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("HTML size:", data.length);
    console.log("Has dashboard-view:", data.includes('id="dashboard-view"'));
    console.log("Has chat-view:", data.includes('id="chat-view"'));
    console.log("Has inventory-view:", data.includes('id="inventory-view"'));
    console.log("Has orders-view:", data.includes('id="orders-view"'));
    console.log("Has kpi-grid:", data.includes('id="kpi-grid"'));
    console.log("Has view-section class:", data.includes('class="view-section"'));
    console.log("CSS linked:", data.includes("index.css"));
    console.log("JS linked:", data.includes("app.js"));
    console.log("BOM:", data.charCodeAt(0) === 0xFEFF);
    console.log("First 200 chars:", JSON.stringify(data.substring(0,200)));
  });
});