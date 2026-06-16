const https = require("https");
https.get("https://harsh-docode24.github.io/Retail-Sales-AI-Assistant/index.css", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("CSS size:", data.length);
    console.log("BOM:", data.charCodeAt(0) === 0xFEFF);
    console.log("Has view-section rule:", data.includes(".view-section"));
    console.log("Has .active rule:", data.includes(".view-section.active"));
    
    // Find the actual rules
    var lines = data.split("\n");
    lines.forEach(function(l, i) {
      if (l.includes("view-section")) {
        console.log("Line " + (i+1) + ": " + l.trim());
      }
    });
    
    // Check if there is a CSS parse error that breaks everything after it
    // Look for any weird characters
    var badChars = 0;
    for(var i = 0; i < data.length; i++) {
      var code = data.charCodeAt(i);
      if(code === 0 || (code > 127 && code < 160 && code !== 133)) {
        console.log("Bad char at pos " + i + ": charCode=" + code + " context: " + JSON.stringify(data.substring(Math.max(0,i-20), i+20)));
        badChars++;
        if(badChars > 5) break;
      }
    }
    if(badChars === 0) console.log("No bad characters in CSS");
    
    // Check first line for BOM or encoding issues
    console.log("First 100 chars:", JSON.stringify(data.substring(0, 100)));
  });
});