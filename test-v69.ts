
async function runTests() {
  console.log("STARTING TEST V69...");
  console.log("Running GPX v69 Tests (ChatBook Inline Logic)...\n");
  
  // Simuliamo la logica di pre-processing
  const preprocessChatBook = (content: string) => {
    return content.replace(/(.*?)(Hai detto:|ChatGPT ha detto:)/gi, (match, before, marker) => {
      if (before && before.trim().length > 0 && !before.endsWith('\n')) {
        return `${before}\n${marker}`;
      }
      return match;
    });
  };
  
  const input = "Bla bla bla. Hai detto: Ciao. Altro testo. ChatGPT ha detto: Risposta.";
  const expected = "Bla bla bla. \nHai detto: Ciao. Altro testo. \nChatGPT ha detto: Risposta.";
  
  const result = preprocessChatBook(input);
  
  console.log("INPUT:    " + JSON.stringify(input));
  console.log("OUTPUT:   " + JSON.stringify(result));
  console.log("EXPECTED: " + JSON.stringify(expected));
  
  if (result === expected) {
    console.log("✅ PASS: Inline markers are correctly split.");
  } else {
    console.log("❌ FAIL: Splitting logic failed.");
  }
}

runTests();
