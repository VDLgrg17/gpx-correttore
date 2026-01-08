import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();
const input = "marco è moltointelligente";
const result = engine.correct(input);

console.log("Input:", input);
console.log("Output:", result.corrected);

if (result.corrected.includes("Marco") && result.corrected.includes("molto intelligente")) {
  console.log("✅ TEST PASSED: Capitalization and Word Split working!");
} else {
  console.log("❌ TEST FAILED");
  if (!result.corrected.includes("Marco")) console.log("   - Capitalization failed");
  if (!result.corrected.includes("molto intelligente")) console.log("   - Word Split failed");
}
