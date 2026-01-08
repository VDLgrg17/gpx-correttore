
async function runTests() {
  console.log("STARTING TEST V67...");
  console.log("Running GPX v67 Tests (Title Detection Logic)...\n");
  
  // Simuliamo la logica di rilevamento titolo
  const detectTitle = (firstLine: string, index: number) => {
    let titleLine: string | null = null;
    let displayTitle = `Capitolo ${index + 1}`;
    
    if (firstLine && firstLine.length < 100 && !firstLine.match(/[.;:,]$/)) {
      titleLine = firstLine;
      displayTitle = firstLine.replace(/[*_]/g, '').substring(0, 50);
      return { isTitle: true, displayTitle };
    }
    return { isTitle: false, displayTitle };
  };
  
  const testCases = [
    { 
      input: "Capitolo 1: L'inizio", 
      expectedIsTitle: true, 
      desc: "Short title without punctuation at end" 
    },
    { 
      input: "Vai ai contenuti, cronologia chat. Hai detto: desidero fare una chiacchierata di matrice filosofica sociologica.", 
      expectedIsTitle: false, 
      desc: "Long paragraph with punctuation" 
    },
    { 
      input: "Un titolo breve ma con punto finale.", 
      expectedIsTitle: false, 
      desc: "Short sentence ending with dot (should be text)" 
    },
    { 
      input: "Titolo Breve", 
      expectedIsTitle: true, 
      desc: "Simple short title" 
    }
  ];
  
  let passed = 0;
  
  testCases.forEach((tc, i) => {
    const result = detectTitle(tc.input, 0);
    if (result.isTitle === tc.expectedIsTitle) {
      console.log(`✅ PASS: ${tc.desc}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${tc.desc} (Expected isTitle: ${tc.expectedIsTitle}, Got: ${result.isTitle})`);
    }
  });
  
  if (passed === testCases.length) {
    console.log("\nAll title detection tests passed.");
  } else {
    console.log("\nSome tests failed.");
  }
}

runTests();
