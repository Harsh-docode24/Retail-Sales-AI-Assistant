const https = require("https");
https.get("https://harsh-docode24.github.io/Retail-Sales-AI-Assistant/app.js", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    // Check BOM
    if(data.charCodeAt(0) === 0xFEFF) {
      console.log("BOM FOUND! This is the problem!");
      console.log("First 3 chars:", data.charCodeAt(0), data.charCodeAt(1), data.charCodeAt(2));
    }
    
    // Try to eval line by line to find where it crashes
    var lines = data.split("\n");
    var cumulative = "";
    for(var i = 0; i < lines.length; i++) {
      cumulative += lines[i] + "\n";
      try {
        new Function(cumulative);
      } catch(e) {
        if(e instanceof SyntaxError) {
          // Check if it is just incomplete (expected)
          if(!e.message.includes("Unexpected end of input") && !e.message.includes("Unexpected token '}'")) {
            console.log("REAL SYNTAX ERROR at line " + (i+1) + ": " + e.message);
            console.log("Line content: " + lines[i].substring(0, 120));
            break;
          }
        }
      }
    }
    console.log("Scanned", lines.length, "lines");
    
    // Final full check
    try {
      new Function(data);
      console.log("Full syntax: VALID");
    } catch(e) {
      console.log("Full syntax ERROR:", e.message);
    }
  });
});