
const t = "chat.\n\n[[USER_SAID]]\n\ndesidero";
console.log("Original:", JSON.stringify(t));

// Regex originale
const r1 = t.replace(/([^\n])\n\s*([a-zàèéìòóù])/g, '$1 $2');
console.log("Reflow Original:", JSON.stringify(r1));

// Regex modificata
const r2 = t.replace(/([^\n\]])\n\s*([a-zàèéìòóù])/g, '$1 $2');
console.log("Reflow Modified:", JSON.stringify(r2));

const t2 = "chat.\n\n[[USER_SAID]]\n\nDesidero"; // Maiuscolo
const r3 = t2.replace(/([^\n\]])\n\s*([a-zàèéìòóù])/g, '$1 $2');
console.log("Reflow Modified (Upper):", JSON.stringify(r3));
