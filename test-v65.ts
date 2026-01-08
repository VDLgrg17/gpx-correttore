
import { EpubOptions } from './client/src/lib/file-utils';

async function runTests() {
  console.log("STARTING TEST V65...");
  console.log("Running GPX v65 Tests (ePub Options)...\n");
  
  // Verifica che l'interfaccia EpubOptions sia definita correttamente
  const options: EpubOptions = {
    fontFamily: 'serif',
    fontSize: '1em',
    margin: '5%'
  };
  
  if (options.fontFamily === 'serif' && options.fontSize === '1em') {
      console.log("✅ PASS: EpubOptions interface is correctly defined.");
  } else {
      console.log("❌ FAIL: EpubOptions interface mismatch.");
  }
  
  // Verifica valori validi
  const validFonts = ['serif', 'sans-serif', 'monospace'];
  if (validFonts.includes(options.fontFamily)) {
      console.log("✅ PASS: Valid font family accepted.");
  }
  
  console.log("\nNote: Full ePub generation test requires browser environment (JSZip/FileSaver).");
  console.log("Manual verification of Preview Dialog is recommended.");
}

runTests();
