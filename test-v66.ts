
async function runTests() {
  console.log("STARTING TEST V66...");
  console.log("Running GPX v66 Tests (XML Escaping)...\n");
  
  // Helper per escape XML (copiato da file-utils.ts per test isolato)
  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };
  
  const testCases = [
    { input: "Tom & Jerry", expected: "Tom &amp; Jerry" },
    { input: "1 < 2", expected: "1 &lt; 2" },
    { input: "He said: \"Hello\"", expected: "He said: &quot;Hello&quot;" },
    { input: "L'albero", expected: "L&apos;albero" }
  ];
  
  let passed = 0;
  
  testCases.forEach(tc => {
    const result = escapeXml(tc.input);
    if (result === tc.expected) {
      console.log(`✅ PASS: '${tc.input}' -> '${result}'`);
      passed++;
    } else {
      console.log(`❌ FAIL: '${tc.input}' -> '${result}' (Expected: '${tc.expected}')`);
    }
  });
  
  if (passed === testCases.length) {
    console.log("\nAll XML escaping tests passed.");
  } else {
    console.log("\nSome tests failed.");
  }
}

runTests();
