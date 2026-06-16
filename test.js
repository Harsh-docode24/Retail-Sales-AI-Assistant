const https = require("https");
https.get("https://harsh-docode24.github.io/Retail-Sales-AI-Assistant/app.js", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("File size:", data.length);
    
    // Simulate minimal DOM
    const mockEl = { innerHTML: "", value: "", style: {}, scrollTop: 0, scrollHeight: 0,
      addEventListener: () => {}, classList: { add:()=>{}, remove:()=>{}, toggle:()=>{}, contains:()=>false },
      appendChild: () => {}, querySelectorAll: () => [], querySelector: () => mockEl,
      getBoundingClientRect: () => ({width:800}), getContext: () => null, parentElement: {getBoundingClientRect:()=>({width:800})}
    };
    const mockDoc = {
      querySelectorAll: () => [],
      querySelector: () => mockEl,
      getElementById: (id) => { console.log("  getElementById:", id); return mockEl; },
      createElement: () => mockEl,
      addEventListener: (ev, fn) => { 
        if(ev === "DOMContentLoaded") {
          console.log("\nRunning DOMContentLoaded...");
          try { fn(); console.log("DOMContentLoaded: SUCCESS"); }
          catch(e) { console.log("DOMContentLoaded ERROR:", e.message, "\n  at:", e.stack.split("\n")[1]); }
        }
      }
    };
    
    try {
      const fn = new Function("document", "window", data);
      fn(mockDoc, {devicePixelRatio: 1});
    } catch(e) {
      console.log("Runtime ERROR:", e.message);
      console.log("Stack:", e.stack.split("\n").slice(0,3).join("\n"));
    }
  });
});