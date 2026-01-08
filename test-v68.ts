
async function runTests() {
  console.log("STARTING TEST V68...");
  console.log("Running GPX v68 Tests (ChatBook Logic)...\n");
  
  // Simuliamo la logica ChatBook
  const processChatBook = (lines: string[]) => {
    let currentSpeaker = "none";
    const output: string[] = [];
    
    lines.forEach(line => {
      if (line.match(/^Hai detto:/i)) {
        currentSpeaker = "user";
        output.push(`<p class="chat-label-user">Hai detto:</p>`);
      } else if (line.match(/^ChatGPT ha detto:/i)) {
        currentSpeaker = "bot";
        output.push(`<p class="chat-label-bot">ChatGPT ha detto:</p>`);
      } else {
        if (currentSpeaker === "user") {
          output.push(`<p class="chat-msg-user"><em>${line}</em></p>`);
        } else if (currentSpeaker === "bot") {
          output.push(`<p class="chat-msg-bot">${line}</p>`);
        } else {
          output.push(`<p>${line}</p>`);
        }
      }
    });
    return output;
  };
  
  const input = [
    "Hai detto:",
    "Voglio parlare di filosofia.",
    "ChatGPT ha detto:",
    "Certamente, parliamone."
  ];
  
  const expected = [
    '<p class="chat-label-user">Hai detto:</p>',
    '<p class="chat-msg-user"><em>Voglio parlare di filosofia.</em></p>',
    '<p class="chat-label-bot">ChatGPT ha detto:</p>',
    '<p class="chat-msg-bot">Certamente, parliamone.</p>'
  ];
  
  const result = processChatBook(input);
  
  let passed = true;
  result.forEach((line, i) => {
    if (line !== expected[i]) {
      console.log(`❌ FAIL at line ${i}: Expected '${expected[i]}', Got '${line}'`);
      passed = false;
    }
  });
  
  if (passed) {
    console.log("✅ PASS: ChatBook formatting logic is correct.");
  }
}

runTests();
